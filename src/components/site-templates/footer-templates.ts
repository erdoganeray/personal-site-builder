import { ComponentTemplate } from "@/types/templates";

/**
 * Footer section template'leri
 */

export const footerTemplate1: ComponentTemplate = {
  id: "footer-modern-centered",
  name: "Modern Centered Footer",
  category: "footer",
  htmlTemplate: `
    <footer id="footer" class="footer-modern-section">
      <div class="footer-modern-container">
        <div class="footer-modern-content">
          <div class="footer-modern-brand">
            <h3 class="footer-modern-name">{{NAME}}</h3>
            <p class="footer-modern-tagline">{{TITLE}}</p>
          </div>
          
          <div class="footer-modern-social">
            {{SOCIAL_LINKS}}
          </div>
        </div>
        
        <div class="footer-modern-bottom">
          <p class="footer-modern-copyright">© {{CURRENT_YEAR}} {{NAME}}. Tüm hakları saklıdır.</p>
          <button class="footer-modern-back-to-top" aria-label="Back to top">↑</button>
        </div>
      </div>
    </footer>
  `,
  cssTemplate: `
    .footer-modern-section {
      background-color: {{COLOR_BACKGROUND}};
      color: {{COLOR_TEXT}};
      padding: 4rem 2rem 2rem;
      border-top: 1px solid rgba(0, 0, 0, 0.1);
    }

    .footer-modern-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .footer-modern-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2rem;
      margin-bottom: 3rem;
    }

    .footer-modern-brand {
      text-align: center;
    }

    .footer-modern-brand .footer-modern-name {
      font-size: 1.5rem;
      font-weight: 700;
      color: {{COLOR_PRIMARY}};
      margin-bottom: 0.5rem;
    }

    .footer-modern-tagline {
      color: {{COLOR_TEXT_SECONDARY}};
      font-size: 0.95rem;
    }

    .footer-modern-social {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      justify-content: center;
    }

    .footer-modern-social a {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: {{COLOR_PRIMARY}};
      color: white;
      text-decoration: none;
      transition: transform 0.3s ease, background-color 0.3s ease;
    }

    .footer-modern-social a:hover {
      transform: translateY(-3px);
      background-color: {{COLOR_SECONDARY}};
    }

    .footer-modern-bottom {
      padding-top: 2rem;
      border-top: 1px solid rgba(0, 0, 0, 0.1);
      text-align: center;
      position: relative;
    }

    .footer-modern-copyright {
      color: {{COLOR_TEXT_SECONDARY}};
      font-size: 0.9rem;
      margin: 0;
    }

    .footer-modern-back-to-top {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background-color: {{COLOR_PRIMARY}};
      color: white;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      transition: transform 0.3s ease, background-color 0.3s ease;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 1000;
    }

    .footer-modern-back-to-top:hover {
      transform: translateY(-5px);
      background-color: {{COLOR_SECONDARY}};
    }

    .footer-modern-back-to-top:focus {
      outline: 2px solid {{COLOR_PRIMARY}};
      outline-offset: 2px;
    }

    @media (max-width: 480px) {
      .footer-modern-section {
        padding: 3rem 1.5rem 1.5rem;
      }

      .footer-modern-brand .footer-modern-name {
        font-size: 1.3rem;
      }

      .footer-modern-back-to-top {
        width: 45px;
        height: 45px;
        bottom: 1.5rem;
        right: 1.5rem;
      }
    }

    @media (min-width: 481px) and (max-width: 768px) {
      .footer-modern-content {
        gap: 2rem;
      }
    }

    @media (min-width: 769px) and (max-width: 1024px) {
      .footer-modern-content {
        flex-direction: row;
        justify-content: space-between;
      }

      .footer-modern-brand {
        text-align: left;
      }

      .footer-modern-social {
        justify-content: flex-end;
      }
    }

    @media (min-width: 1025px) {
      .footer-modern-content {
        flex-direction: row;
        justify-content: space-between;
      }

      .footer-modern-brand {
        text-align: left;
      }

      .footer-modern-social {
        justify-content: flex-end;
      }
    }
  `,
  jsTemplate: `
    // Back to top button functionality
    (function() {
      const backToTopBtn = document.querySelector('.footer-modern-back-to-top');
      if (backToTopBtn) {
        backToTopBtn.addEventListener('click', function() {
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        });
      }
    })();
  `,
  placeholders: [
    "{{NAME}}",
    "{{TITLE}}",
    "{{SOCIAL_LINKS}}",
    "{{CURRENT_YEAR}}",
    "{{COLOR_PRIMARY}}",
    "{{COLOR_SECONDARY}}",
    "{{COLOR_BACKGROUND}}",
    "{{COLOR_TEXT}}",
    "{{COLOR_TEXT_SECONDARY}}",
  ],
  designNotes: "Modern ve merkezi hizalanmış footer tasarımı. Sosyal medya linkleri, aria-labels ve back to top butonu içerir."
};

