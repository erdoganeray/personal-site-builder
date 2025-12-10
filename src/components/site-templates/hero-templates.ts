import { ComponentTemplate } from "@/types/templates";

/**
 * Hero section template'leri
 */

export const heroTemplate1: ComponentTemplate = {
  id: "hero-modern-centered",
  name: "Modern Centered Hero",
  category: "hero",
  htmlTemplate: `
    <section id="hero" class="hero-section" aria-label="Hero section" role="banner">
      <div class="hero-container">
        <div class="hero-image-wrapper" aria-hidden="true">
          <div class="hero-image">{{PROFILE_IMAGE}}</div>
        </div>
        <h1 class="hero-name">{{NAME}}</h1>
        <p class="hero-title" role="doc-subtitle">{{TITLE}}</p>
        <p class="hero-summary">{{SUMMARY}}</p>
        <nav class="hero-cta" aria-label="Primary actions">
          <a href="#contact" class="btn-primary" aria-label="Navigate to contact section">{{CTA_PRIMARY_TEXT}}</a>
          <a href="#about" class="btn-secondary" aria-label="Navigate to about section">{{CTA_SECONDARY_TEXT}}</a>
        </nav>
      </div>
    </section>
  `,
  cssTemplate: `
    .hero-section {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, {{COLOR_PRIMARY}}, {{COLOR_SECONDARY}});
      color: {{COLOR_TEXT}};
      padding: 2rem;
    }

    .hero-container {
      text-align: center;
      max-width: 800px;
    }

    .hero-image-wrapper {
      margin-bottom: 2rem;
    }

    .hero-image {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      margin: 0 auto;
      border: 4px solid {{COLOR_ACCENT}};
      background: {{COLOR_BACKGROUND}};
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 3rem;
      font-weight: 700;
      color: {{COLOR_TEXT}};
      overflow: hidden;
    }

    .hero-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .hero-name {
      font-size: 3rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }

    .hero-title {
      font-size: 1.5rem;
      color: {{COLOR_TEXT_SECONDARY}};
      margin-bottom: 1.5rem;
    }

    .hero-summary {
      font-size: 1.1rem;
      line-height: 1.6;
      margin-bottom: 2rem;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }

    .hero-cta {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    .btn-primary, .btn-secondary {
      padding: 0.75rem 2rem;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      transition: transform 0.3s, box-shadow 0.3s;
    }

    .btn-primary {
      background: {{COLOR_ACCENT}};
      color: white;
    }

    .btn-secondary {
      background: transparent;
      border: 2px solid {{COLOR_ACCENT}};
      color: {{COLOR_TEXT}};
    }

    .btn-primary:hover, .btn-secondary:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }

    /* Keyboard navigation focus styles */
    .btn-primary:focus,
    .btn-secondary:focus {
      outline: 3px solid {{COLOR_ACCENT}};
      outline-offset: 2px;
    }

    .btn-primary:focus-visible,
    .btn-secondary:focus-visible {
      outline: 3px solid {{COLOR_ACCENT}};
      outline-offset: 2px;
      box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.1);
    }

    /* Skip to content link for screen readers */
    .hero-section a.skip-to-content {
      position: absolute;
      top: -40px;
      left: 0;
      background: {{COLOR_ACCENT}};
      color: white;
      padding: 8px;
      text-decoration: none;
      z-index: 100;
    }

    .hero-section a.skip-to-content:focus {
      top: 0;
    }

    @media (max-width: 1024px) {
      .hero-name {
        font-size: 2.5rem;
      }

      .hero-title {
        font-size: 1.3rem;
      }
    }

    @media (max-width: 768px) {
      .hero-section {
        padding: 1.5rem;
      }

      .hero-name {
        font-size: 2rem;
      }

      .hero-title {
        font-size: 1.2rem;
      }

      .hero-summary {
        font-size: 1rem;
      }

      .hero-image {
        width: 120px;
        height: 120px;
        font-size: 2.5rem;
      }
    }

    @media (max-width: 480px) {
      .hero-name {
        font-size: 1.75rem;
      }

      .hero-title {
        font-size: 1.1rem;
      }

      .hero-summary {
        font-size: 0.95rem;
      }

      .hero-image {
        width: 100px;
        height: 100px;
        font-size: 2rem;
      }

      .btn-primary, .btn-secondary {
        padding: 0.6rem 1.5rem;
        font-size: 0.9rem;
      }
    }
  `,
  placeholders: [
    "{{NAME}}", "{{INITIALS}}", "{{TITLE}}", "{{SUMMARY}}", "{{PROFILE_IMAGE}}",
    "{{CTA_PRIMARY_TEXT}}", "{{CTA_SECONDARY_TEXT}}",
    "{{COLOR_PRIMARY}}", "{{COLOR_SECONDARY}}", "{{COLOR_ACCENT}}",
    "{{COLOR_BACKGROUND}}", "{{COLOR_TEXT}}", "{{COLOR_TEXT_SECONDARY}}"
  ],
  jsTemplate: `
    // Smooth scroll for CTA buttons
    document.querySelectorAll('.hero-section a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });

    // Scroll-triggered fade-in animation
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
      const heroContainer = heroSection.querySelector('.hero-container');
      
      // Add initial hidden state
      if (heroContainer) {
        heroContainer.style.opacity = '0';
        heroContainer.style.transform = 'translateY(20px)';
        heroContainer.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      }

      // Intersection Observer for fade-in
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const container = entry.target.querySelector('.hero-container');
            if (container) {
              container.style.opacity = '1';
              container.style.transform = 'translateY(0)';
            }
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });

      observer.observe(heroSection);
    }

    // Ripple effect on button click
    document.querySelectorAll('.btn-primary, .btn-secondary').forEach(button => {
      button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');

        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
      });
    });

    // Add ripple CSS dynamically
    const style = document.createElement('style');
    style.textContent = \`
      .btn-primary, .btn-secondary {
        position: relative;
        overflow: hidden;
      }
      .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
      }
      @keyframes ripple-animation {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }
    \`;
    document.head.appendChild(style);
  `
};

