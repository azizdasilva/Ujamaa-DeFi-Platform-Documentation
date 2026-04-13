/**
 * UJAMAA DeFi Platform - Competitive Intelligence Documentation
 * JavaScript - Version 2.0
 */

document.addEventListener('DOMContentLoaded', function() {
  initMobileMenu();
  initSearch();
  initActiveNavigation();
  initSmoothScroll();
  initCodeCopy();
  initScrollProgress();
});

/**
 * Mobile Menu Toggle
 */
function initMobileMenu() {
  const menuToggle = document.querySelector('.docs-menu-toggle');
  const sidebar = document.querySelector('.docs-sidebar');
  if (!menuToggle || !sidebar) return;

  const overlay = document.createElement('div');
  overlay.className = 'docs-overlay';
  overlay.style.cssText = `
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0, 0, 0, 0.5); z-index: 999;
    opacity: 0; visibility: hidden; transition: all 0.3s ease;
    backdrop-filter: blur(4px);
  `;
  document.body.appendChild(overlay);

  menuToggle.addEventListener('click', function(e) {
    e.stopPropagation();
    sidebar.classList.toggle('open');
    overlay.style.opacity = sidebar.classList.contains('open') ? '1' : '0';
    overlay.style.visibility = sidebar.classList.contains('open') ? 'visible' : 'hidden';
    document.body.style.overflow = sidebar.classList.contains('open') ? 'hidden' : '';
  });

  overlay.addEventListener('click', function() {
    sidebar.classList.remove('open');
    overlay.style.opacity = '0';
    overlay.style.visibility = 'hidden';
    document.body.style.overflow = '';
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && sidebar.classList.contains('open')) {
      sidebar.classList.remove('open');
      overlay.style.opacity = '0';
      overlay.style.visibility = 'hidden';
      document.body.style.overflow = '';
    }
  });
}

/**
 * Search Functionality
 */
function initSearch() {
  const searchInput = document.querySelector('.docs-search-input');
  if (!searchInput) return;

  let debounceTimer;
  searchInput.addEventListener('input', function(e) {
    clearTimeout(debounceTimer);
    const query = e.target.value.toLowerCase().trim();
    debounceTimer = setTimeout(() => {
      if (query.length >= 2) {
        performSearch(query, searchInput);
      } else {
        clearSearch(searchInput);
      }
    }, 150);
  });

  document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      searchInput.focus();
      searchInput.select();
    }
  });
}

function performSearch(query, searchInput) {
  const navLinks = document.querySelectorAll('.docs-nav-link');
  let matchCount = 0;

  navLinks.forEach(link => {
    const text = link.textContent.toLowerCase();
    const listItem = link.closest('.docs-nav-item');
    if (text.includes(query)) {
      listItem.style.display = '';
      link.style.background = 'rgba(59, 130, 246, 0.2)';
      matchCount++;
    } else {
      listItem.style.display = 'none';
      link.style.background = '';
    }
  });

  showSearchResults(query, matchCount, searchInput);
}

function clearSearch(searchInput) {
  document.querySelectorAll('.docs-nav-item').forEach(item => item.style.display = '');
  document.querySelectorAll('.docs-nav-link').forEach(link => link.style.background = '');
  const results = document.querySelector('.docs-search-results');
  if (results) results.remove();
}

function showSearchResults(query, matchCount, searchInput) {
  let results = document.querySelector('.docs-search-results');
  if (!results) {
    results = document.createElement('div');
    results.className = 'docs-search-results';
    results.style.cssText = `
      padding: 0.75rem 1rem; text-align: center;
      color: #94A3B8; font-size: 0.875rem;
      background: rgba(59, 130, 246, 0.1);
      border-radius: 0.5rem; margin-top: 0.5rem;
    `;
    document.querySelector('.docs-search-box').appendChild(results);
  }

  if (matchCount > 0) {
    results.textContent = `Found ${matchCount} result${matchCount > 1 ? 's' : ''} for "${query}"`;
    results.style.color = '#10B981';
  } else {
    results.textContent = `No results found for "${query}"`;
    results.style.color = '#EF4444';
  }
}

/**
 * Active Navigation
 */
function initActiveNavigation() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.docs-nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/**
 * Smooth Scroll
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        history.pushState(null, null, targetId);
      }
    });
  });
}

/**
 * Code Copy
 */
function initCodeCopy() {
  document.querySelectorAll('.docs-pre, pre').forEach(block => {
    const button = document.createElement('button');
    button.className = 'docs-copy-btn';
    button.innerHTML = '📋 Copy';
    button.style.cssText = `
      position: absolute; top: 0.75rem; right: 0.75rem;
      padding: 0.5rem 1rem; background: rgba(255,255,255,0.1);
      border: 1px solid rgba(255,255,255,0.2); border-radius: 0.5rem;
      color: #CBD5E1; font-size: 0.75rem; font-weight: 600;
      cursor: pointer; transition: all 0.2s ease; z-index: 10;
    `;
    block.style.position = 'relative';
    block.appendChild(button);

    button.addEventListener('click', async () => {
      const code = block.querySelector('code')?.textContent || block.textContent;
      try {
        await navigator.clipboard.writeText(code);
        button.innerHTML = '✅ Copied!';
        button.style.background = 'rgba(16, 185, 129, 0.3)';
        setTimeout(() => {
          button.innerHTML = '📋 Copy';
          button.style.background = 'rgba(255, 255, 255, 0.1)';
        }, 2000);
      } catch (err) {
        button.innerHTML = '❌ Failed';
        setTimeout(() => button.innerHTML = '📋 Copy', 2000);
      }
    });
  });
}

/**
 * Scroll Progress
 */
function initScrollProgress() {
  const progress = document.createElement('div');
  progress.className = 'docs-scroll-progress';
  progress.style.cssText = `
    position: fixed; top: 0; left: 0; height: 3px;
    background: linear-gradient(90deg, #3B82F6, #10B981);
    z-index: 10001; width: 0%; transition: width 0.1s ease;
  `;
  document.body.appendChild(progress);

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    progress.style.width = scrollPercent + '%';
  });
}

console.log('✅ UJAMAA Competitive Intelligence Docs v2.0 loaded');
