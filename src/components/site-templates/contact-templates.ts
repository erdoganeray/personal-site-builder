import { ComponentTemplate } from "@/types/templates";

/**
 * Contact section template'leri
 */

export const contactTemplate1: ComponentTemplate = {
  id: "contact-modern-form",
  name: "Modern Contact Form",
  category: "contact",
  htmlTemplate: `
    <section id="contact" class="contact-modern-section">
      <div class="contact-modern-container">
        <div class="contact-modern-header">
          <h2 class="contact-modern-title">İletişime Geçin</h2>
          <p class="contact-modern-subtitle">Projeleriniz için benimle iletişime geçmekten çekinmeyin</p>
        </div>
        
        <div class="contact-modern-content">
          <div class="contact-modern-info">
            <div class="contact-modern-info-item">
              <div class="contact-modern-info-icon">📧</div>
              <div class="contact-modern-info-details">
                <h3>Email</h3>
                <a href="mailto:{{EMAIL}}">{{EMAIL}}</a>
              </div>
            </div>
            
            <div class="contact-modern-info-item">
              <div class="contact-modern-info-icon">📱</div>
              <div class="contact-modern-info-details">
                <h3>Telefon</h3>
                <a href="tel:{{PHONE}}">{{PHONE}}</a>
              </div>
            </div>
            
            <div class="contact-modern-info-item">
              <div class="contact-modern-info-icon">📍</div>
              <div class="contact-modern-info-details">
                <h3>Konum</h3>
                <p>{{LOCATION}}</p>
              </div>
            </div>
          </div>
          
          <form class="contact-modern-form">
            <!-- Honeypot field (hidden from users, visible to bots) -->
            <input type="text" name="honeypot" style="display:none" tabindex="-1" autocomplete="off">
            
            <!-- Hidden field for site owner email -->
            <input type="hidden" name="siteOwnerEmail" value="{{SITE_OWNER_EMAIL}}">
            
            <div class="contact-modern-form-group">
              <label for="name">İsim</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                required 
                aria-required="true"
                aria-invalid="false"
                aria-describedby="name-error"
              >
              <span id="name-error" class="contact-modern-error-message" role="alert"></span>
            </div>
            
            <div class="contact-modern-form-group">
              <label for="email">Email</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                required 
                aria-required="true"
                aria-invalid="false"
                aria-describedby="email-error"
              >
              <span id="email-error" class="contact-modern-error-message" role="alert"></span>
            </div>
            
            <div class="contact-modern-form-group">
              <label for="message">Mesaj</label>
              <textarea 
                id="message" 
                name="message" 
                rows="5" 
                required 
                aria-required="true"
                aria-invalid="false"
                aria-describedby="message-error"
                maxlength="5000"
              ></textarea>
              <span id="message-error" class="contact-modern-error-message" role="alert"></span>
            </div>
            
            <button type="submit" class="contact-modern-submit-btn">
              <span class="contact-modern-btn-text">Gönder</span>
              <span class="contact-modern-btn-spinner" style="display:none;">⏳</span>
            </button>
            
            <!-- Success/Error messages -->
            <div class="contact-modern-form-message" style="display:none;"></div>
          </form>
        </div>
      </div>
    </section>
  `,
  cssTemplate: `
    .contact-modern-section {
      padding: 80px 20px;
      background: {{COLOR_BACKGROUND}};
    }

    .contact-modern-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .contact-modern-header {
      text-align: center;
      margin-bottom: 60px;
    }

    .contact-modern-title {
      font-size: 2.5rem;
      font-weight: 700;
      color: {{COLOR_TEXT}};
      margin-bottom: 1rem;
    }

    .contact-modern-subtitle {
      font-size: 1.2rem;
      color: {{COLOR_TEXT_SECONDARY}};
    }

    .contact-modern-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 60px;
      align-items: start;
    }

    .contact-modern-info {
      display: flex;
      flex-direction: column;
      gap: 30px;
    }

    .contact-modern-info-item {
      display: flex;
      gap: 20px;
      align-items: start;
      padding: 25px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      transition: transform 0.3s, box-shadow 0.3s;
    }

    .contact-modern-info-item:hover {
      transform: translateY(-5px);
      box-shadow: 0 5px 20px rgba(0,0,0,0.15);
    }

    .contact-modern-info-icon {
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

    .contact-modern-info-details h3 {
      font-size: 1.1rem;
      color: {{COLOR_TEXT}};
      margin-bottom: 0.5rem;
    }

    .contact-modern-info-details a,
    .contact-modern-info-details p {
      color: {{COLOR_TEXT_SECONDARY}};
      text-decoration: none;
      transition: color 0.3s;
    }

    .contact-modern-info-details a:hover {
      color: {{COLOR_PRIMARY}};
    }

    .contact-modern-form {
      display: flex;
      flex-direction: column;
      gap: 25px;
    }

    .contact-modern-form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .contact-modern-form-group label {
      font-weight: 600;
      color: {{COLOR_TEXT}};
      font-size: 1rem;
    }

    .contact-modern-form-group input,
    .contact-modern-form-group textarea {
      padding: 12px 16px;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      font-size: 1rem;
      font-family: inherit;
      transition: border-color 0.3s;
    }

    .contact-modern-form-group input:focus,
    .contact-modern-form-group textarea:focus {
      outline: none;
      border-color: {{COLOR_PRIMARY}};
    }

    /* Error states */
    .contact-modern-form-group input[aria-invalid="true"],
    .contact-modern-form-group textarea[aria-invalid="true"] {
      border-color: #dc3545;
      background-color: #fff5f5;
    }

    .contact-modern-error-message {
      display: none;
      color: #dc3545;
      font-size: 0.875rem;
      margin-top: 4px;
    }

    .contact-modern-error-message:not(:empty) {
      display: block;
    }


    .contact-modern-submit-btn {
      position: relative;
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

    .contact-modern-submit-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }

    .contact-modern-submit-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 5px 20px rgba(0,0,0,0.2);
    }

    .contact-modern-btn-spinner {
      margin-left: 8px;
    }

    .contact-modern-form-message {
      margin-top: 20px;
      padding: 15px;
      border-radius: 8px;
      text-align: center;
      font-weight: 500;
    }

    .contact-modern-form-message.success {
      background: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }

    .contact-modern-form-message.error {
      background: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }

    @media (max-width: 768px) {
      .contact-modern-content {
        grid-template-columns: 1fr;
        gap: 40px;
      }

      .contact-modern-title {
        font-size: 2rem;
      }
    }
  `,
  jsTemplate: `
    // Validation functions
    function validateName(name) {
      if (!name || name.trim().length === 0) {
        return 'İsim gereklidir';
      }
      if (name.trim().length < 2) {
        return 'İsim en az 2 karakter olmalıdır';
      }
      return '';
    }

    function validateEmail(email) {
      if (!email || email.trim().length === 0) {
        return 'Email gereklidir';
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return 'Geçerli bir email adresi giriniz';
      }
      return '';
    }

    function validateMessage(message) {
      if (!message || message.trim().length === 0) {
        return 'Mesaj gereklidir';
      }
      if (message.trim().length < 10) {
        return 'Mesaj en az 10 karakter olmalıdır';
      }
      if (message.length > 5000) {
        return 'Mesaj en fazla 5000 karakter olabilir';
      }
      return '';
    }

    function showError(inputId, errorMessage) {
      const input = document.getElementById(inputId);
      const errorSpan = document.getElementById(inputId + '-error');
      
      if (input && errorSpan) {
        input.setAttribute('aria-invalid', 'true');
        errorSpan.textContent = errorMessage;
      }
    }

    function clearError(inputId) {
      const input = document.getElementById(inputId);
      const errorSpan = document.getElementById(inputId + '-error');
      
      if (input && errorSpan) {
        input.setAttribute('aria-invalid', 'false');
        errorSpan.textContent = '';
      }
    }

    function validateField(inputId, validator, value) {
      const error = validator(value);
      if (error) {
        showError(inputId, error);
        return false;
      } else {
        clearError(inputId);
        return true;
      }
    }

    // Real-time validation on blur
    document.getElementById('name')?.addEventListener('blur', function(e) {
      validateField('name', validateName, e.target.value);
    });

    document.getElementById('email')?.addEventListener('blur', function(e) {
      validateField('email', validateEmail, e.target.value);
    });

    document.getElementById('message')?.addEventListener('blur', function(e) {
      validateField('message', validateMessage, e.target.value);
    });

    // Contact form submission handler
    document.querySelector('.contact-modern-form')?.addEventListener('submit', async function(e) {
      e.preventDefault();
      

      const form = e.target;
      const submitBtn = form.querySelector('.contact-modern-submit-btn');
      const btnText = submitBtn.querySelector('.contact-modern-btn-text');
      const btnSpinner = submitBtn.querySelector('.contact-modern-btn-spinner');
      const messageDiv = form.querySelector('.contact-modern-form-message');
      
      // Validate all fields before submission
      const formData = new FormData(form);
      const nameValid = validateField('name', validateName, formData.get('name'));
      const emailValid = validateField('email', validateEmail, formData.get('email'));
      const messageValid = validateField('message', validateMessage, formData.get('message'));
      
      if (!nameValid || !emailValid || !messageValid) {
        // Focus on first invalid field
        if (!nameValid) document.getElementById('name')?.focus();
        else if (!emailValid) document.getElementById('email')?.focus();
        else if (!messageValid) document.getElementById('message')?.focus();
        return;
      }
      
      // Disable form during submission
      submitBtn.disabled = true;
      btnText.style.display = 'none';
      btnSpinner.style.display = 'inline';
      messageDiv.style.display = 'none';
      
      try {
        const data = Object.fromEntries(formData);
        
        // Check if we're in preview mode (localhost or blob URL)
        const isPreview = window.location.hostname === 'localhost' || 
                         window.location.protocol === 'blob:' ||
                         window.location.href.includes('blob:');
        
        if (isPreview) {
          // Preview mode: Show info message instead of sending
          await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
          messageDiv.textContent = 'ℹ️ Önizleme modunda mesaj gönderimi devre dışıdır. Site yayınlandığında contact formu çalışacaktır.';
          messageDiv.className = 'form-message success';
          messageDiv.style.display = 'block';
          form.reset();
        } else {
          // Published site: Send real email
          const apiUrl = window.location.origin + '/api/contact';
          
          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          });
          
          const result = await response.json();
          
          if (!response.ok) {
            throw new Error(result.error || 'Gönderim başarısız');
          }
          
          // Success
          messageDiv.textContent = '✅ Mesajınız başarıyla gönderildi! En kısa sürede dönüş yapacağım.';
          messageDiv.className = 'form-message success';
          messageDiv.style.display = 'block';
          form.reset();
        }
        
      } catch (error) {
        // Error
        messageDiv.textContent = '❌ ' + (error.message || 'Bir hata oluştu. Lütfen tekrar deneyin.');
        messageDiv.className = 'form-message error';
        messageDiv.style.display = 'block';
      } finally {
        // Re-enable form
        submitBtn.disabled = false;
        btnText.style.display = 'inline';
        btnSpinner.style.display = 'none';
      }
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
          <!-- Honeypot field (hidden from users, visible to bots) -->
          <input type="text" name="honeypot" style="display:none" tabindex="-1" autocomplete="off">
          
          <!-- Hidden field for site owner email -->
          <input type="hidden" name="siteOwnerEmail" value="{{SITE_OWNER_EMAIL}}">
          
          <h3 class="split-form-title">Mesaj Gönderin</h3>
          
          <input 
            type="text" 
            id="split-name"
            placeholder="İsim" 
            name="name" 
            required 
            class="split-input"
            aria-required="true"
            aria-invalid="false"
            aria-describedby="split-name-error"
          >
          <span id="split-name-error" class="error-message" role="alert"></span>
          
          <input 
            type="email" 
            id="split-email"
            placeholder="Email" 
            name="email" 
            required 
            class="split-input"
            aria-required="true"
            aria-invalid="false"
            aria-describedby="split-email-error"
          >
          <span id="split-email-error" class="error-message" role="alert"></span>
          
          <textarea 
            id="split-message"
            placeholder="Mesajınız" 
            name="message" 
            rows="6" 
            required 
            class="split-input"
            aria-required="true"
            aria-invalid="false"
            aria-describedby="split-message-error"
            maxlength="5000"
          ></textarea>
          <span id="split-message-error" class="error-message" role="alert"></span>
          
          <button type="submit" class="split-submit">
            <span class="btn-text">Gönder</span>
            <span class="btn-spinner" style="display:none;">⏳</span>
          </button>
          
          <!-- Success/Error messages -->
          <div class="form-message-split" style="display:none;"></div>
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

    /* Error states */
    .split-input[aria-invalid="true"] {
      border-color: #dc3545;
      background-color: #fff5f5;
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

    .split-submit:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }

    .split-submit:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 5px 20px rgba(0,0,0,0.2);
    }

    .btn-spinner {
      margin-left: 8px;
    }

    .form-message-split {
      margin-top: 20px;
      padding: 15px;
      border-radius: 8px;
      text-align: center;
      font-weight: 500;
    }

    .form-message-split.success {
      background: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }

    .form-message-split.error {
      background: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }

    @media (max-width: 768px) {
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
    // Validation functions (same as Template 1)
    function validateName(name) {
      if (!name || name.trim().length === 0) {
        return 'İsim gereklidir';
      }
      if (name.trim().length < 2) {
        return 'İsim en az 2 karakter olmalıdır';
      }
      return '';
    }

    function validateEmail(email) {
      if (!email || email.trim().length === 0) {
        return 'Email gereklidir';
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return 'Geçerli bir email adresi giriniz';
      }
      return '';
    }

    function validateMessage(message) {
      if (!message || message.trim().length === 0) {
        return 'Mesaj gereklidir';
      }
      if (message.trim().length < 10) {
        return 'Mesaj en az 10 karakter olmalıdır';
      }
      if (message.length > 5000) {
        return 'Mesaj en fazla 5000 karakter olabilir';
      }
      return '';
    }

    function showError(inputId, errorMessage) {
      const input = document.getElementById(inputId);
      const errorSpan = document.getElementById(inputId + '-error');
      
      if (input && errorSpan) {
        input.setAttribute('aria-invalid', 'true');
        errorSpan.textContent = errorMessage;
      }
    }

    function clearError(inputId) {
      const input = document.getElementById(inputId);
      const errorSpan = document.getElementById(inputId + '-error');
      
      if (input && errorSpan) {
        input.setAttribute('aria-invalid', 'false');
        errorSpan.textContent = '';
      }
    }

    function validateField(inputId, validator, value) {
      const error = validator(value);
      if (error) {
        showError(inputId, error);
        return false;
      } else {
        clearError(inputId);
        return true;
      }
    }

    // Real-time validation on blur
    document.getElementById('split-name')?.addEventListener('blur', function(e) {
      validateField('split-name', validateName, e.target.value);
    });

    document.getElementById('split-email')?.addEventListener('blur', function(e) {
      validateField('split-email', validateEmail, e.target.value);
    });

    document.getElementById('split-message')?.addEventListener('blur', function(e) {
      validateField('split-message', validateMessage, e.target.value);
    });

    // Split contact form handler
    document.querySelector('.split-form')?.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const form = e.target;
      const submitBtn = form.querySelector('.split-submit');
      const btnText = submitBtn.querySelector('.btn-text');
      const btnSpinner = submitBtn.querySelector('.btn-spinner');
      const messageDiv = form.querySelector('.form-message-split');
      
      // Validate all fields before submission
      const formData = new FormData(form);
      const nameValid = validateField('split-name', validateName, formData.get('name'));
      const emailValid = validateField('split-email', validateEmail, formData.get('email'));
      const messageValid = validateField('split-message', validateMessage, formData.get('message'));
      
      if (!nameValid || !emailValid || !messageValid) {
        // Focus on first invalid field
        if (!nameValid) document.getElementById('split-name')?.focus();
        else if (!emailValid) document.getElementById('split-email')?.focus();
        else if (!messageValid) document.getElementById('split-message')?.focus();
        return;
      }
      
      // Disable form during submission
      submitBtn.disabled = true;
      btnText.style.display = 'none';
      btnSpinner.style.display = 'inline';
      messageDiv.style.display = 'none';
      
      try {
        const data = Object.fromEntries(formData);
        
        // Check if we're in preview mode (localhost or blob URL)
        const isPreview = window.location.hostname === 'localhost' || 
                         window.location.protocol === 'blob:' ||
                         window.location.href.includes('blob:');
        
        if (isPreview) {
          // Preview mode: Show info message instead of sending
          await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
          messageDiv.textContent = 'ℹ️ Önizleme modunda mesaj gönderimi devre dışıdır. Site yayınlandığında contact formu çalışacaktır.';
          messageDiv.className = 'form-message-split success';
          messageDiv.style.display = 'block';
          form.reset();
        } else {
          // Published site: Send real email
          const apiUrl = window.location.origin + '/api/contact';
          
          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          });
          
          const result = await response.json();
          
          if (!response.ok) {
            throw new Error(result.error || 'Gönderim başarısız');
          }
          
          // Success
          messageDiv.textContent = '✅ Teşekkürler! Mesajınız başarıyla gönderildi.';
          messageDiv.className = 'form-message-split success';
          messageDiv.style.display = 'block';
          form.reset();
        }
        
      } catch (error) {
        // Error
        messageDiv.textContent = '❌ ' + (error.message || 'Bir hata oluştu. Lütfen tekrar deneyin.');
        messageDiv.className = 'form-message-split error';
        messageDiv.style.display = 'block';
      } finally {
        // Re-enable form
        submitBtn.disabled = false;
        btnText.style.display = 'inline';
        btnSpinner.style.display = 'none';
      }
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
