/**
 * UJAMAA DeFi Platform - Documentation JavaScript
 * Version: 2.0 | Enhanced for 2026 Design System
 * Features: Mobile menu, search, navigation, smooth scroll, code copy, TOC
 */

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
  initMobileMenu();
  initSearch();
  initActiveNavigation();
  initSmoothScroll();
  initCodeCopy();
  initTableOfContents();
  initScrollProgress();
  addCopyFeedback();
});

/**
 * Mobile Menu Toggle with Overlay
 */
function initMobileMenu() {
  const menuToggle = document.querySelector('.docs-menu-toggle');
  const sidebar = document.querySelector('.docs-sidebar');
  
  if (!menuToggle || !sidebar) return;
  
  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'docs-overlay';
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
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
  
  // Close menu when clicking outside
  overlay.addEventListener('click', function() {
    sidebar.classList.remove('open');
    overlay.style.opacity = '0';
    overlay.style.visibility = 'hidden';
    document.body.style.overflow = '';
  });
  
  // Close menu on escape key
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
 * Enhanced Search with Highlighting and File Search
 */
function initSearch() {
  const searchInput = document.querySelector('.docs-search-input');
  if (!searchInput) return;

  let debounceTimer;
  let searchResultsContainer = null;

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

  // Keyboard shortcut for search (Ctrl/Cmd + K)
  document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      searchInput.focus();
      searchInput.select();
    }

    // Close search on Escape
    if (e.key === 'Escape' && document.activeElement === searchInput) {
      searchInput.blur();
      clearSearch(searchInput);
    }
  });
}

function performSearch(query, searchInput) {
  const navLinks = document.querySelectorAll('.docs-nav-link');
  const fileItems = document.querySelectorAll('.docs-file-link');
  const folderCards = document.querySelectorAll('.docs-folder-card-link');
  let matchCount = 0;

  // Search navigation links
  navLinks.forEach(link => {
    const text = link.textContent.toLowerCase();
    const listItem = link.closest('.docs-nav-item');
    const section = link.closest('.docs-nav-section');

    if (text.includes(query)) {
      listItem.style.display = '';
      link.classList.add('search-match');
      link.style.background = 'rgba(59, 130, 246, 0.2)';
      matchCount++;

      if (section) {
        section.style.display = '';
      }
    } else {
      listItem.style.display = 'none';
      link.classList.remove('search-match');
    }
  });

  // Search file links
  fileItems.forEach(link => {
    const text = link.textContent.toLowerCase();
    const listItem = link.closest('.docs-file-item');

    if (text.includes(query)) {
      listItem.style.display = '';
      link.style.background = 'rgba(59, 130, 246, 0.1)';
      matchCount++;
    } else {
      listItem.style.display = 'none';
    }
  });

  // Search folder cards
  folderCards.forEach(link => {
    const text = link.textContent.toLowerCase();
    const card = link.closest('.docs-folder-card');

    if (text.includes(query)) {
      card.style.display = '';
      link.style.background = 'rgba(59, 130, 246, 0.1)';
      matchCount++;
    } else {
      card.style.display = 'none';
    }
  });

  // Show results count
  showSearchResults(query, matchCount, searchInput);
}

function clearSearch(searchInput) {
  const navLinks = document.querySelectorAll('.docs-nav-link');
  navLinks.forEach(link => {
    link.classList.remove('search-match');
    link.style.background = '';
  });

  const navItems = document.querySelectorAll('.docs-nav-item');
  navItems.forEach(item => {
    item.style.display = '';
  });

  const fileItems = document.querySelectorAll('.docs-file-item');
  fileItems.forEach(item => {
    item.style.display = '';
  });

  const fileLinks = document.querySelectorAll('.docs-file-link');
  fileLinks.forEach(link => {
    link.style.background = '';
  });

  const folderCards = document.querySelectorAll('.docs-folder-card');
  folderCards.forEach(card => {
    card.style.display = '';
  });

  const folderLinks = document.querySelectorAll('.docs-folder-card-link');
  folderLinks.forEach(link => {
    link.style.background = '';
  });

  const searchResults = document.querySelector('.docs-search-results');
  if (searchResults) {
    searchResults.remove();
  }
}

