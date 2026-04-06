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
      const stored = JSON.parse(localStorage.getItem(IMAGE_CACHE_KEY) || '{}');
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
      const stored = JSON.parse(localStorage.getItem(IMAGE_CACHE_KEY) || '{}');
      stored[key] = url;
      // Keep cache small (max 30 entries)
      const keys = Object.keys(stored);
      if (keys.length > 30) delete stored[keys[0]];
      localStorage.setItem(IMAGE_CACHE_KEY, JSON.stringify(stored));
    } catch (e) {}
  }

  // ==========================================
  // FETCH IMAGE URL (via Netlify function)
  // ==========================================
  async function fetchProductImage(query, type = 'main') {
    const cacheKey = `${query}_${type}`;
    // Check cache first
    const cached = getCachedImage(cacheKey);
    if (cached) return cached;

    try {
      const res = await fetch(
        `/.netlify/functions/fetch-image?query=${encodeURIComponent(query)}&type=${encodeURIComponent(type)}`,
        { signal: AbortSignal.timeout(8000) }
      );

      if (!res.ok) return null;

      const data = await res.json();
      
      if (data.imageUrl || data.thumbnailUrl) {
        const resultArgs = {
          imageUrl: data.imageUrl,
          thumbnailUrl: data.thumbnailUrl
        };
        setCachedImage(cacheKey, resultArgs);
        return resultArgs;
      }
    } catch (e) {
      console.warn('[ProductImages] Fetch failed:', e.message);
    }

    return null;
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
    fetchProductImage(searchQuery, 'main').then(imgData => {
      if (imgData && imgData.imageUrl) {
        const img = new Image();
        img.loading = 'lazy';
        img.alt = productName;
        img.referrerPolicy = 'no-referrer';
        img.className = 'ps-product-img';

        img.onload = () => {
          imgWrap.innerHTML = '';
          imgWrap.appendChild(img);
        };
        
        let triedThumb = false;
        img.onerror = () => {
          if (!triedThumb && imgData.thumbnailUrl) {
            triedThumb = true;
            img.src = imgData.thumbnailUrl;
          } else {
            imgWrap.style.display = 'none';
          }
        };
        
        // Direct frontend rendering natively bypassing proxies
        img.src = imgData.imageUrl;
      } else {
        imgWrap.style.display = 'none';
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

    alternatives.forEach((name, index) => {
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
    });
    
    // Fetch image for alternatives simultaneously (2 calls)
    alternatives.forEach((name, index) => {
      const searchQuery = name;
      fetchProductImage(searchQuery, 'alt').then(imgData => {
        const imgArea = grid.querySelectorAll('.ps-alt-img-area')[index];
        if (!imgArea) return;
        
        let targetUrl = imgData ? imgData.imageUrl : null;
        let targetThumb = imgData ? imgData.thumbnailUrl : null;
        
        if (targetUrl) {
          const img = new Image();
          img.loading = 'lazy';
          img.alt = name;
          img.referrerPolicy = 'no-referrer';

          img.onload = () => {
            imgArea.innerHTML = '';
            imgArea.appendChild(img);
          };
          
          let triedThumb = false;
          img.onerror = () => {
            if (!triedThumb && targetThumb) {
              triedThumb = true;
              img.src = targetThumb;
            } else {
              imgArea.innerHTML = '<div class="ps-img-error"><span>Image Blocked</span></div>';
            }
          };
          
          // Direct frontend rendering natively
          img.src = targetUrl;
        } else {
          imgArea.innerHTML = '<div class="ps-img-error"><span>No Image</span></div>';
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
    
    // Expose prefetch function for parallel loading
    window.psPrefetchImage = function(query, type) {
      if (query) fetchProductImage(query, type);
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(init, 250));
  } else {
    setTimeout(init, 250);
  }

})();
