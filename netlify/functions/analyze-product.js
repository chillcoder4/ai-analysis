/* =============================================
   PureScan — Netlify Serverless Function
   Secure backend for API calls (SERPER + GROQ)
   ============================================= */

// ==========================================
// CONFIGURATION (from Netlify env vars)
// ==========================================
const SERPER_URL = 'https://google.serper.dev/search';
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';

/**
 * Get API keys securely from environment variables
 */
function getSerperKeys() {
  return [
    process.env.SERPER_API_KEY,
    process.env.SERPER_API_KEY2
  ].filter(Boolean);
}

function getGroqKeys() {
  return [
    process.env.GROQ_1,
    process.env.GROQ_2,
    process.env.GROQ_3,
    process.env.GROQ_4,
    process.env.GROQ_5
  ].filter(Boolean);
}

// ==========================================
// SERPER SEARCH (with key failover)
// ==========================================
/**
 * Detect if input contains a barcode number (8-13 digit numeric string)
 */
function extractBarcode(input) {
  const match = input.match(/\b(\d{8,13})\b/);
  return match ? match[1] : null;
}

async function searchProduct(productName) {
  const keys = getSerperKeys();
  const errors = [];

  // Smart query: if input contains a barcode, optimize the search
  const barcode = extractBarcode(productName);
  let searchQuery;
  if (barcode) {
    searchQuery = `${barcode} food product ingredients nutrition brand details India packaged food label`;
    console.log(`[PureScan] Barcode detected: ${barcode}`);
  } else {
    searchQuery = `${productName} ingredients nutrition facts health analysis India`;
  }

  for (let i = 0; i < keys.length; i++) {
    try {
      const response = await fetch(SERPER_URL, {
        method: 'POST',
        headers: {
          'X-API-KEY': keys[i],
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          q: searchQuery,
          num: 10
        })
      });

      if (!response.ok) {
        throw new Error(`Serper API returned ${response.status}`);
      }

      const data = await response.json();

      // If barcode search returned poor results, try a fallback query
      if (barcode && data.organic && data.organic.length < 3) {
        console.log('[PureScan] Few results for barcode, trying fallback query...');
        try {
          const fallbackRes = await fetch(SERPER_URL, {
            method: 'POST',
            headers: {
              'X-API-KEY': keys[i],
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              q: `barcode ${barcode} product India`,
              num: 8
            })
          });
          if (fallbackRes.ok) {
            const fallbackData = await fallbackRes.json();
            if (fallbackData.organic) {
              data.organic = [...(data.organic || []), ...fallbackData.organic];
            }
          }
        } catch (e) {
          // Ignore fallback errors
        }
      }

      return data;
    } catch (err) {
      errors.push(`Serper key ${i + 1}: ${err.message}`);
      console.warn(`Serper key ${i + 1} failed:`, err.message);
    }
  }

  console.error('All Serper keys failed:', errors);
  return null;
}

