import { ComponentTemplate } from "@/types/templates";

/**
 * Portfolio section template'leri
 */

export const portfolioTemplate1: ComponentTemplate = {
  id: "portfolio-grid",
  name: "Grid Portfolio",
  category: "portfolio",
  htmlTemplate: `
    <section class="portfolio-section" id="portfolio">
      <div class="container">
        <h2 class="section-title">Portfolio</h2>
        <div class="portfolio-grid">
          {{PORTFOLIO_ITEMS}}
        </div>
      </div>
    </section>
  `,
  cssTemplate: `
    .portfolio-section {
      padding: 5rem 2rem;
      background: {{COLOR_BACKGROUND}};
      font-family: {{FONT_BODY}}, sans-serif;
    }

    .portfolio-section .section-title {
      font-family: {{FONT_HEADING}}, sans-serif;
    }

    .portfolio-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .portfolio-item {
      position: relative;
      aspect-ratio: 4/3;
      border-radius: 12px;
      overflow: hidden;
      cursor: pointer;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .portfolio-item:hover {
      transform: translateY(-8px);
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
    }

    .portfolio-item img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .portfolio-item:hover img {
      transform: scale(1.05);
    }

    /* Lightbox styles */
    .lightbox {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.9);
      z-index: 9999;
      justify-content: center;
      align-items: center;
      padding: 2rem;
    }

    .lightbox.active {
      display: flex;
    }

    .lightbox-content {
      max-width: 90%;
      max-height: 90%;
      position: relative;
    }

    .lightbox-content img {
      max-width: 100%;
      max-height: 90vh;
      object-fit: contain;
      border-radius: 8px;
    }

    .lightbox-close {
      position: absolute;
      top: -40px;
      right: 0;
      background: {{COLOR_ACCENT}};
      color: white;
      border: none;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.3s ease;
    }

    .lightbox-close:hover {
      background: {{COLOR_SECONDARY}};
    }

    @media (max-width: 768px) {
      .portfolio-grid {
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
      }
    }
  `,
  jsTemplate: `
    // Lightbox functionality
    document.addEventListener('DOMContentLoaded', function() {
      const portfolioItems = document.querySelectorAll('.portfolio-item');
      const lightbox = document.getElementById('portfolio-lightbox');
      const lightboxImg = document.getElementById('lightbox-img');
      const lightboxClose = document.getElementById('lightbox-close');

      portfolioItems.forEach(item => {
        item.addEventListener('click', function() {
          const img = this.querySelector('img');
          lightboxImg.src = img.src;
          lightbox.classList.add('active');
        });
      });

      if (lightboxClose) {
        lightboxClose.addEventListener('click', function() {
          lightbox.classList.remove('active');
        });
      }

      if (lightbox) {
        lightbox.addEventListener('click', function(e) {
          if (e.target === lightbox) {
            lightbox.classList.remove('active');
          }
        });
      }

      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
          lightbox.classList.remove('active');
        }
      });
    });
  `,
  placeholders: [
    "{{PORTFOLIO_ITEMS}}",
    "{{COLOR_BACKGROUND}}", "{{COLOR_ACCENT}}", "{{COLOR_SECONDARY}}",
    "{{FONT_HEADING}}", "{{FONT_BODY}}"
  ]
};

