/* =============================================
   PureScan — Fetch Image Netlify Function
   Uses existing Serper API for Google Image Search
   No new API keys needed!
   ============================================= */

const SERPER_IMAGES_URL = 'https://google.serper.dev/images';

function getSerperKeys() {
  return [
    process.env.SERPER_API_KEY,
    process.env.SERPER_API_KEY2
  ].filter(Boolean);
}

exports.handler = async function (event) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
    'Cache-Control': 'public, max-age=3600'
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers, body: '' };
  if (event.httpMethod !== 'GET') return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };

  const query = event.queryStringParameters?.query;
  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Query required' }) };
  }

  const type = event.queryStringParameters?.type || 'main';
  const rawQuery = query.trim().substring(0, 200);
  const keys = getSerperKeys();

  let searchTerms = rawQuery;
  if (type === 'alt') {
    searchTerms = `${rawQuery} product front view real photo`;
  } else {
    searchTerms = `${rawQuery} product packaging front view real photo`;
  }

  async function fetchImagesForQuery(q) {
    for (let i = 0; i < keys.length; i++) {
      try {
        const response = await fetch(SERPER_IMAGES_URL, {
          method: 'POST',
          headers: {
            'X-API-KEY': keys[i],
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ q, num: 20 })
        });
        if (response.ok) {
          const data = await response.json();
          if (data.images && data.images.length > 0) return data.images;
        }
      } catch (err) {
        console.warn(`[FetchImage] Key ${i+1} failed:`, err.message);
      }
    }
    return [];
  }

  function filterAndSort(images) {
    const filtered = images.filter(img => {
      const url = (img.imageUrl || '').toLowerCase();
      const title = (img.title || '').toLowerCase();
      
      // Strict filtering
      const badKeywords = ['icon', 'logo', 'svg', 'emoji', 'illustration', 'vector', 'clipart', 'drawing', 'placeholder', 'sprite', 'template'];
      for (const bad of badKeywords) {
        if (url.includes(bad) || title.includes(bad)) return false;
      }
      
      if (url.startsWith('data:')) return false;
      
      // Strict size > 300px
      const width = img.imageWidth || 0;
      const height = img.imageHeight || 0;
      if (width > 0 && width <= 300) return false;
      if (height > 0 && height <= 300) return false;
      
      return true;
    });

    return filtered.sort((a, b) => {
      const resA = (a.imageWidth || 0) * (a.imageHeight || 0);
      const resB = (b.imageWidth || 0) * (b.imageHeight || 0);
      return resB - resA;
    });
  }

  let rawImages = await fetchImagesForQuery(searchTerms);
  let bestImages = filterAndSort(rawImages);

  if (bestImages.length > 0) {
    const primary = bestImages[0];
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        imageUrl: primary.imageUrl || null,
        thumbnailUrl: primary.thumbnailUrl || null,
        title: primary.title || '',
        source: primary.source || '',
        images: bestImages.slice(0, 3).map(img => ({
          url: img.imageUrl,
          thumbnail: img.thumbnailUrl,
          title: img.title
        }))
      })
    };
  }

  // Final failure
  return {
    statusCode: 404,
    headers,
    body: JSON.stringify({
      error: 'No real product images found',
      imageUrl: null,
      thumbnailUrl: null
    })
  };
};
