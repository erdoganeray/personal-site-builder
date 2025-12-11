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
    "{{COLOR_BACKGROUND}}", "{{COLOR_ACCENT}}", "{{COLOR_SECONDARY}}"
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
    "{{COLOR_PRIMARY}}", "{{COLOR_ACCENT}}", "{{COLOR_SECONDARY}}", "{{COLOR_TEXT}}"
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
    "{{COLOR_BACKGROUND}}", "{{COLOR_ACCENT}}", "{{COLOR_SECONDARY}}"
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
    "{{COLOR_BACKGROUND}}", "{{COLOR_ACCENT}}", "{{COLOR_SECONDARY}}"
  ]
};

export const portfolioTemplates = [
  portfolioTemplate1,
  portfolioTemplate2,
  portfolioTemplate3,
  portfolioTemplate4
];