export const portfolioTemplate2: ComponentTemplate = {
  id: "portfolio-masonry",
  name: "Masonry Portfolio",
  category: "portfolio",
  htmlTemplate: `
    <section class="portfolio-section-masonry" id="portfolio">
      <div class="container">
        <h2 class="section-title">Portfolio</h2>
        <div class="portfolio-masonry">
          {{PORTFOLIO_ITEMS}}
        </div>
      </div>
    </section>
  `,
  cssTemplate: `
    .portfolio-section-masonry {
      padding: 5rem 2rem;
      background: {{COLOR_PRIMARY}};
      color: {{COLOR_TEXT}};
      font-family: {{FONT_BODY}}, sans-serif;
    }

    .portfolio-section-masonry .section-title {
      font-family: {{FONT_HEADING}}, sans-serif;
    }

    .portfolio-masonry {
      columns: 3;
      column-gap: 1.5rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .portfolio-item-masonry {
      break-inside: avoid;
      margin-bottom: 1.5rem;
      position: relative;
      border-radius: 12px;
      overflow: hidden;
      cursor: pointer;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .portfolio-item-masonry:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
    }

    .portfolio-item-masonry img {
      width: 100%;
      height: auto;
      display: block;
      transition: transform 0.3s ease;
    }

    .portfolio-item-masonry:hover img {
      transform: scale(1.03);
    }

    /* Lightbox styles */
    .lightbox {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.9);
      z-index: 9999;
      justify-content: center;
      align-items: center;
      padding: 2rem;
    }

    .lightbox.active {
      display: flex;
    }

    .lightbox-content {
      max-width: 90%;
      max-height: 90%;
      position: relative;
    }

    .lightbox-content img {
      max-width: 100%;
      max-height: 90vh;
      object-fit: contain;
      border-radius: 8px;
    }

    .lightbox-close {
      position: absolute;
      top: -40px;
      right: 0;
      background: {{COLOR_ACCENT}};
      color: white;
      border: none;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.3s ease;
    }

    .lightbox-close:hover {
      background: {{COLOR_SECONDARY}};
    }

    @media (max-width: 992px) {
      .portfolio-masonry {
        columns: 2;
      }
    }

    @media (max-width: 576px) {
      .portfolio-masonry {
        columns: 1;
      }
    }
  `,
  jsTemplate: `
    // Lightbox functionality
    document.addEventListener('DOMContentLoaded', function() {
      const portfolioItems = document.querySelectorAll('.portfolio-item-masonry');
      const lightbox = document.getElementById('portfolio-lightbox');
      const lightboxImg = document.getElementById('lightbox-img');
      const lightboxClose = document.getElementById('lightbox-close');

      portfolioItems.forEach(item => {
        item.addEventListener('click', function() {
          const img = this.querySelector('img');
          lightboxImg.src = img.src;
          lightbox.classList.add('active');
        });
      });

      if (lightboxClose) {
        lightboxClose.addEventListener('click', function() {
          lightbox.classList.remove('active');
        });
      }

      if (lightbox) {
        lightbox.addEventListener('click', function(e) {
          if (e.target === lightbox) {
            lightbox.classList.remove('active');
          }
        });
      }

      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
          lightbox.classList.remove('active');
        }
      });
    });
  `,
  placeholders: [
    "{{PORTFOLIO_ITEMS}}",
    "{{COLOR_PRIMARY}}", "{{COLOR_ACCENT}}", "{{COLOR_SECONDARY}}", "{{COLOR_TEXT}}",
    "{{FONT_HEADING}}", "{{FONT_BODY}}"
  ]
};

