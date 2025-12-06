import { ComponentTemplate } from "@/types/templates";

/**
 * Navigation menu template'leri
 */

export const navigationTemplate1: ComponentTemplate = {
  id: "nav-classic-horizontal",
  name: "Classic Horizontal Navigation",
  category: "navigation",
  htmlTemplate: `
    <nav class="nav-section">
      <div class="nav-container">
        <div class="nav-logo">
          <a href="#home">{{NAME}}</a>
        </div>
        <button class="nav-toggle" aria-label="Toggle menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
        <ul class="nav-menu" id="nav-menu">
          <!-- Menu items will be dynamically generated based on page sections -->
        </ul>
      </div>
    </nav>
  `,
  cssTemplate: `
    .nav-section {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: #ffffff;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      z-index: 1000;
      transition: all 0.3s ease;
    }

    .nav-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .nav-logo a {
      font-size: 1.5rem;
      font-weight: 700;
      color: #2c3e50;
      text-decoration: none;
      transition: color 0.3s ease;
    }

    .nav-logo a:hover {
      color: #3498db;
    }

    .nav-toggle {
      display: none;
      flex-direction: column;
      gap: 4px;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.5rem;
    }

    .nav-toggle span {
      width: 25px;
      height: 3px;
      background: #2c3e50;
      transition: all 0.3s ease;
    }

    .nav-menu {
      display: flex;
      gap: 2rem;
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .nav-link {
      color: #2c3e50;
      text-decoration: none;
      font-weight: 500;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      transition: all 0.3s ease;
    }

    .nav-link:hover {
      background: #f8f9fa;
      color: #3498db;
    }

    @media (max-width: 768px) {
      .nav-toggle {
        display: flex;
      }

      .nav-menu {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        flex-direction: column;
        gap: 0;
        background: #ffffff;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.3s ease;
      }

      .nav-menu.active {
        max-height: 400px;
      }

      .nav-link {
        display: block;
        padding: 1rem 2rem;
        border-bottom: 1px solid #f0f0f0;
      }
    }
  `,
  jsTemplate: `
    // Dynamically generate menu items based on sections
    const navMenu = document.getElementById('nav-menu');
    if (navMenu) {
      const sections = document.querySelectorAll('section[id]');
      const menuItems = [];
      
      sections.forEach(section => {
        const sectionId = section.getAttribute('id');
        let sectionName = sectionId.charAt(0).toUpperCase() + sectionId.slice(1);
        
        // Türkçe isimlendirme
        const nameMap = {
          'hero': 'Ana Sayfa',
          'experience': 'Deneyim',
          'skills': 'Yetenekler',
          'about': 'Hakkımda',
          'contact': 'İletişim',
          'education': 'Eğitim'
        };
        
        sectionName = nameMap[sectionId] || sectionName;
        
        menuItems.push(\`<li><a href="#\${sectionId}" class="nav-link">\${sectionName}</a></li>\`);
      });
      
      navMenu.innerHTML = menuItems.join('');
    }

    // Mobile menu toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenuEl = document.querySelector('.nav-menu');
    
    if (navToggle && navMenuEl) {
      navToggle.addEventListener('click', () => {
        navMenuEl.classList.toggle('active');
      });

      // Close menu when link is clicked
      document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
          navMenuEl.classList.remove('active');
        });
      });
    }

    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });

    // Add shadow on scroll
    window.addEventListener('scroll', () => {
      const nav = document.querySelector('.nav-section');
      if (nav) {
        if (window.scrollY > 50) {
          nav.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
        } else {
          nav.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
      }
    });
  `,
  dataSchema: {
    NAME: { type: "text", required: true, description: "Logo/Brand ismi" },
  },
  designNotes: "Klasik yatay navigasyon. Mobilde hamburger menüye dönüşür. Scroll'da gölge efekti artar.",
};

