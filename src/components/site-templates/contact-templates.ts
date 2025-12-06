import { ComponentTemplate } from "@/types/templates";

/**
 * Contact section template'leri
 */

export const contactTemplate1: ComponentTemplate = {
  id: "contact-modern-form",
  name: "Modern Contact Form",
  category: "contact",
  htmlTemplate: `
    <section id="contact" class="contact-section">
      <div class="contact-container">
        <div class="contact-header">
          <h2 class="contact-title">İletişime Geçin</h2>
          <p class="contact-subtitle">Projeleriniz için benimle iletişime geçmekten çekinmeyin</p>
        </div>
        
        <div class="contact-content">
          <div class="contact-info">
            <div class="info-item">
              <div class="info-icon">📧</div>
              <div class="info-details">
                <h3>Email</h3>
                <a href="mailto:{{EMAIL}}">{{EMAIL}}</a>
              </div>
            </div>
            
            <div class="info-item">
              <div class="info-icon">📱</div>
              <div class="info-details">
                <h3>Telefon</h3>
                <a href="tel:{{PHONE}}">{{PHONE}}</a>
              </div>
            </div>
            
            <div class="info-item">
              <div class="info-icon">📍</div>
              <div class="info-details">
                <h3>Konum</h3>
                <p>{{LOCATION}}</p>
              </div>
            </div>
          </div>
          
          <form class="contact-form">
            <div class="form-group">
              <label for="name">İsim</label>
              <input type="text" id="name" name="name" required>
            </div>
            
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" name="email" required>
            </div>
            
            <div class="form-group">
              <label for="message">Mesaj</label>
              <textarea id="message" name="message" rows="5" required></textarea>
            </div>
            
            <button type="submit" class="submit-btn">Gönder</button>
          </form>
        </div>
      </div>
    </section>
  `,
  cssTemplate: `
    .contact-section {
      padding: 80px 20px;
      background: {{COLOR_BACKGROUND}};
    }

    .contact-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .contact-header {
      text-align: center;
      margin-bottom: 60px;
    }

    .contact-title {
      font-size: 2.5rem;
      font-weight: 700;
      color: {{COLOR_TEXT}};
      margin-bottom: 1rem;
    }

    .contact-subtitle {
      font-size: 1.2rem;
      color: {{COLOR_TEXT_SECONDARY}};
    }

    .contact-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 60px;
      align-items: start;
    }

    .contact-info {
      display: flex;
      flex-direction: column;
      gap: 30px;
    }

    .info-item {
      display: flex;
      gap: 20px;
      align-items: start;
      padding: 25px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      transition: transform 0.3s, box-shadow 0.3s;
    }

    .info-item:hover {
      transform: translateY(-5px);
      box-shadow: 0 5px 20px rgba(0,0,0,0.15);
    }

    .info-icon {
      font-size: 2rem;
      width: 60px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, {{COLOR_PRIMARY}}, {{COLOR_SECONDARY}});
      border-radius: 12px;
      flex-shrink: 0;
    }

    .info-details h3 {
      font-size: 1.1rem;
      color: {{COLOR_TEXT}};
      margin-bottom: 0.5rem;
    }

    .info-details a,
    .info-details p {
      color: {{COLOR_TEXT_SECONDARY}};
      text-decoration: none;
      transition: color 0.3s;
    }

    .info-details a:hover {
      color: {{COLOR_PRIMARY}};
    }

    .contact-form {
      display: flex;
      flex-direction: column;
      gap: 25px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .form-group label {
      font-weight: 600;
      color: {{COLOR_TEXT}};
      font-size: 1rem;
    }

    .form-group input,
    .form-group textarea {
      padding: 12px 16px;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      font-size: 1rem;
      font-family: inherit;
      transition: border-color 0.3s;
    }

    .form-group input:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: {{COLOR_PRIMARY}};
    }

    .submit-btn {
      padding: 15px 40px;
      background: linear-gradient(135deg, {{COLOR_PRIMARY}}, {{COLOR_SECONDARY}});
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.3s, box-shadow 0.3s;
    }

    .submit-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 20px rgba(0,0,0,0.2);
    }

    @media (max-width: 768px) {
      .contact-content {
        grid-template-columns: 1fr;
        gap: 40px;
      }

      .contact-title {
        font-size: 2rem;
      }
    }
  `,
  jsTemplate: `
    // Contact form submission handler
    document.querySelector('.contact-form')?.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData);
      
      // Form submission logic here
      console.log('Form submitted:', data);
      alert('Mesajınız alındı! En kısa sürede dönüş yapacağım.');
      e.target.reset();
    });
  `,
  placeholders: [
    "{{EMAIL}}",
    "{{PHONE}}",
    "{{LOCATION}}",
    "{{COLOR_PRIMARY}}",
    "{{COLOR_SECONDARY}}",
    "{{COLOR_BACKGROUND}}",
    "{{COLOR_TEXT}}",
    "{{COLOR_TEXT_SECONDARY}}",
  ],
};