export const portfolioTemplate3: ComponentTemplate = {
  id: "portfolio-carousel",
  name: "Carousel Portfolio",
  category: "portfolio",
  htmlTemplate: `
    <section class="portfolio-section-carousel" id="portfolio">
      <div class="container">
        <h2 class="section-title">Portfolio</h2>
        <div class="portfolio-carousel">
          <button class="carousel-btn carousel-prev" id="carousel-prev">‹</button>
          <div class="carousel-track-container">
            <div class="carousel-track" id="carousel-track">
              {{PORTFOLIO_ITEMS}}
            </div>
          </div>
          <button class="carousel-btn carousel-next" id="carousel-next">›</button>
        </div>
        <div class="carousel-indicators" id="carousel-indicators"></div>
      </div>
    </section>
  `,
  cssTemplate: `
    .portfolio-section-carousel {
      padding: 5rem 2rem;
      background: {{COLOR_BACKGROUND}};
      font-family: {{FONT_BODY}}, sans-serif;
    }

    .portfolio-section-carousel .section-title {
      font-family: {{FONT_HEADING}}, sans-serif;
    }

    .portfolio-carousel {
      position: relative;
      max-width: 1000px;
      margin: 0 auto;
      overflow: hidden;
    }

    .carousel-track-container {
      overflow: hidden;
      border-radius: 12px;
    }

    .carousel-track {
      display: flex;
      transition: transform 0.5s ease-in-out;
    }

    .portfolio-item-carousel {
      min-width: 100%;
      aspect-ratio: 16/9;
      cursor: pointer;
    }

    .portfolio-item-carousel img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .carousel-btn {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background: {{COLOR_ACCENT}};
      color: white;
      border: none;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      font-size: 32px;
      cursor: pointer;
      z-index: 10;
      transition: background 0.3s ease, transform 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .carousel-btn:hover {
      background: {{COLOR_SECONDARY}};
      transform: translateY(-50%) scale(1.1);
    }

    .carousel-prev {
      left: 1rem;
    }

    .carousel-next {
      right: 1rem;
    }

    .carousel-indicators {
      display: flex;
      justify-content: center;
      gap: 0.5rem;
      margin-top: 1.5rem;
    }

    .carousel-indicator {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.3);
      cursor: pointer;
      transition: background 0.3s ease, transform 0.3s ease;
    }

    .carousel-indicator.active {
      background: {{COLOR_ACCENT}};
      transform: scale(1.2);
    }

    /* Lightbox styles */
    .lightbox {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.9);
      z-index: 9999;
      justify-content: center;
      align-items: center;
      padding: 2rem;
    }

    .lightbox.active {
      display: flex;
    }

    .lightbox-content {
      max-width: 90%;
      max-height: 90%;
      position: relative;
    }

    .lightbox-content img {
      max-width: 100%;
      max-height: 90vh;
      object-fit: contain;
      border-radius: 8px;
    }

    .lightbox-close {
      position: absolute;
      top: -40px;
      right: 0;
      background: {{COLOR_ACCENT}};
      color: white;
      border: none;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.3s ease;
    }

    .lightbox-close:hover {
      background: {{COLOR_SECONDARY}};
    }

    @media (max-width: 768px) {
      .carousel-btn {
        width: 40px;
        height: 40px;
        font-size: 24px;
      }
    }
  `,
  jsTemplate: `
    // Carousel functionality
    document.addEventListener('DOMContentLoaded', function() {
      const track = document.getElementById('carousel-track');
      const prevBtn = document.getElementById('carousel-prev');
      const nextBtn = document.getElementById('carousel-next');
      const indicatorsContainer = document.getElementById('carousel-indicators');
      const items = track.querySelectorAll('.portfolio-item-carousel');
      const lightbox = document.getElementById('portfolio-lightbox');
      const lightboxImg = document.getElementById('lightbox-img');
      const lightboxClose = document.getElementById('lightbox-close');
      
      let currentIndex = 0;
      const totalItems = items.length;

      // Create indicators
      for (let i = 0; i < totalItems; i++) {
        const indicator = document.createElement('div');
        indicator.className = 'carousel-indicator' + (i === 0 ? ' active' : '');
        indicator.addEventListener('click', () => goToSlide(i));
        indicatorsContainer.appendChild(indicator);
      }

      const indicators = indicatorsContainer.querySelectorAll('.carousel-indicator');

      function updateCarousel() {
        track.style.transform = \`translateX(-\${currentIndex * 100}%)\`;
        indicators.forEach((ind, i) => {
          ind.classList.toggle('active', i === currentIndex);
        });
      }

      function goToSlide(index) {
        currentIndex = index;
        updateCarousel();
      }

      function nextSlide() {
        currentIndex = (currentIndex + 1) % totalItems;
        updateCarousel();
      }

      function prevSlide() {
        currentIndex = (currentIndex - 1 + totalItems) % totalItems;
        updateCarousel();
      }

      if (prevBtn) prevBtn.addEventListener('click', prevSlide);
      if (nextBtn) nextBtn.addEventListener('click', nextSlide);

      // Auto-play (optional)
      setInterval(nextSlide, 5000);

      // Lightbox
      items.forEach(item => {
        item.addEventListener('click', function() {
          const img = this.querySelector('img');
          lightboxImg.src = img.src;
          lightbox.classList.add('active');
        });
      });

      if (lightboxClose) {
        lightboxClose.addEventListener('click', function() {
          lightbox.classList.remove('active');
        });
      }

      if (lightbox) {
        lightbox.addEventListener('click', function(e) {
          if (e.target === lightbox) {
            lightbox.classList.remove('active');
          }
        });
      }

      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
          lightbox.classList.remove('active');
        }
      });
    });
  `,
  placeholders: [
    "{{PORTFOLIO_ITEMS}}",
    "{{COLOR_BACKGROUND}}", "{{COLOR_ACCENT}}", "{{COLOR_SECONDARY}}",
    "{{FONT_HEADING}}", "{{FONT_BODY}}"
  ]
};