export const navigationTemplate2: ComponentTemplate = {
  id: "nav-minimal-centered",
  name: "Minimal Centered Navigation",
  category: "navigation",
  htmlTemplate: `
    <nav class="nav-minimal">
      <div class="nav-minimal-container">
        <ul class="nav-minimal-menu" id="nav-minimal-menu">
          <li class="nav-minimal-logo">
            <a href="#hero">{{INITIALS}}</a>
          </li>
          <!-- Menu items will be dynamically generated -->
        </ul>
      </div>
    </nav>
  `,
  cssTemplate: `
    .nav-minimal {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      z-index: 1000;
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    }

    .nav-minimal-container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 1.5rem 2rem;
    }

    .nav-minimal-menu {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 3rem;
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .nav-minimal-logo {
      margin: 0 2rem;
    }

    .nav-minimal-logo a {
      width: 45px;
      height: 45px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #2c3e50;
      color: #ffffff;
      border-radius: 50%;
      font-weight: 700;
      font-size: 1.2rem;
      text-decoration: none;
      transition: all 0.3s ease;
    }

    .nav-minimal-logo a:hover {
      background: #3498db;
      transform: scale(1.1);
    }

    .nav-minimal-link {
      color: #2c3e50;
      text-decoration: none;
      font-weight: 500;
      font-size: 0.95rem;
      position: relative;
      transition: color 0.3s ease;
    }

    .nav-minimal-link::after {
      content: '';
      position: absolute;
      bottom: -5px;
      left: 0;
      width: 0;
      height: 2px;
      background: #3498db;
      transition: width 0.3s ease;
    }

    .nav-minimal-link:hover,
    .nav-minimal-link.active {
      color: #3498db;
    }

    .nav-minimal-link:hover::after,
    .nav-minimal-link.active::after {
      width: 100%;
    }

    @media (max-width: 768px) {
      .nav-minimal-menu {
        flex-wrap: wrap;
        gap: 1.5rem;
      }

      .nav-minimal-logo {
        order: -1;
        width: 100%;
        text-align: center;
        margin: 0 0 1rem 0;
      }
    }
  `,
  jsTemplate: `
    // Dynamically generate menu items
    const navMinimalMenu = document.getElementById('nav-minimal-menu');
    const logoItem = document.querySelector('.nav-minimal-logo');
    
    if (navMinimalMenu && logoItem) {
      const sections = document.querySelectorAll('section[id]');
      const menuItems = [];
      const nameMap = {
        'hero': 'Ana Sayfa',
        'experience': 'Deneyim',
        'skills': 'Yetenekler',
        'about': 'Hakkımda',
        'contact': 'İletişim',
        'education': 'Eğitim'
      };
      
      let itemsBeforeLogo = [];
      let itemsAfterLogo = [];
      let isBeforeLogo = true;
      
      sections.forEach((section, index) => {
        const sectionId = section.getAttribute('id');
        const sectionName = nameMap[sectionId] || sectionId.charAt(0).toUpperCase() + sectionId.slice(1);
        const item = \`<li><a href="#\${sectionId}" class="nav-minimal-link">\${sectionName}</a></li>\`;
        
        // İlk yarıyı logo öncesine, ikinci yarıyı logo sonrasına koy
        if (index < Math.floor(sections.length / 2)) {
          itemsBeforeLogo.push(item);
        } else {
          itemsAfterLogo.push(item);
        }
      });
      
      // Logo'nun önüne ve arkasına itemleri ekle
      logoItem.insertAdjacentHTML('beforebegin', itemsBeforeLogo.join(''));
      logoItem.insertAdjacentHTML('afterend', itemsAfterLogo.join(''));
    }

    // Active link management
    const navLinks = document.querySelectorAll('.nav-minimal-link');
    
    window.addEventListener('scroll', () => {
      let current = '';
      
      document.querySelectorAll('section[id]').forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
          current = section.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
          link.classList.add('active');
        }
      });
    });

    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  `,
  dataSchema: {
    INITIALS: { type: "text", required: true, description: "İsim baş harfleri (örn: EA)" },
  },
  designNotes: "Minimal tasarım. Logo ortada, linkler iki yanda. Aktif sayfa göstergesi var.",
};