function showSearchResults(query, matchCount, searchInput) {
  let results = document.querySelector('.docs-search-results');

  if (!results) {
    results = document.createElement('div');
    results.className = 'docs-search-results';
    results.style.cssText = `
      padding: 0.75rem 1rem;
      text-align: center;
      color: #94A3B8;
      font-size: 0.875rem;
      background: rgba(59, 130, 246, 0.1);
      border-radius: 0.5rem;
      margin-top: 0.5rem;
    `;
    const searchBox = document.querySelector('.docs-search-box');
    searchBox.appendChild(results);
  }

  if (matchCount > 0) {
    results.textContent = `Found ${matchCount} result${matchCount > 1 ? 's' : ''} for "${query}"`;
    results.style.color = '#10B981';
  } else {
    results.textContent = `No results found for "${query}"`;
    results.style.color = '#EF4444';
  }
}


function showSearchResults(query, hasResults) {
  let results = document.querySelector('.docs-search-results');
  
  if (!results && !hasResults) {
    results = document.createElement('div');
    results.className = 'docs-search-results';
    results.style.cssText = `
      padding: 1rem;
      text-align: center;
      color: #94A3B8;
      font-size: 0.875rem;
    `;
    results.textContent = `No results found for "${query}"`;
    
    const searchBox = document.querySelector('.docs-search-box');
    searchBox.appendChild(results);
  } else if (results && hasResults) {
    results.remove();
  }
}

/**
 * Active Navigation Highlighting with Scroll Spy
 */
function initActiveNavigation() {
  // Highlight current page
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.docs-nav-link');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    
    if (href === currentPage ||
        (currentPage === '' && href === 'index.html') ||
        (currentPage === 'index.html' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
  
  // Scroll spy for section navigation
  initScrollSpy();
}

function initScrollSpy() {
  const sections = document.querySelectorAll('section[id], h1[id], h2[id]');
  if (sections.length === 0) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        if (id) {
          updateActiveNavLink(id);
        }
      }
    });
  }, { threshold: 0.1, rootMargin: '-100px 0px -60% 0px' });
  
  sections.forEach(section => observer.observe(section));
}