export const portfolioTemplate4: ComponentTemplate = {
  id: "portfolio-bento-grid",
  name: "Bento Grid Portfolio",
  category: "portfolio",
  htmlTemplate: `
    <section class="portfolio-section-bento" id="portfolio">
      <div class="container">
        <h2 class="section-title">Portfolio</h2>
        <div class="portfolio-bento-grid">
          {{PORTFOLIO_ITEMS}}
        </div>
      </div>
    </section>
  `,
  cssTemplate: `
    .portfolio-section-bento {
      padding: 5rem 2rem;
      background: {{COLOR_BACKGROUND}};
      font-family: {{FONT_BODY}}, sans-serif;
    }

    .portfolio-section-bento .section-title {
      font-family: {{FONT_HEADING}}, sans-serif;
    }

    .portfolio-bento-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      grid-auto-rows: 250px;
      gap: 1rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    /* First item is featured (2x2) */
    .portfolio-item-bento:first-child {
      grid-column: span 2;
      grid-row: span 2;
    }

    .portfolio-item-bento {
      position: relative;
      border-radius: 16px;
      overflow: hidden;
      cursor: pointer;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      background: linear-gradient(135deg, rgba({{COLOR_ACCENT}}, 0.05), rgba({{COLOR_SECONDARY}}, 0.05));
    }

    .portfolio-item-bento:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
    }

    .portfolio-item-bento img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .portfolio-item-bento:hover img {
      transform: scale(1.05);
    }

    /* Metadata Overlay */
    .portfolio-item-metadata {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: linear-gradient(to top, rgba(0, 0, 0, 0.85), transparent);
      padding: 1.5rem 1rem 1rem;
      transform: translateY(100%);
      transition: transform 0.3s ease;
    }

    .portfolio-item-bento:hover .portfolio-item-metadata {
      transform: translateY(0);
    }

    .portfolio-item-title {
      font-size: 1.1rem;
      font-weight: 700;
      color: white;
      margin: 0 0 0.25rem 0;
      line-height: 1.3;
    }

    .portfolio-item-description {
      font-size: 0.875rem;
      color: rgba(255, 255, 255, 0.9);
      margin: 0 0 0.5rem 0;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .portfolio-item-category {
      display: inline-block;
      font-size: 0.75rem;
      color: {{COLOR_ACCENT}};
      background: rgba(255, 255, 255, 0.15);
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      margin-bottom: 0.5rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .portfolio-item-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.375rem;
      margin-top: 0.5rem;
    }

    .portfolio-item-tag {
      font-size: 0.7rem;
      color: rgba(255, 255, 255, 0.8);
      background: rgba(255, 255, 255, 0.1);
      padding: 0.2rem 0.5rem;
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .portfolio-item-link {
      position: absolute;
      top: 1rem;
      right: 1rem;
      width: 36px;
      height: 36px;
      background: rgba(255, 255, 255, 0.95);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transform: scale(0.8);
      transition: all 0.3s ease;
      z-index: 10;
      text-decoration: none;
      color: {{COLOR_ACCENT}};
      font-size: 1.2rem;
    }

    .portfolio-item-bento:hover .portfolio-item-link {
      opacity: 1;
      transform: scale(1);
    }

    .portfolio-item-link:hover {
      background: {{COLOR_ACCENT}};
      color: white;
      transform: scale(1.1);
    }

    /* Lightbox styles */
    .lightbox {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.95);
      z-index: 9999;
      justify-content: center;
      align-items: center;
      padding: 2rem;
    }

    .lightbox.active {
      display: flex;
    }

    .lightbox-content {
      max-width: 90%;
      max-height: 90%;
      position: relative;
    }

    .lightbox-content img {
      max-width: 100%
;
      max-height: 90vh;
      object-fit: contain;
      border-radius: 8px;
    }

    .lightbox-close {
      position: absolute;
      top: -40px;
      right: 0;
      background: {{COLOR_ACCENT}};
      color: white;
      border: none;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      font-size: 24px;
      cursor: pointer;
      transition: background 0.3s ease;
    }

    .lightbox-close:hover {
      background: {{COLOR_SECONDARY}};
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
      .portfolio-bento-grid {
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        grid-auto-rows: 150px;
        gap: 0.75rem;
      }

      .portfolio-item-metadata {
        padding: 1rem 0.75rem 0.75rem;
      }

      .portfolio-item-title {
        font-size: 0.95rem;
      }

      .portfolio-item-description {
        font-size: 0.8rem;
        -webkit-line-clamp: 1;
      }
    }

    @media (min-width: 1200px) {
      .portfolio-bento-grid {
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        grid-auto-rows: 280px;
      }
    }
  `,
  jsTemplate: `
    document.addEventListener('DOMContentLoaded', function() {
      const portfolioItems = document.querySelectorAll('.portfolio-item-bento');
      const lightbox = document.getElementById('portfolio-lightbox');
      const lightboxImg = document.getElementById('lightbox-img');
      const lightboxClose = document.getElementById('lightbox-close');

      portfolioItems.forEach(item => {
        item.addEventListener('click', function(e) {
          // Don't open lightbox if clicking on external link
          if (e.target.closest('.portfolio-item-link')) {
            return;
          }
          
          const img = this.querySelector('img');
          if (img && lightbox && lightboxImg) {
            lightboxImg.src = img.src;
            lightbox.classList.add('active');
          }
        });
      });

      if (lightboxClose) {
        lightboxClose.addEventListener('click', function() {
          lightbox.classList.remove('active');
        });
      }

      if (lightbox) {
        lightbox.addEventListener('click', function(e) {
          if (e.target === lightbox) {
            lightbox.classList.remove('active');
          }
        });
      }

      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox && lightbox.classList.contains('active')) {
          lightbox.classList.remove('active');
        }
      });
    });
  `,
  placeholders: [
    "{{PORTFOLIO_ITEMS}}",
    "{{COLOR_BACKGROUND}}", "{{COLOR_ACCENT}}", "{{COLOR_SECONDARY}}",
    "{{FONT_HEADING}}", "{{FONT_BODY}}"
  ]
};

