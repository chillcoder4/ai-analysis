/* =============================================
   PureScan — Product Images Module
   Fetches and displays product images dynamically
   Uses existing Serper API via Netlify function
   ============================================= */

(function () {
  'use strict';

  // ==========================================
  // IMAGE CACHE (in-memory + sessionStorage)
  // ==========================================
  const IMAGE_CACHE_KEY = 'purescan_img_cache';
  const imageMemCache = new Map();

  function getCachedImage(query) {
    const key = query.toLowerCase().trim();
    if (imageMemCache.has(key)) return imageMemCache.get(key);
    try {
      const stored = JSON.parse(sessionStorage.getItem(IMAGE_CACHE_KEY) || '{}');
      if (stored[key]) {
        imageMemCache.set(key, stored[key]);
        return stored[key];
      }
    } catch (e) {}
    return null;
  }

  function setCachedImage(query, url) {
    const key = query.toLowerCase().trim();
    imageMemCache.set(key, url);
    try {
      const stored = JSON.parse(sessionStorage.getItem(IMAGE_CACHE_KEY) || '{}');
      stored[key] = url;
      // Keep cache small (max 30 entries)
      const keys = Object.keys(stored);
      if (keys.length > 30) delete stored[keys[0]];
      sessionStorage.setItem(IMAGE_CACHE_KEY, JSON.stringify(stored));
    } catch (e) {}
  }

  // ==========================================
  // FETCH IMAGE URL (via Netlify function)
  // ==========================================
  async function fetchProductImage(query) {
    // Check cache first
    const cached = getCachedImage(query);
    if (cached) return cached;

    try {
      const res = await fetch(
        `/.netlify/functions/fetch-image?query=${encodeURIComponent(query)}`,
        { signal: AbortSignal.timeout(8000) }
      );

      if (!res.ok) return null;

      const data = await res.json();
      
      if (data.imageUrl || data.thumbnailUrl) {
        const resultArgs = {
          imageUrl: data.imageUrl,
          thumbnailUrl: data.thumbnailUrl
        };
        setCachedImage(query, resultArgs);
        return resultArgs;
      }
    } catch (e) {
      console.warn('[ProductImages] Fetch failed:', e.message);
    }

    return null;
  }

  // Load image with timeout — show emoji if image takes too long
  function loadImageWithTimeout(imgWrap, url, altText, fallbackEmoji, timeoutMs) {
    const tms = timeoutMs || 5000;
    const img = new Image();
    img.loading = 'lazy';
    img.alt = altText;
    img.referrerPolicy = 'no-referrer'; // Important for external image sources
    img.className = 'ps-product-img';

    let resolved = false;
    const timer = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        imgWrap.innerHTML = `<div class="ps-img-placeholder">${fallbackEmoji}</div>`;
      }
    }, tms);

    img.onload = () => {
      if (!resolved) {
        resolved = true;
        clearTimeout(timer);
        imgWrap.innerHTML = '';
        imgWrap.appendChild(img);
      }
    };
    img.onerror = () => {
      if (!resolved) {
        resolved = true;
        clearTimeout(timer);
        imgWrap.innerHTML = `<div class="ps-img-placeholder">${fallbackEmoji}</div>`;
      }
    };
    img.src = url;
  }

  // ==========================================
  // EMOJI HELPERS (smart fallback)
  // ==========================================
  function getProductEmoji(name) {
    const n = (name || '').toLowerCase();
    const map = [
      [['noodle', 'maggi', 'yippee', 'pasta'], '🍜'],
      [['cola', 'pepsi', 'thums up', 'sprite', 'mountain dew', 'soda', 'fanta'], '🥤'],
      [['chip', 'lays', 'kurkure', 'bhujia', 'namkeen'], '🍟'],
      [['chocolate', 'dairy milk', 'kitkat', 'oreo', 'nutella', 'cadbury'], '🍫'],
      [['biscuit', 'cookie', 'parle', 'bourbon', 'good day', 'marie', 'hide'], '🍪'],
      [['juice', 'frooti', 'maaza', 'real', 'tropicana', 'paper boat', 'tang'], '🧃'],
      [['milk', 'dairy', 'amul'], '🥛'],
      [['bread', 'pav'], '🍞'],
      [['rice', 'biryani'], '🍚'],
      [['tea', 'chai'], '🍵'],
      [['coffee', 'nescafe'], '☕'],
      [['butter', 'ghee'], '🧈'],
      [['oil', 'saffola', 'fortune'], '🫒'],
      [['sauce', 'ketchup', 'kissan', 'heinz'], '🥫'],
      [['energy', 'sting', 'red bull', 'monster'], '⚡'],
      [['horlicks', 'bournvita', 'complan', 'boost'], '🥤'],
      [['ice cream', 'kulfi'], '🍨'],
      [['candy', 'toffee', 'sweet'], '🍬'],
      [['cereal', 'muesli', 'oats', 'cornflakes'], '🥣'],
      [['honey'], '🍯'],
      [['jam', 'jelly'], '🫙'],
      [['paneer', 'cheese', 'tofu'], '🧀'],
      [['egg'], '🥚'],
      [['chicken', 'meat', 'fish'], '🍗'],
      [['pickle', 'achar'], '🫙'],
      [['chyawanprash'], '🍯'],
      [['glucon', 'glucose'], '💊'],
    ];
    for (const [keywords, emoji] of map) {
      if (keywords.some(k => n.includes(k))) return emoji;
    }
    return '📦';
  }

  function getFoodEmoji(name) {
    const n = (name || '').toLowerCase();
    const map = [
      [['fruit', 'apple', 'banana', 'mango', 'papaya'], '🍎'],
      [['salad', 'vegetable', 'veggie'], '🥗'],
      [['nut', 'almond', 'walnut', 'peanut', 'cashew'], '🥜'],
      [['coconut'], '🥥'],
      [['orange', 'citrus', 'lemon'], '🍊'],
      [['milk', 'curd', 'yogurt', 'dahi', 'lassi', 'buttermilk'], '🥛'],
      [['egg', 'omelette'], '🥚'],
      [['rice', 'grain', 'millet', 'ragi'], '🌾'],
      [['honey'], '🍯'],
      [['fish', 'salmon', 'tuna'], '🐟'],
      [['chicken', 'meat', 'turkey'], '🍗'],
      [['paneer', 'cheese', 'tofu', 'cottage'], '🧀'],
      [['dry fruit', 'raisin', 'date', 'fig', 'prune'], '🫐'],
      [['dal', 'lentil', 'bean', 'rajma', 'chana', 'chickpea', 'sprout'], '🫘'],
      [['tea', 'green tea', 'herbal'], '🍵'],
      [['oat', 'porridge', 'muesli', 'cereal'], '🥣'],
      [['water', 'nimbu', 'lemonade'], '💧'],
      [['jaggery', 'gur'], '🟤'],
      [['avocado'], '🥑'],
      [['broccoli', 'spinach', 'palak', 'kale'], '🥦'],
      [['carrot', 'beetroot'], '🥕'],
      [['sweet potato', 'potato'], '🍠'],
      [['berry', 'strawberry', 'blueberry'], '🍓'],
      [['smoothie', 'shake', 'protein'], '🥤'],
      [['bread', 'whole wheat', 'multigrain'], '🍞'],
      [['roti', 'chapati', 'paratha'], '🫓'],
      [['soup'], '🍲'],
      [['idli', 'dosa', 'uttapam'], '🫓'],
      [['poha', 'upma'], '🍚'],
    ];
    for (const [keywords, emoji] of map) {
      if (keywords.some(k => n.includes(k))) return emoji;
    }
    return '🥬';
  }

  // ==========================================
  // INJECT PRODUCT IMAGE INTO RESULT SCREEN
  // ==========================================
  function injectProductImage() {
    const productName = document.getElementById('resultProductName')?.textContent;
    if (!productName || productName === 'Product Name') return;

    // Remove existing image if any (user scanned a new product)
    const existing = document.getElementById('psProductImage');
    if (existing) existing.remove();

    // Create image container
    const imgWrap = document.createElement('div');
    imgWrap.className = 'ps-product-img-wrap';
    imgWrap.id = 'psProductImage';
    imgWrap.innerHTML = `<div class="ps-img-skeleton"><div class="ps-skeleton-shimmer"></div></div>`;

    // Insert before the result badge (top of hero card)
    const resultHero = document.querySelector('.result-hero');
    const resultBadge = document.getElementById('resultBadge');
    if (resultHero && resultBadge) {
      resultHero.insertBefore(imgWrap, resultBadge);
    }

    // Fetch and display image
    const searchQuery = productName;
    fetchProductImage(searchQuery).then(imgData => {
      if (imgData) {
        const fallbackEmoji = getProductEmoji(productName);
        const img = new Image();
        img.loading = 'lazy';
        img.alt = productName;
        img.referrerPolicy = 'no-referrer';
        img.className = 'ps-product-img';

        let resolved = false;
        let triedThumbnail = false;
        
        const timer = setTimeout(() => {
          if (!resolved) {
            resolved = true;
            imgWrap.innerHTML = `<div class="ps-img-placeholder">${fallbackEmoji}</div>`;
          }
        }, 8000);

        img.onload = () => {
          if (!resolved) {
            resolved = true;
            clearTimeout(timer);
            imgWrap.innerHTML = '';
            imgWrap.appendChild(img);
          }
        };
        
        img.onerror = () => {
          if (!triedThumbnail && imgData.thumbnailUrl && imgData.thumbnailUrl !== imgData.imageUrl) {
            triedThumbnail = true;
            img.src = imgData.thumbnailUrl; // Direct Google CDN, no proxy!
          } else if (!resolved) {
            resolved = true;
            clearTimeout(timer);
            imgWrap.innerHTML = `<div class="ps-img-placeholder">${fallbackEmoji}</div>`;
          }
        };
        
        // Start by trying the highest quality image via proxy
        const targetUrl = imgData.imageUrl || imgData.thumbnailUrl;
        img.src = `https://wsrv.nl/?url=${encodeURIComponent(targetUrl)}&w=800&fit=contain`;
      } else {
        imgWrap.innerHTML = `<div class="ps-img-placeholder">${getProductEmoji(productName)}</div>`;
      }
    });
  }

  // ==========================================
  // ENHANCE ALTERNATIVES WITH IMAGES
  // ==========================================
  function enhanceAlternatives() {
    const altList = document.getElementById('alternativesList');
    if (!altList) return;

    // Don't re-enhance
    if (altList.querySelector('.ps-alt-img-grid')) return;

    // Get alternative names from existing items
    const items = altList.querySelectorAll('.alternative-item');
    if (items.length === 0) return;

    const alternatives = [];
    items.forEach(item => {
      const name = item.querySelector('span')?.textContent?.trim();
      if (name) alternatives.push(name);
    });

    if (alternatives.length === 0) return;

    // Build image card grid
    const grid = document.createElement('div');
    grid.className = 'ps-alt-img-grid';

    alternatives.forEach(name => {
      const card = document.createElement('div');
      card.className = 'ps-alt-img-card';
      card.innerHTML = `
        <div class="ps-alt-img-area">
          <div class="ps-img-skeleton ps-img-skeleton-sm"><div class="ps-skeleton-shimmer"></div></div>
        </div>
        <div class="ps-alt-img-card-body">
          <div class="ps-alt-img-card-name">${escapeText(name)}</div>
          <span class="ps-alt-img-card-tag">
            <i data-lucide="check-circle"></i> Healthier
          </span>
        </div>
      `;
      grid.appendChild(card);

      // Fetch image for this alternative
      const searchQuery = name;
      fetchProductImage(searchQuery).then(imgData => {
        const imgArea = card.querySelector('.ps-alt-img-area');
        if (imgData) {
          const fallbackEmoji = getFoodEmoji(name);
          const img = new Image();
          img.loading = 'lazy';
          img.alt = name;
          img.referrerPolicy = 'no-referrer';

          let done = false;
          let triedThumbnail = false;
          
          const fallback = () => {
            if (!done) {
              done = true;
              imgArea.innerHTML = `<div class="ps-img-placeholder-mini">${fallbackEmoji}</div>`;
            }
          };
          
          // Show emoji if image takes > 8s
          const timer = setTimeout(fallback, 8000);

          img.onload = () => {
            if (!done) {
              done = true;
              clearTimeout(timer);
              imgArea.innerHTML = '';
              imgArea.appendChild(img);
            }
          };
          
          img.onerror = () => {
            if (!triedThumbnail && imgData.thumbnailUrl && imgData.thumbnailUrl !== imgData.imageUrl) {
              triedThumbnail = true;
              img.src = imgData.thumbnailUrl; // Direct Google CDN, no proxy!
            } else {
              clearTimeout(timer);
              fallback();
            }
          };
          
          // Start by trying the highest quality image via proxy
          const targetUrl = imgData.imageUrl || imgData.thumbnailUrl;
          img.src = `https://wsrv.nl/?url=${encodeURIComponent(targetUrl)}&w=400&fit=contain`;
        } else {
          imgArea.innerHTML = `<div class="ps-img-placeholder-mini">${getFoodEmoji(name)}</div>`;
        }
      });
    });

    // Replace original text list with image grid
    altList.innerHTML = '';
    altList.appendChild(grid);

    // Re-init lucide icons for the tags
    if (window.lucide) setTimeout(() => lucide.createIcons(), 100);
  }

  // ==========================================
  // ESCAPE HTML TEXT
  // ==========================================
  function escapeText(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ==========================================
  // OBSERVERS — Hook into existing screens
  // ==========================================
  function setupObservers() {
    // When result screen becomes active → inject product image
    const resultScreen = document.getElementById('resultScreen');
    if (resultScreen) {
      new MutationObserver(() => {
        if (resultScreen.classList.contains('active')) {
          setTimeout(injectProductImage, 150);
        }
      }).observe(resultScreen, { attributes: true, attributeFilter: ['class'] });
    }

    // When report screen becomes active → enhance alternatives
    const reportScreen = document.getElementById('reportScreen');
    if (reportScreen) {
      new MutationObserver(() => {
        if (reportScreen.classList.contains('active')) {
          setTimeout(enhanceAlternatives, 200);
        }
      }).observe(reportScreen, { attributes: true, attributeFilter: ['class'] });
    }

    // Also observe the alternatives list for content changes
    // (because populateReport fills it dynamically)
    const altList = document.getElementById('alternativesList');
    if (altList) {
      new MutationObserver(() => {
        // Check if report screen is visible and list has content
        const reportActive = reportScreen?.classList.contains('active');
        if (reportActive && altList.children.length > 0 && !altList.querySelector('.ps-alt-img-grid')) {
          setTimeout(enhanceAlternatives, 100);
        }
      }).observe(altList, { childList: true });
    }
  }

  // ==========================================
  // INIT
  // ==========================================
  function init() {
    if (document.getElementById('psProductImage__init')) return;

    // Mark as initialized
    const marker = document.createElement('div');
    marker.id = 'psProductImage__init';
    marker.style.display = 'none';
    document.body.appendChild(marker);

    setupObservers();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(init, 250));
  } else {
    setTimeout(init, 250);
  }

})();