export const navigationTemplate3: ComponentTemplate = {
  id: "nav-sidebar-modern",
  name: "Modern Sidebar Navigation",
  category: "navigation",
  htmlTemplate: `
    <nav class="nav-sidebar">
      <div class="nav-sidebar-header">
        <div class="nav-sidebar-logo">{{INITIALS}}</div>
        <h3 class="nav-sidebar-name">{{NAME}}</h3>
      </div>
      <ul class="nav-sidebar-menu" id="nav-sidebar-menu">
        <!-- Menu items will be dynamically generated -->
      </ul>
      <div class="nav-sidebar-footer">
        <div class="nav-sidebar-social">
          {{SOCIAL_LINKS}}
        </div>
      </div>
    </nav>
    <button class="nav-sidebar-toggle" aria-label="Toggle sidebar">☰</button>
  `,
  cssTemplate: `
    .nav-sidebar {
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      width: 280px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #ffffff;
      padding: 2rem 0;
      display: flex;
      flex-direction: column;
      z-index: 1000;
      transition: transform 0.3s ease;
    }

    .nav-sidebar-header {
      text-align: center;
      padding: 0 2rem 2rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .nav-sidebar-logo {
      width: 80px;
      height: 80px;
      margin: 0 auto 1rem;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      font-weight: 700;
      backdrop-filter: blur(10px);
    }

    .nav-sidebar-name {
      margin: 0;
      font-size: 1.2rem;
      font-weight: 600;
    }

    .nav-sidebar-menu {
      flex: 1;
      list-style: none;
      padding: 2rem 0;
      margin: 0;
    }

    .nav-sidebar-link {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem 2rem;
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
      background: #ffffff;
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
      font-size: 1.5rem;
    }

    .nav-sidebar-text {
      font-weight: 500;
    }

    .nav-sidebar-footer {
      padding: 1.5rem 2rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .nav-sidebar-social {
      display: flex;
      justify-content: center;
      gap: 1rem;
    }

    .nav-sidebar-social a {
      color: rgba(255, 255, 255, 0.8);
      text-decoration: none;
      font-size: 1.5rem;
      transition: color 0.3s ease;
    }

    .nav-sidebar-social a:hover {
      color: #ffffff;
    }

    .nav-sidebar-toggle {
      display: none;
      position: fixed;
      top: 1rem;
      left: 1rem;
      z-index: 1001;
      background: #667eea;
      color: #ffffff;
      border: none;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      font-size: 1.5rem;
      cursor: pointer;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    }

    @media (max-width: 768px) {
      .nav-sidebar {
        transform: translateX(-100%);
      }

      .nav-sidebar.active {
        transform: translateX(0);
      }

      .nav-sidebar-toggle {
        display: block;
      }
    }

    /* Main content adjustment */
    body {
      margin-left: 280px;
    }

    @media (max-width: 768px) {
      body {
        margin-left: 0;
      }
    }
  `,
  jsTemplate: `
    // Dynamically generate sidebar menu items
    const sidebarMenu = document.getElementById('nav-sidebar-menu');
    if (sidebarMenu) {
      const sections = document.querySelectorAll('section[id]');
      const iconMap = {
        'hero': '🏠',
        'experience': '💼',
        'skills': '⚡',
        'about': '👤',
        'contact': '📧',
        'education': '🎓'
      };
      const nameMap = {
        'hero': 'Ana Sayfa',
        'experience': 'Deneyim',
        'skills': 'Yetenekler',
        'about': 'Hakkımda',
        'contact': 'İletişim',
        'education': 'Eğitim'
      };
      
      const menuItems = [];
      sections.forEach((section, index) => {
        const sectionId = section.getAttribute('id');
        const icon = iconMap[sectionId] || '📄';
        const name = nameMap[sectionId] || sectionId.charAt(0).toUpperCase() + sectionId.slice(1);
        const activeClass = index === 0 ? 'active' : '';
        
        menuItems.push(\`
          <li>
            <a href="#\${sectionId}" class="nav-sidebar-link \${activeClass}">
              <span class="nav-sidebar-icon">\${icon}</span>
              <span class="nav-sidebar-text">\${name}</span>
            </a>
          </li>
        \`);
      });
      
      sidebarMenu.innerHTML = menuItems.join('');
    }

    // Sidebar toggle for mobile
    const sidebarToggle = document.querySelector('.nav-sidebar-toggle');
    const sidebar = document.querySelector('.nav-sidebar');
    
    if (sidebarToggle && sidebar) {
      sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
      });

      // Close sidebar when link is clicked on mobile
      if (window.innerWidth <= 768) {
        document.querySelectorAll('.nav-sidebar-link').forEach(link => {
          link.addEventListener('click', () => {
            sidebar.classList.remove('active');
          });
        });
      }
    }

    // Active link management
    const sidebarLinks = document.querySelectorAll('.nav-sidebar-link');
    
    window.addEventListener('scroll', () => {
      let current = '';
      
      document.querySelectorAll('section[id]').forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 300) {
          current = section.getAttribute('id');
        }
      });

      sidebarLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
          link.classList.add('active');
        }
      });
    });

    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  `,
  dataSchema: {
    NAME: { type: "text", required: true, description: "Tam isim" },
    INITIALS: { type: "text", required: true, description: "İsim baş harfleri" },
    SOCIAL_LINKS: { type: "html", required: false, description: "Sosyal medya linkleri" },
  },
  designNotes: "Modern sidebar navigasyon. Sol tarafta sabit durur. Mobilde hamburger menü ile açılır. Gradient arka plan ve iconlu menu.",
};

