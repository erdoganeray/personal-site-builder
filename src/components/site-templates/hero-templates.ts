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
      <!-- Animated gradient background -->
      <div class="hero-bg-gradient"></div>
      <div class="hero-bg-mesh"></div>
      
      <!-- Floating particles -->
      <div class="hero-particles" aria-hidden="true">
        <span class="particle"></span>
        <span class="particle"></span>
        <span class="particle"></span>
        <span class="particle"></span>
        <span class="particle"></span>
        <span class="particle"></span>
      </div>
      
      <div class="hero-container">
        <div class="hero-image-wrapper" aria-hidden="true">
          <div class="hero-image-glow"></div>
          <div class="hero-image">{{PROFILE_IMAGE}}</div>
          <span class="hero-status-badge">🟢 Müsait</span>
        </div>
        <h1 class="hero-name">{{NAME}}</h1>
        <p class="hero-title" role="doc-subtitle">{{TITLE}}</p>
        <p class="hero-summary">{{SUMMARY}}</p>
        <nav class="hero-cta" aria-label="Primary actions">
          <a href="#contact" class="btn-primary" aria-label="Navigate to contact section">
            <span class="btn-text">{{CTA_PRIMARY_TEXT}}</span>
            <span class="btn-shimmer"></span>
          </a>
          <a href="#experience" class="btn-secondary" aria-label="Navigate to experience section">
            <span class="btn-text">{{CTA_SECONDARY_TEXT}}</span>
          </a>
        </nav>
        <div class="hero-social" aria-label="Social links">
          {{SOCIAL_LINKS}}
        </div>
      </div>
    </section>
  `,
  cssTemplate: `
    .hero-section {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      color: {{COLOR_TEXT}};
      padding: 2rem;
      position: relative;
      overflow: hidden;
    }

    /* Animated gradient background */
    .hero-bg-gradient {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, {{COLOR_PRIMARY}} 0%, {{COLOR_SECONDARY}} 50%, {{COLOR_PRIMARY}} 100%);
      background-size: 200% 200%;
      animation: gradient-shift 8s ease infinite;
      z-index: 0;
    }

    @keyframes gradient-shift {
      0%, 100% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
    }

    /* Mesh overlay for depth */
    .hero-bg-mesh {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: 
        radial-gradient(circle at 20% 30%, {{COLOR_ACCENT}}30 0%, transparent 40%),
        radial-gradient(circle at 80% 70%, {{COLOR_SECONDARY}}25 0%, transparent 35%),
        radial-gradient(circle at 50% 50%, {{COLOR_PRIMARY}}15 0%, transparent 50%);
      z-index: 1;
      pointer-events: none;
    }

    /* Floating particles */
    .hero-particles {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 2;
      pointer-events: none;
      overflow: hidden;
    }

    .particle {
      position: absolute;
      width: 6px;
      height: 6px;
      background: rgba(255, 255, 255, 0.4);
      border-radius: 50%;
      animation: float-particle 15s infinite ease-in-out;
    }

    .particle:nth-child(1) { left: 10%; top: 20%; animation-delay: 0s; animation-duration: 12s; }
    .particle:nth-child(2) { left: 20%; top: 80%; animation-delay: 2s; animation-duration: 18s; }
    .particle:nth-child(3) { left: 60%; top: 30%; animation-delay: 4s; animation-duration: 14s; }
    .particle:nth-child(4) { left: 80%; top: 60%; animation-delay: 1s; animation-duration: 16s; }
    .particle:nth-child(5) { left: 40%; top: 70%; animation-delay: 3s; animation-duration: 20s; }
    .particle:nth-child(6) { left: 70%; top: 15%; animation-delay: 5s; animation-duration: 13s; }

    @keyframes float-particle {
      0%, 100% { transform: translateY(0) translateX(0) scale(1); opacity: 0.4; }
      25% { transform: translateY(-30px) translateX(10px) scale(1.2); opacity: 0.8; }
      50% { transform: translateY(-60px) translateX(-10px) scale(0.8); opacity: 0.6; }
      75% { transform: translateY(-30px) translateX(15px) scale(1.1); opacity: 0.7; }
    }

    .hero-container {
      text-align: center;
      max-width: 800px;
      position: relative;
      z-index: 10;
    }

    .hero-image-wrapper {
      margin-bottom: 2rem;
      position: relative;
      display: inline-block;
    }

    /* Animated glow ring */
    .hero-image-glow {
      position: absolute;
      top: -8px;
      left: 50%;
      transform: translateX(-50%);
      width: 166px;
      height: 166px;
      border-radius: 50%;
      background: conic-gradient(from 0deg, {{COLOR_ACCENT}}, {{COLOR_SECONDARY}}, {{COLOR_PRIMARY}}, {{COLOR_ACCENT}});
      animation: glow-spin 4s linear infinite;
      filter: blur(3px);
      opacity: 0.8;
    }

    @keyframes glow-spin {
      0% { transform: translateX(-50%) rotate(0deg); }
      100% { transform: translateX(-50%) rotate(360deg); }
    }

    .hero-image {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      margin: 0 auto;
      border: 4px solid {{COLOR_BACKGROUND}};
      background: {{COLOR_BACKGROUND}};
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 3rem;
      font-weight: 700;
      color: {{COLOR_TEXT}};
      overflow: hidden;
      position: relative;
      z-index: 2;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    }

    .hero-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    /* Status badge */
    .hero-status-badge {
      position: absolute;
      bottom: 5px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(255, 255, 255, 0.95);
      color: #059669;
      font-size: 0.75rem;
      font-weight: 600;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      white-space: nowrap;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
      z-index: 3;
    }

    .hero-name {
      font-size: 3rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      background: linear-gradient(135deg, {{COLOR_TEXT}} 0%, {{COLOR_ACCENT}} 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .hero-title {
      font-size: 1.5rem;
      color: {{COLOR_TEXT_SECONDARY}};
      margin-bottom: 1.5rem;
      opacity: 0.9;
    }

    .hero-summary {
      font-size: 1.1rem;
      line-height: 1.6;
      margin-bottom: 2rem;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
      opacity: 0.85;
    }

    .hero-cta {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
      margin-bottom: 2rem;
    }

    .btn-primary, .btn-secondary {
      padding: 0.875rem 2.25rem;
      border-radius: 50px;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
    }

    .btn-text {
      position: relative;
      z-index: 2;
    }

    .btn-primary {
      background: {{COLOR_ACCENT}};
      color: white;
      box-shadow: 0 4px 15px {{COLOR_ACCENT}}50;
    }

    /* Shimmer effect on primary button */
    .btn-shimmer {
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
      animation: heroShimmer 3s infinite;
    }

    @keyframes heroShimmer {
      0% { left: -100%; }
      50%, 100% { left: 100%; }
    }

    .btn-secondary {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border: 2px solid rgba(255, 255, 255, 0.3);
      color: {{COLOR_TEXT}};
    }

    .btn-primary:hover {
      transform: translateY(-3px) scale(1.02);
      box-shadow: 0 8px 25px {{COLOR_ACCENT}}60;
    }

    .btn-secondary:hover {
      transform: translateY(-3px) scale(1.02);
      background: rgba(255, 255, 255, 0.2);
      border-color: {{COLOR_ACCENT}};
    }

    /* Social icons row */
    .hero-social {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    .hero-social a {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(5px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: {{COLOR_TEXT}};
      text-decoration: none;
      transition: all 0.3s ease;
    }

    .hero-social a:hover {
      background: {{COLOR_ACCENT}};
      border-color: {{COLOR_ACCENT}};
      transform: translateY(-3px);
      box-shadow: 0 5px 15px {{COLOR_ACCENT}}40;
    }

    .hero-social svg {
      width: 20px;
      height: 20px;
    }

    /* Keyboard navigation focus styles */
    .btn-primary:focus,
    .btn-secondary:focus,
    .hero-social a:focus {
      outline: 3px solid {{COLOR_ACCENT}};
      outline-offset: 2px;
    }

    .btn-primary:focus-visible,
    .btn-secondary:focus-visible,
    .hero-social a:focus-visible {
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

      .hero-image-glow {
        width: 136px;
        height: 136px;
      }

      .hero-social a {
        width: 40px;
        height: 40px;
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

      .hero-image-glow {
        width: 116px;
        height: 116px;
      }

      .btn-primary, .btn-secondary {
        padding: 0.7rem 1.75rem;
        font-size: 0.9rem;
      }

      .hero-social a {
        width: 36px;
        height: 36px;
      }

      .hero-social svg {
        width: 18px;
        height: 18px;
      }
    }

    /* Reduced motion preference */
    @media (prefers-reduced-motion: reduce) {
      .hero-bg-gradient,
      .hero-image-glow,
      .particle,
      .btn-shimmer {
        animation: none;
      }

      .btn-primary:hover,
      .btn-secondary:hover,
      .hero-social a:hover {
        transform: none;
      }
    }
  `,
  placeholders: [
    "{{NAME}}", "{{INITIALS}}", "{{TITLE}}", "{{SUMMARY}}", "{{PROFILE_IMAGE}}",
    "{{CTA_PRIMARY_TEXT}}", "{{CTA_SECONDARY_TEXT}}", "{{SOCIAL_LINKS}}",
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

    // Parallax scroll effect
    const heroSection = document.querySelector('.hero-section');
    const heroContainer = document.querySelector('.hero-container');
    const heroParticles = document.querySelector('.hero-particles');
    
    if (heroSection && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
      // Initial fade-in animation
      if (heroContainer) {
        heroContainer.style.opacity = '0';
        heroContainer.style.transform = 'translateY(30px)';
        heroContainer.style.transition = 'opacity 1s ease, transform 1s ease';
        
        setTimeout(() => {
          heroContainer.style.opacity = '1';
          heroContainer.style.transform = 'translateY(0)';
        }, 100);
      }

      // Parallax on scroll
      window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const heroHeight = heroSection.offsetHeight;
        
        if (scrolled < heroHeight) {
          const parallaxSpeed = 0.3;
          if (heroContainer) {
            heroContainer.style.transform = 'translateY(' + (scrolled * parallaxSpeed) + 'px)';
          }
          if (heroParticles) {
            heroParticles.style.transform = 'translateY(' + (scrolled * 0.15) + 'px)';
          }
        }
      });
    }

    // Ripple effect on button click
    document.querySelectorAll('.hero-section .btn-primary, .hero-section .btn-secondary').forEach(button => {
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
    if (!document.querySelector('#hero-modern-ripple-style')) {
      const style = document.createElement('style');
      style.id = 'hero-modern-ripple-style';
      style.textContent = \`
        .hero-section .btn-primary .ripple,
        .hero-section .btn-secondary .ripple {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.5);
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
    }

    // Mouse follow effect on hero image glow (desktop only)
    const heroImageWrapper = document.querySelector('.hero-image-wrapper');
    const heroImageGlow = document.querySelector('.hero-image-glow');
    
    if (heroImageWrapper && heroImageGlow && window.innerWidth > 768) {
      heroSection.addEventListener('mousemove', function(e) {
        const rect = heroImageWrapper.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const deltaX = (e.clientX - centerX) / 20;
        const deltaY = (e.clientY - centerY) / 20;
        
        heroImageGlow.style.transform = \`translateX(calc(-50% + \${deltaX}px)) rotate(\${deltaX * 2}deg)\`;
      });
    }
  `
};

export const heroTemplate2: ComponentTemplate = {
  id: "hero-split-screen",
  name: "Split Screen Hero",
  category: "hero",
  htmlTemplate: `
    <section id="hero" class="hero-section-split" aria-label="Hero section" role="banner">
      <!-- Left content side -->
      <div class="hero-content">
        <div class="hero-content-inner">
          <span class="hero-status-badge-split">🟢 Müsait</span>
          <h1 class="hero-name-split">{{NAME}}</h1>
          <p class="hero-title-split" role="doc-subtitle">{{TITLE}}</p>
          <p class="hero-summary-split">{{SUMMARY}}</p>
          <nav class="hero-cta-split" aria-label="Primary actions">
            <a href="#contact" class="btn-split-primary" aria-label="Navigate to contact section">
              <span class="btn-text">{{CTA_PRIMARY_TEXT}}</span>
            </a>
            <a href="#experience" class="btn-split-secondary" aria-label="Navigate to experience section">
              <span class="btn-text">{{CTA_SECONDARY_TEXT}}</span>
            </a>
          </nav>
          <div class="hero-social-split" aria-label="Social links">
            {{SOCIAL_LINKS}}
          </div>
        </div>
      </div>
      
      <!-- Diagonal divider -->
      <div class="hero-diagonal-divider" aria-hidden="true"></div>
      
      <!-- Right visual side -->
      <div class="hero-visual-split" aria-hidden="true">
        <!-- Floating decorative elements -->
        <div class="floating-decor floating-decor-1"></div>
        <div class="floating-decor floating-decor-2"></div>
        <div class="floating-decor floating-decor-3"></div>
        
        <div class="hero-image-container-split">
          <div class="hero-image-glow-split"></div>
          <div class="hero-image-split">{{PROFILE_IMAGE}}</div>
        </div>
      </div>
    </section>
  `,
  cssTemplate: `
    .hero-section-split {
      min-height: 100vh;
      display: grid;
      grid-template-columns: 1fr 1fr;
      position: relative;
      overflow: hidden;
    }

    /* Left content side */
    .hero-content {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 4rem 3rem;
      background: linear-gradient(135deg, {{COLOR_PRIMARY}} 0%, {{COLOR_SECONDARY}} 100%);
      color: {{COLOR_TEXT}};
      position: relative;
      z-index: 2;
    }

    .hero-content-inner {
      max-width: 500px;
    }

    /* Status badge */
    .hero-status-badge-split {
      display: inline-block;
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(10px);
      color: {{COLOR_TEXT}};
      font-size: 0.85rem;
      font-weight: 500;
      padding: 0.5rem 1rem;
      border-radius: 50px;
      margin-bottom: 1.5rem;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .hero-name-split {
      font-size: 3.5rem;
      font-weight: 800;
      margin-bottom: 0.75rem;
      line-height: 1.1;
      letter-spacing: -0.02em;
    }

    .hero-title-split {
      font-size: 1.5rem;
      color: {{COLOR_TEXT_SECONDARY}};
      margin-bottom: 1.5rem;
      opacity: 0.9;
    }

    .hero-summary-split {
      font-size: 1.1rem;
      line-height: 1.8;
      margin-bottom: 2rem;
      opacity: 0.85;
    }

    .hero-cta-split {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      margin-bottom: 2rem;
    }

    .btn-split-primary,
    .btn-split-secondary {
      padding: 0.9rem 2rem;
      border-radius: 50px;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
    }

    .btn-split-primary {
      background: rgba(255, 255, 255, 0.95);
      color: {{COLOR_PRIMARY}};
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    }

    .btn-split-primary:hover {
      transform: translateY(-3px) scale(1.02);
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
    }

    .btn-split-secondary {
      background: transparent;
      border: 2px solid rgba(255, 255, 255, 0.4);
      color: {{COLOR_TEXT}};
    }

    .btn-split-secondary:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.7);
      transform: translateY(-3px);
    }

    /* Social icons */
    .hero-social-split {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    .hero-social-split a {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 42px;
      height: 42px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: {{COLOR_TEXT}};
      text-decoration: none;
      transition: all 0.3s ease;
    }

    .hero-social-split a:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);
    }

    .hero-social-split svg {
      width: 18px;
      height: 18px;
    }

    /* Diagonal divider */
    .hero-diagonal-divider {
      position: absolute;
      top: 0;
      left: 50%;
      width: 150px;
      height: 100%;
      background: linear-gradient(135deg, {{COLOR_PRIMARY}} 0%, {{COLOR_SECONDARY}} 100%);
      transform: translateX(-50%) skewX(-5deg);
      z-index: 3;
    }

    /* Right visual side */
    .hero-visual-split {
      display: flex;
      align-items: center;
      justify-content: center;
      background: {{COLOR_BACKGROUND}};
      position: relative;
      z-index: 1;
    }

    /* Floating decorative elements */
    .floating-decor {
      position: absolute;
      border-radius: 50%;
      opacity: 0.15;
      animation: float-decor 8s ease-in-out infinite;
    }

    .floating-decor-1 {
      width: 200px;
      height: 200px;
      background: {{COLOR_PRIMARY}};
      top: 10%;
      right: 10%;
      animation-delay: 0s;
    }

    .floating-decor-2 {
      width: 120px;
      height: 120px;
      background: {{COLOR_ACCENT}};
      bottom: 20%;
      right: 25%;
      animation-delay: 2s;
    }

    .floating-decor-3 {
      width: 80px;
      height: 80px;
      background: {{COLOR_SECONDARY}};
      top: 40%;
      right: 5%;
      animation-delay: 4s;
    }

    @keyframes float-decor {
      0%, 100% { transform: translateY(0) scale(1); }
      50% { transform: translateY(-20px) scale(1.05); }
    }

    /* Profile image container */
    .hero-image-container-split {
      position: relative;
      z-index: 2;
    }

    .hero-image-glow-split {
      position: absolute;
      top: -15px;
      left: -15px;
      right: -15px;
      bottom: -15px;
      border-radius: 25px;
      background: linear-gradient(135deg, {{COLOR_PRIMARY}}40, {{COLOR_ACCENT}}40);
      filter: blur(20px);
      animation: pulse-glow 3s ease-in-out infinite;
    }

    @keyframes pulse-glow {
      0%, 100% { opacity: 0.6; transform: scale(1); }
      50% { opacity: 0.8; transform: scale(1.02); }
    }

    .hero-image-split {
      width: 320px;
      height: 320px;
      border-radius: 20px;
      background: {{COLOR_SURFACE}};
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 5rem;
      font-weight: 700;
      color: {{COLOR_TEXT}};
      overflow: hidden;
      position: relative;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      border: 4px solid {{COLOR_BACKGROUND}};
    }

    .hero-image-split img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    /* Focus styles */
    .btn-split-primary:focus,
    .btn-split-secondary:focus,
    .hero-social-split a:focus {
      outline: 3px solid rgba(255, 255, 255, 0.5);
      outline-offset: 2px;
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .hero-name-split {
        font-size: 2.75rem;
      }

      .hero-title-split {
        font-size: 1.3rem;
      }

      .hero-image-split {
        width: 280px;
        height: 280px;
      }

      .hero-diagonal-divider {
        width: 100px;
      }
    }

    @media (max-width: 768px) {
      .hero-section-split {
        grid-template-columns: 1fr;
        grid-template-rows: auto 1fr;
      }

      .hero-diagonal-divider {
        display: none;
      }

      .hero-visual-split {
        order: -1;
        padding: 3rem 2rem 2rem;
        min-height: auto;
      }

      .hero-content {
        padding: 2rem;
        text-align: center;
      }

      .hero-content-inner {
        max-width: 100%;
      }

      .hero-name-split {
        font-size: 2.25rem;
      }

      .hero-title-split {
        font-size: 1.2rem;
      }

      .hero-summary-split {
        font-size: 1rem;
      }

      .hero-image-split {
        width: 200px;
        height: 200px;
        font-size: 4rem;
      }

      .hero-cta-split {
        justify-content: center;
      }

      .hero-social-split {
        justify-content: center;
      }

      .floating-decor {
        display: none;
      }
    }

    @media (max-width: 480px) {
      .hero-content {
        padding: 1.5rem;
      }

      .hero-name-split {
        font-size: 1.85rem;
      }

      .hero-title-split {
        font-size: 1.1rem;
      }

      .hero-image-split {
        width: 160px;
        height: 160px;
        font-size: 3rem;
      }

      .btn-split-primary,
      .btn-split-secondary {
        padding: 0.75rem 1.5rem;
        font-size: 0.9rem;
      }

      .hero-cta-split {
        flex-direction: column;
        width: 100%;
      }

      .btn-split-primary,
      .btn-split-secondary {
        width: 100%;
        text-align: center;
      }
    }

    /* Reduced motion */
    @media (prefers-reduced-motion: reduce) {
      .floating-decor,
      .hero-image-glow-split {
        animation: none;
      }

      .btn-split-primary:hover,
      .btn-split-secondary:hover,
      .hero-social-split a:hover {
        transform: none;
      }
    }
  `,
  placeholders: [
    "{{NAME}}", "{{INITIALS}}", "{{TITLE}}", "{{SUMMARY}}", "{{PROFILE_IMAGE}}",
    "{{CTA_PRIMARY_TEXT}}", "{{CTA_SECONDARY_TEXT}}", "{{SOCIAL_LINKS}}",
    "{{COLOR_PRIMARY}}", "{{COLOR_SECONDARY}}", "{{COLOR_ACCENT}}",
    "{{COLOR_BACKGROUND}}", "{{COLOR_SURFACE}}", "{{COLOR_TEXT}}", "{{COLOR_TEXT_SECONDARY}}"
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

    // Reveal animation on load
    const heroSplit = document.querySelector('.hero-section-split');
    if (heroSplit && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
      const heroContent = heroSplit.querySelector('.hero-content-inner');
      const heroVisual = heroSplit.querySelector('.hero-image-container-split');
      
      // Initial hidden state
      if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateX(-40px)';
        heroContent.style.transition = 'opacity 0.8s ease, transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
      }
      if (heroVisual) {
        heroVisual.style.opacity = '0';
        heroVisual.style.transform = 'translateX(40px) scale(0.95)';
        heroVisual.style.transition = 'opacity 0.8s ease 0.2s, transform 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.2s';
      }

      // Trigger animation after short delay
      setTimeout(() => {
        if (heroContent) {
          heroContent.style.opacity = '1';
          heroContent.style.transform = 'translateX(0)';
        }
        if (heroVisual) {
          heroVisual.style.opacity = '1';
          heroVisual.style.transform = 'translateX(0) scale(1)';
        }
      }, 100);

      // Parallax effect on scroll (desktop only)
      if (window.innerWidth > 768) {
        window.addEventListener('scroll', function() {
          const scrolled = window.pageYOffset;
          const heroHeight = heroSplit.offsetHeight;
          
          if (scrolled < heroHeight && heroVisual) {
            const parallaxSpeed = 0.2;
            heroVisual.style.transform = 'translateY(' + (scrolled * parallaxSpeed) + 'px)';
          }
        });
      }
    }

    // Ripple effect on button click
    document.querySelectorAll('.hero-section-split .btn-split-primary, .hero-section-split .btn-split-secondary').forEach(button => {
      button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple-split');

        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
      });
    });

    // Add ripple CSS dynamically
    if (!document.querySelector('#hero-split-ripple-style')) {
      const style = document.createElement('style');
      style.id = 'hero-split-ripple-style';
      style.textContent = \`
        .hero-section-split .btn-split-primary,
        .hero-section-split .btn-split-secondary {
          position: relative;
          overflow: hidden;
        }
        .ripple-split {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.5);
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
        <h1 class="hero-minimal-name">
          <span class="name-text">{{NAME}}</span>
          <span class="name-underline" aria-hidden="true"></span>
        </h1>
        <p class="hero-minimal-title" role="doc-subtitle">
          <span class="title-text">{{TITLE}}</span>
        </p>
        <p class="hero-minimal-tagline">{{SUMMARY}}</p>
        <nav class="hero-minimal-cta" aria-label="Primary actions">
          <a href="#contact" class="btn-minimal-primary" aria-label="Navigate to contact section">
            <span class="btn-text">{{CTA_PRIMARY_TEXT}}</span>
            <span class="btn-shine" aria-hidden="true"></span>
          </a>
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

    /* Animated Name with Underline */
    .hero-minimal-name {
      font-size: 5rem;
      font-weight: 800;
      margin-bottom: 1.5rem;
      line-height: 1.1;
      letter-spacing: -0.02em;
      position: relative;
      display: inline-block;
    }

    .name-text {
      background: linear-gradient(135deg, {{COLOR_TEXT}} 0%, {{COLOR_ACCENT}} 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      position: relative;
      z-index: 1;
    }

    .name-underline {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 6px;
      background: linear-gradient(90deg, {{COLOR_ACCENT}}, {{COLOR_SECONDARY}}, {{COLOR_ACCENT}});
      background-size: 200% 100%;
      border-radius: 3px;
      animation: underline-shimmer 3s ease-in-out infinite;
      transform: scaleX(0);
      transform-origin: left;
    }

    .name-underline.animated {
      animation: underline-reveal 0.8s ease forwards, underline-shimmer 3s ease-in-out 0.8s infinite;
    }

    @keyframes underline-reveal {
      0% { transform: scaleX(0); }
      100% { transform: scaleX(1); }
    }

    @keyframes underline-shimmer {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    /* Title with highlight effect */
    .hero-minimal-title {
      font-size: 2rem;
      font-weight: 400;
      margin-bottom: 2rem;
      color: {{COLOR_TEXT_SECONDARY}};
      position: relative;
      display: inline-block;
    }

    .title-text {
      position: relative;
      font-weight: 600;
      color: {{COLOR_ACCENT}};
      display: inline-block;
      padding-bottom: 8px;
    }

    .title-text::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 3px;
      background: linear-gradient(90deg, {{COLOR_ACCENT}}, {{COLOR_SECONDARY}});
      border-radius: 2px;
      animation: highlight-width 2s ease-in-out infinite alternate;
    }

    @keyframes highlight-width {
      0% { transform: scaleX(0.6); opacity: 0.6; }
      100% { transform: scaleX(1); opacity: 1; }
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

    .btn-text {
      position: relative;
      z-index: 1;
    }

    .btn-shine {
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.3),
        transparent
      );
      transition: left 0.5s ease;
    }

    .btn-minimal-primary:hover .btn-shine {
      left: 100%;
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
        font-size: 1.75rem;
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

      .name-underline {
        height: 4px;
      }

      .hero-minimal-title {
        font-size: 1.35rem;
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
        font-size: 1.1rem;
      }

      .hero-minimal-tagline {
        font-size: 0.95rem;
      }

      .btn-minimal-primary {
        padding: 0.75rem 2rem;
        font-size: 0.95rem;
      }
    }

    /* Reduced motion preference */
    @media (prefers-reduced-motion: reduce) {
      .hero-minimal-text,
      .name-underline,
      .title-text::after,
      .hero-minimal-text::before {
        animation: none;
      }

      .name-underline {
        transform: scaleX(1);
      }

      .title-text::after {
        transform: scaleX(1);
        opacity: 1;
      }

      .btn-minimal-primary:hover {
        transform: none;
      }

      .btn-shine {
        display: none;
      }
    }
  `,
  jsTemplate: `
    // Animated Underline Effect
    const nameUnderline = document.querySelector('.hero-minimal-text .name-underline');
    if (nameUnderline && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
      setTimeout(() => {
        nameUnderline.classList.add('animated');
      }, 500);
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
      
      if (container && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
        container.style.opacity = '0';
        container.style.transform = 'translateY(30px)';
        container.style.transition = 'opacity 1s ease, transform 1s ease';

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
      <!-- Aurora/Northern Lights Background -->
      <div class="aurora-bg">
        <div class="aurora-layer aurora-layer-1"></div>
        <div class="aurora-layer aurora-layer-2"></div>
        <div class="aurora-layer aurora-layer-3"></div>
      </div>
      
      <!-- Noise texture overlay -->
      <div class="noise-overlay" aria-hidden="true"></div>
      
      <!-- Floating particles -->
      <div class="floating-particles">
        <span class="particle"></span>
        <span class="particle"></span>
        <span class="particle"></span>
        <span class="particle"></span>
        <span class="particle"></span>
        <span class="particle"></span>
        <span class="particle"></span>
      </div>
      
      <div class="hero-gradient-container">
        <div class="hero-gradient-card" data-tilt>
          <div class="card-glow"></div>
          <div class="hero-gradient-image-wrapper" aria-hidden="true">
            <div class="hero-gradient-image">{{PROFILE_IMAGE}}</div>
          </div>
          <h1 class="hero-gradient-name">{{NAME}}</h1>
          <p class="hero-gradient-title" role="doc-subtitle">{{TITLE}}</p>
          <p class="hero-gradient-summary">{{SUMMARY}}</p>
          <nav class="hero-gradient-cta" aria-label="Primary actions">
            <a href="#contact" class="btn-gradient-primary" aria-label="Navigate to contact section">
              <span class="btn-text">{{CTA_PRIMARY_TEXT}}</span>
              <span class="btn-shine"></span>
            </a>
            <a href="#experience" class="btn-gradient-secondary" aria-label="Navigate to experience section">
              <span class="btn-text">{{CTA_SECONDARY_TEXT}}</span>
            </a>
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
      background: {{COLOR_PRIMARY}};
    }

    /* Aurora/Northern Lights Background */
    .aurora-bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 0;
      overflow: hidden;
    }

    .aurora-layer {
      position: absolute;
      width: 200%;
      height: 200%;
      top: -50%;
      left: -50%;
      opacity: 0.6;
      filter: blur(80px);
    }

    .aurora-layer-1 {
      background: radial-gradient(ellipse at 30% 20%, {{COLOR_ACCENT}}90 0%, transparent 50%),
                  radial-gradient(ellipse at 70% 80%, {{COLOR_SECONDARY}}80 0%, transparent 45%);
      animation: aurora-drift-1 18s ease-in-out infinite;
    }

    .aurora-layer-2 {
      background: radial-gradient(ellipse at 60% 40%, {{COLOR_PRIMARY}}70 0%, transparent 55%),
                  radial-gradient(ellipse at 20% 70%, {{COLOR_ACCENT}}60 0%, transparent 40%);
      animation: aurora-drift-2 22s ease-in-out infinite;
      animation-delay: -5s;
    }

    .aurora-layer-3 {
      background: radial-gradient(ellipse at 80% 60%, {{COLOR_SECONDARY}}50 0%, transparent 45%),
                  radial-gradient(ellipse at 40% 30%, {{COLOR_PRIMARY}}40 0%, transparent 50%);
      animation: aurora-drift-3 25s ease-in-out infinite;
      animation-delay: -10s;
    }

    @keyframes aurora-drift-1 {
      0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
      25% { transform: translate(5%, 3%) rotate(3deg) scale(1.05); }
      50% { transform: translate(-3%, 5%) rotate(-2deg) scale(0.95); }
      75% { transform: translate(3%, -3%) rotate(2deg) scale(1.02); }
    }

    @keyframes aurora-drift-2 {
      0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
      25% { transform: translate(-4%, 4%) rotate(-3deg) scale(1.03); }
      50% { transform: translate(5%, -3%) rotate(4deg) scale(0.97); }
      75% { transform: translate(-2%, 2%) rotate(-1deg) scale(1.04); }
    }

    @keyframes aurora-drift-3 {
      0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
      25% { transform: translate(3%, -5%) rotate(2deg) scale(0.98); }
      50% { transform: translate(-4%, 3%) rotate(-3deg) scale(1.06); }
      75% { transform: translate(4%, 4%) rotate(1deg) scale(0.96); }
    }

    /* Noise texture overlay */
    .noise-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
      pointer-events: none;
      opacity: 0.03;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
    }

    /* Floating particles */
    .floating-particles {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 2;
      pointer-events: none;
    }

    .particle {
      position: absolute;
      width: 4px;
      height: 4px;
      background: rgba(255, 255, 255, 0.6);
      border-radius: 50%;
      box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
      animation: float-aurora 20s infinite;
    }

    .particle:nth-child(1) { left: 10%; top: 20%; animation-delay: 0s; animation-duration: 18s; }
    .particle:nth-child(2) { left: 85%; top: 75%; animation-delay: 2s; animation-duration: 22s; }
    .particle:nth-child(3) { left: 45%; top: 45%; animation-delay: 4s; animation-duration: 16s; }
    .particle:nth-child(4) { left: 25%; top: 80%; animation-delay: 1s; animation-duration: 24s; }
    .particle:nth-child(5) { left: 75%; top: 25%; animation-delay: 3s; animation-duration: 20s; }
    .particle:nth-child(6) { left: 60%; top: 60%; animation-delay: 5s; animation-duration: 19s; }
    .particle:nth-child(7) { left: 15%; top: 55%; animation-delay: 2.5s; animation-duration: 21s; }

    @keyframes float-aurora {
      0%, 100% {
        transform: translate(0, 0) scale(1);
        opacity: 0;
      }
      5% { opacity: 0.8; }
      50% {
        transform: translate(40px, -60px) scale(1.4);
        opacity: 0.6;
      }
      95% { opacity: 0.8; }
    }

    /* Glassmorphism container */
    .hero-gradient-container {
      position: relative;
      z-index: 3;
      max-width: 700px;
      width: 100%;
      perspective: 1000px;
    }

    .hero-gradient-card {
      background: rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-radius: 24px;
      padding: 3rem;
      border: 1px solid rgba(255, 255, 255, 0.15);
      box-shadow: 
        0 8px 32px rgba(0, 0, 0, 0.15),
        inset 0 1px 0 rgba(255, 255, 255, 0.2);
      text-align: center;
      color: white;
      transform-style: preserve-3d;
      transition: transform 0.1s ease-out, box-shadow 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .hero-gradient-card:hover {
      box-shadow: 
        0 20px 60px rgba(0, 0, 0, 0.25),
        inset 0 1px 0 rgba(255, 255, 255, 0.25);
    }

    /* Card glow effect */
    .card-glow {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255, 255, 255, 0.15) 0%, transparent 50%);
      pointer-events: none;
      z-index: 0;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .hero-gradient-card:hover .card-glow {
      opacity: 1;
    }

    .hero-gradient-image-wrapper {
      margin-bottom: 2rem;
      position: relative;
      z-index: 1;
    }

    .hero-gradient-image {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      margin: 0 auto;
      border: 4px solid rgba(255, 255, 255, 0.25);
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(5px);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 3rem;
      font-weight: 700;
      color: white;
      overflow: hidden;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .hero-gradient-card:hover .hero-gradient-image {
      transform: translateZ(30px);
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.25);
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
      text-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
      position: relative;
      z-index: 1;
      transition: transform 0.3s ease;
    }

    .hero-gradient-card:hover .hero-gradient-name {
      transform: translateZ(20px);
    }

    .hero-gradient-title {
      font-size: 1.5rem;
      color: rgba(255, 255, 255, 0.9);
      margin-bottom: 1.5rem;
      font-weight: 300;
      position: relative;
      z-index: 1;
      transition: transform 0.3s ease;
    }

    .hero-gradient-card:hover .hero-gradient-title {
      transform: translateZ(15px);
    }

    .hero-gradient-summary {
      font-size: 1.1rem;
      line-height: 1.6;
      margin-bottom: 2rem;
      color: rgba(255, 255, 255, 0.85);
      position: relative;
      z-index: 1;
      transition: transform 0.3s ease;
    }

    .hero-gradient-card:hover .hero-gradient-summary {
      transform: translateZ(10px);
    }

    .hero-gradient-cta {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
      position: relative;
      z-index: 1;
    }

    .btn-gradient-primary,
    .btn-gradient-secondary {
      padding: 0.875rem 2.25rem;
      border-radius: 50px;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      display: inline-block;
      position: relative;
      overflow: hidden;
    }

    .btn-text {
      position: relative;
      z-index: 2;
    }

    .btn-gradient-primary {
      background: rgba(255, 255, 255, 0.95);
      color: {{COLOR_PRIMARY}};
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    }

    /* Shine effect on primary button */
    .btn-shine {
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
      animation: btn-shine 3s infinite;
    }

    @keyframes btn-shine {
      0% { left: -100%; }
      50%, 100% { left: 100%; }
    }

    .btn-gradient-secondary {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(5px);
      border: 2px solid rgba(255, 255, 255, 0.4);
      color: white;
    }

    .btn-gradient-primary:hover {
      background: white;
      transform: translateY(-3px) scale(1.02);
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.25);
    }

    .btn-gradient-secondary:hover {
      background: rgba(255, 255, 255, 0.2);
      border-color: rgba(255, 255, 255, 0.8);
      transform: translateY(-3px) scale(1.02);
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

      /* Disable 3D tilt on mobile */
      .hero-gradient-card:hover {
        transform: none !important;
      }

      .hero-gradient-card:hover .hero-gradient-image,
      .hero-gradient-card:hover .hero-gradient-name,
      .hero-gradient-card:hover .hero-gradient-title,
      .hero-gradient-card:hover .hero-gradient-summary {
        transform: none;
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
        padding: 0.7rem 1.75rem;
        font-size: 0.9rem;
      }
    }

    /* Reduced motion preference */
    @media (prefers-reduced-motion: reduce) {
      .aurora-layer,
      .particle,
      .btn-shine {
        animation: none;
      }

      .hero-gradient-card,
      .hero-gradient-image,
      .hero-gradient-name,
      .hero-gradient-title,
      .hero-gradient-summary {
        transition: none;
        transform: none !important;
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

    // 3D Tilt effect for card
    const heroGradient = document.querySelector('.hero-animated-gradient');
    const card = document.querySelector('.hero-gradient-card[data-tilt]');
    const cardGlow = document.querySelector('.card-glow');
    
    if (card && window.innerWidth > 768 && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
      let bounds;
      
      function rotateToMouse(e) {
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        const leftX = mouseX - bounds.x;
        const topY = mouseY - bounds.y;
        const center = {
          x: leftX - bounds.width / 2,
          y: topY - bounds.height / 2
        };
        const distance = Math.sqrt(center.x**2 + center.y**2);
        
        card.style.transform = \`
          perspective(1000px)
          rotateX(\${center.y / -40}deg)
          rotateY(\${center.x / 40}deg)
        \`;
        
        // Update glow position
        const percentX = (leftX / bounds.width) * 100;
        const percentY = (topY / bounds.height) * 100;
        card.style.setProperty('--mouse-x', percentX + '%');
        card.style.setProperty('--mouse-y', percentY + '%');
      }
      
      card.addEventListener('mouseenter', () => {
        bounds = card.getBoundingClientRect();
        document.addEventListener('mousemove', rotateToMouse);
      });
      
      card.addEventListener('mouseleave', () => {
        document.removeEventListener('mousemove', rotateToMouse);
        card.style.transform = '';
        card.style.setProperty('--mouse-x', '50%');
        card.style.setProperty('--mouse-y', '50%');
      });
    }

    // Fade-in animation
    if (heroGradient) {
      if (card) {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95) translateY(30px)';
        card.style.transition = 'opacity 1s ease, transform 1s ease';
      }

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const c = entry.target.querySelector('.hero-gradient-card');
            if (c) {
              setTimeout(() => {
                c.style.opacity = '1';
                c.style.transform = 'scale(1) translateY(0)';
              }, 100);
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

/**
 * Hero Template 5 - Fullscreen Background with Stock Photo
 * Stok fotoğraf destekli tam ekran arka plan görselli hero section
 */
export const heroTemplate5: ComponentTemplate = {
  id: "hero-fullscreen-bg",
  name: "Fullscreen Background Hero",
  category: "hero",
  htmlTemplate: `
    <section id="hero" class="hero-fullscreen-bg" aria-label="Hero section" role="banner">
      <div class="hero-bg-wrapper" aria-hidden="true">
        <img 
          src="{{STOCK_IMAGE:hero}}" 
          alt="{{STOCK_IMAGE_ALT:hero}}" 
          class="hero-bg-image"
          loading="eager"
        />
        <!-- Duotone overlay layers -->
        <div class="hero-duotone-layer"></div>
        <div class="hero-gradient-overlay"></div>
        <div class="hero-vignette"></div>
      </div>
      
      <!-- Floating particles for depth -->
      <div class="hero-particles-bg" aria-hidden="true">
        <span class="particle-bg"></span>
        <span class="particle-bg"></span>
        <span class="particle-bg"></span>
        <span class="particle-bg"></span>
        <span class="particle-bg"></span>
      </div>
      
      <div class="hero-fullscreen-content">
        <div class="hero-profile-image" aria-hidden="true">
          {{PROFILE_IMAGE}}
        </div>
        <h1 class="hero-fullscreen-name">{{NAME}}</h1>
        <p class="hero-fullscreen-title" role="doc-subtitle">{{TITLE}}</p>
        <p class="hero-fullscreen-summary">{{SUMMARY}}</p>
        <nav class="hero-fullscreen-cta" aria-label="Primary actions">
          <a href="#contact" class="btn-fullscreen-primary" aria-label="Navigate to contact section">
            <span class="btn-text">{{CTA_PRIMARY_TEXT}}</span>
            <span class="btn-shine"></span>
          </a>
          <a href="#experience" class="btn-fullscreen-secondary" aria-label="Navigate to experience section">
            <span class="btn-text">{{CTA_SECONDARY_TEXT}}</span>
          </a>
        </nav>
      </div>
      <div class="hero-scroll-indicator" aria-hidden="true">
        <span class="scroll-arrow"></span>
      </div>
    </section>
  `,
  cssTemplate: `
    .hero-fullscreen-bg {
      position: relative;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      color: #ffffff;
    }

    .hero-bg-wrapper {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 0;
    }

    /* Ken Burns effect - slow zoom animation */
    .hero-bg-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
      animation: kenBurns 25s ease-in-out infinite alternate;
      transform-origin: center center;
    }

    @keyframes kenBurns {
      0% {
        transform: scale(1) translate(0, 0);
      }
      50% {
        transform: scale(1.1) translate(-1%, 1%);
      }
      100% {
        transform: scale(1.15) translate(1%, -1%);
      }
    }

    /* Duotone overlay - primary color layer */
    .hero-duotone-layer {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        180deg,
        {{COLOR_PRIMARY}}dd 0%,
        {{COLOR_SECONDARY}}cc 100%
      );
      mix-blend-mode: color;
      opacity: 0.85;
    }

    /* Gradient overlay for depth */
    .hero-gradient-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        135deg, 
        {{COLOR_PRIMARY}}99 0%, 
        transparent 40%,
        transparent 60%,
        {{COLOR_SECONDARY}}99 100%
      );
      mix-blend-mode: multiply;
    }

    /* Vignette effect */
    .hero-vignette {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: radial-gradient(
        ellipse at center,
        transparent 40%,
        {{COLOR_PRIMARY}}60 100%
      );
      pointer-events: none;
    }

    /* Floating particles */
    .hero-particles-bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
      pointer-events: none;
      overflow: hidden;
    }

    .particle-bg {
      position: absolute;
      width: 3px;
      height: 3px;
      background: rgba(255, 255, 255, 0.5);
      border-radius: 50%;
      box-shadow: 0 0 6px rgba(255, 255, 255, 0.4);
      animation: float-particle-bg 20s infinite;
    }

    .particle-bg:nth-child(1) { left: 15%; top: 25%; animation-delay: 0s; animation-duration: 22s; }
    .particle-bg:nth-child(2) { left: 80%; top: 15%; animation-delay: 3s; animation-duration: 18s; }
    .particle-bg:nth-child(3) { left: 45%; top: 70%; animation-delay: 5s; animation-duration: 25s; }
    .particle-bg:nth-child(4) { left: 70%; top: 60%; animation-delay: 2s; animation-duration: 20s; }
    .particle-bg:nth-child(5) { left: 25%; top: 80%; animation-delay: 4s; animation-duration: 23s; }

    @keyframes float-particle-bg {
      0%, 100% {
        transform: translate(0, 0) scale(1);
        opacity: 0;
      }
      10% { opacity: 0.6; }
      50% {
        transform: translate(30px, -40px) scale(1.3);
        opacity: 0.4;
      }
      90% { opacity: 0.6; }
    }

    .hero-fullscreen-content {
      position: relative;
      z-index: 2;
      text-align: center;
      max-width: 900px;
      padding: 2rem;
      animation: heroFullscreenFadeInUp 1s ease-out;
    }

    @keyframes heroFullscreenFadeInUp {
      from {
        opacity: 0;
        transform: translateY(40px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .hero-profile-image {
      width: 160px;
      height: 160px;
      border-radius: 50%;
      margin: 0 auto 2rem;
      border: 4px solid rgba(255, 255, 255, 0.3);
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 3.5rem;
      font-weight: 700;
      color: #ffffff;
      overflow: hidden;
      box-shadow: 0 8px 40px rgba(0, 0, 0, 0.4);
      animation: fadeInScale 1s ease-out 0.2s both;
    }

    @keyframes fadeInScale {
      from {
        opacity: 0;
        transform: scale(0.8);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }

    .hero-profile-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .hero-fullscreen-name {
      font-size: 4rem;
      font-weight: 800;
      margin-bottom: 0.75rem;
      text-shadow: 0 4px 30px rgba(0, 0, 0, 0.4);
      letter-spacing: -0.02em;
      animation: fadeInUp 1s ease-out 0.3s both;
    }

    .hero-fullscreen-title {
      font-size: 1.5rem;
      font-weight: 400;
      opacity: 0.9;
      margin-bottom: 1.5rem;
      text-shadow: 0 2px 15px rgba(0, 0, 0, 0.3);
      animation: fadeInUp 1s ease-out 0.4s both;
    }

    .hero-fullscreen-summary {
      font-size: 1.15rem;
      line-height: 1.7;
      opacity: 0.85;
      margin-bottom: 2.5rem;
      max-width: 650px;
      margin-left: auto;
      margin-right: auto;
      animation: fadeInUp 1s ease-out 0.5s both;
    }

    .hero-fullscreen-cta {
      display: flex;
      gap: 1.25rem;
      justify-content: center;
      flex-wrap: wrap;
      animation: fadeInUp 1s ease-out 0.6s both;
    }

    .btn-fullscreen-primary,
    .btn-fullscreen-secondary {
      padding: 1rem 2.5rem;
      border-radius: 50px;
      text-decoration: none;
      font-weight: 600;
      font-size: 1rem;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }

    .btn-text {
      position: relative;
      z-index: 2;
    }

    .btn-fullscreen-primary {
      background: #ffffff;
      color: {{COLOR_PRIMARY}};
      box-shadow: 0 4px 25px rgba(0, 0, 0, 0.25);
    }

    /* Shine effect */
    .btn-shine {
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
      animation: btnShine 3s infinite;
    }

    @keyframes btnShine {
      0% { left: -100%; }
      50%, 100% { left: 100%; }
    }

    .btn-fullscreen-primary:hover {
      transform: translateY(-4px) scale(1.02);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.35);
      background: #f8f8f8;
    }

    .btn-fullscreen-secondary {
      background: rgba(255, 255, 255, 0.1);
      border: 2px solid rgba(255, 255, 255, 0.5);
      color: #ffffff;
      backdrop-filter: blur(8px);
    }

    .btn-fullscreen-secondary:hover {
      background: rgba(255, 255, 255, 0.2);
      border-color: rgba(255, 255, 255, 0.9);
      transform: translateY(-4px) scale(1.02);
    }

    /* Focus styles for accessibility */
    .btn-fullscreen-primary:focus,
    .btn-fullscreen-secondary:focus {
      outline: 3px solid rgba(255, 255, 255, 0.8);
      outline-offset: 3px;
    }

    /* Scroll indicator */
    .hero-scroll-indicator {
      position: absolute;
      bottom: 2rem;
      left: 50%;
      transform: translateX(-50%);
      z-index: 2;
    }

    .scroll-arrow {
      display: block;
      width: 24px;
      height: 24px;
      border-right: 2px solid rgba(255, 255, 255, 0.6);
      border-bottom: 2px solid rgba(255, 255, 255, 0.6);
      transform: rotate(45deg);
      animation: scrollBounce 2s infinite;
    }

    @keyframes scrollBounce {
      0%, 20%, 50%, 80%, 100% {
        transform: translateY(0) rotate(45deg);
      }
      40% {
        transform: translateY(10px) rotate(45deg);
      }
      60% {
        transform: translateY(5px) rotate(45deg);
      }
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .hero-fullscreen-name {
        font-size: 3rem;
      }

      .hero-fullscreen-title {
        font-size: 1.3rem;
      }

      .hero-profile-image {
        width: 140px;
        height: 140px;
      }
    }

    @media (max-width: 768px) {
      .hero-fullscreen-bg {
        min-height: 100svh;
      }

      .hero-fullscreen-content {
        padding: 1.5rem;
      }

      .hero-fullscreen-name {
        font-size: 2.25rem;
      }

      .hero-fullscreen-title {
        font-size: 1.1rem;
      }

      .hero-fullscreen-summary {
        font-size: 1rem;
      }

      .hero-profile-image {
        width: 120px;
        height: 120px;
        font-size: 2.5rem;
      }

      .btn-fullscreen-primary,
      .btn-fullscreen-secondary {
        padding: 0.875rem 2rem;
        font-size: 0.95rem;
      }

      /* Slower Ken Burns on mobile for better performance */
      .hero-bg-image {
        animation-duration: 35s;
      }
    }

    @media (max-width: 480px) {
      .hero-fullscreen-name {
        font-size: 1.85rem;
      }

      .hero-fullscreen-title {
        font-size: 1rem;
      }

      .hero-fullscreen-summary {
        font-size: 0.95rem;
      }

      .hero-profile-image {
        width: 100px;
        height: 100px;
        font-size: 2rem;
      }

      .hero-fullscreen-cta {
        flex-direction: column;
        gap: 1rem;
      }

      .btn-fullscreen-primary,
      .btn-fullscreen-secondary {
        width: 100%;
        text-align: center;
      }
    }

    /* Reduced motion preference */
    @media (prefers-reduced-motion: reduce) {
      .hero-bg-image {
        animation: none;
        transform: scale(1.05);
      }

      .hero-fullscreen-content,
      .hero-profile-image,
      .hero-fullscreen-name,
      .hero-fullscreen-title,
      .hero-fullscreen-summary,
      .hero-fullscreen-cta {
        animation: none;
      }

      .scroll-arrow,
      .btn-shine,
      .particle-bg {
        animation: none;
      }

      .btn-fullscreen-primary:hover,
      .btn-fullscreen-secondary:hover {
        transform: none;
      }
    }
  `,
  jsTemplate: `
    // Ken Burns pan direction change
    const heroFullscreen = document.querySelector('.hero-fullscreen-bg');
    const heroBgImage = document.querySelector('.hero-bg-image');

    // Parallax on scroll
    if (heroFullscreen && heroBgImage && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
      window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const heroHeight = heroFullscreen.offsetHeight;
        
        if (scrolled < heroHeight) {
          const parallaxSpeed = 0.3;
          heroBgImage.style.marginTop = (scrolled * parallaxSpeed) + 'px';
        }
      });
    }

    // Scroll indicator click
    const scrollIndicator = document.querySelector('.hero-scroll-indicator');
    if (scrollIndicator) {
      scrollIndicator.style.cursor = 'pointer';
      scrollIndicator.addEventListener('click', function() {
        const heroSection = document.querySelector('.hero-fullscreen-bg');
        if (heroSection) {
          const nextSection = heroSection.nextElementSibling;
          if (nextSection) {
            nextSection.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    }

    // Smooth scroll for CTA buttons
    document.querySelectorAll('.hero-fullscreen-bg a[href^="#"]').forEach(anchor => {
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
  `,
  placeholders: [
    "{{NAME}}", "{{INITIALS}}", "{{TITLE}}", "{{SUMMARY}}", "{{PROFILE_IMAGE}}",
    "{{CTA_PRIMARY_TEXT}}", "{{CTA_SECONDARY_TEXT}}",
    "{{COLOR_PRIMARY}}", "{{COLOR_SECONDARY}}", "{{COLOR_ACCENT}}",
    "{{STOCK_IMAGE:hero}}", "{{STOCK_IMAGE_ALT:hero}}"
  ]
};

/**
 * Hero Template 6 - Split Layout with Stock Photo
 * Sol tarafta içerik, sağ tarafta stok fotoğraf bulunan hero section
 */
export const heroTemplate6: ComponentTemplate = {
  id: "hero-split-image",
  name: "Split Image Hero",
  category: "hero",
  htmlTemplate: `
    <section id="hero" class="hero-split" aria-label="Hero section" role="banner">
      <div class="hero-split-content">
        <div class="hero-split-inner">
          <div class="hero-split-profile" aria-hidden="true">
            {{PROFILE_IMAGE}}
          </div>
          <h1 class="hero-split-name">{{NAME}}</h1>
          <p class="hero-split-title" role="doc-subtitle">{{TITLE}}</p>
          <p class="hero-split-summary">{{SUMMARY}}</p>
          <nav class="hero-split-cta" aria-label="Primary actions">
            <a href="#contact" class="btn-split-primary" aria-label="Navigate to contact section">
              <span class="btn-text">{{CTA_PRIMARY_TEXT}}</span>
              <span class="btn-shine"></span>
            </a>
            <a href="#experience" class="btn-split-secondary" aria-label="Navigate to experience section">
              <span class="btn-text">{{CTA_SECONDARY_TEXT}}</span>
            </a>
          </nav>
        </div>
      </div>
      <div class="hero-split-image-wrapper" aria-hidden="true">
        <img 
          src="{{STOCK_IMAGE:hero}}" 
          alt="{{STOCK_IMAGE_ALT:hero}}" 
          class="hero-split-image"
          loading="eager"
        />
        <!-- Duotone overlay layers -->
        <div class="hero-split-duotone"></div>
        <div class="hero-split-gradient"></div>
        <div class="hero-split-vignette"></div>
        
        <!-- Floating elements -->
        <div class="hero-split-particles">
          <span class="split-particle"></span>
          <span class="split-particle"></span>
          <span class="split-particle"></span>
        </div>
      </div>
    </section>
  `,
  cssTemplate: `
    .hero-split {
      display: grid;
      grid-template-columns: 1fr 1fr;
      min-height: 100vh;
      background: {{COLOR_BACKGROUND}};
    }

    .hero-split-content {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 4rem 3rem;
      background: {{COLOR_BACKGROUND}};
    }

    .hero-split-inner {
      max-width: 520px;
    }

    .hero-split-profile {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      margin-bottom: 2rem;
      border: 3px solid {{COLOR_PRIMARY}};
      background: {{COLOR_SURFACE}};
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2.5rem;
      font-weight: 700;
      color: {{COLOR_TEXT}};
      overflow: hidden;
      box-shadow: 0 4px 25px rgba(0, 0, 0, 0.12);
      animation: splitFadeIn 0.8s ease-out both;
    }

    @keyframes splitFadeIn {
      from {
        opacity: 0;
        transform: translateX(-30px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    .hero-split-profile img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .hero-split-name {
      font-size: 3.25rem;
      font-weight: 800;
      color: {{COLOR_TEXT}};
      margin-bottom: 0.5rem;
      line-height: 1.1;
      letter-spacing: -0.02em;
      animation: splitFadeIn 0.8s ease-out 0.1s both;
    }

    .hero-split-title {
      font-size: 1.35rem;
      color: {{COLOR_PRIMARY}};
      margin-bottom: 1.5rem;
      font-weight: 500;
      animation: splitFadeIn 0.8s ease-out 0.2s both;
    }

    .hero-split-summary {
      font-size: 1.1rem;
      line-height: 1.7;
      color: {{COLOR_TEXT_SECONDARY}};
      margin-bottom: 2.5rem;
      animation: splitFadeIn 0.8s ease-out 0.3s both;
    }

    .hero-split-cta {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      animation: splitFadeIn 0.8s ease-out 0.4s both;
    }

    .btn-split-primary,
    .btn-split-secondary {
      padding: 0.9rem 2rem;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      font-size: 1rem;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }

    .btn-text {
      position: relative;
      z-index: 2;
    }

    .btn-split-primary {
      background: {{COLOR_PRIMARY}};
      color: #ffffff;
      box-shadow: 0 4px 20px {{COLOR_PRIMARY}}40;
    }

    /* Shine effect */
    .btn-shine {
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
      animation: splitBtnShine 3s infinite;
    }

    @keyframes splitBtnShine {
      0% { left: -100%; }
      50%, 100% { left: 100%; }
    }

    .btn-split-primary:hover {
      transform: translateY(-3px) scale(1.02);
      box-shadow: 0 8px 30px {{COLOR_PRIMARY}}50;
    }

    .btn-split-secondary {
      background: transparent;
      border: 2px solid {{COLOR_BORDER}};
      color: {{COLOR_TEXT}};
    }

    .btn-split-secondary:hover {
      background: {{COLOR_SURFACE}};
      border-color: {{COLOR_PRIMARY}};
      color: {{COLOR_PRIMARY}};
      transform: translateY(-3px);
    }

    /* Focus styles */
    .btn-split-primary:focus,
    .btn-split-secondary:focus {
      outline: 3px solid {{COLOR_PRIMARY}};
      outline-offset: 3px;
    }

    /* Image side */
    .hero-split-image-wrapper {
      position: relative;
      overflow: hidden;
    }

    /* Ken Burns effect */
    .hero-split-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
      animation: splitKenBurns 20s ease-in-out infinite alternate;
      transform-origin: center center;
    }

    @keyframes splitKenBurns {
      0% {
        transform: scale(1) translate(0, 0);
      }
      50% {
        transform: scale(1.08) translate(-1%, 1%);
      }
      100% {
        transform: scale(1.12) translate(1%, -0.5%);
      }
    }

    /* Duotone overlay layer */
    .hero-split-duotone {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        180deg,
        {{COLOR_PRIMARY}}cc 0%,
        {{COLOR_SECONDARY}}aa 100%
      );
      mix-blend-mode: color;
      opacity: 0.7;
      pointer-events: none;
    }

    /* Gradient overlay */
    .hero-split-gradient {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        135deg,
        {{COLOR_PRIMARY}}60 0%,
        transparent 50%,
        {{COLOR_SECONDARY}}40 100%
      );
      mix-blend-mode: multiply;
      pointer-events: none;
    }

    /* Vignette */
    .hero-split-vignette {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: radial-gradient(
        ellipse at center,
        transparent 30%,
        {{COLOR_PRIMARY}}50 100%
      );
      pointer-events: none;
    }

    /* Floating particles */
    .hero-split-particles {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      overflow: hidden;
    }

    .split-particle {
      position: absolute;
      width: 4px;
      height: 4px;
      background: rgba(255, 255, 255, 0.5);
      border-radius: 50%;
      box-shadow: 0 0 8px rgba(255, 255, 255, 0.4);
      animation: splitParticleFloat 18s infinite;
    }

    .split-particle:nth-child(1) { left: 20%; top: 30%; animation-delay: 0s; animation-duration: 20s; }
    .split-particle:nth-child(2) { left: 70%; top: 20%; animation-delay: 3s; animation-duration: 16s; }
    .split-particle:nth-child(3) { left: 50%; top: 70%; animation-delay: 5s; animation-duration: 22s; }

    @keyframes splitParticleFloat {
      0%, 100% {
        transform: translate(0, 0) scale(1);
        opacity: 0;
      }
      10% { opacity: 0.7; }
      50% {
        transform: translate(25px, -35px) scale(1.3);
        opacity: 0.5;
      }
      90% { opacity: 0.7; }
    }

    /* Responsive */
    @media (max-width: 1200px) {
      .hero-split-name {
        font-size: 2.75rem;
      }

      .hero-split-content {
        padding: 3rem 2.5rem;
      }
    }

    @media (max-width: 992px) {
      .hero-split {
        grid-template-columns: 1fr;
        grid-template-rows: auto 1fr;
      }

      .hero-split-image-wrapper {
        order: -1;
        height: 45vh;
        min-height: 300px;
      }

      .hero-split-content {
        padding: 3rem 2rem;
      }

      .hero-split-inner {
        max-width: 100%;
        text-align: center;
      }

      .hero-split-profile {
        margin-left: auto;
        margin-right: auto;
      }

      .hero-split-cta {
        justify-content: center;
      }

      /* Slower Ken Burns on mobile */
      .hero-split-image {
        animation-duration: 30s;
      }
    }

    @media (max-width: 768px) {
      .hero-split-image-wrapper {
        height: 40vh;
        min-height: 250px;
      }

      .hero-split-name {
        font-size: 2.25rem;
      }

      .hero-split-title {
        font-size: 1.15rem;
      }

      .hero-split-summary {
        font-size: 1rem;
      }

      .hero-split-profile {
        width: 100px;
        height: 100px;
        font-size: 2rem;
      }
    }

    @media (max-width: 480px) {
      .hero-split-content {
        padding: 2rem 1.5rem;
      }

      .hero-split-name {
        font-size: 1.85rem;
      }

      .hero-split-title {
        font-size: 1rem;
      }

      .hero-split-profile {
        width: 80px;
        height: 80px;
        font-size: 1.75rem;
      }

      .hero-split-cta {
        flex-direction: column;
      }

      .btn-split-primary,
      .btn-split-secondary {
        width: 100%;
        text-align: center;
      }
    }

    /* Reduced motion */
    @media (prefers-reduced-motion: reduce) {
      .hero-split-profile,
      .hero-split-name,
      .hero-split-title,
      .hero-split-summary,
      .hero-split-cta {
        animation: none;
      }

      .hero-split-image {
        animation: none;
        transform: scale(1.02);
      }

      .split-particle,
      .btn-shine {
        animation: none;
      }

      .btn-split-primary:hover,
      .btn-split-secondary:hover {
        transform: none;
      }
    }
  `,
  jsTemplate: `
    // Smooth scroll for CTA buttons
    document.querySelectorAll('.hero-split a[href^="#"]').forEach(anchor => {
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

    // Subtle parallax on scroll for split hero
    const heroSplitImage = document.querySelector('.hero-split-image');
    const heroSplit = document.querySelector('.hero-split');

    if (heroSplitImage && heroSplit && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
      // Only apply parallax on desktop
      if (window.innerWidth > 992) {
        window.addEventListener('scroll', function() {
          const scrolled = window.pageYOffset;
          const heroHeight = heroSplit.offsetHeight;
          
          if (scrolled < heroHeight) {
            const parallaxSpeed = 0.1;
            heroSplitImage.style.marginTop = (scrolled * parallaxSpeed) + 'px';
          }
        });
      }
    }
  `,
  placeholders: [
    "{{NAME}}", "{{INITIALS}}", "{{TITLE}}", "{{SUMMARY}}", "{{PROFILE_IMAGE}}",
    "{{CTA_PRIMARY_TEXT}}", "{{CTA_SECONDARY_TEXT}}",
    "{{COLOR_PRIMARY}}", "{{COLOR_SECONDARY}}", "{{COLOR_ACCENT}}", "{{COLOR_BACKGROUND}}",
    "{{COLOR_TEXT}}", "{{COLOR_TEXT_SECONDARY}}", "{{COLOR_SURFACE}}", "{{COLOR_BORDER}}",
    "{{STOCK_IMAGE:hero}}", "{{STOCK_IMAGE_ALT:hero}}"
  ]
};

/**
 * Hero Template 7 - Bento Grid Layout
 * Modern Apple/Vercel tarzı bento kutu grid layout
 */
export const heroTemplate7: ComponentTemplate = {
  id: "hero-bento-grid",
  name: "Bento Grid Hero",
  category: "hero",
  htmlTemplate: `
    <section id="hero" class="hero-bento" aria-label="Hero section" role="banner">
      <!-- Animated background orbs -->
      <div class="bento-bg-orbs" aria-hidden="true">
        <div class="bg-orb orb-1"></div>
        <div class="bg-orb orb-2"></div>
        <div class="bg-orb orb-3"></div>
      </div>
      
      <div class="bento-container">
        <!-- Main Profile Card (Large) -->
        <div class="bento-card bento-profile" data-animate="1">
          <div class="bento-profile-image" aria-hidden="true">
            {{PROFILE_IMAGE}}
          </div>
          <div class="bento-profile-info">
            <h1 class="bento-name">{{NAME}}</h1>
            <p class="bento-title">{{TITLE}}</p>
          </div>
        </div>

        <!-- Location Card -->
        <div class="bento-card bento-location" data-animate="2">
          <div class="location-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
          </div>
          <span class="location-text">{{LOCATION}}</span>
        </div>

        <!-- Status Card - Available -->
        <div class="bento-card bento-status" data-animate="3">
          <div class="status-indicator">
            <span class="status-dot"></span>
            <span class="status-text">Müsait</span>
          </div>
          <span class="status-subtext">Yeni projelere açık</span>
        </div>

        <!-- Summary Card -->
        <div class="bento-card bento-summary-card" data-animate="4">
          <p class="bento-summary">{{SUMMARY}}</p>
        </div>

        <!-- Social Links Card -->
        <div class="bento-card bento-social" data-animate="5">
          <div class="bento-social-links">{{SOCIAL_LINKS}}</div>
        </div>

        <!-- CTA Card -->
        <div class="bento-card bento-cta" data-animate="6">
          <nav class="bento-cta-buttons" aria-label="Primary actions">
            <a href="#contact" class="btn-bento-primary" aria-label="Navigate to contact section">
              <span class="btn-text">{{CTA_PRIMARY_TEXT}}</span>
              <span class="btn-glow"></span>
            </a>
            <a href="#experience" class="btn-bento-secondary" aria-label="Navigate to experience section">
              <span class="btn-text">{{CTA_SECONDARY_TEXT}}</span>
            </a>
          </nav>
        </div>
      </div>
    </section>
  `,
  cssTemplate: `
    .hero-bento {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: {{COLOR_BACKGROUND}};
      padding: 2rem;
      position: relative;
      overflow: hidden;
    }

    /* Animated background orbs */
    .bento-bg-orbs {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      overflow: hidden;
    }

    .bg-orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0.5;
      animation: heroBentoOrbFloat 20s ease-in-out infinite;
    }

    .orb-1 {
      width: 400px;
      height: 400px;
      background: {{COLOR_PRIMARY}};
      top: -10%;
      left: -5%;
      animation-delay: 0s;
    }

    .orb-2 {
      width: 300px;
      height: 300px;
      background: {{COLOR_SECONDARY}};
      top: 60%;
      right: -5%;
      animation-delay: -7s;
    }

    .orb-3 {
      width: 250px;
      height: 250px;
      background: {{COLOR_ACCENT}};
      bottom: -5%;
      left: 30%;
      animation-delay: -14s;
    }

    @keyframes heroBentoOrbFloat {
      0%, 100% {
        transform: translate(0, 0) scale(1);
      }
      25% {
        transform: translate(30px, -30px) scale(1.05);
      }
      50% {
        transform: translate(-20px, 20px) scale(0.95);
      }
      75% {
        transform: translate(20px, 10px) scale(1.02);
      }
    }

    .bento-container {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      grid-template-rows: auto auto auto;
      gap: 1rem;
      max-width: 900px;
      width: 100%;
      position: relative;
      z-index: 1;
    }

    /* Base card styles */
    .bento-card {
      background: {{COLOR_SURFACE}};
      border-radius: 20px;
      padding: 1.5rem;
      border: 1px solid {{COLOR_BORDER}};
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
      backdrop-filter: blur(10px);
    }

    .bento-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, {{COLOR_PRIMARY}}08 0%, transparent 50%);
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .bento-card:hover {
      transform: translateY(-4px);
      box-shadow: 
        0 20px 40px rgba(0, 0, 0, 0.15),
        0 0 0 1px {{COLOR_PRIMARY}}20;
      border-color: {{COLOR_PRIMARY}}30;
    }

    .bento-card:hover::before {
      opacity: 1;
    }

    /* Animation classes */
    .bento-card[data-animate] {
      opacity: 0;
      transform: translateY(30px);
    }

    .bento-card.animate-in {
      animation: bentoFadeIn 0.6s ease forwards;
    }

    @keyframes bentoFadeIn {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Profile Card - Large */
    .bento-profile {
      grid-column: span 2;
      grid-row: span 2;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1.5rem;
      padding: 2.5rem;
      text-align: center;
    }

    .bento-profile-image {
      width: 120px;
      height: 120px;
      border-radius: 24px;
      background: {{COLOR_PRIMARY}}15;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 3rem;
      font-weight: 700;
      color: {{COLOR_PRIMARY}};
      overflow: hidden;
      border: 3px solid {{COLOR_PRIMARY}}30;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
    }

    .bento-profile-image::after {
      content: '';
      position: absolute;
      inset: -3px;
      border-radius: 27px;
      background: linear-gradient(135deg, {{COLOR_PRIMARY}}, {{COLOR_SECONDARY}});
      z-index: -1;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .bento-profile:hover .bento-profile-image {
      transform: scale(1.05);
      box-shadow: 0 15px 40px {{COLOR_PRIMARY}}30;
    }

    .bento-profile:hover .bento-profile-image::after {
      opacity: 1;
    }

    .bento-profile-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .bento-profile-info {
      text-align: center;
    }

    .bento-name {
      font-size: 2.25rem;
      font-weight: 800;
      color: {{COLOR_TEXT}};
      margin-bottom: 0.5rem;
      line-height: 1.1;
      letter-spacing: -0.02em;
    }

    .bento-title {
      font-size: 1.1rem;
      color: {{COLOR_PRIMARY}};
      font-weight: 500;
    }

    /* Location Card */
    .bento-location {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      background: linear-gradient(135deg, {{COLOR_PRIMARY}}15 0%, {{COLOR_SECONDARY}}10 100%);
    }

    .location-icon {
      width: 42px;
      height: 42px;
      border-radius: 12px;
      background: {{COLOR_ICON_PRIMARY}}15;
      display: flex;
      align-items: center;
      justify-content: center;
      color: {{COLOR_ICON_PRIMARY}};
      animation: locationPulse 2s ease-in-out infinite;
    }

    .location-icon svg {
      width: 22px;
      height: 22px;
    }

    @keyframes locationPulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }

    .location-text {
      font-size: 0.9rem;
      font-weight: 600;
      color: {{COLOR_TEXT}};
      text-align: center;
    }

    /* Status Card */
    .bento-status {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.4rem;
      background: {{COLOR_SURFACE}};
    }

    .status-indicator {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .status-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #22c55e;
      animation: statusPulse 2s ease-in-out infinite;
      box-shadow: 0 0 10px #22c55e80;
    }

    @keyframes statusPulse {
      0%, 100% { 
        opacity: 1;
        box-shadow: 0 0 10px #22c55e80;
      }
      50% { 
        opacity: 0.7;
        box-shadow: 0 0 20px #22c55e;
      }
    }

    .status-text {
      font-size: 0.95rem;
      font-weight: 700;
      color: #22c55e;
    }

    .status-subtext {
      font-size: 0.75rem;
      color: {{COLOR_TEXT_SECONDARY}};
      text-align: center;
    }

    /* Summary Card */
    .bento-summary-card {
      grid-column: span 2;
      display: flex;
      align-items: center;
      padding: 1.5rem;
    }

    .bento-summary {
      font-size: 1rem;
      line-height: 1.6;
      color: {{COLOR_TEXT_SECONDARY}};
      margin: 0;
    }

    /* Social Card */
    .bento-social {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
    }

    .bento-social-links {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
      justify-content: center;
    }

    .bento-social-links a {
      width: 42px;
      height: 42px;
      border-radius: 12px;
      background: {{COLOR_PRIMARY}}10;
      display: flex;
      align-items: center;
      justify-content: center;
      color: {{COLOR_PRIMARY}};
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .bento-social-links a:hover {
      background: {{COLOR_PRIMARY}};
      color: #ffffff;
      transform: translateY(-3px) scale(1.05);
      box-shadow: 0 8px 20px {{COLOR_PRIMARY}}40;
    }

    /* CTA Card */
    .bento-cta {
      grid-column: span 3;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
      background: transparent;
      border: none;
      backdrop-filter: none;
    }

    .bento-cta:hover {
      transform: none;
      box-shadow: none;
    }

    .bento-cta::before {
      display: none;
    }

    .bento-cta-buttons {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      justify-content: center;
    }

    .btn-bento-primary,
    .btn-bento-secondary {
      padding: 1rem 2.5rem;
      border-radius: 14px;
      text-decoration: none;
      font-weight: 600;
      font-size: 1rem;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }

    .btn-text {
      position: relative;
      z-index: 2;
    }

    .btn-bento-primary {
      background: linear-gradient(135deg, {{COLOR_PRIMARY}} 0%, {{COLOR_SECONDARY}} 100%);
      color: #ffffff;
      box-shadow: 0 4px 20px {{COLOR_PRIMARY}}40;
    }

    .btn-glow {
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
      animation: btnGlow 3s infinite;
    }

    @keyframes btnGlow {
      0% { left: -100%; }
      50%, 100% { left: 100%; }
    }

    .btn-bento-primary:hover {
      transform: translateY(-3px) scale(1.02);
      box-shadow: 0 10px 35px {{COLOR_PRIMARY}}50;
    }

    .btn-bento-secondary {
      background: {{COLOR_SURFACE}};
      border: 2px solid {{COLOR_BORDER}};
      color: {{COLOR_TEXT}};
      backdrop-filter: blur(10px);
    }

    .btn-bento-secondary:hover {
      border-color: {{COLOR_PRIMARY}};
      color: {{COLOR_PRIMARY}};
      transform: translateY(-3px);
      background: {{COLOR_PRIMARY}}10;
    }

    /* Focus styles */
    .btn-bento-primary:focus,
    .btn-bento-secondary:focus {
      outline: 3px solid {{COLOR_PRIMARY}};
      outline-offset: 3px;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .bento-container {
        grid-template-columns: repeat(2, 1fr);
      }

      .bento-profile {
        grid-column: span 2;
        grid-row: span 1;
      }

      .bento-location,
      .bento-status {
        grid-column: span 1;
      }

      .bento-summary-card {
        grid-column: span 2;
      }

      .bento-social {
        grid-column: span 2;
      }

      .bento-cta {
        grid-column: span 2;
      }

      .bento-name {
        font-size: 1.85rem;
      }

      .bento-profile-image {
        width: 100px;
        height: 100px;
        font-size: 2.5rem;
      }

      .bg-orb {
        opacity: 0.3;
      }
    }

    @media (max-width: 480px) {
      .hero-bento {
        padding: 1rem;
      }

      .bento-container {
        gap: 0.75rem;
      }

      .bento-card {
        padding: 1.25rem;
        border-radius: 16px;
      }

      .bento-profile {
        padding: 1.5rem;
      }

      .bento-profile-image {
        width: 80px;
        height: 80px;
        font-size: 2rem;
        border-radius: 18px;
      }

      .bento-name {
        font-size: 1.5rem;
      }

      .bento-title {
        font-size: 1rem;
      }

      .bento-summary {
        font-size: 0.95rem;
      }

      .bento-cta-buttons {
        flex-direction: column;
        width: 100%;
      }

      .btn-bento-primary,
      .btn-bento-secondary {
        width: 100%;
        text-align: center;
      }

      .bg-orb {
        display: none;
      }
    }

    /* Reduced motion */
    @media (prefers-reduced-motion: reduce) {
      .bento-card[data-animate] {
        opacity: 1;
        transform: none;
      }

      .bento-card.animate-in {
        animation: none;
      }

      .bento-card:hover,
      .bento-profile:hover .bento-profile-image,
      .btn-bento-primary:hover,
      .btn-bento-secondary:hover,
      .bento-social-links a:hover {
        transform: none;
      }

      .bg-orb,
      .location-icon,
      .status-dot,
      .btn-glow {
        animation: none;
      }

      .status-dot {
        box-shadow: 0 0 10px #22c55e80;
      }
    }
  `,
  jsTemplate: `
    // Staggered animation on page load
    const bentoCards = document.querySelectorAll('.bento-card[data-animate]');
    
    if (bentoCards.length && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const card = entry.target;
            const delay = parseInt(card.dataset.animate) * 100;
            
            setTimeout(() => {
              card.classList.add('animate-in');
            }, delay);
            
            observer.unobserve(card);
          }
        });
      }, { threshold: 0.1 });

      bentoCards.forEach(card => observer.observe(card));
    } else {
      // Show all cards immediately if reduced motion
      bentoCards.forEach(card => {
        card.style.opacity = '1';
        card.style.transform = 'none';
      });
    }

    // Smooth scroll for CTA buttons
    document.querySelectorAll('.hero-bento a[href^="#"]').forEach(anchor => {
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

    // Hover tilt effect for cards (desktop only)
    if (window.innerWidth > 768 && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
      document.querySelectorAll('.bento-card:not(.bento-cta)').forEach(card => {
        card.addEventListener('mousemove', function(e) {
          const rect = this.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          
          const rotateX = (y - centerY) / 25;
          const rotateY = (centerX - x) / 25;
          
          this.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-4px)';
        });
        
        card.addEventListener('mouseleave', function() {
          this.style.transform = '';
        });
      });
    }
  `,
  placeholders: [
    "{{NAME}}", "{{INITIALS}}", "{{TITLE}}", "{{SUMMARY}}", "{{PROFILE_IMAGE}}",
    "{{CTA_PRIMARY_TEXT}}", "{{CTA_SECONDARY_TEXT}}", "{{SOCIAL_LINKS}}", "{{LOCATION}}",
    "{{COLOR_PRIMARY}}", "{{COLOR_SECONDARY}}", "{{COLOR_ACCENT}}", "{{COLOR_BACKGROUND}}",
    "{{COLOR_TEXT}}", "{{COLOR_TEXT_SECONDARY}}", "{{COLOR_SURFACE}}", "{{COLOR_BORDER}}",
    "{{COLOR_ICON_PRIMARY}}", "{{COLOR_ICON_SECONDARY}}"
  ]
};

export const heroTemplates = [heroTemplate1, heroTemplate2, heroTemplate3, heroTemplate4, heroTemplate5, heroTemplate6, heroTemplate7];