export const heroTemplate2: ComponentTemplate = {
  id: "hero-split-screen",
  name: "Split Screen Hero",
  category: "hero",
  htmlTemplate: `
    <section id="hero" class="hero-section-split" aria-label="Hero section" role="banner">
      <div class="hero-content">
        <h1 class="hero-name">{{NAME}}</h1>
        <p class="hero-title" role="doc-subtitle">{{TITLE}}</p>
        <p class="hero-summary">{{SUMMARY}}</p>
        <nav class="hero-cta" aria-label="Primary actions">
          <a href="#contact" class="btn-primary" aria-label="Navigate to contact section">{{CTA_PRIMARY_TEXT}}</a>
        </nav>
      </div>
      <div class="hero-visual" aria-hidden="true">
        <div class="hero-image">{{PROFILE_IMAGE}}</div>
      </div>
    </section>
  `,
  cssTemplate: `
    .hero-section-split {
      min-height: 100vh;
      display: grid;
      grid-template-columns: 1fr 1fr;
      background: {{COLOR_BACKGROUND}};
    }

    .hero-content {
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 3rem;
      background: {{COLOR_PRIMARY}};
      color: {{COLOR_TEXT}};
    }

    .hero-name {
      font-size: 3.5rem;
      font-weight: 700;
      margin-bottom: 1rem;
    }

    .hero-title {
      font-size: 1.75rem;
      color: {{COLOR_TEXT_SECONDARY}};
      margin-bottom: 2rem;
    }

    .hero-summary {
      font-size: 1.1rem;
      line-height: 1.8;
      margin-bottom: 2.5rem;
    }

    .hero-visual {
      display: flex;
      align-items: center;
      justify-content: center;
      background: {{COLOR_SECONDARY}};
    }

    .hero-image {
      width: 300px;
      height: 300px;
      border-radius: 20px;
      background: {{COLOR_ACCENT}};
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 5rem;
      font-weight: 700;
      color: white;
      overflow: hidden;
    }

    .hero-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    /* Button styles */
    .btn-primary {
      padding: 0.75rem 2rem;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      transition: transform 0.3s, box-shadow 0.3s;
      background: {{COLOR_ACCENT}};
      color: white;
      display: inline-block;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }

    /* Keyboard navigation focus styles */
    .btn-primary:focus {
      outline: 3px solid {{COLOR_ACCENT}};
      outline-offset: 2px;
    }

    .btn-primary:focus-visible {
      outline: 3px solid {{COLOR_ACCENT}};
      outline-offset: 2px;
      box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.1);
    }

    /* Skip to content link for screen readers */
    .hero-section-split a.skip-to-content {
      position: absolute;
      top: -40px;
      left: 0;
      background: {{COLOR_ACCENT}};
      color: white;
      padding: 8px;
      text-decoration: none;
      z-index: 100;
    }

    .hero-section-split a.skip-to-content:focus {
      top: 0;
    }

    @media (max-width: 768px) {
      .hero-section-split {
        grid-template-columns: 1fr;
      }
      
      .hero-content {
        padding: 2rem;
      }

      .hero-name {
        font-size: 2.5rem;
      }

      .hero-title {
        font-size: 1.4rem;
      }

      .hero-summary {
        font-size: 1rem;
      }

      .hero-image {
        width: 200px;
        height: 200px;
        font-size: 4rem;
      }
    }

    @media (max-width: 480px) {
      .hero-content {
        padding: 1.5rem;
      }

      .hero-name {
        font-size: 2rem;
      }

      .hero-title {
        font-size: 1.2rem;
      }

      .hero-summary {
        font-size: 0.95rem;
      }

      .hero-image {
        width: 150px;
        height: 150px;
        font-size: 3rem;
      }
    }
  `,
  placeholders: [
    "{{NAME}}", "{{INITIALS}}", "{{TITLE}}", "{{SUMMARY}}", "{{PROFILE_IMAGE}}",
    "{{CTA_PRIMARY_TEXT}}",
    "{{COLOR_PRIMARY}}", "{{COLOR_SECONDARY}}", "{{COLOR_ACCENT}}",
    "{{COLOR_BACKGROUND}}", "{{COLOR_TEXT}}", "{{COLOR_TEXT_SECONDARY}}"
  ],
  jsTemplate: `
    // Smooth scroll for CTA buttons
    document.querySelectorAll('.hero-section-split a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });

    // Scroll-triggered fade-in animation
    const heroSection = document.querySelector('.hero-section-split');
    if (heroSection) {
      const heroContent = heroSection.querySelector('.hero-content');
      const heroVisual = heroSection.querySelector('.hero-visual');
      
      // Add initial hidden state
      if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateX(-30px)';
        heroContent.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      }
      if (heroVisual) {
        heroVisual.style.opacity = '0';
        heroVisual.style.transform = 'translateX(30px)';
        heroVisual.style.transition = 'opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s';
      }

      // Intersection Observer for fade-in
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const content = entry.target.querySelector('.hero-content');
            const visual = entry.target.querySelector('.hero-visual');
            if (content) {
              content.style.opacity = '1';
              content.style.transform = 'translateX(0)';
            }
            if (visual) {
              visual.style.opacity = '1';
              visual.style.transform = 'translateX(0)';
            }
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });

      observer.observe(heroSection);
    }

    // Parallax effect on scroll (subtle movement)
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const heroVisual = document.querySelector('.hero-visual');
          if (heroVisual) {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.3;
            heroVisual.style.transform = \`translateY(\${rate}px)\`;
          }
          ticking = false;
        });
        ticking = true;
      }
    });

    // Ripple effect on button click
    document.querySelectorAll('.hero-section-split .btn-primary').forEach(button => {
      button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');

        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
      });
    });

    // Add ripple CSS dynamically (if not already added)
    if (!document.querySelector('#hero-split-ripple-style')) {
      const style = document.createElement('style');
      style.id = 'hero-split-ripple-style';
      style.textContent = \`
        .hero-section-split .btn-primary {
          position: relative;
          overflow: hidden;
        }
        .hero-section-split .ripple {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.6);
          transform: scale(0);
          animation: ripple-animation-split 0.6s ease-out;
          pointer-events: none;
        }
        @keyframes ripple-animation-split {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
      \`;
      document.head.appendChild(style);
    }
  `
};