export const footerTemplate2: ComponentTemplate = {
  id: "footer-minimal-simple",
  name: "Minimal Simple Footer",
  category: "footer",
  htmlTemplate: `
    <footer id="footer" class="footer-minimal-section">
      <div class="footer-minimal-container">
        <div class="footer-minimal-info">
          <p class="footer-minimal-name">{{NAME}}</p>
          <p class="footer-minimal-contact">{{EMAIL}} | {{PHONE}}</p>
        </div>
        
        <div class="footer-minimal-social">
          {{SOCIAL_LINKS}}
        </div>
        
        <p class="footer-minimal-copyright">© {{CURRENT_YEAR}} {{NAME}}</p>
        <button class="footer-minimal-back-to-top" aria-label="Back to top">↑</button>
      </div>
    </footer>
  `,
  cssTemplate: `
    .footer-minimal-section {
      background-color: {{COLOR_BACKGROUND}};
      color: {{COLOR_TEXT}};
      padding: 2rem;
      text-align: center;
      border-top: 2px solid {{COLOR_PRIMARY}};
    }

    .footer-minimal-container {
      max-width: 800px;
      margin: 0 auto;
    }

    .footer-minimal-info {
      margin-bottom: 1.5rem;
    }

    .footer-minimal-name {
      font-size: 1.2rem;
      font-weight: 600;
      color: {{COLOR_PRIMARY}};
      margin-bottom: 0.5rem;
    }

    .footer-minimal-contact {
      color: {{COLOR_TEXT_SECONDARY}};
      font-size: 0.9rem;
    }

    .footer-minimal-social {
      display: flex;
      gap: 1rem;
      justify-content: center;
      margin-bottom: 1.5rem;
    }

    .footer-minimal-social a {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 35px;
      height: 35px;
      border-radius: 50%;
      background-color: {{COLOR_PRIMARY}};
      color: white;
      text-decoration: none;
      transition: transform 0.3s ease;
    }

    .footer-minimal-social a:hover {
      transform: scale(1.1);
    }

    .footer-minimal-copyright {
      color: {{COLOR_TEXT_SECONDARY}};
      font-size: 0.85rem;
      margin: 0;
    }

    .footer-minimal-back-to-top {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background-color: {{COLOR_PRIMARY}};
      color: white;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      transition: transform 0.3s ease, background-color 0.3s ease;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 1000;
    }

    .footer-minimal-back-to-top:hover {
      transform: translateY(-5px);
      background-color: {{COLOR_SECONDARY}};
    }

    .footer-minimal-back-to-top:focus {
      outline: 2px solid {{COLOR_PRIMARY}};
      outline-offset: 2px;
    }

    @media (max-width: 480px) {
      .footer-minimal-section {
        padding: 1.5rem 1rem;
      }

      .footer-minimal-name {
        font-size: 1.1rem;
      }

      .footer-minimal-contact {
        font-size: 0.85rem;
      }

      .footer-minimal-social a {
        width: 32px;
        height: 32px;
      }

      .footer-minimal-back-to-top {
        width: 45px;
        height: 45px;
        bottom: 1.5rem;
        right: 1.5rem;
      }
    }

    @media (min-width: 481px) and (max-width: 768px) {
      .footer-minimal-section {
        padding: 2rem 1.5rem;
      }
    }

    @media (min-width: 769px) and (max-width: 1024px) {
      .footer-minimal-container {
        max-width: 900px;
      }
    }

    @media (min-width: 1025px) {
      .footer-minimal-container {
        max-width: 1000px;
      }
    }
  `,
  jsTemplate: `
    // Back to top button functionality
    (function() {
      const backToTopBtn = document.querySelector('.footer-minimal-back-to-top');
      if (backToTopBtn) {
        backToTopBtn.addEventListener('click', function() {
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        });
      }
    })();
  `,
  placeholders: [
    "{{NAME}}",
    "{{EMAIL}}",
    "{{PHONE}}",
    "{{SOCIAL_LINKS}}",
    "{{CURRENT_YEAR}}",
    "{{COLOR_PRIMARY}}",
    "{{COLOR_SECONDARY}}",
    "{{COLOR_BACKGROUND}}",
    "{{COLOR_TEXT}}",
    "{{COLOR_TEXT_SECONDARY}}",
  ],
  designNotes: "Minimal ve sade footer tasarımı. Temel bilgiler, sosyal medya linkleri, aria-labels ve back to top butonu."
};