export const navigationTemplate4: ComponentTemplate = {
  id: "nav-floating-dot",
  name: "Floating Dot Navigation",
  category: "navigation",
  htmlTemplate: `
    <nav class="nav-floating">
      <ul class="nav-floating-menu" id="nav-floating-menu">
        <!-- Menu items will be dynamically generated -->
      </ul>
    </nav>
  `,
  cssTemplate: `
    .nav-floating {
      position: fixed;
      right: 2rem;
      top: 50%;
      transform: translateY(-50%);
      z-index: 1000;
    }

    .nav-floating-menu {
      list-style: none;
      padding: 1rem;
      margin: 0;
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(10px);
      border-radius: 50px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .nav-floating-dot {
      display: block;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #cbd5e0;
      position: relative;
      transition: all 0.3s ease;
    }

    .nav-floating-dot::before {
      content: attr(data-tooltip);
      position: absolute;
      right: calc(100% + 1rem);
      top: 50%;
      transform: translateY(-50%);
      background: #2c3e50;
      color: #ffffff;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-size: 0.85rem;
      white-space: nowrap;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s ease;
    }

    .nav-floating-dot::after {
      content: '';
      position: absolute;
      right: calc(100% + 0.5rem);
      top: 50%;
      transform: translateY(-50%);
      border: 6px solid transparent;
      border-left-color: #2c3e50;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s ease;
    }

    .nav-floating-dot:hover::before,
    .nav-floating-dot:hover::after {
      opacity: 1;
    }

    .nav-floating-dot:hover {
      background: #3498db;
      transform: scale(1.5);
    }

    .nav-floating-dot.active {
      background: #3498db;
      width: 16px;
      height: 16px;
    }

    @media (max-width: 768px) {
      .nav-floating {
        right: 1rem;
      }

      .nav-floating-menu {
        padding: 0.75rem;
        gap: 1rem;
      }

      .nav-floating-dot::before,
      .nav-floating-dot::after {
        display: none;
      }
    }
  `,
  jsTemplate: `
    // Dynamically generate floating dots
    const floatingMenu = document.getElementById('nav-floating-menu');
    if (floatingMenu) {
      const sections = document.querySelectorAll('section[id]');
      const nameMap = {
        'hero': 'Ana Sayfa',
        'experience': 'Deneyim',
        'skills': 'Yetenekler',
        'about': 'Hakkımda',
        'contact': 'İletişim',
        'education': 'Eğitim'
      };
      
      const menuItems = [];
      sections.forEach((section, index) => {
        const sectionId = section.getAttribute('id');
        const name = nameMap[sectionId] || sectionId.charAt(0).toUpperCase() + sectionId.slice(1);
        const activeClass = index === 0 ? 'active' : '';
        
        menuItems.push(\`
          <li>
            <a href="#\${sectionId}" class="nav-floating-dot \${activeClass}" data-tooltip="\${name}"></a>
          </li>
        \`);
      });
      
      floatingMenu.innerHTML = menuItems.join('');
    }

    // Active dot management based on scroll
    const floatingDots = document.querySelectorAll('.nav-floating-dot');
    
    window.addEventListener('scroll', () => {
      let current = '';
      
      document.querySelectorAll('section[id]').forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 300) {
          current = section.getAttribute('id');
        }
      });

      floatingDots.forEach(dot => {
        dot.classList.remove('active');
        if (dot.getAttribute('href') === '#' + current) {
          dot.classList.add('active');
        }
      });
    });

    // Smooth scrolling
    floatingDots.forEach(dot => {
      dot.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  `,
  dataSchema: {},
  designNotes: "Minimal floating dot navigation. Sağ tarafta sabit durur. Hover'da tooltip gösterir. Aktif sayfa daha büyük gösterilir.",
};

export const navigationTemplates: ComponentTemplate[] = [
  navigationTemplate1,
  navigationTemplate2,
  navigationTemplate3,
  navigationTemplate4,
];