// ==========================================
// GROQ AI ANALYSIS (with 5-key failover)
// ==========================================
async function analyzeWithAI(productName, searchData) {
  // Build context from search results
  let context = '';
  if (searchData) {
    if (searchData.organic) {
      context = searchData.organic.map(r =>
        `Title: ${r.title}\nSnippet: ${r.snippet || ''}\nLink: ${r.link || ''}`
      ).join('\n\n');
    }
    if (searchData.knowledgeGraph) {
      const kg = searchData.knowledgeGraph;
      context += `\n\nKnowledge Graph:\nTitle: ${kg.title || ''}\nDescription: ${kg.description || ''}\n`;
      if (kg.attributes) {
        context += Object.entries(kg.attributes).map(([k, v]) => `${k}: ${v}`).join('\n');
      }
    }
  }

  const systemPrompt = `You are PureScan AI — a world-class food safety and nutrition analyst. You analyze food products and consumer goods to expose hidden truths behind marketing claims.

You MUST respond with ONLY valid JSON (no markdown, no code blocks, no extra text). The JSON must follow this exact structure:

{
  "isFood": true,
  "productName": "Full product name",
  "healthScore": <number 0-10, one decimal>,
  "verdict": "Safe" | "Moderate" | "Avoid",
  "shortSummary": "One sentence summary of overall assessment",
  "sugarLevel": "None" | "Low" | "Moderate" | "High" | "Very High",
  "processingLevel": "Minimal" | "Moderate" | "High" | "Ultra-Processed",
  "additivesLevel": "None" | "Few" | "Several" | "Many",
  "ingredients": [
    {
      "name": "Ingredient name",
      "chemicalName": "Chemical/scientific name if applicable, else null",
      "status": "safe" | "caution" | "danger",
      "explanation": "Brief explanation of health impact"
    }
  ],
  "hiddenTruth": "Detailed paragraph exposing what the marketing hides. Be specific about misleading claims, hidden sugars, chemical additives disguised by codes (E150c, maltodextrin, etc.), palm oil presence, and real nutritional value vs marketed claims.",
  "harmfulComponents": [
    {
      "name": "Component name",
      "reason": "Why it's harmful"
    }
  ],
  "sugarOilWarning": "Detailed paragraph about sugar content, types of oils/fats used, trans fats, and their health implications.",
  "alternatives": ["Alternative product 1", "Alternative product 2", "Alternative product 3"],
  "allergyAlerts": ["List any common allergens found like gluten, dairy, nuts, soy, etc."]
}

If the product is NOT a food/beverage/consumable item, respond with:
{
  "isFood": false,
  "productName": "Detected product name if possible",
  "healthScore": 0,
  "verdict": "Not Food",
  "shortSummary": "This product is not a food-related item. Please scan only food products for analysis.",
  "sugarLevel": "None",
  "processingLevel": "None",
  "additivesLevel": "None",
  "ingredients": [],
  "hiddenTruth": "This product is not a food-related item. PureScan is designed to analyze packaged food and beverage products only.",
  "harmfulComponents": [],
  "sugarOilWarning": "Not applicable — this is not a food product.",
  "alternatives": [],
  "allergyAlerts": []
}

IMPORTANT RULES:
- First determine if this is a food/beverage/consumable product. If NOT, use the non-food response format above.
- Be truthful and evidence-based
- Decode ALL chemical names (e.g., E150c = ammonia caramel color)
- Flag palm oil, high fructose corn syrup, maltodextrin, MSG (E621), artificial sweeteners
- Score 8-10 for genuinely healthy products (whole foods, natural ingredients)
- Score 4-7 for moderately processed with some concerns
- Score 0-3 for ultra-processed, high sugar/sodium, many artificial additives
- Focus on the Indian market context
- Do NOT be lenient — expose marketing tricks honestly
- Include at least 5 ingredients in the breakdown
- If a barcode number is provided, identify the product from the search results and analyze it`;

  const userMessage = `Analyze this product: "${productName}"

Here is information gathered from the web about this product:

${context || 'No web data available — use your knowledge base.'}

Provide a thorough ingredient analysis, health score, and hidden truth report. Remember to output ONLY valid JSON.`;

  const keys = getGroqKeys();
  const errors = [];

  for (let i = 0; i < keys.length; i++) {
    try {
      const response = await fetch(GROQ_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${keys[i]}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage }
          ],
          temperature: 0.3,
          max_tokens: 3000,
          response_format: { type: 'json_object' }
        })
      });

      if (!response.ok) {
        const errBody = await response.text();
        throw new Error(`Groq API ${response.status}: ${errBody.substring(0, 200)}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;

      if (!content) throw new Error('Empty response from Groq');

      return JSON.parse(content);
    } catch (err) {
      errors.push(`Groq key ${i + 1}: ${err.message}`);
      console.warn(`Groq key ${i + 1} failed:`, err.message);
    }
  }

  console.error('All Groq keys failed:', errors);
  return null;
}

// ==========================================
// NETLIFY FUNCTION HANDLER
// ==========================================
exports.handler = async function (event) {
  // CORS headers for all responses
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { productName } = body;

    if (!productName || typeof productName !== 'string' || productName.trim().length === 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Product name is required' })
      };
    }

    const cleanName = productName.trim().substring(0, 200); // Limit length

    // Step 1: Search product info via SERPER
    console.log(`[PureScan] Searching for: ${cleanName}`);
    const searchData = await searchProduct(cleanName);

    // Step 2: Analyze with GROQ AI
    console.log(`[PureScan] Analyzing with AI...`);
    const analysis = await analyzeWithAI(cleanName, searchData);

    if (!analysis) {
      return {
        statusCode: 502,
        headers,
        body: JSON.stringify({
          error: 'AI analysis failed. All API keys exhausted or service unavailable.'
        })
      };
    }

    // Return successful analysis
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(analysis)
    };

  } catch (err) {
    console.error('[PureScan] Function error:', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error: ' + err.message })
    };
  }
};
