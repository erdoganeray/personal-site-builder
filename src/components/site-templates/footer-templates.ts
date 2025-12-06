import { ComponentTemplate } from "@/types/templates";

/**
 * Footer section template'leri
 */

export const footerTemplate1: ComponentTemplate = {
  id: "footer-modern-centered",
  name: "Modern Centered Footer",
  category: "footer",
  htmlTemplate: `
    <footer id="footer" class="footer-section">
      <div class="footer-container">
        <div class="footer-content">
          <div class="footer-brand">
            <h3 class="footer-name">{{NAME}}</h3>
            <p class="footer-tagline">{{TITLE}}</p>
          </div>
          
          <div class="footer-links">
            <div class="footer-links-group">
              <h4>Bağlantılar</h4>
              <ul>
                <li><a href="#hero">Ana Sayfa</a></li>
                <li><a href="#about">Hakkımda</a></li>
                <li><a href="#experience">Deneyim</a></li>
                <li><a href="#contact">İletişim</a></li>
              </ul>
            </div>
          </div>
          
          <div class="footer-social">
            {{SOCIAL_LINKS}}
          </div>
        </div>
        
        <div class="footer-bottom">
          <p class="footer-copyright">© {{CURRENT_YEAR}} {{NAME}}. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  `,
  cssTemplate: `
    .footer-section {
      background-color: {{COLOR_BACKGROUND}};
      color: {{COLOR_TEXT}};
      padding: 4rem 2rem 2rem;
      border-top: 1px solid rgba(0, 0, 0, 0.1);
    }

    .footer-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .footer-content {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 3rem;
      margin-bottom: 3rem;
    }

    .footer-brand .footer-name {
      font-size: 1.5rem;
      font-weight: 700;
      color: {{COLOR_PRIMARY}};
      margin-bottom: 0.5rem;
    }

    .footer-tagline {
      color: {{COLOR_TEXT_SECONDARY}};
      font-size: 0.95rem;
    }

    .footer-links-group h4 {
      font-size: 1.1rem;
      font-weight: 600;
      margin-bottom: 1rem;
      color: {{COLOR_PRIMARY}};
    }

    .footer-links-group ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .footer-links-group ul li {
      margin-bottom: 0.5rem;
    }

    .footer-links-group ul li a {
      color: {{COLOR_TEXT}};
      text-decoration: none;
      transition: color 0.3s ease;
    }

    .footer-links-group ul li a:hover {
      color: {{COLOR_PRIMARY}};
    }

    .footer-social {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .footer-social a {
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

    .footer-social a:hover {
      transform: translateY(-3px);
      background-color: {{COLOR_SECONDARY}};
    }

    .footer-bottom {
      padding-top: 2rem;
      border-top: 1px solid rgba(0, 0, 0, 0.1);
      text-align: center;
    }

    .footer-copyright {
      color: {{COLOR_TEXT_SECONDARY}};
      font-size: 0.9rem;
      margin: 0;
    }

    @media (max-width: 768px) {
      .footer-content {
        grid-template-columns: 1fr;
        gap: 2rem;
        text-align: center;
      }

      .footer-social {
        justify-content: center;
      }
    }
  `,
  placeholders: ["NAME", "TITLE", "SOCIAL_LINKS", "CURRENT_YEAR"],
  designNotes: "Modern ve merkezi hizalanmış footer tasarımı. Sosyal medya linkleri ve bağlantılar içerir."
};

export const footerTemplate2: ComponentTemplate = {
  id: "footer-minimal-simple",
  name: "Minimal Simple Footer",
  category: "footer",
  htmlTemplate: `
    <footer id="footer" class="footer-section">
      <div class="footer-container">
        <div class="footer-info">
          <p class="footer-name">{{NAME}}</p>
          <p class="footer-contact">{{EMAIL}} | {{PHONE}}</p>
        </div>
        
        <div class="footer-social">
          {{SOCIAL_LINKS}}
        </div>
        
        <p class="footer-copyright">© {{CURRENT_YEAR}} {{NAME}}</p>
      </div>
    </footer>
  `,
  cssTemplate: `
    .footer-section {
      background-color: {{COLOR_BACKGROUND}};
      color: {{COLOR_TEXT}};
      padding: 2rem;
      text-align: center;
      border-top: 2px solid {{COLOR_PRIMARY}};
    }

    .footer-container {
      max-width: 800px;
      margin: 0 auto;
    }

    .footer-info {
      margin-bottom: 1.5rem;
    }

    .footer-name {
      font-size: 1.2rem;
      font-weight: 600;
      color: {{COLOR_PRIMARY}};
      margin-bottom: 0.5rem;
    }

    .footer-contact {
      color: {{COLOR_TEXT_SECONDARY}};
      font-size: 0.9rem;
    }

    .footer-social {
      display: flex;
      gap: 1rem;
      justify-content: center;
      margin-bottom: 1.5rem;
    }

    .footer-social a {
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

    .footer-social a:hover {
      transform: scale(1.1);
    }

    .footer-copyright {
      color: {{COLOR_TEXT_SECONDARY}};
      font-size: 0.85rem;
      margin: 0;
    }
  `,
  placeholders: ["NAME", "EMAIL", "PHONE", "SOCIAL_LINKS", "CURRENT_YEAR"],
  designNotes: "Minimal ve sade footer tasarımı. Temel bilgiler ve sosyal medya linkleri."
};