function updateActiveNavLink(sectionId) {
  // Update TOC if present
  const tocLinks = document.querySelectorAll('.docs-toc-link');
  tocLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${sectionId}`) {
      link.classList.add('active');
    }
  });
}

/**
 * Smooth Scroll for Anchor Links
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
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        
        // Update URL without scrolling
        history.pushState(null, null, targetId);
        
        // Close mobile menu if open
        const sidebar = document.querySelector('.docs-sidebar');
        if (sidebar && sidebar.classList.contains('open')) {
          sidebar.classList.remove('open');
        }
      }
    });
  });
}

/**
 * Code Copy Functionality with Visual Feedback
 */
function initCodeCopy() {
  const codeBlocks = document.querySelectorAll('.docs-pre, pre');
  
  codeBlocks.forEach(block => {
    // Create copy button
    const button = document.createElement('button');
    button.className = 'docs-copy-btn';
    button.innerHTML = '📋 Copy';
    button.style.cssText = `
      position: absolute;
      top: 0.75rem;
      right: 0.75rem;
      padding: 0.5rem 1rem;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 0.5rem;
      color: #CBD5E1;
      font-size: 0.75rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      z-index: 10;
    `;
    
    button.addEventListener('mouseenter', () => {
      button.style.background = 'rgba(255, 255, 255, 0.2)';
      button.style.color = '#FFFFFF';
    });
    
    button.addEventListener('mouseleave', () => {
      button.style.background = 'rgba(255, 255, 255, 0.1)';
      button.style.color = '#CBD5E1';
    });
    
    block.style.position = 'relative';
    block.appendChild(button);
    
    button.addEventListener('click', async () => {
      const code = block.querySelector('code')?.textContent || block.textContent;
      
      try {
        await navigator.clipboard.writeText(code);
        button.innerHTML = '✅ Copied!';
        button.style.background = 'rgba(16, 185, 129, 0.3)';
        button.style.borderColor = 'rgba(16, 185, 129, 0.5)';
        
        setTimeout(() => {
          button.innerHTML = '📋 Copy';
          button.style.background = 'rgba(255, 255, 255, 0.1)';
          button.style.borderColor = 'rgba(255, 255, 255, 0.2)';
        }, 2000);
      } catch (err) {
        button.innerHTML = '❌ Failed';
        setTimeout(() => {
          button.innerHTML = '📋 Copy';
        }, 2000);
      }
    });
  });
}

/**
 * Add visual feedback for copy actions
 */
function addCopyFeedback() {
  // Add toast notification container
  const toastContainer = document.createElement('div');
  toastContainer.id = 'docs-toast-container';
  toastContainer.style.cssText = `
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  `;
  document.body.appendChild(toastContainer);
}

function showToast(message, type = 'info') {
  const container = document.getElementById('docs-toast-container');
  if (!container) return;
  
  const toast = document.createElement('div');
  toast.className = 'docs-toast';
  toast.style.cssText = `
    padding: 1rem 1.5rem;
    background: ${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#3B82F6'};
    color: white;
    border-radius: 0.75rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    font-size: 0.875rem;
    font-weight: 500;
    animation: slideIn 0.3s ease-out;
  `;
  toast.textContent = message;
  
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(1rem)';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

/**
 * Table of Contents Generator
 */
function initTableOfContents() {
  const content = document.querySelector('.docs-content');
  if (!content) return;
  
  const headings = content.querySelectorAll('h2, h3');
  if (headings.length === 0) return;
  
  // Create TOC container
  const toc = document.createElement('aside');
  toc.className = 'docs-toc';
  toc.style.cssText = `
    position: fixed;
    top: 6rem;
    right: 2rem;
    width: 240px;
    max-height: calc(100vh - 8rem);
    overflow-y: auto;
    padding: 1.5rem;
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(20px);
    border-radius: 1rem;
    border: 1px solid #E2E8F0;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    z-index: 50;
  `;
  
  // Add TOC title
  const title = document.createElement('h4');
  title.textContent = 'On This Page';
  title.style.cssText = `
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #64748B;
    margin-bottom: 1rem;
  `;
  toc.appendChild(title);
  
  // Add TOC list
  const list = document.createElement('ul');
  list.className = 'docs-toc-list';
  list.style.cssText = `
    list-style: none;
    padding: 0;
    margin: 0;
  `;
  
  headings.forEach(heading => {
    const id = heading.id || generateId(heading.textContent);
    heading.id = id;
    
    const level = heading.tagName === 'H2' ? 0 : 1;
    const text = heading.textContent.trim();
    
    const item = document.createElement('li');
    item.className = 'docs-toc-item';
    item.style.cssText = `
      margin-bottom: 0.5rem;
      ${level === 1 ? 'padding-left: 1rem;' : ''}
    `;
    
    const link = document.createElement('a');
    link.className = 'docs-toc-link';
    link.href = `#${id}`;
    link.textContent = text;
    link.style.cssText = `
      display: block;
      padding: 0.5rem;
      color: #475569;
      text-decoration: none;
      font-size: 0.875rem;
      border-radius: 0.5rem;
      transition: all 0.2s ease;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    `;
    
    link.addEventListener('mouseenter', () => {
      link.style.background = '#F1F5F9';
      link.style.color = '#3B82F6';
    });
    
    link.addEventListener('mouseleave', () => {
      if (!link.classList.contains('active')) {
        link.style.background = '';
        link.style.color = '#475569';
      }
    });
    
    item.appendChild(link);
    list.appendChild(item);
  });
  
  toc.appendChild(list);
  document.body.appendChild(toc);
  
  // Hide TOC on mobile
  if (window.innerWidth < 1280) {
    toc.style.display = 'none';
  }
}

function generateId(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim();
}

/**
 * Scroll Progress Indicator
 */
function initScrollProgress() {
  const progress = document.createElement('div');
  progress.className = 'docs-scroll-progress';
  progress.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 3px;
    background: linear-gradient(90deg, #3B82F6, #10B981);
    z-index: 10001;
    width: 0%;
    transition: width 0.1s ease;
  `;
  document.body.appendChild(progress);
  
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    progress.style.width = scrollPercent + '%';
  });
}

/**
 * Add keyboard navigation
 */
document.addEventListener('keydown', function(e) {
  // Alt + Arrow Up/Down for navigation
  if (e.altKey && e.key === 'ArrowUp') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
  if (e.altKey && e.key === 'ArrowDown') {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }
});

/**
 * Performance optimization: Lazy load images
 */
document.addEventListener('DOMContentLoaded', function() {
  const images = document.querySelectorAll('img');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.classList.add('loaded');
          }
          imageObserver.unobserve(img);
        }
      });
    });
    
    images.forEach(img => {
      if (img.dataset.src) {
        imageObserver.observe(img);
      }
    });
  }
});

/**
 * Add CSS animation for toast
 */
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  .docs-toast {
    animation: slideIn 0.3s ease-out;
  }
  
  .search-match {
    animation: highlight 1s ease;
  }
  
  @keyframes highlight {
    0%, 100% { background: transparent; }
    50% { background: rgba(59, 130, 246, 0.3); }
  }
  
  @media (max-width: 1280px) {
    .docs-toc {
      display: none !important;
    }
  }
`;
document.head.appendChild(style);

console.log('✅ UJAMAA Documentation v2.0 loaded successfully');