export const footerTemplate3: ComponentTemplate = {
  id: "footer-split-columns",
  name: "Split Columns Footer",
  category: "footer",
  htmlTemplate: `
    <footer id="footer" class="footer-split-section">
      <div class="footer-split-container">
        <div class="footer-split-columns">
          <div class="footer-split-col footer-split-about">
            <h3>{{NAME}}</h3>
            <p>{{SUMMARY}}</p>
            <div class="footer-split-social">
              {{SOCIAL_LINKS}}
            </div>
          </div>
          
          <div class="footer-split-col footer-split-contact-info">
            <h4>İletişim</h4>
            <ul>
              <li>{{EMAIL}}</li>
              <li>{{PHONE}}</li>
              <li>{{LOCATION}}</li>
            </ul>
          </div>
        </div>
        
        <div class="footer-split-bottom">
          <p>© {{CURRENT_YEAR}} {{NAME}}. Tüm hakları saklıdır.</p>
          <button class="footer-split-back-to-top" aria-label="Back to top">↑</button>
        </div>
      </div>
    </footer>
  `,
  cssTemplate: `
    .footer-split-section {
      background: linear-gradient(135deg, {{COLOR_PRIMARY}}, {{COLOR_SECONDARY}});
      color: white;
      padding: 4rem 2rem 2rem;
    }

    .footer-split-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .footer-split-columns {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 3rem;
      margin-bottom: 3rem;
    }

    .footer-split-col h3,
    .footer-split-col h4 {
      margin-bottom: 1.5rem;
      font-weight: 600;
    }

    .footer-split-col h3 {
      font-size: 1.8rem;
    }

    .footer-split-col h4 {
      font-size: 1.2rem;
    }

    .footer-split-about p {
      line-height: 1.6;
      margin-bottom: 1.5rem;
      opacity: 0.9;
    }

    .footer-split-social {
      display: flex;
      gap: 1rem;
    }

    .footer-split-social a {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: rgba(255, 255, 255, 0.2);
      color: white;
      text-decoration: none;
      transition: background-color 0.3s ease;
    }

    .footer-split-social a:hover {
      background-color: rgba(255, 255, 255, 0.3);
    }

    .footer-split-contact-info ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .footer-split-contact-info ul li {
      margin-bottom: 0.75rem;
      opacity: 0.9;
    }

    .footer-split-bottom {
      padding-top: 2rem;
      border-top: 1px solid rgba(255, 255, 255, 0.2);
      text-align: center;
      position: relative;
    }

    .footer-split-bottom p {
      margin: 0;
      opacity: 0.8;
      font-size: 0.9rem;
    }

    .footer-split-back-to-top {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background-color: rgba(255, 255, 255, 0.9);
      color: {{COLOR_PRIMARY}};
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      transition: transform 0.3s ease, background-color 0.3s ease;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      z-index: 1000;
    }

    .footer-split-back-to-top:hover {
      transform: translateY(-5px);
      background-color: white;
    }

    .footer-split-back-to-top:focus {
      outline: 2px solid white;
      outline-offset: 2px;
    }

    @media (max-width: 480px) {
      .footer-split-section {
        padding: 3rem 1.5rem 1.5rem;
      }

      .footer-split-columns {
        grid-template-columns: 1fr;
        gap: 2rem;
      }

      .footer-split-col h3 {
        font-size: 1.5rem;
      }

      .footer-split-col h4 {
        font-size: 1.1rem;
      }

      .footer-split-back-to-top {
        width: 45px;
        height: 45px;
        bottom: 1.5rem;
        right: 1.5rem;
      }
    }

    @media (min-width: 481px) and (max-width: 768px) {
      .footer-split-columns {
        grid-template-columns: 1fr;
        gap: 2.5rem;
      }
    }

    @media (min-width: 769px) and (max-width: 1024px) {
      .footer-split-columns {
        grid-template-columns: repeat(2, 1fr);
        gap: 2.5rem;
      }
    }

    @media (min-width: 1025px) {
      .footer-split-columns {
        gap: 4rem;
      }
    }
  `,
  jsTemplate: `
    // Back to top button functionality
    (function() {
      const backToTopBtn = document.querySelector('.footer-split-back-to-top');
      if (backToTopBtn) {
        backToTopBtn.addEventListener('click', function() {
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        });
      }
    })();
  `,
  placeholders: [
    "{{NAME}}",
    "{{SUMMARY}}",
    "{{EMAIL}}",
    "{{PHONE}}",
    "{{LOCATION}}",
    "{{SOCIAL_LINKS}}",
    "{{CURRENT_YEAR}}",
    "{{COLOR_PRIMARY}}",
    "{{COLOR_SECONDARY}}",
    "{{COLOR_BACKGROUND}}",
    "{{COLOR_TEXT}}",
    "{{COLOR_TEXT_SECONDARY}}",
  ],
  designNotes: "Kolon bazlı profesyonel footer tasarımı. Aria-labels, detaylı bilgi ve back to top butonu içerir."
};

