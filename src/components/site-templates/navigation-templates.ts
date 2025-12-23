import { ComponentTemplate } from "@/types/templates";

/**
 * Navigation menu template'leri
 */

export const navigationTemplate1: ComponentTemplate = {
  id: "nav-classic-horizontal",
  name: "Classic Horizontal Navigation",
  category: "navigation",
  htmlTemplate: `
    <nav class="nav-section" aria-label="Main navigation">
      <div class="nav-container">
        <div class="nav-logo">
          <a href="#hero">{{NAME}}</a>
        </div>
        <button class="nav-toggle" 
                aria-label="Toggle menu" 
                aria-expanded="false"
                aria-controls="nav-menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
        <ul class="nav-menu" id="nav-menu">
          {{NAV_MENU_ITEMS}}
        </ul>
      </div>
    </nav>
  `,
  cssTemplate: `
    /* Fixed navigation için body padding */
    body {
      padding-top: 70px;
    }

    .nav-section {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: rgba({{COLOR_BACKGROUND_RGB}}, 0.85);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba({{COLOR_TEXT_RGB}}, 0.08);
      z-index: 10000;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .nav-section::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, {{COLOR_PRIMARY}}, {{COLOR_ACCENT}}, {{COLOR_PRIMARY}});
      background-size: 200% 100%;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .nav-section.scrolled::after {
      opacity: 1;
      animation: gradientMove 3s linear infinite;
    }

    @keyframes gradientMove {
      0% { background-position: 0% 50%; }
      100% { background-position: 200% 50%; }
    }

    .nav-section.scrolled {
      padding-top: 0;
      padding-bottom: 0;
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    }

    .nav-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: padding 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .nav-section.scrolled .nav-container {
      padding: 0.6rem 2rem;
    }

    .nav-logo a {
      font-size: 1.5rem;
      font-weight: 700;
      color: {{COLOR_TEXT}};
      text-decoration: none;
      transition: all 0.3s ease;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }

    .nav-section.scrolled .nav-logo a {
      font-size: 1.3rem;
    }

    .nav-logo a:hover {
      color: {{COLOR_PRIMARY}};
      transform: scale(1.02);
    }

    .nav-toggle {
      display: none;
      flex-direction: column;
      gap: 5px;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.5rem;
      z-index: 10001;
    }

    .nav-toggle span {
      width: 24px;
      height: 2px;
      background: {{COLOR_TEXT}};
      border-radius: 2px;
      transition: all 0.3s ease;
      transform-origin: center;
    }

    .nav-toggle.active span:nth-child(1) {
      transform: translateY(7px) rotate(45deg);
    }

    .nav-toggle.active span:nth-child(2) {
      opacity: 0;
      transform: scaleX(0);
    }

    .nav-toggle.active span:nth-child(3) {
      transform: translateY(-7px) rotate(-45deg);
    }

    .nav-menu {
      display: flex;
      gap: 0.5rem;
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: {{COLOR_TEXT}};
      text-decoration: none;
      font-weight: 500;
      padding: 0.6rem 1rem;
      border-radius: 8px;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .nav-link-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      color: {{COLOR_TEXT_SECONDARY}};
      transition: all 0.3s ease;
    }

    .nav-link-icon svg {
      width: 18px;
      height: 18px;
    }

    .nav-link-text {
      position: relative;
    }

    .nav-link-text::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 0;
      height: 2px;
      background: {{COLOR_PRIMARY}};
      transition: width 0.3s ease;
    }

    .nav-link:hover .nav-link-text::after,
    .nav-link.active .nav-link-text::after {
      width: 100%;
    }

    .nav-link:hover {
      background: rgba({{COLOR_PRIMARY_RGB}}, 0.1);
      color: {{COLOR_PRIMARY}};
    }

    .nav-link:hover .nav-link-icon {
      color: {{COLOR_PRIMARY}};
      transform: scale(1.1);
    }

    .nav-link.active {
      background: rgba({{COLOR_PRIMARY_RGB}}, 0.15);
      color: {{COLOR_PRIMARY}};
    }

    .nav-link.active .nav-link-icon {
      color: {{COLOR_PRIMARY}};
    }

    @media (max-width: 768px) {
      .nav-toggle {
        display: flex;
      }

      .nav-menu {
        position: fixed;
        top: 0;
        right: -100%;
        width: 280px;
        height: 100vh;
        flex-direction: column;
        gap: 0.5rem;
        padding: 80px 1.5rem 2rem;
        background: rgba({{COLOR_BACKGROUND_RGB}}, 0.98);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        box-shadow: -10px 0 40px rgba(0, 0, 0, 0.15);
        transition: right 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        overflow-y: auto;
      }

      .nav-menu.active {
        right: 0;
      }

      .nav-link {
        padding: 1rem 1.5rem;
        border-radius: 12px;
        font-size: 1.05rem;
      }

      .nav-link-icon svg {
        width: 20px;
        height: 20px;
      }
    }
  `,
  jsTemplate: `
    // Navigation references
    const navSection = document.querySelector('.nav-section');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenuEl = document.querySelector('.nav-menu');
    
    // Mobile menu toggle with hamburger animation
    if (navToggle && navMenuEl) {
      navToggle.addEventListener('click', () => {
        const isExpanded = navMenuEl.classList.toggle('active');
        navToggle.classList.toggle('active');
        navToggle.setAttribute('aria-expanded', isExpanded.toString());
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = isExpanded ? 'hidden' : '';
      });

      // Close menu when link is clicked
      document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
          navMenuEl.classList.remove('active');
          navToggle.classList.remove('active');
          navToggle.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        });
      });
      
      // ESC key to close menu
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenuEl.classList.contains('active')) {
          navMenuEl.classList.remove('active');
          navToggle.classList.remove('active');
          navToggle.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        }
      });

      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (navMenuEl.classList.contains('active') && 
            !navMenuEl.contains(e.target) && 
            !navToggle.contains(e.target)) {
          navMenuEl.classList.remove('active');
          navToggle.classList.remove('active');
          navToggle.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        }
      });
    }

    // Scroll shrink effect & active link management
    const navHeight = navSection?.offsetHeight || 80;
    let lastScrollY = 0;
    
    window.addEventListener('scroll', () => {
      const scrollY = window.pageYOffset;
      
      // Add/remove scrolled class for shrink effect
      if (navSection) {
        if (scrollY > 50) {
          navSection.classList.add('scrolled');
        } else {
          navSection.classList.remove('scrolled');
        }
      }
      
      // Active link management
      let current = '';
      document.querySelectorAll('section[id]').forEach(section => {
        const sectionTop = section.offsetTop;
        if (scrollY >= sectionTop - navHeight - 50) {
          current = section.getAttribute('id');
        }
      });

      document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
        if (link.getAttribute('href') === '#' + current) {
          link.classList.add('active');
          link.setAttribute('aria-current', 'page');
        }
      });
      
      lastScrollY = scrollY;
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
          const headerOffset = navHeight;
          const elementPosition = targetSection.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  `,
  placeholders: [
    "{{NAME}}", "{{NAV_MENU_ITEMS}}",
    "{{COLOR_PRIMARY}}", "{{COLOR_PRIMARY_RGB}}", "{{COLOR_SECONDARY}}", "{{COLOR_ACCENT}}",
    "{{COLOR_BACKGROUND}}", "{{COLOR_BACKGROUND_RGB}}", "{{COLOR_TEXT}}", "{{COLOR_TEXT_RGB}}", "{{COLOR_TEXT_SECONDARY}}"
  ],
  designNotes: "Modern glassmorphism navigasyon. Icon destekli menü öğeleri, scroll'da küçülme efekti, mobilde slide-in drawer. Hamburger X'e dönüşür.",
};