export const contactTemplate2: ComponentTemplate = {
  id: "contact-minimal-centered",
  name: "Minimal Centered Contact",
  category: "contact",
  htmlTemplate: `
    <section id="contact" class="contact-section-minimal">
      <div class="contact-container-minimal">
        <h2 class="contact-title-minimal">Benimle İletişime Geçin</h2>
        
        <div class="contact-methods">
          <a href="mailto:{{EMAIL}}" class="contact-method">
            <span class="method-icon">✉️</span>
            <span class="method-label">Email</span>
            <span class="method-value">{{EMAIL}}</span>
          </a>
          
          <a href="tel:{{PHONE}}" class="contact-method">
            <span class="method-icon">📞</span>
            <span class="method-label">Telefon</span>
            <span class="method-value">{{PHONE}}</span>
          </a>
          
          <div class="contact-method">
            <span class="method-icon">📍</span>
            <span class="method-label">Konum</span>
            <span class="method-value">{{LOCATION}}</span>
          </div>
        </div>
      </div>
    </section>
  `,
  cssTemplate: `
    .contact-section-minimal {
      padding: 100px 20px;
      background: linear-gradient(135deg, {{COLOR_PRIMARY}}, {{COLOR_SECONDARY}});
      color: white;
      text-align: center;
    }

    .contact-container-minimal {
      max-width: 900px;
      margin: 0 auto;
    }

    .contact-title-minimal {
      font-size: 3rem;
      font-weight: 700;
      margin-bottom: 60px;
    }

    .contact-methods {
      display: flex;
      flex-direction: column;
      gap: 30px;
      align-items: center;
    }

    .contact-method {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 30px 50px;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border-radius: 16px;
      border: 2px solid rgba(255, 255, 255, 0.2);
      text-decoration: none;
      color: white;
      transition: all 0.3s;
      min-width: 400px;
    }

    .contact-method:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: translateY(-5px);
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    }

    .method-icon {
      font-size: 2.5rem;
    }

    .method-label {
      font-size: 0.9rem;
      opacity: 0.8;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .method-value {
      font-size: 1.3rem;
      font-weight: 600;
    }

    @media (max-width: 768px) {
      .contact-title-minimal {
        font-size: 2rem;
      }

      .contact-method {
        min-width: 100%;
        padding: 25px 30px;
      }

      .method-value {
        font-size: 1.1rem;
      }
    }
  `,
  placeholders: [
    "{{EMAIL}}",
    "{{PHONE}}",
    "{{LOCATION}}",
    "{{COLOR_PRIMARY}}",
    "{{COLOR_SECONDARY}}",
  ],
};