export const heroTemplate3: ComponentTemplate = {
  id: "hero-minimal-text",
  name: "Minimal Text-Focused Hero",
  category: "hero",
  htmlTemplate: `
    <section id="hero" class="hero-minimal-text" aria-label="Hero section" role="banner">
      <div class="hero-minimal-container">
        <h1 class="hero-minimal-name">{{NAME}}</h1>
        <p class="hero-minimal-title" role="doc-subtitle">
          <span class="typing-text">{{TITLE}}</span>
          <span class="typing-cursor">|</span>
        </p>
        <p class="hero-minimal-tagline">{{SUMMARY}}</p>
        <nav class="hero-minimal-cta" aria-label="Primary actions">
          <a href="#contact" class="btn-minimal-primary" aria-label="Navigate to contact section">{{CTA_PRIMARY_TEXT}}</a>
        </nav>
      </div>
    </section>
  `,
  cssTemplate: `
    .hero-minimal-text {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, {{COLOR_PRIMARY}} 0%, {{COLOR_SECONDARY}} 100%);
      background-size: 200% 200%;
      animation: gradient-shift 15s ease infinite;
      color: {{COLOR_TEXT}};
      padding: 2rem;
      position: relative;
      overflow: hidden;
    }

    @keyframes gradient-shift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    .hero-minimal-container {
      text-align: center;
      max-width: 900px;
      z-index: 1;
    }

    .hero-minimal-name {
      font-size: 5rem;
      font-weight: 800;
      margin-bottom: 1rem;
      line-height: 1.1;
      letter-spacing: -0.02em;
      background: linear-gradient(135deg, {{COLOR_TEXT}} 0%, {{COLOR_ACCENT}} 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .hero-minimal-title {
      font-size: 2.5rem;
      font-weight: 300;
      margin-bottom: 2rem;
      color: {{COLOR_TEXT_SECONDARY}};
      min-height: 3.5rem;
    }

    .typing-text {
      display: inline-block;
    }

    .typing-cursor {
      display: inline-block;
      animation: blink 1s step-end infinite;
      margin-left: 2px;
    }

    @keyframes blink {
      0%, 50% { opacity: 1; }
      51%, 100% { opacity: 0; }
    }

    .hero-minimal-tagline {
      font-size: 1.25rem;
      line-height: 1.8;
      margin-bottom: 3rem;
      max-width: 700px;
      margin-left: auto;
      margin-right: auto;
      color: {{COLOR_TEXT}};
      opacity: 0.9;
    }

    .hero-minimal-cta {
      display: flex;
      justify-content: center;
      gap: 1.5rem;
    }

    .btn-minimal-primary {
      padding: 1rem 3rem;
      border-radius: 50px;
      text-decoration: none;
      font-weight: 600;
      font-size: 1.1rem;
      background: {{COLOR_ACCENT}};
      color: white;
      transition: all 0.3s ease;
      display: inline-block;
      position: relative;
      overflow: hidden;
    }

    .btn-minimal-primary:hover {
      transform: translateY(-3px);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    }

    .btn-minimal-primary:focus {
      outline: 3px solid {{COLOR_ACCENT}};
      outline-offset: 2px;
    }

    .btn-minimal-primary:focus-visible {
      outline: 3px solid {{COLOR_ACCENT}};
      outline-offset: 2px;
      box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.1);
    }

    /* Decorative elements */
    .hero-minimal-text::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
      animation: rotate-gradient 20s linear infinite;
      pointer-events: none;
    }

    @keyframes rotate-gradient {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @media (max-width: 1024px) {
      .hero-minimal-name {
        font-size: 4rem;
      }

      .hero-minimal-title {
        font-size: 2rem;
      }

      .hero-minimal-tagline {
        font-size: 1.1rem;
      }
    }

    @media (max-width: 768px) {
      .hero-minimal-text {
        padding: 1.5rem;
      }

      .hero-minimal-name {
        font-size: 3rem;
      }

      .hero-minimal-title {
        font-size: 1.5rem;
        min-height: 2.5rem;
      }

      .hero-minimal-tagline {
        font-size: 1rem;
      }

      .btn-minimal-primary {
        padding: 0.875rem 2.5rem;
        font-size: 1rem;
      }
    }

    @media (max-width: 480px) {
      .hero-minimal-name {
        font-size: 2.5rem;
      }

      .hero-minimal-title {
        font-size: 1.25rem;
        min-height: 2rem;
      }

      .hero-minimal-tagline {
        font-size: 0.95rem;
      }

      .btn-minimal-primary {
        padding: 0.75rem 2rem;
        font-size: 0.95rem;
      }
    }
  `,
  jsTemplate: `
    // Typing effect for title
    const typingText = document.querySelector('.hero-minimal-text .typing-text');
    if (typingText) {
      const originalText = typingText.textContent;
      typingText.textContent = '';
      
      let charIndex = 0;
      const typingSpeed = 100; // ms per character
      
      function typeCharacter() {
        if (charIndex < originalText.length) {
          typingText.textContent += originalText.charAt(charIndex);
          charIndex++;
          setTimeout(typeCharacter, typingSpeed);
        }
      }
      
      // Start typing after a short delay
      setTimeout(typeCharacter, 500);
    }

    // Smooth scroll for CTA button
    document.querySelectorAll('.hero-minimal-text a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });

    // Fade-in animation
    const heroMinimal = document.querySelector('.hero-minimal-text');
    if (heroMinimal) {
      const container = heroMinimal.querySelector('.hero-minimal-container');
      
      if (container) {
        container.style.opacity = '0';
        container.style.transform = 'translateY(30px)';
        container.style.transition = 'opacity 1s ease, transform 1s ease';
      }

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const cont = entry.target.querySelector('.hero-minimal-container');
            if (cont) {
              cont.style.opacity = '1';
              cont.style.transform = 'translateY(0)';
            }
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });

      observer.observe(heroMinimal);
    }

    // Ripple effect
    document.querySelectorAll('.btn-minimal-primary').forEach(button => {
      button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');

        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
      });
    });

    // Add ripple CSS
    if (!document.querySelector('#hero-minimal-ripple-style')) {
      const style = document.createElement('style');
      style.id = 'hero-minimal-ripple-style';
      style.textContent = \`
        .btn-minimal-primary {
          position: relative;
          overflow: hidden;
        }
        .btn-minimal-primary .ripple {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.6);
          transform: scale(0);
          animation: ripple-animation-minimal 0.6s ease-out;
          pointer-events: none;
        }
        @keyframes ripple-animation-minimal {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
      \`;
      document.head.appendChild(style);
    }
  `,
  placeholders: [
    "{{NAME}}", "{{TITLE}}", "{{SUMMARY}}",
    "{{CTA_PRIMARY_TEXT}}",
    "{{COLOR_PRIMARY}}", "{{COLOR_SECONDARY}}", "{{COLOR_ACCENT}}",
    "{{COLOR_TEXT}}", "{{COLOR_TEXT_SECONDARY}}"
  ]
};