export const navigationTemplate2: ComponentTemplate = {
  id: "nav-sidebar-modern",
  name: "Modern Sidebar Navigation",
  category: "navigation",
  htmlTemplate: `
    <nav class="nav-sidebar" aria-label="Main navigation">
      <!-- Scroll Progress Indicator -->
      <div class="nav-sidebar-progress">
        <div class="nav-sidebar-progress-bar"></div>
      </div>
      
      <div class="nav-sidebar-header">
        <div class="nav-sidebar-logo">{{INITIALS}}</div>
        <h3 class="nav-sidebar-name">{{NAME}}</h3>
      </div>
      
      <ul class="nav-sidebar-menu" id="nav-sidebar-menu">
        {{NAV_MENU_ITEMS}}
      </ul>
      
      <div class="nav-sidebar-footer">
        <!-- Collapse Toggle Button -->
        <button class="nav-sidebar-collapse-toggle" aria-label="Collapse sidebar" title="Daralt">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="11 17 6 12 11 7"></polyline>
            <polyline points="18 17 13 12 18 7"></polyline>
          </svg>
        </button>
      </div>
    </nav>
    <button class="nav-sidebar-toggle" 
            aria-label="Toggle sidebar"
            aria-expanded="false"
            aria-controls="nav-sidebar">☰</button>
  `,
  cssTemplate: `
    .nav-sidebar {
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      width: 280px;
      background: linear-gradient(-45deg, {{COLOR_PRIMARY}}, {{COLOR_SECONDARY}}, {{COLOR_ACCENT}}, {{COLOR_PRIMARY}});
      background-size: 400% 400%;
      animation: gradientShift 15s ease infinite;
      color: {{COLOR_TEXT}};
      padding: 2rem 0;
      display: flex;
      flex-direction: column;
      z-index: 10000;
      transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1), 
                  transform 0.3s ease,
                  padding 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      overflow: hidden;
    }

    @keyframes gradientShift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    /* Scroll Progress Indicator */
    .nav-sidebar-progress {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: rgba(255, 255, 255, 0.2);
      z-index: 10;
    }

    .nav-sidebar-progress-bar {
      height: 100%;
      width: 0%;
      background: linear-gradient(90deg, {{COLOR_ACCENT}}, #ffffff);
      border-radius: 0 3px 3px 0;
      transition: width 0.1s ease-out;
      box-shadow: 0 0 10px {{COLOR_ACCENT}};
    }

    /* Collapsed State */
    .nav-sidebar.collapsed {
      width: 80px;
      padding: 1.5rem 0;
    }

    .nav-sidebar.collapsed .nav-sidebar-header {
      padding: 0 0.5rem 1.5rem;
    }

    .nav-sidebar.collapsed .nav-sidebar-logo {
      width: 50px;
      height: 50px;
      font-size: 1.2rem;
      margin-bottom: 0;
    }

    .nav-sidebar.collapsed .nav-sidebar-name {
      opacity: 0;
      height: 0;
      overflow: hidden;
      margin: 0;
    }

    .nav-sidebar.collapsed .nav-sidebar-link {
      padding: 1rem;
      justify-content: center;
    }

    .nav-sidebar.collapsed .nav-sidebar-text {
      position: absolute;
      left: 100%;
      margin-left: 15px;
      background: rgba(0, 0, 0, 0.85);
      color: #ffffff;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-size: 0.85rem;
      white-space: nowrap;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.2s ease, transform 0.2s ease;
      transform: translateX(-10px);
      z-index: 100;
    }

    .nav-sidebar.collapsed .nav-sidebar-text::before {
      content: '';
      position: absolute;
      left: -6px;
      top: 50%;
      transform: translateY(-50%);
      border: 6px solid transparent;
      border-right-color: rgba(0, 0, 0, 0.85);
    }

    .nav-sidebar.collapsed .nav-sidebar-link:hover .nav-sidebar-text {
      opacity: 1;
      transform: translateX(0);
    }

    .nav-sidebar.collapsed .nav-sidebar-icon {
      width: 24px;
      height: 24px;
    }

    .nav-sidebar.collapsed .nav-sidebar-icon svg {
      width: 24px;
      height: 24px;
    }

    .nav-sidebar.collapsed .nav-sidebar-footer {
      padding: 1rem 0.5rem;
      flex-direction: column;
      gap: 0.75rem;
    }

    .nav-sidebar.collapsed .nav-sidebar-social {
      flex-direction: column;
      gap: 0.5rem;
    }

    .nav-sidebar.collapsed .nav-sidebar-social a {
      width: 36px;
      height: 36px;
    }

    .nav-sidebar.collapsed .nav-sidebar-collapse-toggle svg {
      transform: rotate(180deg);
    }



    .nav-sidebar-header {
      text-align: center;
      padding: 0 2rem 2rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      transition: padding 0.4s ease;
    }

    .nav-sidebar-logo {
      width: 70px;
      height: 70px;
      margin: 0 auto 0.75rem;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.6rem;
      font-weight: 700;
      color: {{COLOR_TEXT}};
      backdrop-filter: blur(10px);
      transition: all 0.4s ease;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    }

    .nav-sidebar-name {
      margin: 0;
      font-size: 1rem;
      font-weight: 600;
      color: {{COLOR_TEXT}};
      transition: all 0.3s ease;
    }

    .nav-sidebar-menu {
      flex: 1;
      list-style: none;
      padding: 1.5rem 0;
      margin: 0;
    }

    .nav-sidebar-link {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1.5rem;
      color: rgba(255, 255, 255, 0.8);
      text-decoration: none;
      transition: all 0.3s ease;
      position: relative;
    }

    .nav-sidebar-link::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 4px;
      background: {{COLOR_ACCENT}};
      transform: scaleY(0);
      transition: transform 0.3s ease;
    }

    .nav-sidebar-link:hover,
    .nav-sidebar-link.active {
      background: rgba(255, 255, 255, 0.1);
      color: #ffffff;
    }

    .nav-sidebar-link.active::before {
      transform: scaleY(1);
    }

    .nav-sidebar-icon {
      width: 18px;
      height: 18px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      color: rgba(255, 255, 255, 0.9);
      transition: all 0.3s ease;
    }

    .nav-sidebar-icon svg {
      width: 18px;
      height: 18px;
      stroke: currentColor;
      fill: none;
      transition: transform 0.3s ease, stroke-width 0.3s ease;
    }

    .nav-sidebar-link:hover .nav-sidebar-icon {
      color: #ffffff;
    }

    .nav-sidebar-link:hover .nav-sidebar-icon svg {
      transform: scale(1.15) rotate(5deg);
    }

    .nav-sidebar-link.active .nav-sidebar-icon svg {
      animation: pulse 2s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }

    .nav-sidebar-text {
      font-weight: 500;
      font-size: 0.875rem;
      transition: opacity 0.3s ease;
    }

    .nav-sidebar-footer {
      padding: 1.5rem 2rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      transition: padding 0.4s ease;
    }



    /* Collapse Toggle Button */
    .nav-sidebar-collapse-toggle {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 50%;
      color: rgba(255, 255, 255, 0.8);
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .nav-sidebar-collapse-toggle:hover {
      background: rgba(255, 255, 255, 0.2);
      color: #ffffff;
    }

    .nav-sidebar-collapse-toggle svg {
      transition: transform 0.3s ease;
    }



    .nav-sidebar-toggle {
      display: none;
      position: fixed;
      top: 1rem;
      left: 1rem;
      z-index: 10001;
      background: {{COLOR_PRIMARY}};
      color: #ffffff;
      border: none;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      font-size: 1.5rem;
      cursor: pointer;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
      transition: all 0.3s ease;
    }

    .nav-sidebar-toggle:hover {
      transform: scale(1.05);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
    }

    @media (max-width: 768px) {
      .nav-sidebar {
        transform: translateX(-100%);
        width: 280px !important;
      }

      .nav-sidebar.active {
        transform: translateX(0);
      }

      .nav-sidebar-toggle {
        display: block;
      }

      .nav-sidebar-collapse-toggle {
        display: none;
      }

      .nav-sidebar.collapsed .nav-sidebar-text {
        position: static;
        opacity: 1;
        background: none;
        padding: 0;
        margin-left: 0;
        transform: none;
      }

      .nav-sidebar.collapsed .nav-sidebar-text::before {
        display: none;
      }
    }

    /* Main content adjustment */
    body {
      margin-left: 280px;
      transition: margin-left 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    body.sidebar-collapsed {
      margin-left: 80px;
    }

    @media (max-width: 768px) {
      body {
        margin-left: 0 !important;
      }
    }
  `,
  jsTemplate: `
    // Sidebar references
    const sidebarToggle = document.querySelector('.nav-sidebar-toggle');
    const sidebar = document.querySelector('.nav-sidebar');
    const collapseToggle = document.querySelector('.nav-sidebar-collapse-toggle');
    const progressBar = document.querySelector('.nav-sidebar-progress-bar');
    
    // Mobile toggle
    if (sidebarToggle && sidebar) {
      sidebarToggle.addEventListener('click', () => {
        const isExpanded = sidebar.classList.toggle('active');
        sidebarToggle.setAttribute('aria-expanded', isExpanded.toString());
      });

      // Close sidebar when link is clicked on mobile
      if (window.innerWidth <= 768) {
        document.querySelectorAll('.nav-sidebar-link').forEach(link => {
          link.addEventListener('click', () => {
            sidebar.classList.remove('active');
            sidebarToggle.setAttribute('aria-expanded', 'false');
          });
        });
      }
    }

    // Collapse toggle for desktop
    if (collapseToggle && sidebar) {
      // Check saved state
      const savedCollapsed = localStorage.getItem('sidebar-collapsed');
      if (savedCollapsed === 'true') {
        sidebar.classList.add('collapsed');
        document.body.classList.add('sidebar-collapsed');
      }

      collapseToggle.addEventListener('click', () => {
        const isCollapsed = sidebar.classList.toggle('collapsed');
        document.body.classList.toggle('sidebar-collapsed', isCollapsed);
        localStorage.setItem('sidebar-collapsed', isCollapsed.toString());
        collapseToggle.setAttribute('title', isCollapsed ? 'Genişlet' : 'Daralt');
      });
    }



    // Scroll progress indicator
    const updateScrollProgress = () => {
      if (!progressBar) return;
      
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollPercent = (scrollTop / scrollHeight) * 100;
      
      progressBar.style.width = Math.min(scrollPercent, 100) + '%';
    };

    // Active link management
    const navHeight = 80;
    
    window.addEventListener('scroll', () => {
      // Update progress bar
      updateScrollProgress();
      
      // Active link management
      let current = '';
      
      document.querySelectorAll('section[id]').forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - navHeight - 50) {
          current = section.getAttribute('id');
        }
      });

      document.querySelectorAll('.nav-sidebar-link').forEach(link => {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
        if (link.getAttribute('href') === '#' + current) {
          link.classList.add('active');
          link.setAttribute('aria-current', 'page');
        }
      });
    });

    // Initial progress update
    updateScrollProgress();
  `,
  placeholders: [
    "{{NAME}}", "{{INITIALS}}", "{{NAV_MENU_ITEMS}}",
    "{{COLOR_PRIMARY}}", "{{COLOR_SECONDARY}}", "{{COLOR_ACCENT}}", "{{COLOR_TEXT}}"
  ],
  designNotes: "Modern sidebar navigasyon. Collapsible mode (daraltılınca tooltip gösterimi), scroll progress indicator ve animated gradient arka plan içerir. Sol tarafta sabit durur. Mobilde hamburger menü ile açılır. Menu item'ları server-side oluşturulur, iconlu.",
};