export const portfolioTemplate5: ComponentTemplate = {
  id: "portfolio-glass-modern",
  name: "Glass Modern Portfolio",
  category: "portfolio",
  htmlTemplate: `
    <section class="portfolio-glass-section" id="portfolio">
      <!-- Animated background orbs -->
      <div class="portfolio-glass-bg">
        <div class="portfolio-orb portfolio-orb-1"></div>
        <div class="portfolio-orb portfolio-orb-2"></div>
        <div class="portfolio-orb portfolio-orb-3"></div>
      </div>
      
      <div class="container">
        <h2 class="portfolio-glass-title">Portfolio</h2>
        <div class="portfolio-glass-grid">
          {{PORTFOLIO_ITEMS}}
        </div>
      </div>
    </section>
  `,
  cssTemplate: `
    .portfolio-glass-section {
      padding: 5rem 2rem;
      background: {{COLOR_BACKGROUND}};
      position: relative;
      overflow: hidden;
      font-family: {{FONT_BODY}}, sans-serif;
    }

    /* Animated background orbs */
    .portfolio-glass-bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 0;
    }

    .portfolio-orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0.4;
      animation: portfolio-float-orb 20s ease-in-out infinite;
    }

    .portfolio-orb-1 {
      width: 400px;
      height: 400px;
      background: {{COLOR_PRIMARY}};
      top: -100px;
      left: -100px;
      animation-delay: 0s;
    }

    .portfolio-orb-2 {
      width: 350px;
      height: 350px;
      background: {{COLOR_ACCENT}};
      bottom: -80px;
      right: -80px;
      animation-delay: -7s;
    }

    .portfolio-orb-3 {
      width: 250px;
      height: 250px;
      background: {{COLOR_SECONDARY}};
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      animation-delay: -14s;
    }

    @keyframes portfolio-float-orb {
      0%, 100% {
        transform: translate(0, 0) scale(1);
      }
      25% {
        transform: translate(30px, -30px) scale(1.1);
      }
      50% {
        transform: translate(-20px, 20px) scale(0.95);
      }
      75% {
        transform: translate(20px, 10px) scale(1.05);
      }
    }

    .portfolio-glass-section .container {
      position: relative;
      z-index: 1;
      max-width: 1200px;
      margin: 0 auto;
    }

    .portfolio-glass-title {
      font-family: {{FONT_HEADING}}, sans-serif;
      font-size: 2.5rem;
      font-weight: 700;
      text-align: center;
      margin-bottom: 3rem;
      color: {{COLOR_TEXT}};
      background: linear-gradient(135deg, {{COLOR_PRIMARY}}, {{COLOR_ACCENT}});
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .portfolio-glass-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .portfolio-glass-item {
      position: relative;
      aspect-ratio: 4/3;
      border-radius: 20px;
      overflow: hidden;
      cursor: pointer;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }

    .portfolio-glass-item:hover {
      transform: translateY(-8px) scale(1.02);
      border-color: {{COLOR_ACCENT}};
      box-shadow: 
        0 20px 40px rgba(0, 0, 0, 0.2),
        0 0 30px rgba({{COLOR_ACCENT}}, 0.3),
        inset 0 0 30px rgba(255, 255, 255, 0.1);
    }

    .portfolio-glass-item img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s ease;
    }

    .portfolio-glass-item:hover img {
      transform: scale(1.1);
    }

    /* Glassmorphism overlay on hover */
    .portfolio-glass-item::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.1) 0%,
        rgba(255, 255, 255, 0) 50%,
        rgba(255, 255, 255, 0.05) 100%
      );
      z-index: 1;
      pointer-events: none;
    }

    /* Neon glow border animation */
    .portfolio-glass-item::after {
      content: '';
      position: absolute;
      top: -2px;
      left: -2px;
      right: -2px;
      bottom: -2px;
      background: linear-gradient(135deg, {{COLOR_PRIMARY}}, {{COLOR_ACCENT}}, {{COLOR_SECONDARY}});
      border-radius: 22px;
      z-index: -1;
      opacity: 0;
      transition: opacity 0.4s ease;
    }

    .portfolio-glass-item:hover::after {
      opacity: 1;
      animation: portfolio-glow-pulse 2s ease-in-out infinite;
    }

    @keyframes portfolio-glow-pulse {
      0%, 100% {
        filter: blur(8px);
        opacity: 0.6;
      }
      50% {
        filter: blur(12px);
        opacity: 0.8;
      }
    }

    /* Lightbox styles */
    .lightbox {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.95);
      backdrop-filter: blur(10px);
      z-index: 9999;
      justify-content: center;
      align-items: center;
      padding: 2rem;
    }

    .lightbox.active {
      display: flex;
    }

    .lightbox-content {
      max-width: 90%;
      max-height: 90%;
      position: relative;
    }

    .lightbox-content img {
      max-width: 100%;
      max-height: 90vh;
      object-fit: contain;
      border-radius: 16px;
      box-shadow: 0 0 60px rgba({{COLOR_ACCENT}}, 0.3);
    }

    .lightbox-close {
      position: absolute;
      top: -50px;
      right: 0;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.2);
      width: 44px;
      height: 44px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
    }

    .lightbox-close:hover {
      background: {{COLOR_ACCENT}};
      border-color: {{COLOR_ACCENT}};
      transform: rotate(90deg);
    }

    @media (max-width: 768px) {
      .portfolio-glass-section {
        padding: 3rem 1rem;
      }

      .portfolio-glass-title {
        font-size: 2rem;
        margin-bottom: 2rem;
      }

      .portfolio-glass-grid {
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;
      }

      .portfolio-orb-1 {
        width: 250px;
        height: 250px;
      }

      .portfolio-orb-2 {
        width: 200px;
        height: 200px;
      }

      .portfolio-orb-3 {
        width: 150px;
        height: 150px;
      }
    }

    @media (max-width: 480px) {
      .portfolio-glass-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .portfolio-orb,
      .portfolio-glass-item,
      .portfolio-glass-item::after {
        animation: none;
      }

      .portfolio-glass-item:hover {
        transform: none;
      }
    }
  `,
  jsTemplate: `
    // Lightbox functionality
    document.addEventListener('DOMContentLoaded', function() {
      const portfolioItems = document.querySelectorAll('.portfolio-glass-item');
      const lightbox = document.getElementById('portfolio-lightbox');
      const lightboxImg = document.getElementById('lightbox-img');
      const lightboxClose = document.getElementById('lightbox-close');

      portfolioItems.forEach(item => {
        item.addEventListener('click', function() {
          const img = this.querySelector('img');
          if (img && lightbox && lightboxImg) {
            lightboxImg.src = img.src;
            lightbox.classList.add('active');
          }
        });
      });

      if (lightboxClose) {
        lightboxClose.addEventListener('click', function() {
          lightbox.classList.remove('active');
        });
      }

      if (lightbox) {
        lightbox.addEventListener('click', function(e) {
          if (e.target === lightbox) {
            lightbox.classList.remove('active');
          }
        });
      }

      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox && lightbox.classList.contains('active')) {
          lightbox.classList.remove('active');
        }
      });
    });
  `,
  placeholders: [
    "{{PORTFOLIO_ITEMS}}",
    "{{COLOR_BACKGROUND}}", "{{COLOR_PRIMARY}}", "{{COLOR_SECONDARY}}", "{{COLOR_ACCENT}}", "{{COLOR_TEXT}}",
    "{{FONT_HEADING}}", "{{FONT_BODY}}"
  ]
};