export const heroTemplate4: ComponentTemplate = {
  id: "hero-animated-gradient",
  name: "Animated Gradient Background Hero",
  category: "hero",
  htmlTemplate: `
    <section id="hero" class="hero-animated-gradient" aria-label="Hero section" role="banner">
      <div class="gradient-bg"></div>
      <div class="floating-particles">
        <span class="particle"></span>
        <span class="particle"></span>
        <span class="particle"></span>
        <span class="particle"></span>
        <span class="particle"></span>
      </div>
      <div class="hero-gradient-container">
        <div class="hero-gradient-card">
          <div class="hero-gradient-image-wrapper" aria-hidden="true">
            <div class="hero-gradient-image">{{PROFILE_IMAGE}}</div>
          </div>
          <h1 class="hero-gradient-name">{{NAME}}</h1>
          <p class="hero-gradient-title" role="doc-subtitle">{{TITLE}}</p>
          <p class="hero-gradient-summary">{{SUMMARY}}</p>
          <nav class="hero-gradient-cta" aria-label="Primary actions">
            <a href="#contact" class="btn-gradient-primary" aria-label="Navigate to contact section">{{CTA_PRIMARY_TEXT}}</a>
            <a href="#about" class="btn-gradient-secondary" aria-label="Navigate to about section">{{CTA_SECONDARY_TEXT}}</a>
          </nav>
        </div>
      </div>
    </section>
  `,
  cssTemplate: `
    .hero-animated-gradient {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
      padding: 2rem;
    }

    /* Animated gradient background */
    .gradient-bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(45deg, {{COLOR_PRIMARY}}, {{COLOR_SECONDARY}}, {{COLOR_ACCENT}}, {{COLOR_PRIMARY}});
      background-size: 400% 400%;
      animation: gradient-animation 15s ease infinite;
      z-index: 0;
    }

    @keyframes gradient-animation {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    /* Floating particles */
    .floating-particles {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
      pointer-events: none;
    }

    .particle {
      position: absolute;
      width: 4px;
      height: 4px;
      background: rgba(255, 255, 255, 0.5);
      border-radius: 50%;
      animation: float 20s infinite;
    }

    .particle:nth-child(1) {
      left: 10%;
      top: 20%;
      animation-delay: 0s;
      animation-duration: 15s;
    }

    .particle:nth-child(2) {
      left: 80%;
      top: 80%;
      animation-delay: 2s;
      animation-duration: 18s;
    }

    .particle:nth-child(3) {
      left: 50%;
      top: 50%;
      animation-delay: 4s;
      animation-duration: 20s;
    }

    .particle:nth-child(4) {
      left: 30%;
      top: 70%;
      animation-delay: 1s;
      animation-duration: 22s;
    }

    .particle:nth-child(5) {
      left: 70%;
      top: 30%;
      animation-delay: 3s;
      animation-duration: 17s;
    }

    @keyframes float {
      0%, 100% {
        transform: translate(0, 0) scale(1);
        opacity: 0;
      }
      10% {
        opacity: 1;
      }
      90% {
        opacity: 1;
      }
      50% {
        transform: translate(50px, -50px) scale(1.5);
      }
    }

    /* Glassmorphism container */
    .hero-gradient-container {
      position: relative;
      z-index: 2;
      max-width: 700px;
      width: 100%;
    }

    .hero-gradient-card {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border-radius: 20px;
      padding: 3rem;
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      text-align: center;
      color: white;
    }

    .hero-gradient-image-wrapper {
      margin-bottom: 2rem;
    }

    .hero-gradient-image {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      margin: 0 auto;
      border: 4px solid rgba(255, 255, 255, 0.3);
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(5px);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 3rem;
      font-weight: 700;
      color: white;
      overflow: hidden;
    }

    .hero-gradient-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .hero-gradient-name {
      font-size: 3rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      color: white;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    }

    .hero-gradient-title {
      font-size: 1.5rem;
      color: rgba(255, 255, 255, 0.9);
      margin-bottom: 1.5rem;
      font-weight: 300;
    }

    .hero-gradient-summary {
      font-size: 1.1rem;
      line-height: 1.6;
      margin-bottom: 2rem;
      color: rgba(255, 255, 255, 0.85);
    }

    .hero-gradient-cta {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    .btn-gradient-primary,
    .btn-gradient-secondary {
      padding: 0.75rem 2rem;
      border-radius: 50px;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.3s ease;
      display: inline-block;
      position: relative;
      overflow: hidden;
    }

    .btn-gradient-primary {
      background: rgba(255, 255, 255, 0.9);
      color: {{COLOR_PRIMARY}};
    }

    .btn-gradient-secondary {
      background: transparent;
      border: 2px solid rgba(255, 255, 255, 0.5);
      color: white;
    }

    .btn-gradient-primary:hover {
      background: white;
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    }

    .btn-gradient-secondary:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: white;
      transform: translateY(-2px);
    }

    .btn-gradient-primary:focus,
    .btn-gradient-secondary:focus {
      outline: 3px solid rgba(255, 255, 255, 0.5);
      outline-offset: 2px;
    }

    .btn-gradient-primary:focus-visible,
    .btn-gradient-secondary:focus-visible {
      outline: 3px solid rgba(255, 255, 255, 0.5);
      outline-offset: 2px;
      box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.2);
    }

    @media (max-width: 1024px) {
      .hero-gradient-name {
        font-size: 2.5rem;
      }

      .hero-gradient-title {
        font-size: 1.3rem;
      }
    }

    @media (max-width: 768px) {
      .hero-animated-gradient {
        padding: 1.5rem;
      }

      .hero-gradient-card {
        padding: 2rem;
      }

      .hero-gradient-name {
        font-size: 2rem;
      }

      .hero-gradient-title {
        font-size: 1.2rem;
      }

      .hero-gradient-summary {
        font-size: 1rem;
      }

      .hero-gradient-image {
        width: 120px;
        height: 120px;
        font-size: 2.5rem;
      }
    }

    @media (max-width: 480px) {
      .hero-gradient-card {
        padding: 1.5rem;
      }

      .hero-gradient-name {
        font-size: 1.75rem;
      }

      .hero-gradient-title {
        font-size: 1.1rem;
      }

      .hero-gradient-summary {
        font-size: 0.95rem;
      }

      .hero-gradient-image {
        width: 100px;
        height: 100px;
        font-size: 2rem;
      }

      .btn-gradient-primary,
      .btn-gradient-secondary {
        padding: 0.6rem 1.5rem;
        font-size: 0.9rem;
      }
    }
  `,
  jsTemplate: `
    // Smooth scroll for CTA buttons
    document.querySelectorAll('.hero-animated-gradient a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });

    // Fade-in animation
    const heroGradient = document.querySelector('.hero-animated-gradient');
    if (heroGradient) {
      const card = heroGradient.querySelector('.hero-gradient-card');
      
      if (card) {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95) translateY(20px)';
        card.style.transition = 'opacity 1s ease, transform 1s ease';
      }

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const c = entry.target.querySelector('.hero-gradient-card');
            if (c) {
              c.style.opacity = '1';
              c.style.transform = 'scale(1) translateY(0)';
            }
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });

      observer.observe(heroGradient);
    }

    // Ripple effect
    document.querySelectorAll('.btn-gradient-primary, .btn-gradient-secondary').forEach(button => {
      button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');

        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
      });
    });

    // Add ripple CSS
    if (!document.querySelector('#hero-gradient-ripple-style')) {
      const style = document.createElement('style');
      style.id = 'hero-gradient-ripple-style';
      style.textContent = \`
        .btn-gradient-primary,
        .btn-gradient-secondary {
          position: relative;
          overflow: hidden;
        }
        .btn-gradient-primary .ripple,
        .btn-gradient-secondary .ripple {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.6);
          transform: scale(0);
          animation: ripple-animation-gradient 0.6s ease-out;
          pointer-events: none;
        }
        @keyframes ripple-animation-gradient {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
      \`;
      document.head.appendChild(style);
    }
  `,
  placeholders: [
    "{{NAME}}", "{{INITIALS}}", "{{TITLE}}", "{{SUMMARY}}", "{{PROFILE_IMAGE}}",
    "{{CTA_PRIMARY_TEXT}}", "{{CTA_SECONDARY_TEXT}}",
    "{{COLOR_PRIMARY}}", "{{COLOR_SECONDARY}}", "{{COLOR_ACCENT}}"
  ]
};

export const heroTemplates = [heroTemplate1, heroTemplate2, heroTemplate3, heroTemplate4];