export const navigationTemplate3: ComponentTemplate = {
  id: "nav-floating-dot",
  name: "Floating Dot Navigation",
  category: "navigation",
  htmlTemplate: `
    <nav class="nav-floating" aria-label="Main navigation">
      <ul class="nav-floating-menu" id="nav-floating-menu">
        {{NAV_MENU_ITEMS}}
      </ul>
    </nav>
  `,
  cssTemplate: `
    .nav-floating {
      position: fixed;
      right: 1.5rem;
      top: 50%;
      transform: translateY(-50%);
      z-index: 10000;
      opacity: 1;
      transition: opacity 0.5s ease;
    }

    .nav-floating.idle {
      opacity: 0.3;
    }

    .nav-floating:hover {
      opacity: 1 !important;
    }

    .nav-floating-menu {
      list-style: none;
      padding: 0.75rem;
      margin: 0;
      background: rgba({{COLOR_BACKGROUND_RGB}}, 0.8);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-radius: 30px;
      border: 1px solid rgba({{COLOR_TEXT_RGB}}, 0.1);
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12);
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .nav-floating-dot {
      display: block;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: {{COLOR_TEXT_SECONDARY}};
      position: relative;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
    }

    .nav-floating-dot::before {
      content: attr(data-tooltip);
      position: absolute;
      right: calc(100% + 12px);
      top: 50%;
      transform: translateY(-50%) translateX(5px);
      background: {{COLOR_PRIMARY}};
      color: #ffffff;
      padding: 0.4rem 0.75rem;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 500;
      white-space: nowrap;
      opacity: 0;
      pointer-events: none;
      transition: all 0.25s ease;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    }

    .nav-floating-dot::after {
      content: '';
      position: absolute;
      right: calc(100% + 6px);
      top: 50%;
      transform: translateY(-50%);
      border: 5px solid transparent;
      border-left-color: {{COLOR_PRIMARY}};
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.25s ease;
    }

    .nav-floating-dot:hover::before {
      opacity: 1;
      transform: translateY(-50%) translateX(0);
    }

    .nav-floating-dot:hover::after {
      opacity: 1;
    }

    .nav-floating-dot:hover {
      background: {{COLOR_PRIMARY}};
      transform: scale(1.4);
    }

    .nav-floating-dot.active {
      background: {{COLOR_PRIMARY}};
      width: 12px;
      height: 12px;
      animation: dotPulse 2s ease-in-out infinite;
    }

    @keyframes dotPulse {
      0%, 100% {
        box-shadow: 0 0 0 0 rgba({{COLOR_PRIMARY_RGB}}, 0.4);
      }
      50% {
        box-shadow: 0 0 0 8px rgba({{COLOR_PRIMARY_RGB}}, 0);
      }
    }

    /* Trail effect between dots */
    .nav-floating-menu li {
      position: relative;
    }

    .nav-floating-menu li:not(:last-child)::after {
      content: '';
      position: absolute;
      left: 50%;
      bottom: -0.6rem;
      transform: translateX(-50%);
      width: 2px;
      height: 4px;
      background: rgba({{COLOR_TEXT_RGB}}, 0.15);
      border-radius: 1px;
    }

    @media (max-width: 768px) {
      .nav-floating {
        right: 0.75rem;
      }

      .nav-floating-menu {
        padding: 0.5rem;
        gap: 0.75rem;
        border-radius: 20px;
      }

      .nav-floating-dot {
        width: 8px;
        height: 8px;
      }

      .nav-floating-dot.active {
        width: 10px;
        height: 10px;
      }

      .nav-floating-dot::before,
      .nav-floating-dot::after {
        display: none;
      }

      .nav-floating-menu li:not(:last-child)::after {
        display: none;
      }
    }
  `,
  jsTemplate: `
    // Floating navigation references
    const navFloating = document.querySelector('.nav-floating');
    const navHeight = 80;
    let idleTimer = null;

    // Auto-hide on idle function
    const resetIdleTimer = () => {
      if (navFloating) {
        navFloating.classList.remove('idle');
        clearTimeout(idleTimer);
        idleTimer = setTimeout(() => {
          navFloating.classList.add('idle');
        }, 3000);
      }
    };

    // Listen for user activity
    ['scroll', 'mousemove', 'touchstart'].forEach(event => {
      window.addEventListener(event, resetIdleTimer, { passive: true });
    });

    // Start idle timer
    resetIdleTimer();
    
    // Active dot management and scroll handling
    window.addEventListener('scroll', () => {
      let current = '';
      
      document.querySelectorAll('section[id]').forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - navHeight - 50) {
          current = section.getAttribute('id');
        }
      });

      document.querySelectorAll('.nav-floating-dot').forEach(dot => {
        dot.classList.remove('active');
        dot.removeAttribute('aria-current');
        if (dot.getAttribute('href') === '#' + current) {
          dot.classList.add('active');
          dot.setAttribute('aria-current', 'page');
        }
      });
    });

    // Smooth scroll for dot clicks
    document.querySelectorAll('.nav-floating-dot').forEach(dot => {
      dot.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = dot.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
          const headerOffset = navHeight;
          const elementPosition = targetSection.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  `,
  placeholders: [
    "{{NAV_MENU_ITEMS}}",
    "{{COLOR_PRIMARY}}", "{{COLOR_PRIMARY_RGB}}", "{{COLOR_BACKGROUND}}",
    "{{COLOR_BACKGROUND_RGB}}", "{{COLOR_TEXT_SECONDARY}}", "{{COLOR_TEXT_RGB}}"
  ],
  designNotes: "Modern minimal floating dot navigation. Sağ tarafta sabit durur. Aktif dot pulse animasyonu ile vurgulanır. 3 saniye hareketsizlikte opacity azalır (idle mode). Hover'da tooltip gösterir. Dot'lar arası trail çizgisi bulunur. Smooth scroll destekli.",
};