export const portfolioTemplate6: ComponentTemplate = {
  id: "portfolio-animated-gradient",
  name: "Animated Gradient Portfolio",
  category: "portfolio",
  htmlTemplate: `
    <section class="portfolio-gradient-section" id="portfolio">
      <!-- Animated gradient background -->
      <div class="portfolio-gradient-bg"></div>
      
      <div class="container">
        <h2 class="portfolio-gradient-title">
          <span class="gradient-text">Portfolio</span>
        </h2>
        <div class="portfolio-gradient-grid">
          {{PORTFOLIO_ITEMS}}
        </div>
      </div>
    </section>
  `,
  cssTemplate: `
    .portfolio-gradient-section {
      padding: 5rem 2rem;
      position: relative;
      overflow: hidden;
      font-family: {{FONT_BODY}}, sans-serif;
    }

    /* Animated gradient background */
    .portfolio-gradient-bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        135deg,
        {{COLOR_PRIMARY}} 0%,
        {{COLOR_SECONDARY}} 25%,
        {{COLOR_ACCENT}} 50%,
        {{COLOR_SECONDARY}} 75%,
        {{COLOR_PRIMARY}} 100%
      );
      background-size: 400% 400%;
      animation: portfolio-gradient-shift 15s ease infinite;
      z-index: 0;
    }

    @keyframes portfolio-gradient-shift {
      0% {
        background-position: 0% 50%;
      }
      50% {
        background-position: 100% 50%;
      }
      100% {
        background-position: 0% 50%;
      }
    }

    .portfolio-gradient-section .container {
      position: relative;
      z-index: 1;
      max-width: 1200px;
      margin: 0 auto;
    }

    .portfolio-gradient-title {
      font-family: {{FONT_HEADING}}, sans-serif;
      font-size: 2.5rem;
      font-weight: 700;
      text-align: center;
      margin-bottom: 3rem;
    }

    .portfolio-gradient-title .gradient-text {
      background: linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.8) 50%, #ffffff 100%);
      background-size: 200% 200%;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: portfolio-text-shimmer 3s ease-in-out infinite;
    }

    @keyframes portfolio-text-shimmer {
      0% {
        background-position: 200% 50%;
      }
      100% {
        background-position: -200% 50%;
      }
    }

    .portfolio-gradient-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .portfolio-gradient-item {
      position: relative;
      aspect-ratio: 4/3;
      border-radius: 16px;
      overflow: hidden;
      cursor: pointer;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
      opacity: 0;
      transform: translateY(30px);
      animation: portfolio-item-appear 0.6s ease forwards;
    }

    .portfolio-gradient-item:nth-child(1) { animation-delay: 0.1s; }
    .portfolio-gradient-item:nth-child(2) { animation-delay: 0.2s; }
    .portfolio-gradient-item:nth-child(3) { animation-delay: 0.3s; }
    .portfolio-gradient-item:nth-child(4) { animation-delay: 0.4s; }
    .portfolio-gradient-item:nth-child(5) { animation-delay: 0.5s; }
    .portfolio-gradient-item:nth-child(6) { animation-delay: 0.6s; }

    @keyframes portfolio-item-appear {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .portfolio-gradient-item:hover {
      transform: translateY(-10px) scale(1.02);
      box-shadow: 
        0 20px 40px rgba(0, 0, 0, 0.3),
        0 0 40px rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.4);
    }

    .portfolio-gradient-item img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s ease;
    }

    .portfolio-gradient-item:hover img {
      transform: scale(1.1);
    }

    /* Shimmer overlay effect */
    .portfolio-gradient-item::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        90deg,
        transparent 0%,
        rgba(255, 255, 255, 0.2) 50%,
        transparent 100%
      );
      z-index: 2;
      pointer-events: none;
      transition: left 0.6s ease;
    }

    .portfolio-gradient-item:hover::before {
      left: 100%;
    }

    /* Glow effect on hover */
    .portfolio-gradient-item::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border-radius: 16px;
      background: linear-gradient(135deg, rgba(255,255,255,0.1), transparent);
      opacity: 0;
      transition: opacity 0.4s ease;
      z-index: 1;
      pointer-events: none;
    }

    .portfolio-gradient-item:hover::after {
      opacity: 1;
    }

    /* Lightbox styles */
    .lightbox {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.95);
      z-index: 9999;
      justify-content: center;
      align-items: center;
      padding: 2rem;
    }

    .lightbox.active {
      display: flex;
      animation: portfolio-lightbox-fade 0.3s ease;
    }

    @keyframes portfolio-lightbox-fade {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    .lightbox-content {
      max-width: 90%;
      max-height: 90%;
      position: relative;
      animation: portfolio-lightbox-zoom 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    @keyframes portfolio-lightbox-zoom {
      from {
        transform: scale(0.8);
        opacity: 0;
      }
      to {
        transform: scale(1);
        opacity: 1;
      }
    }

    .lightbox-content img {
      max-width: 100%;
      max-height: 90vh;
      object-fit: contain;
      border-radius: 12px;
      box-shadow: 0 0 80px rgba(255, 255, 255, 0.1);
    }

    .lightbox-close {
      position: absolute;
      top: -50px;
      right: 0;
      background: linear-gradient(135deg, {{COLOR_PRIMARY}}, {{COLOR_ACCENT}});
      color: white;
      border: none;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
    }

    .lightbox-close:hover {
      transform: rotate(90deg) scale(1.1);
      box-shadow: 0 0 20px {{COLOR_ACCENT}};
    }

    @media (max-width: 768px) {
      .portfolio-gradient-section {
        padding: 3rem 1rem;
      }

      .portfolio-gradient-title {
        font-size: 2rem;
        margin-bottom: 2rem;
      }

      .portfolio-gradient-grid {
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;
      }
    }

    @media (max-width: 480px) {
      .portfolio-gradient-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .portfolio-gradient-bg,
      .portfolio-gradient-title .gradient-text,
      .portfolio-gradient-item,
      .portfolio-gradient-item::before {
        animation: none;
      }

      .portfolio-gradient-item {
        opacity: 1;
        transform: none;
      }

      .portfolio-gradient-item:hover {
        transform: none;
      }
    }
  `,
  jsTemplate: `
    // Lightbox functionality
    document.addEventListener('DOMContentLoaded', function() {
      const portfolioItems = document.querySelectorAll('.portfolio-gradient-item');
      const lightbox = document.getElementById('portfolio-lightbox');
      const lightboxImg = document.getElementById('lightbox-img');
      const lightboxClose = document.getElementById('lightbox-close');

      portfolioItems.forEach(item => {
        item.addEventListener('click', function() {
          const img = this.querySelector('img');
          if (img && lightbox && lightboxImg) {
            lightboxImg.src = img.src;
            lightbox.classList.add('active');
          }
        });
      });

      if (lightboxClose) {
        lightboxClose.addEventListener('click', function() {
          lightbox.classList.remove('active');
        });
      }

      if (lightbox) {
        lightbox.addEventListener('click', function(e) {
          if (e.target === lightbox) {
            lightbox.classList.remove('active');
          }
        });
      }

      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox && lightbox.classList.contains('active')) {
          lightbox.classList.remove('active');
        }
      });
    });
  `,
  placeholders: [
    "{{PORTFOLIO_ITEMS}}",
    "{{COLOR_PRIMARY}}", "{{COLOR_SECONDARY}}", "{{COLOR_ACCENT}}",
    "{{FONT_HEADING}}", "{{FONT_BODY}}"
  ]
};

export const portfolioTemplates = [
  portfolioTemplate1,
  portfolioTemplate2,
  portfolioTemplate3,
  portfolioTemplate4,
  portfolioTemplate5,
  portfolioTemplate6
];