export const contactTemplate3: ComponentTemplate = {
  id: "contact-split-info",
  name: "Split Layout Contact",
  category: "contact",
  htmlTemplate: `
    <section id="contact" class="contact-section-split">
      <div class="contact-split-left">
        <div class="split-content">
          <h2 class="split-title">Birlikte Çalışalım</h2>
          <p class="split-description">Yeni projeler için her zaman açığım. İletişim bilgilerimden bana ulaşabilirsiniz.</p>
          
          <div class="split-info-list">
            <div class="split-info-item">
              <div class="split-icon">📧</div>
              <div>
                <div class="split-label">Email</div>
                <a href="mailto:{{EMAIL}}" class="split-value">{{EMAIL}}</a>
              </div>
            </div>
            
            <div class="split-info-item">
              <div class="split-icon">📱</div>
              <div>
                <div class="split-label">Telefon</div>
                <a href="tel:{{PHONE}}" class="split-value">{{PHONE}}</a>
              </div>
            </div>
            
            <div class="split-info-item">
              <div class="split-icon">📍</div>
              <div>
                <div class="split-label">Konum</div>
                <div class="split-value">{{LOCATION}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="contact-split-right">
        <form class="split-form">
          <h3 class="split-form-title">Mesaj Gönderin</h3>
          
          <input type="text" placeholder="İsim" name="name" required class="split-input">
          <input type="email" placeholder="Email" name="email" required class="split-input">
          <textarea placeholder="Mesajınız" name="message" rows="6" required class="split-input"></textarea>
          
          <button type="submit" class="split-submit">Gönder</button>
        </form>
      </div>
    </section>
  `,
  cssTemplate: `
    .contact-section-split {
      display: grid;
      grid-template-columns: 1fr 1fr;
      min-height: 100vh;
    }

    .contact-split-left {
      background: linear-gradient(135deg, {{COLOR_PRIMARY}}, {{COLOR_SECONDARY}});
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 60px;
    }

    .split-content {
      max-width: 500px;
    }

    .split-title {
      font-size: 3rem;
      font-weight: 700;
      margin-bottom: 1.5rem;
    }

    .split-description {
      font-size: 1.2rem;
      line-height: 1.6;
      margin-bottom: 3rem;
      opacity: 0.9;
    }

    .split-info-list {
      display: flex;
      flex-direction: column;
      gap: 25px;
    }

    .split-info-item {
      display: flex;
      gap: 20px;
      align-items: center;
    }

    .split-icon {
      font-size: 2rem;
      width: 60px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 12px;
      flex-shrink: 0;
    }

    .split-label {
      font-size: 0.9rem;
      opacity: 0.8;
      margin-bottom: 5px;
    }

    .split-value,
    .split-value a {
      font-size: 1.1rem;
      font-weight: 600;
      color: white;
      text-decoration: none;
    }

    .contact-split-right {
      background: {{COLOR_BACKGROUND}};
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 60px;
    }

    .split-form {
      width: 100%;
      max-width: 500px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .split-form-title {
      font-size: 2rem;
      color: {{COLOR_TEXT}};
      margin-bottom: 1rem;
    }

    .split-input {
      padding: 15px 20px;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      font-size: 1rem;
      font-family: inherit;
      transition: border-color 0.3s;
    }

    .split-input:focus {
      outline: none;
      border-color: {{COLOR_PRIMARY}};
    }

    .split-submit {
      padding: 15px 40px;
      background: {{COLOR_ACCENT}};
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.3s, box-shadow 0.3s;
    }

    .split-submit:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 20px rgba(0,0,0,0.2);
    }

    @media (max-width: 968px) {
      .contact-section-split {
        grid-template-columns: 1fr;
      }

      .contact-split-left,
      .contact-split-right {
        min-height: 50vh;
        padding: 40px 20px;
      }

      .split-title {
        font-size: 2rem;
      }
    }
  `,
  jsTemplate: `
    // Split contact form handler
    document.querySelector('.split-form')?.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData);
      
      console.log('Contact form submitted:', data);
      alert('Teşekkürler! Mesajınız alındı.');
      e.target.reset();
    });
  `,
  placeholders: [
    "{{EMAIL}}",
    "{{PHONE}}",
    "{{LOCATION}}",
    "{{COLOR_PRIMARY}}",
    "{{COLOR_SECONDARY}}",
    "{{COLOR_ACCENT}}",
    "{{COLOR_BACKGROUND}}",
    "{{COLOR_TEXT}}",
  ],
};

/**
 * Tüm contact template'lerini export et
 */
export const contactTemplates = [
  contactTemplate1,
  contactTemplate2,
  contactTemplate3,
];