export const navigationTemplate4: ComponentTemplate = {
  id: "nav-glass-morphism",
  name: "Glass Morphism Navigation",
  category: "navigation",
  htmlTemplate: `
    <nav class="nav-glass" aria-label="Main navigation">
      <div class="nav-glass-container">
        <a class="nav-glass-logo" href="#hero">{{NAME}}</a>
        <button class="nav-glass-toggle" 
                aria-label="Toggle menu" 
                aria-expanded="false"
                aria-controls="nav-glass-menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
        <ul class="nav-glass-menu" id="nav-glass-menu">
          {{NAV_MENU_ITEMS}}
        </ul>
      </div>
    </nav>
  `,
  cssTemplate: `
    /* Fixed navigation body padding */
    body {
      padding-top: 100px;
    }

    .nav-glass {
      position: fixed;
      top: 12px;
      left: 50%;
      transform: translateX(-50%);
      width: calc(100% - 40px);
      max-width: 1200px;
      background: rgba({{COLOR_BACKGROUND_RGB}}, 0.15);
      backdrop-filter: blur(16px) saturate(180%);
      -webkit-backdrop-filter: blur(16px) saturate(180%);
      border: 1px solid rgba({{COLOR_TEXT_RGB}}, 0.1);
      border-radius: 24px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2),
                  inset 0 0 0 1px rgba(255, 255, 255, 0.05);
      z-index: 10000;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .nav-glass::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, 
        transparent 5%, 
        rgba({{COLOR_PRIMARY_RGB}}, 0.7) 30%, 
        rgba({{COLOR_ACCENT_RGB}}, 0.7) 70%, 
        transparent 95%);
      opacity: 0.8;
    }

    .nav-glass-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .nav-glass-logo {
      font-size: 1.4rem;
      font-weight: 700;
      color: {{COLOR_TEXT}};
      text-decoration: none;
      transition: all 0.3s ease;
      position: relative;
    }

    .nav-glass-logo::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 0;
      width: 0;
      height: 2px;
      background: linear-gradient(90deg, {{COLOR_PRIMARY}}, {{COLOR_ACCENT}});
      transition: width 0.3s ease;
    }

    .nav-glass-logo:hover::after {
      width: 100%;
    }

    .nav-glass-logo:hover {
      color: {{COLOR_PRIMARY}};
    }

    .nav-glass-toggle {
      display: none;
      flex-direction: column;
      gap: 5px;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.5rem;
      z-index: 10001;
    }

    .nav-glass-toggle span {
      width: 24px;
      height: 2px;
      background: {{COLOR_TEXT}};
      border-radius: 2px;
      transition: all 0.3s ease;
      transform-origin: center;
    }

    .nav-glass-toggle.active span:nth-child(1) {
      transform: translateY(7px) rotate(45deg);
    }

    .nav-glass-toggle.active span:nth-child(2) {
      opacity: 0;
      transform: scaleX(0);
    }

    .nav-glass-toggle.active span:nth-child(3) {
      transform: translateY(-7px) rotate(-45deg);
    }

    .nav-glass-menu {
      display: flex;
      gap: 0.75rem;
      list-style: none;
      margin: 0;
      padding: 0;
      align-items: center;
    }

    .nav-glass-link {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.6rem;
      color: {{COLOR_TEXT}};
      text-decoration: none;
      font-weight: 500;
      font-size: 0.9rem;
      padding: 0.65rem 1rem;
      border-radius: 12px;
      position: relative;
      overflow: hidden;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      background: transparent;
    }

    /* Ripple effect container */
    .nav-glass-link::before {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at center, rgba({{COLOR_PRIMARY_RGB}}, 0.3) 0%, transparent 70%);
      border-radius: inherit;
      transform: scale(0);
      opacity: 0;
      transition: transform 0.5s ease, opacity 0.3s ease;
    }

    .nav-glass-link:hover::before {
      transform: scale(2.5);
      opacity: 1;
    }

    .nav-glass-link-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      color: {{COLOR_TEXT_SECONDARY}};
      transition: all 0.3s ease;
      position: relative;
      z-index: 1;
    }

    .nav-glass-link-icon svg {
      width: 20px;
      height: 20px;
    }

    .nav-glass-link-text {
      position: relative;
      z-index: 1;
    }

    .nav-glass-link:hover {
      color: {{COLOR_PRIMARY}};
      background: rgba({{COLOR_PRIMARY_RGB}}, 0.12);
      box-shadow: 0 0 20px rgba({{COLOR_PRIMARY_RGB}}, 0.15),
                  inset 0 0 0 1px rgba({{COLOR_PRIMARY_RGB}}, 0.2);
      transform: translateY(-1px);
    }

    .nav-glass-link:hover .nav-glass-link-icon {
      color: {{COLOR_PRIMARY}};
      transform: scale(1.1);
    }

    .nav-glass-link.active {
      color: {{COLOR_PRIMARY}};
      background: rgba({{COLOR_PRIMARY_RGB}}, 0.15);
      box-shadow: 0 0 15px rgba({{COLOR_PRIMARY_RGB}}, 0.2);
    }

    .nav-glass-link.active .nav-glass-link-icon {
      color: {{COLOR_PRIMARY}};
    }

    /* Neon glow on active */
    .nav-glass-link.active::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 60%;
      height: 2px;
      background: {{COLOR_PRIMARY}};
      box-shadow: 0 0 10px {{COLOR_PRIMARY}}, 0 0 20px rgba({{COLOR_PRIMARY_RGB}}, 0.5);
      border-radius: 2px;
    }

    @media (max-width: 768px) {
      .nav-glass-toggle {
        display: flex;
      }

      .nav-glass-menu {
        position: fixed;
        top: 0;
        right: -100%;
        width: 280px;
        height: 100vh;
        flex-direction: column;
        gap: 0.5rem;
        padding: 80px 1.5rem 2rem;
        background: rgba({{COLOR_BACKGROUND_RGB}}, 0.2);
        backdrop-filter: blur(20px) saturate(180%);
        -webkit-backdrop-filter: blur(20px) saturate(180%);
        border-left: 1px solid rgba({{COLOR_TEXT_RGB}}, 0.1);
        box-shadow: -10px 0 40px rgba(0, 0, 0, 0.3),
                    inset 0 0 0 1px rgba(255, 255, 255, 0.05);
        transition: right 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        overflow-y: auto;
      }

      .nav-glass-menu.active {
        right: 0;
      }

      .nav-glass-link {
        padding: 1rem 1.5rem;
        border-radius: 12px;
        font-size: 1rem;
      }

      .nav-glass-link-icon svg {
        width: 20px;
        height: 20px;
      }
    }
  `,
  jsTemplate: `
    // Glass navigation references
    const navGlassToggle = document.querySelector('.nav-glass-toggle');
    const navGlassMenu = document.querySelector('.nav-glass-menu');
    const navHeight = 80;
    
    // Mobile menu toggle
    if (navGlassToggle && navGlassMenu) {
      navGlassToggle.addEventListener('click', () => {
        const isExpanded = navGlassMenu.classList.toggle('active');
        navGlassToggle.classList.toggle('active');
        navGlassToggle.setAttribute('aria-expanded', isExpanded.toString());
        document.body.style.overflow = isExpanded ? 'hidden' : '';
      });

      // Close menu when link is clicked
      document.querySelectorAll('.nav-glass-link').forEach(link => {
        link.addEventListener('click', () => {
          navGlassMenu.classList.remove('active');
          navGlassToggle.classList.remove('active');
          navGlassToggle.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        });
      });
      
      // ESC key to close menu
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navGlassMenu.classList.contains('active')) {
          navGlassMenu.classList.remove('active');
          navGlassToggle.classList.remove('active');
          navGlassToggle.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        }
      });

      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (navGlassMenu.classList.contains('active') && 
            !navGlassMenu.contains(e.target) && 
            !navGlassToggle.contains(e.target)) {
          navGlassMenu.classList.remove('active');
          navGlassToggle.classList.remove('active');
          navGlassToggle.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        }
      });
    }

    // Active link management
    window.addEventListener('scroll', () => {
      let current = '';
      
      document.querySelectorAll('section[id]').forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - navHeight - 50) {
          current = section.getAttribute('id');
        }
      });

      document.querySelectorAll('.nav-glass-link').forEach(link => {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
        if (link.getAttribute('href') === '#' + current) {
          link.classList.add('active');
          link.setAttribute('aria-current', 'page');
        }
      });
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('.nav-glass-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
          const headerOffset = navHeight;
          const elementPosition = targetSection.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  `,
  placeholders: [
    "{{NAME}}", "{{NAV_MENU_ITEMS}}",
    "{{COLOR_PRIMARY}}", "{{COLOR_PRIMARY_RGB}}",
    "{{COLOR_ACCENT}}", "{{COLOR_ACCENT_RGB}}",
    "{{COLOR_BACKGROUND}}", "{{COLOR_BACKGROUND_RGB}}",
    "{{COLOR_TEXT}}", "{{COLOR_TEXT_SECONDARY}}"
  ],
  designNotes: "Premium glassmorphism navigation. Blur(20px) arka plan, neon border glow, ripple hover efekti. Icon+text menü öğeleri. Hamburger X'e dönüşür. Mobil drawer menü glassmorphism ile.",
};