export const footerTemplate4: ComponentTemplate = {
  id: "footer-wave-sticky",
  name: "Wave Sticky Footer",
  category: "footer",
  htmlTemplate: `
    <footer id="footer" class="footer-wave-section">
      <svg class="footer-wave-divider" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" preserveAspectRatio="none">
        <path d="M0,64 C320,120 640,0 960,64 C1280,128 1440,32 1440,64 L1440,120 L0,120 Z" fill="currentColor"></path>
      </svg>
      <div class="footer-wave-container">
        <div class="footer-wave-content">
          <div class="footer-wave-brand">
            <h3 class="footer-wave-name">{{NAME}}</h3>
            <p class="footer-wave-tagline">{{TITLE}}</p>
          </div>
          
          <div class="footer-wave-info">
            <p>{{EMAIL}}</p>
            <p>{{PHONE}}</p>
            <p>{{LOCATION}}</p>
          </div>
          
          <div class="footer-wave-social">
            {{SOCIAL_LINKS}}
          </div>
        </div>
        
        <div class="footer-wave-bottom">
          <p class="footer-wave-copyright">© {{CURRENT_YEAR}} {{NAME}}. Tüm hakları saklıdır.</p>
        </div>
        <button class="footer-wave-back-to-top" aria-label="Back to top">↑</button>
      </div>
    </footer>
  `,
  cssTemplate: `
    .footer-wave-section {
      position: relative;
      background: linear-gradient(180deg, {{COLOR_PRIMARY}}, {{COLOR_SECONDARY}});
      color: white;
      padding: 0;
      margin-top: 6rem;
    }

    .footer-wave-divider {
      position: absolute;
      top: -1px;
      left: 0;
      width: 100%;
      height: 120px;
      color: {{COLOR_PRIMARY}};
      transform: translateY(-100%);
    }

    .footer-wave-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 3rem 2rem 2rem;
      position: relative;
    }

    .footer-wave-content {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2.5rem;
      margin-bottom: 2.5rem;
      align-items: start;
    }

    .footer-wave-brand .footer-wave-name {
      font-size: 1.8rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      color: white;
    }

    .footer-wave-tagline {
      font-size: 1rem;
      opacity: 0.9;
      margin: 0;
    }

    .footer-wave-info {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .footer-wave-info p {
      margin: 0;
      opacity: 0.9;
      font-size: 0.95rem;
    }

    .footer-wave-social {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .footer-wave-social a {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 45px;
      height: 45px;
      border-radius: 50%;
      background-color: rgba(255, 255, 255, 0.2);
      color: white;
      text-decoration: none;
      transition: all 0.3s ease;
      backdrop-filter: blur(10px);
    }

    .footer-wave-social a:hover {
      background-color: rgba(255, 255, 255, 0.3);
      transform: translateY(-3px) scale(1.05);
    }

    .footer-wave-bottom {
      padding-top: 2rem;
      border-top: 1px solid rgba(255, 255, 255, 0.2);
      text-align: center;
    }

    .footer-wave-copyright {
      margin: 0;
      opacity: 0.85;
      font-size: 0.9rem;
    }

    .footer-wave-back-to-top {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      width: 55px;
      height: 55px;
      border-radius: 50%;
      background: linear-gradient(135deg, {{COLOR_PRIMARY}}, {{COLOR_SECONDARY}});
      color: white;
      border: 2px solid rgba(255, 255, 255, 0.3);
      font-size: 1.5rem;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
      z-index: 1000;
      opacity: 0;
      pointer-events: none;
    }

    .footer-wave-back-to-top.visible {
      opacity: 1;
      pointer-events: all;
    }

    .footer-wave-back-to-top:hover {
      transform: translateY(-8px) scale(1.1);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
    }

    .footer-wave-back-to-top:focus {
      outline: 2px solid white;
      outline-offset: 3px;
    }

    @media (max-width: 480px) {
      .footer-wave-section {
        margin-top: 4rem;
      }

      .footer-wave-divider {
        height: 80px;
      }

      .footer-wave-container {
        padding: 2rem 1.5rem 1.5rem;
      }

      .footer-wave-content {
        grid-template-columns: 1fr;
        gap: 2rem;
        text-align: center;
      }

      .footer-wave-brand .footer-wave-name {
        font-size: 1.5rem;
      }

      .footer-wave-social {
        justify-content: center;
      }

      .footer-wave-social a {
        width: 40px;
        height: 40px;
      }

      .footer-wave-back-to-top {
        width: 50px;
        height: 50px;
        bottom: 1.5rem;
        right: 1.5rem;
      }
    }

    @media (min-width: 481px) and (max-width: 768px) {
      .footer-wave-section {
        margin-top: 5rem;
      }

      .footer-wave-divider {
        height: 100px;
      }

      .footer-wave-content {
        grid-template-columns: 1fr;
        gap: 2rem;
        text-align: center;
      }

      .footer-wave-social {
        justify-content: center;
      }
    }

    @media (min-width: 769px) and (max-width: 1024px) {
      .footer-wave-content {
        grid-template-columns: repeat(2, 1fr);
        gap: 2.5rem;
      }

      .footer-wave-social {
        grid-column: 1 / -1;
        justify-content: center;
      }
    }

    @media (min-width: 1025px) {
      .footer-wave-content {
        grid-template-columns: 2fr 1.5fr 1.5fr;
        gap: 3rem;
      }
    }
  `,
  jsTemplate: `
    // Back to top button functionality with sticky behavior
    (function() {
      const backToTopBtn = document.querySelector('.footer-wave-back-to-top');
      if (backToTopBtn) {
        // Show/hide button based on scroll position
        function toggleBackToTopButton() {
          if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
          } else {
            backToTopBtn.classList.remove('visible');
          }
        }

        // Smooth scroll to top
        backToTopBtn.addEventListener('click', function() {
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        });

        // Listen for scroll events
        window.addEventListener('scroll', toggleBackToTopButton);
        
        // Initial check
        toggleBackToTopButton();
      }
    })();
  `,
  placeholders: [
    "{{NAME}}",
    "{{TITLE}}",
    "{{EMAIL}}",
    "{{PHONE}}",
    "{{LOCATION}}",
    "{{SOCIAL_LINKS}}",
    "{{CURRENT_YEAR}}",
    "{{COLOR_PRIMARY}}",
    "{{COLOR_SECONDARY}}",
    "{{COLOR_BACKGROUND}}",
    "{{COLOR_TEXT}}",
    "{{COLOR_TEXT_SECONDARY}}",
  ],
  designNotes: "Wave SVG divider ile modern sticky footer tasarımı. Gradient background, responsive layout ve dinamik back to top butonu içerir."
};