export const footerTemplate3: ComponentTemplate = {
  id: "footer-split-columns",
  name: "Split Columns Footer",
  category: "footer",
  htmlTemplate: `
    <footer id="footer" class="footer-section">
      <div class="footer-container">
        <div class="footer-columns">
          <div class="footer-col footer-about">
            <h3>{{NAME}}</h3>
            <p>{{SUMMARY}}</p>
            <div class="footer-social">
              {{SOCIAL_LINKS}}
            </div>
          </div>
          
          <div class="footer-col footer-quick-links">
            <h4>Hızlı Bağlantılar</h4>
            <ul>
              <li><a href="#hero">Ana Sayfa</a></li>
              <li><a href="#about">Hakkımda</a></li>
              <li><a href="#experience">Deneyim</a></li>
              <li><a href="#education">Eğitim</a></li>
              <li><a href="#skills">Yetenekler</a></li>
            </ul>
          </div>
          
          <div class="footer-col footer-contact-info">
            <h4>İletişim</h4>
            <ul>
              <li>{{EMAIL}}</li>
              <li>{{PHONE}}</li>
              <li>{{LOCATION}}</li>
            </ul>
          </div>
        </div>
        
        <div class="footer-bottom">
          <p>© {{CURRENT_YEAR}} {{NAME}}. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  `,
  cssTemplate: `
    .footer-section {
      background: linear-gradient(135deg, {{COLOR_PRIMARY}}, {{COLOR_SECONDARY}});
      color: white;
      padding: 4rem 2rem 2rem;
    }

    .footer-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .footer-columns {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 3rem;
      margin-bottom: 3rem;
    }

    .footer-col h3,
    .footer-col h4 {
      margin-bottom: 1.5rem;
      font-weight: 600;
    }

    .footer-col h3 {
      font-size: 1.8rem;
    }

    .footer-col h4 {
      font-size: 1.2rem;
    }

    .footer-about p {
      line-height: 1.6;
      margin-bottom: 1.5rem;
      opacity: 0.9;
    }

    .footer-social {
      display: flex;
      gap: 1rem;
    }

    .footer-social a {
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

    .footer-social a:hover {
      background-color: rgba(255, 255, 255, 0.3);
    }

    .footer-quick-links ul,
    .footer-contact-info ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .footer-quick-links ul li,
    .footer-contact-info ul li {
      margin-bottom: 0.75rem;
    }

    .footer-quick-links a {
      color: white;
      text-decoration: none;
      opacity: 0.9;
      transition: opacity 0.3s ease;
    }

    .footer-quick-links a:hover {
      opacity: 1;
    }

    .footer-contact-info ul li {
      opacity: 0.9;
    }

    .footer-bottom {
      padding-top: 2rem;
      border-top: 1px solid rgba(255, 255, 255, 0.2);
      text-align: center;
    }

    .footer-bottom p {
      margin: 0;
      opacity: 0.8;
      font-size: 0.9rem;
    }

    @media (max-width: 768px) {
      .footer-columns {
        grid-template-columns: 1fr;
        gap: 2rem;
      }
    }
  `,
  placeholders: ["NAME", "SUMMARY", "EMAIL", "PHONE", "LOCATION", "SOCIAL_LINKS", "CURRENT_YEAR"],
  designNotes: "Kolon bazlı profesyonel footer tasarımı. Detaylı bilgi ve linkler için uygundur."
};

export const footerTemplates: ComponentTemplate[] = [
  footerTemplate1,
  footerTemplate2,
  footerTemplate3,
];