export const navigationTemplate5: ComponentTemplate = {
  id: "nav-bottom-tabbar",
  name: "Bottom Tab Bar Navigation",
  category: "navigation",
  htmlTemplate: `
    <nav class="nav-tabbar" aria-label="Main navigation">
      <div class="nav-tabbar-container">
        <!-- Desktop header (hidden on mobile) -->
        <div class="nav-tabbar-desktop-header">
          <a class="nav-tabbar-logo" href="#hero">{{NAME}}</a>
          <ul class="nav-tabbar-desktop-menu" id="nav-tabbar-desktop-menu">
          </ul>
        </div>
        
        <!-- Mobile bottom tab bar (hidden on desktop) -->
        <div class="nav-tabbar-mobile">
          <ul class="nav-tabbar-tabs" id="nav-tabbar-tabs">
          </ul>
          <div class="nav-tabbar-indicator"></div>
        </div>
      </div>
      
      <!-- Hidden data for JS to populate both menus -->
      <template id="nav-tabbar-data">{{NAV_MENU_ITEMS}}</template>
    </nav>
  `,
  cssTemplate: `
    /* Bottom Tab Bar Navigation */
    .nav-tabbar {
      position: fixed;
      z-index: 10000;
    }

    .nav-tabbar-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    /* Desktop Header Styles */
    .nav-tabbar-desktop-header {
      display: none;
    }

    .nav-tabbar-desktop-menu {
      display: flex;
      gap: 0.5rem;
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .nav-tabbar-desktop-link {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: {{COLOR_TEXT}};
      text-decoration: none;
      font-weight: 500;
      padding: 0.6rem 1rem;
      border-radius: 8px;
      transition: all 0.3s ease;
      position: relative;
    }

    .nav-tabbar-desktop-link-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      color: {{COLOR_TEXT_SECONDARY}};
      transition: all 0.3s ease;
    }

    .nav-tabbar-desktop-link-icon svg {
      width: 18px;
      height: 18px;
    }

    .nav-tabbar-desktop-link:hover {
      background: rgba({{COLOR_PRIMARY_RGB}}, 0.1);
      color: {{COLOR_PRIMARY}};
    }

    .nav-tabbar-desktop-link:hover .nav-tabbar-desktop-link-icon {
      color: {{COLOR_PRIMARY}};
    }

    .nav-tabbar-desktop-link.active {
      background: rgba({{COLOR_PRIMARY_RGB}}, 0.15);
      color: {{COLOR_PRIMARY}};
    }

    .nav-tabbar-desktop-link.active .nav-tabbar-desktop-link-icon {
      color: {{COLOR_PRIMARY}};
    }

    /* Mobile Tab Bar Styles */
    .nav-tabbar-mobile {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba({{COLOR_BACKGROUND_RGB}}, 0.9);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-top: 1px solid rgba({{COLOR_TEXT_RGB}}, 0.08);
      padding: 0.4rem 0.25rem;
      padding-bottom: max(0.4rem, env(safe-area-inset-bottom));
      box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
      overflow-x: hidden;
    }

    .nav-tabbar-tabs {
      display: flex;
      justify-content: space-around;
      align-items: center;
      list-style: none;
      margin: 0;
      padding: 0;
      position: relative;
    }

    .nav-tabbar-tabs li {
      flex: 1 1 0;
      min-width: 0;
      display: flex;
      justify-content: center;
    }

    .nav-tabbar-tab {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.15rem;
      padding: 0.35rem 0.4rem;
      color: {{COLOR_TEXT_SECONDARY}};
      text-decoration: none;
      border-radius: 10px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      min-width: 44px;
    }

    .nav-tabbar-tab-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .nav-tabbar-tab-icon svg {
      width: 18px;
      height: 18px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .nav-tabbar-tab-label {
      display: none;
    }

    /* Active Tab - Pop-up Animation */
    .nav-tabbar-tab.active {
      color: {{COLOR_PRIMARY}};
    }

    .nav-tabbar-tab.active .nav-tabbar-tab-icon {
      transform: translateY(-4px) scale(1.15);
    }

    .nav-tabbar-tab.active .nav-tabbar-tab-icon svg {
      filter: drop-shadow(0 2px 8px rgba({{COLOR_PRIMARY_RGB}}, 0.4));
    }

    .nav-tabbar-tab.active .nav-tabbar-tab-label {
      opacity: 1;
      font-weight: 600;
    }

    /* Pill-shaped Active Indicator */
    .nav-tabbar-tab.active::before {
      content: '';
      position: absolute;
      top: -8px;
      left: 50%;
      transform: translateX(-50%);
      width: 32px;
      height: 4px;
      background: linear-gradient(90deg, {{COLOR_PRIMARY}}, {{COLOR_ACCENT}});
      border-radius: 0 0 4px 4px;
      box-shadow: 0 2px 8px rgba({{COLOR_PRIMARY_RGB}}, 0.3);
      animation: pillAppear 0.3s ease;
    }

    @keyframes pillAppear {
      0% {
        width: 0;
        opacity: 0;
      }
      100% {
        width: 32px;
        opacity: 1;
      }
    }

    /* Hover State */
    .nav-tabbar-tab:hover:not(.active) {
      color: {{COLOR_TEXT}};
      background: rgba({{COLOR_PRIMARY_RGB}}, 0.05);
    }

    .nav-tabbar-tab:hover:not(.active) .nav-tabbar-tab-icon {
      transform: translateY(-2px);
    }

    /* Body padding for fixed bottom tab */
    body {
      padding-bottom: 70px;
    }

    /* Desktop Styles - Transform to Header */
    @media (min-width: 769px) {
      body {
        padding-bottom: 0;
        padding-top: 70px;
      }

      .nav-tabbar {
        top: 0;
        left: 0;
        right: 0;
        bottom: auto;
        background: rgba({{COLOR_BACKGROUND_RGB}}, 0.85);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border-bottom: 1px solid rgba({{COLOR_TEXT_RGB}}, 0.08);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      }

      .nav-tabbar-mobile {
        display: none;
      }

      .nav-tabbar-desktop-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 2rem;
        max-width: 1200px;
        margin: 0 auto;
      }

      .nav-tabbar-logo {
        font-size: 1.4rem;
        font-weight: 700;
        color: {{COLOR_TEXT}};
        text-decoration: none;
        transition: all 0.3s ease;
      }

      .nav-tabbar-logo:hover {
        color: {{COLOR_PRIMARY}};
      }
    }

    /* Very small screens - Reduce label size */
    @media (max-width: 374px) {
      .nav-tabbar-tab {
        min-width: 48px;
        padding: 0.4rem 0.5rem;
      }

      .nav-tabbar-tab-label {
        font-size: 0.55rem;
      }

      .nav-tabbar-tab-icon svg {
        width: 20px;
        height: 20px;
      }
    }
  `,
  jsTemplate: `
    // Bottom Tab Bar navigation
    const navHeight = 80;
    
    // Initialize menus from data template
    (function initTabBarMenus() {
      const dataTemplate = document.getElementById('nav-tabbar-data');
      if (!dataTemplate) return;
      
      const dataContent = dataTemplate.innerHTML || '';
      
      // Split mobile and desktop items by the separator comment
      const parts = dataContent.split('<!-- DESKTOP_MENU -->');
      const mobileItems = parts[0] || '';
      const desktopItems = parts[1] || '';
      
      // Populate mobile tabs
      const tabsContainer = document.getElementById('nav-tabbar-tabs');
      if (tabsContainer && mobileItems) {
        tabsContainer.innerHTML = mobileItems;
      }
      
      // Populate desktop menu
      const desktopContainer = document.getElementById('nav-tabbar-desktop-menu');
      if (desktopContainer && desktopItems) {
        desktopContainer.innerHTML = desktopItems;
      }
    })();
    
    // Active tab management on scroll
    window.addEventListener('scroll', () => {
      let current = '';
      
      document.querySelectorAll('section[id]').forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - navHeight - 50) {
          current = section.getAttribute('id');
        }
      });

      // Update mobile tabs
      document.querySelectorAll('.nav-tabbar-tab').forEach(tab => {
        tab.classList.remove('active');
        tab.removeAttribute('aria-current');
        if (tab.getAttribute('href') === '#' + current) {
          tab.classList.add('active');
          tab.setAttribute('aria-current', 'page');
        }
      });

      // Update desktop links
      document.querySelectorAll('.nav-tabbar-desktop-link').forEach(link => {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
        if (link.getAttribute('href') === '#' + current) {
          link.classList.add('active');
          link.setAttribute('aria-current', 'page');
        }
      });
    });

    // Smooth scroll for tab and link clicks
    const handleNavClick = (e) => {
      e.preventDefault();
      const targetId = e.currentTarget.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        const headerOffset = navHeight;
        const elementPosition = targetSection.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    };

    document.querySelectorAll('.nav-tabbar-tab').forEach(tab => {
      tab.addEventListener('click', handleNavClick);
    });

    document.querySelectorAll('.nav-tabbar-desktop-link').forEach(link => {
      link.addEventListener('click', handleNavClick);
    });
  `,
  placeholders: [
    "{{NAME}}", "{{NAV_MENU_ITEMS}}",
    "{{COLOR_PRIMARY}}", "{{COLOR_PRIMARY_RGB}}",
    "{{COLOR_ACCENT}}", "{{COLOR_ACCENT_RGB}}",
    "{{COLOR_BACKGROUND}}", "{{COLOR_BACKGROUND_RGB}}",
    "{{COLOR_TEXT}}", "{{COLOR_TEXT_RGB}}", "{{COLOR_TEXT_SECONDARY}}"
  ],
  designNotes: "Mobil-first bottom tab bar navigasyon. Altta sabit, icon+label stacked layout, pill-shaped active indicator, pop-up animasyonu. Desktop'ta üst header'a dönüşür. Safe area inset desteği. Content creators, influencers ve mobil odaklı portfolyolar için ideal.",
};