export const footerTemplate5: ComponentTemplate = {
  id: "footer-mega-columns",
  name: "Mega Footer",
  category: "footer",
  htmlTemplate: `
    <footer id="footer" class="footer-mega-section">
      <div class="footer-mega-container">
        <div class="footer-mega-columns">
          <div class="footer-mega-col footer-mega-about">
            <h4>Hakkımda</h4>
            <p class="footer-mega-summary">{{SUMMARY}}</p>
            <div class="footer-mega-social">
              {{SOCIAL_LINKS}}
            </div>
          </div>
          
          <div class="footer-mega-col footer-mega-quick-links">
            <h4>Hızlı Erişim</h4>
            <ul>
              {{FOOTER_LINKS}}
            </ul>
          </div>
          
          <div class="footer-mega-col footer-mega-contact">
            <h4>İletişim Bilgileri</h4>
            <ul>
              <li>
                <span class="footer-mega-icon">📧</span>
                <a href="mailto:{{EMAIL}}" aria-label="Email gönder">{{EMAIL}}</a>
              </li>
              <li>
                <span class="footer-mega-icon">📱</span>
                <a href="tel:{{PHONE}}" aria-label="Telefon et">{{PHONE}}</a>
              </li>
              <li>
                <span class="footer-mega-icon">📍</span>
                <span>{{LOCATION}}</span>
              </li>
            </ul>
          </div>
          
          <div class="footer-mega-col footer-mega-info">
            <h4>{{NAME}}</h4>
            <p class="footer-mega-title">{{TITLE}}</p>
            <p class="footer-mega-tagline">Kaliteli ve profesyonel çözümler için benimle iletişime geçin.</p>
          </div>
        </div>
        
        <div class="footer-mega-bottom">
          <p class="footer-mega-copyright">© {{CURRENT_YEAR}} {{NAME}}. Tüm hakları saklıdır.</p>
          <p class="footer-mega-credits">Powered by passion and innovation</p>
        </div>
        <button class="footer-mega-back-to-top" aria-label="Back to top">↑</button>
      </div>
    </footer>
  `,
  cssTemplate: `
    .footer-mega-section {
      background-color: {{COLOR_BACKGROUND}};
      color: {{COLOR_TEXT}};
      padding: 5rem 2rem 2rem;
      border-top: 3px solid {{COLOR_PRIMARY}};
      box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
    }

    .footer-mega-container {
      max-width: 1400px;
      margin: 0 auto;
    }

    .footer-mega-columns {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 3rem;
      margin-bottom: 3rem;
    }

    .footer-mega-col h4 {
      font-size: 1.2rem;
      font-weight: 700;
      color: {{COLOR_PRIMARY}};
      margin-bottom: 1.5rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .footer-mega-about .footer-mega-summary {
      line-height: 1.7;
      margin-bottom: 1.5rem;
      color: {{COLOR_TEXT_SECONDARY}};
      font-size: 0.95rem;
    }

    .footer-mega-social {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    .footer-mega-social a {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 42px;
      height: 42px;
      border-radius: 8px;
      background-color: {{COLOR_PRIMARY}};
      color: white;
      text-decoration: none;
      transition: all 0.3s ease;
      font-size: 1.1rem;
    }

    .footer-mega-social a:hover {
      background-color: {{COLOR_SECONDARY}};
      transform: translateY(-3px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .footer-mega-quick-links ul,
    .footer-mega-contact ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .footer-mega-quick-links ul li {
      margin-bottom: 0.75rem;
    }

    .footer-mega-quick-links a {
      color: {{COLOR_TEXT}};
      text-decoration: none;
      transition: all 0.3s ease;
      display: inline-block;
      position: relative;
      padding-left: 1rem;
    }

    .footer-mega-quick-links a::before {
      content: '→';
      position: absolute;
      left: 0;
      color: {{COLOR_PRIMARY}};
      transition: transform 0.3s ease;
    }

    .footer-mega-quick-links a:hover {
      color: {{COLOR_PRIMARY}};
      transform: translateX(5px);
    }

    .footer-mega-quick-links a:hover::before {
      transform: translateX(5px);
    }

    .footer-mega-contact ul li {
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .footer-mega-icon {
      font-size: 1.2rem;
      flex-shrink: 0;
    }

    .footer-mega-contact a {
      color: {{COLOR_TEXT}};
      text-decoration: none;
      transition: color 0.3s ease;
      word-break: break-word;
    }

    .footer-mega-contact a:hover {
      color: {{COLOR_PRIMARY}};
    }

    .footer-mega-info .footer-mega-title {
      color: {{COLOR_SECONDARY}};
      font-weight: 600;
      margin-bottom: 1rem;
      font-size: 1rem;
    }

    .footer-mega-tagline {
      color: {{COLOR_TEXT_SECONDARY}};
      line-height: 1.6;
      font-size: 0.9rem;
    }

    .footer-mega-bottom {
      padding-top: 2rem;
      border-top: 2px solid rgba(0, 0, 0, 0.1);
      text-align: center;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .footer-mega-copyright {
      color: {{COLOR_TEXT}};
      font-size: 0.95rem;
      font-weight: 500;
      margin: 0;
    }

    .footer-mega-credits {
      color: {{COLOR_TEXT_SECONDARY}};
      font-size: 0.85rem;
      font-style: italic;
      margin: 0;
    }

    .footer-mega-back-to-top {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      width: 55px;
      height: 55px;
      border-radius: 12px;
      background: linear-gradient(135deg, {{COLOR_PRIMARY}}, {{COLOR_SECONDARY}});
      color: white;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
      z-index: 1000;
      opacity: 0;
      pointer-events: none;
    }

    .footer-mega-back-to-top.visible {
      opacity: 1;
      pointer-events: all;
    }

    .footer-mega-back-to-top:hover {
      transform: translateY(-5px) rotate(5deg);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
    }

    .footer-mega-back-to-top:focus {
      outline: 3px solid {{COLOR_PRIMARY}};
      outline-offset: 3px;
    }

    @media (max-width: 480px) {
      .footer-mega-section {
        padding: 3rem 1.5rem 1.5rem;
      }

      .footer-mega-columns {
        grid-template-columns: 1fr;
        gap: 2.5rem;
      }

      .footer-mega-col h4 {
        font-size: 1.1rem;
      }

      .footer-mega-social {
        justify-content: center;
      }

      .footer-mega-quick-links,
      .footer-mega-contact,
      .footer-mega-about,
      .footer-mega-info {
        text-align: center;
      }

      .footer-mega-quick-links a {
        padding-left: 0;
      }

      .footer-mega-quick-links a::before {
        display: none;
      }

      .footer-mega-contact ul li {
        justify-content: center;
      }

      .footer-mega-back-to-top {
        width: 50px;
        height: 50px;
        bottom: 1.5rem;
        right: 1.5rem;
      }
    }

    @media (min-width: 481px) and (max-width: 768px) {
      .footer-mega-section {
        padding: 4rem 2rem 2rem;
      }

      .footer-mega-columns {
        grid-template-columns: 1fr;
        gap: 2.5rem;
      }

      .footer-mega-social {
        justify-content: center;
      }
    }

    @media (min-width: 769px) and (max-width: 1024px) {
      .footer-mega-columns {
        grid-template-columns: repeat(2, 1fr);
        gap: 2.5rem;
      }
    }

    @media (min-width: 1025px) and (max-width: 1280px) {
      .footer-mega-columns {
        gap: 2.5rem;
      }
    }

    @media (min-width: 1281px) {
      .footer-mega-columns {
        gap: 3.5rem;
      }
    }
  `,
  jsTemplate: `
    // Back to top button functionality with smooth animation
    (function() {
      const backToTopBtn = document.querySelector('.footer-mega-back-to-top');
      if (backToTopBtn) {
        // Show/hide button based on scroll position
        function toggleBackToTopButton() {
          if (window.scrollY > 400) {
            backToTopBtn.classList.add('visible');
          } else {
            backToTopBtn.classList.remove('visible');
          }
        }

        // Smooth scroll to top
        backToTopBtn.addEventListener('click', function() {
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        });

        // Listen for scroll events with throttling for performance
        let scrollTimeout;
        window.addEventListener('scroll', function() {
          if (scrollTimeout) {
            window.cancelAnimationFrame(scrollTimeout);
          }
          scrollTimeout = window.requestAnimationFrame(function() {
            toggleBackToTopButton();
          });
        });
        
        // Initial check
        toggleBackToTopButton();
      }
    })();
  `,
  placeholders: [
    "{{NAME}}",
    "{{TITLE}}",
    "{{SUMMARY}}",
    "{{EMAIL}}",
    "{{PHONE}}",
    "{{LOCATION}}",
    "{{SOCIAL_LINKS}}",
    "{{FOOTER_LINKS}}",
    "{{CURRENT_YEAR}}",
    "{{COLOR_PRIMARY}}",
    "{{COLOR_SECONDARY}}",
    "{{COLOR_BACKGROUND}}",
    "{{COLOR_TEXT}}",
    "{{COLOR_TEXT_SECONDARY}}",
  ],
  designNotes: "Kapsamlı 4-kolonlu mega footer tasarımı. About, Quick Links, Contact ve Info bölümleri ile responsive tasarım. Mobile'da tek kolona daralan yapı."
};

export const footerTemplates: ComponentTemplate[] = [
  footerTemplate1,
  footerTemplate2,
  footerTemplate3,
  footerTemplate4,
  footerTemplate5,
];