export const navigationTemplate6: ComponentTemplate = {
  id: "nav-pill-modern",
  name: "Pill Navigation",
  category: "navigation",
  htmlTemplate: `
    <nav class="nav-pill" aria-label="Main navigation">
      <div class="nav-pill-container">
        <a class="nav-pill-logo" href="#hero">{{NAME}}</a>
        <button class="nav-pill-toggle" 
                aria-label="Toggle menu" 
                aria-expanded="false"
                aria-controls="nav-pill-menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
        <div class="nav-pill-menu-wrapper" id="nav-pill-menu">
          <ul class="nav-pill-menu">
            {{NAV_MENU_ITEMS}}
          </ul>
          <div class="nav-pill-indicator"></div>
        </div>
      </div>
    </nav>
  `,
  cssTemplate: `
    /* Fixed navigation body padding */
    body {
      padding-top: 90px;
    }

    .nav-pill {
      position: fixed;
      top: 16px;
      left: 50%;
      transform: translateX(-50%);
      width: calc(100% - 24px);
      max-width: 1100px;
      z-index: 10000;
    }

    .nav-pill-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem 0.5rem 0.5rem 1.5rem;
      background: rgba({{COLOR_BACKGROUND_RGB}}, 0.85);
      backdrop-filter: blur(16px) saturate(180%);
      -webkit-backdrop-filter: blur(16px) saturate(180%);
      border: 1px solid rgba({{COLOR_TEXT_RGB}}, 0.08);
      border-radius: 100px;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08),
                  0 1px 2px rgba(0, 0, 0, 0.04);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .nav-pill-container:hover {
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12),
                  0 2px 4px rgba(0, 0, 0, 0.06);
    }

    .nav-pill-logo {
      font-size: 1rem;
      font-weight: 700;
      color: {{COLOR_TEXT}};
      text-decoration: none;
      transition: all 0.3s ease;
      white-space: nowrap;
    }

    .nav-pill-logo:hover {
      color: {{COLOR_PRIMARY}};
    }

    .nav-pill-toggle {
      display: none;
      flex-direction: column;
      gap: 4px;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.75rem;
      border-radius: 50%;
      transition: background 0.3s ease;
      z-index: 10001;
    }

    .nav-pill-toggle:hover {
      background: rgba({{COLOR_TEXT_RGB}}, 0.05);
    }

    .nav-pill-toggle span {
      width: 20px;
      height: 2px;
      background: {{COLOR_TEXT}};
      border-radius: 2px;
      transition: all 0.3s ease;
      transform-origin: center;
    }

    .nav-pill-toggle.active span:nth-child(1) {
      transform: translateY(6px) rotate(45deg);
    }

    .nav-pill-toggle.active span:nth-child(2) {
      opacity: 0;
      transform: scaleX(0);
    }

    .nav-pill-toggle.active span:nth-child(3) {
      transform: translateY(-6px) rotate(-45deg);
    }

    .nav-pill-menu-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    .nav-pill-menu {
      display: flex;
      gap: 0.25rem;
      list-style: none;
      margin: 0;
      padding: 0.25rem;
      background: rgba({{COLOR_TEXT_RGB}}, 0.04);
      border-radius: 100px;
      position: relative;
    }

    .nav-pill-link {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      color: {{COLOR_TEXT_SECONDARY}};
      text-decoration: none;
      font-weight: 500;
      font-size: 0.8rem;
      padding: 0.5rem 0.85rem;
      border-radius: 100px;
      position: relative;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 1;
    }

    .nav-pill-link-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
    }

    .nav-pill-link-icon svg {
      width: 14px;
      height: 14px;
    }

    .nav-pill-link:hover {
      color: {{COLOR_TEXT}};
    }

    .nav-pill-link.active {
      color: {{COLOR_PRIMARY}};
    }

    /* Sliding background indicator */
    .nav-pill-indicator {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      height: calc(100% - 8px);
      background: rgba({{COLOR_PRIMARY_RGB}}, 0.12);
      border-radius: 100px;
      box-shadow: 0 2px 8px rgba({{COLOR_PRIMARY_RGB}}, 0.15);
      transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
      pointer-events: none;
      opacity: 0;
    }

    .nav-pill-indicator.active {
      opacity: 1;
    }

    @media (max-width: 768px) {
      body {
        padding-top: 80px;
      }

      .nav-pill {
        top: 12px;
        width: calc(100% - 24px);
      }

      .nav-pill-container {
        padding: 0.4rem 0.5rem 0.4rem 1rem;
      }

      .nav-pill-toggle {
        display: flex;
      }

      .nav-pill-menu-wrapper {
        position: fixed;
        top: 0;
        right: -100%;
        width: 280px;
        height: 100vh;
        background: rgba({{COLOR_BACKGROUND_RGB}}, 0.98);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        flex-direction: column;
        padding: 80px 1.5rem 2rem;
        box-shadow: -10px 0 40px rgba(0, 0, 0, 0.15);
        transition: right 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .nav-pill-menu-wrapper.active {
        right: 0;
      }

      .nav-pill-menu {
        flex-direction: column;
        gap: 0.5rem;
        width: 100%;
        background: transparent;
        padding: 0;
        border-radius: 0;
      }

      .nav-pill-link {
        padding: 1rem 1.5rem;
        border-radius: 12px;
        font-size: 1rem;
      }

      .nav-pill-link-icon svg {
        width: 20px;
        height: 20px;
      }

      .nav-pill-indicator {
        display: none;
      }

      .nav-pill-link.active {
        background: rgba({{COLOR_PRIMARY_RGB}}, 0.12);
      }
    }
  `,
  jsTemplate: `
    // Pill navigation references
    const navPillToggle = document.querySelector('.nav-pill-toggle');
    const navPillMenu = document.querySelector('.nav-pill-menu-wrapper');
    const navPillIndicator = document.querySelector('.nav-pill-indicator');
    const navPillLinks = document.querySelectorAll('.nav-pill-link');
    const navHeight = 80;
    
    // Sliding indicator function
    function updateIndicator(activeLink) {
      if (!navPillIndicator || !activeLink || window.innerWidth <= 768) return;
      
      const linkRect = activeLink.getBoundingClientRect();
      const menuRect = activeLink.closest('.nav-pill-menu').getBoundingClientRect();
      
      const left = linkRect.left - menuRect.left;
      const width = linkRect.width;
      
      navPillIndicator.style.left = left + 'px';
      navPillIndicator.style.width = width + 'px';
      navPillIndicator.classList.add('active');
    }
    
    // Mobile menu toggle
    if (navPillToggle && navPillMenu) {
      navPillToggle.addEventListener('click', () => {
        const isExpanded = navPillMenu.classList.toggle('active');
        navPillToggle.classList.toggle('active');
        navPillToggle.setAttribute('aria-expanded', isExpanded.toString());
        document.body.style.overflow = isExpanded ? 'hidden' : '';
      });

      // Close menu when link is clicked
      navPillLinks.forEach(link => {
        link.addEventListener('click', () => {
          navPillMenu.classList.remove('active');
          navPillToggle.classList.remove('active');
          navPillToggle.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        });
      });
      
      // ESC key to close menu
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navPillMenu.classList.contains('active')) {
          navPillMenu.classList.remove('active');
          navPillToggle.classList.remove('active');
          navPillToggle.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        }
      });

      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (navPillMenu.classList.contains('active') && 
            !navPillMenu.contains(e.target) && 
            !navPillToggle.contains(e.target)) {
          navPillMenu.classList.remove('active');
          navPillToggle.classList.remove('active');
          navPillToggle.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        }
      });
    }

    // Active link management on scroll
    window.addEventListener('scroll', () => {
      let current = '';
      
      document.querySelectorAll('section[id]').forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - navHeight - 50) {
          current = section.getAttribute('id');
        }
      });

      navPillLinks.forEach(link => {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
        if (link.getAttribute('href') === '#' + current) {
          link.classList.add('active');
          link.setAttribute('aria-current', 'page');
          updateIndicator(link);
        }
      });
    });

    // Smooth scroll for navigation links
    navPillLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
          const headerOffset = navHeight;
          const elementPosition = targetSection.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    });

    // Initial indicator position
    window.addEventListener('load', () => {
      const activeLink = document.querySelector('.nav-pill-link.active');
      if (activeLink) {
        updateIndicator(activeLink);
      }
    });

    // Update indicator on resize
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        const activeLink = document.querySelector('.nav-pill-link.active');
        if (activeLink) {
          updateIndicator(activeLink);
        }
      }
    });
  `,
  placeholders: [
    "{{NAME}}", "{{NAV_MENU_ITEMS}}",
    "{{COLOR_PRIMARY}}", "{{COLOR_PRIMARY_RGB}}",
    "{{COLOR_BACKGROUND}}", "{{COLOR_BACKGROUND_RGB}}",
    "{{COLOR_TEXT}}", "{{COLOR_TEXT_RGB}}", "{{COLOR_TEXT_SECONDARY}}"
  ],
  designNotes: "Modern pill-shaped navigasyon. Rounded pill-style linkler, sliding background indicator animasyonu, subtle shadow efektleri. Kompakt ve minimal tasarım. SaaS tarzı siteler ve minimal portfolyolar için ideal. Mobilde slide-in drawer menü.",
};

export const navigationTemplates: ComponentTemplate[] = [
  navigationTemplate1,
  navigationTemplate2,
  navigationTemplate3,
  navigationTemplate4,
  navigationTemplate5,
  navigationTemplate6,
];
