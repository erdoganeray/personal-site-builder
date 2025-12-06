# 🚀 Personal Site Builder - AI-Powered Personal Website Generator

> Transform your CV into a professional personal website in minutes using AI

A SaaS application that allows users to upload their CV and automatically generate a modern, responsive personal website using Google Gemini AI, with one-click deployment to Cloudflare.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Development Workflow](#development-workflow)
- [Template System](#template-system)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [User Flow](#user-flow)
- [Future Plans](#future-plans)

---

## 🎯 Overview

**Personal Site Builder** helps professionals, freelancers, and job seekers create stunning personal websites without coding knowledge. Simply upload your CV, let AI analyze it, and get a fully functional, deployed website in minutes.

### How It Works

1. **Upload**: User uploads their CV (PDF format)
2. **Analyze**: Gemini AI extracts and structures CV information
3. **Design**: AI selects appropriate templates and color themes based on CV content
4. **Generate**: System fills templates with CV data to create HTML/CSS/JS
5. **Deploy**: One-click deployment to Cloudflare with automatic subdomain

---

## ✨ Key Features

### Current (MVP)
- ✅ **PDF CV Upload** - Automatic parsing using Gemini AI
- ✅ **AI-Powered Design** - Smart template selection and theme colors
- ✅ **Component-Based Templates** - Hero, Experience, Skills, Education, Contact sections
- ✅ **Live Preview** - See your site before publishing
- ✅ **One Revision** - Request one design modification per site
- ✅ **Cloudflare Deployment** - Automatic deployment with subdomain (username.domain.com)
- ✅ **Version History** - Track and rollback to previous versions
- ✅ **Responsive Design** - Mobile-friendly by default

### Upcoming Features
- 🔜 Custom domain support (ownname.com)
- 🔜 Blog system with editor
- 🔜 Portfolio gallery
- 🔜 Analytics dashboard
- 🔜 Multi-language support
- 🔜 Dark/Light mode toggle
- 🔜 LinkedIn/GitHub auto-import
- 🔜 Custom CSS editor

---

## 🛠 Technology Stack

### Frontend
- **Next.js 14+** (App Router) - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Hook Form** - Form management
- **Zod** - Validation

### Backend
- **Next.js API Routes** - Backend API
- **Prisma** - Database ORM
- **PostgreSQL** (Supabase) - Database
- **NextAuth.js** - Authentication
- **Bcrypt** - Password hashing

### AI & Storage
- **Google Gemini 2.5 Flash** - AI for CV parsing and site generation
- **Cloudflare R2** - File storage (S3-compatible)
- **AWS SDK v3** - R2 integration

### Deployment
- **Vercel** - Main application hosting
- **Cloudflare Pages** - User site hosting
- **Cloudflare DNS** - Automatic subdomain management

---

## 🏗 Architecture

### Component Flow

```
User CV Upload
    ↓
Gemini PDF Parser (extracts structured data)
    ↓
Design Analyzer (selects templates & colors)
    ↓
Template Engine (fills templates with CV data)
    ↓
HTML/CSS/JS Generation
    ↓
Database Storage
    ↓
Preview/Revision
    ↓
Cloudflare Deployment (R2 + DNS)
```

### Template System

The project uses a **component-based template system** instead of AI-generated HTML for each request:

1. **Predefined Templates**: Multiple design variations for each component (hero, experience, skills, etc.)
2. **AI Selection**: Gemini analyzes CV and selects appropriate templates
3. **Placeholder System**: Templates use placeholders (e.g., `{{NAME}}`, `{{COLOR_PRIMARY}}`)
4. **Data Injection**: System replaces placeholders with actual CV content
5. **Consistent Output**: Ensures reliable, bug-free websites

See [TEMPLATE_SYSTEM_DOCS.md](./TEMPLATE_SYSTEM_DOCS.md) for detailed template documentation.

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (Supabase recommended)
- Google AI Studio API key (Gemini)
- Cloudflare account with R2 and DNS access

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd personal-site-builder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Fill in all required variables (see [Environment Variables](#environment-variables))

4. **Initialize database**
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```

6. **Open browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```bash
# Database (Supabase)
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# Authentication
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"

# Google Gemini AI
GEMINI_API_KEY="AIzaSy..."

# Cloudflare Account
CLOUDFLARE_ACCOUNT_ID="..."
CLOUDFLARE_ZONE_ID="..."  # Your domain's zone ID
CLOUDFLARE_API_TOKEN="..."

# Cloudflare R2 Storage
R2_ACCESS_KEY_ID="..."
R2_SECRET_ACCESS_KEY="..."
R2_BUCKET_NAME="user-sites"
R2_PUBLIC_URL="https://pub-...r2.dev"
R2_PUBLIC_DOMAIN="pub-...r2.dev"

# Domain Configuration
NEXT_PUBLIC_BASE_DOMAIN="yourdomain.com"

# Vercel (Optional for deployment)
VERCEL_TOKEN="..."
```

### Getting API Keys

- **Supabase**: Create free account at [supabase.com](https://supabase.com)
- **Gemini API**: Get free key from [Google AI Studio](https://aistudio.google.com/app/apikey)
- **Cloudflare**: 
  - API Token: [dash.cloudflare.com/profile/api-tokens](https://dash.cloudflare.com/profile/api-tokens)
  - R2 Credentials: Dashboard → R2 → Manage R2 API Tokens

---

## 💻 Development Workflow

### Database Migrations

```bash
# Create a new migration
npx prisma migrate dev --name description_of_changes

# Apply migrations
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate

# Open Prisma Studio (database GUI)
npx prisma studio
```

### Running the Application

```bash
# Development mode with hot reload
npm run dev

# Production build
npm run build
npm start

# Lint code
npm run lint
```

### Testing Flow

1. Register a new user at `/register`
2. Login at `/login`
3. Upload a CV from dashboard
4. Wait for AI processing (30-60 seconds)
5. Preview the generated site
6. Request revision if needed (one-time)
7. Publish to Cloudflare
8. Visit your live site at `username.yourdomain.com`

---

## 📦 Template System

### Available Templates

#### Hero Section
- `hero-modern-centered` - Centered layout with large name
- `hero-split-screen` - Two-column split design

#### Experience Section
- `experience-timeline` - Timeline format
- `experience-cards` - Card grid layout

#### Skills Section
- `skills-progress-bars` - Progress bars with percentages
- `skills-card-grid` - Card-based skill display

#### Contact Section
- `contact-modern-form` - Two-column with form and info cards
- `contact-minimal-centered` - Minimal centered design
- `contact-split-info` - Split layout with gradient

### Adding New Templates

1. Create template in appropriate file (e.g., `src/components/site-templates/hero-templates.ts`)
2. Define HTML, CSS, and placeholders
3. Export template and add to `allTemplates` in `index.ts`
4. Update `design-analyzer.ts` to include new template
5. Add replacement logic in `template-engine.ts` if needed

See [TEMPLATE_SYSTEM_DOCS.md](./TEMPLATE_SYSTEM_DOCS.md) for detailed guide.

---

## 🌐 Deployment

### Main Application (Vercel)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to production
vercel --prod
```

Or connect your GitHub repository to Vercel for automatic deployments.

### Cloudflare Setup

1. **Purchase domain** (e.g., personalweb.info)
2. **Add domain to Cloudflare** and update nameservers
3. **Create R2 bucket** named "user-sites"
4. **Enable R2 public access** and note the public URL
5. **Create API token** with R2 and DNS edit permissions
6. **Configure wildcard DNS**: `*.yourdomain.com` → CNAME to R2 public URL
7. **Enable SSL**: Cloudflare provides automatic SSL for wildcards

### User Site Deployment Flow

When a user publishes their site:

1. System creates subdomain: `username.yourdomain.com`
2. HTML/CSS/JS uploaded to R2: `sites/{siteId}/`
3. Cloudflare DNS CNAME record created automatically
4. SSL certificate issued by Cloudflare (automatic)
5. Site accessible within 30 seconds (DNS propagation)

---

## 📁 Project Structure

```
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── migrations/            # Database migrations
├── public/                    # Static assets
├── src/
│   ├── app/
│   │   ├── api/              # API routes
│   │   │   ├── auth/         # Authentication
│   │   │   ├── cv/           # CV processing
│   │   │   ├── site/         # Site management
│   │   │   └── upload/       # File uploads
│   │   ├── dashboard/        # User dashboard
│   │   ├── editor/           # Site editor
│   │   ├── login/            # Login page
│   │   ├── preview/          # Site preview
│   │   └── register/         # Registration
│   ├── components/
│   │   ├── dashboard/        # Dashboard components
│   │   └── site-templates/   # Template system
│   ├── lib/
│   │   ├── auth.ts           # NextAuth config
│   │   ├── cloudflare-deploy.ts # Deployment logic
│   │   ├── design-analyzer.ts   # AI template selection
│   │   ├── gemini.ts         # Gemini AI client
│   │   ├── gemini-pdf-parser.ts # PDF parsing
│   │   ├── prisma.ts         # Prisma client
│   │   ├── template-engine.ts   # Template processing
│   │   └── sync-utils.ts     # Data sync utilities
│   └── types/
│       ├── next-auth.d.ts    # NextAuth types
│       └── templates.ts      # Template types
├── .env                       # Environment variables
├── next.config.ts             # Next.js configuration
├── package.json               # Dependencies
├── tsconfig.json              # TypeScript config
└── README.md                  # This file
```

---

## 👤 User Flow

### 1. Registration & Authentication
```
Landing Page → Register → Login → Dashboard
```

### 2. Site Creation
```
Dashboard → Upload CV (PDF)
    ↓
Gemini PDF Parser (extracts structured data)
    ↓
Optional: Add LinkedIn/GitHub links
    ↓
Optional: Custom design prompt
    ↓
Click "Generate Site"
    ↓
Design Analyzer (AI selects templates & colors)
    ↓
Template Engine (fills templates with data)
    ↓
Preview Page (iframe with generated site)
```

### 3. Revision (Optional - 1 time)
```
Preview Page → "Request Revision" button
    ↓
Enter revision request (e.g., "Make it more colorful")
    ↓
Gemini regenerates with modifications
    ↓
Updated preview shown
    ↓
Revision counter incremented (1/1 used)
```

### 4. Publishing
```
Preview Page → "Publish" button
    ↓
System creates subdomain (username.domain.com)
    ↓
Upload HTML/CSS/JS to Cloudflare R2
    ↓
Create Cloudflare DNS CNAME record
    ↓
Update database (status: published, URLs saved)
    ↓
Success! Site live at https://username.domain.com
```

### 5. Version Management
```
Dashboard → View site → Version History
    ↓
See all previous versions with timestamps
    ↓
Rollback to any previous version
    ↓
System restores content and re-publishes
```

---

## 🎯 Future Plans

### Short-term (Next 2-3 months)
- [ ] Photo upload (profile picture)
- [ ] Multiple template themes
- [ ] More revision credits (3 per site)
- [ ] SEO optimization tools
- [ ] Analytics dashboard (visitor stats)

### Mid-term (3-6 months)
- [ ] **Monetization**: Stripe integration
  - Free Plan: Subdomain, 1 site, 1 revision
  - Pro Plan ($5-10/mo): Custom domain, unlimited revisions, analytics, priority support
- [ ] Custom domain support (user-owned domains)
- [ ] Blog system with Markdown editor
- [ ] Portfolio gallery with image uploads
- [ ] LinkedIn/GitHub auto-import
- [ ] Custom CSS editor

### Long-term (6+ months)
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Advanced SEO tools
- [ ] Template marketplace
- [ ] Collaboration features
- [ ] A/B testing for designs
- [ ] Email notifications
- [ ] Social media integration

---

## 📊 Database Schema

Key models:

### User
- Authentication and profile information
- One-to-many relationship with Sites

### Site
- Website metadata and content
- HTML/CSS/JS storage
- Deployment information (subdomain, Cloudflare URL)
- Version history tracking
- Design plan (selected templates and colors)
- Revision counter

### Version (Future)
- Historical snapshots of site content
- Rollback functionality

See `prisma/schema.prisma` for complete schema.

---

## 🔧 Configuration Files

- `next.config.ts` - Next.js configuration
- `tsconfig.json` - TypeScript compiler options
- `tailwind.config.ts` - Tailwind CSS customization
- `postcss.config.mjs` - PostCSS plugins
- `eslint.config.mjs` - ESLint rules
- `prisma/schema.prisma` - Database schema

---

## 📝 Important Documents

- [TEMPLATE_SYSTEM_DOCS.md](./TEMPLATE_SYSTEM_DOCS.md) - Template system architecture
- [proje_sureci_fast.md](./proje_sureci_fast.md) - Complete development roadmap
- [page_creation_plan.md](./page_creation_plan.md) - Original page creation flow
- [plans.md](./plans.md) - Feature ideas and future plans
- [logo.md](./logo.md) - Brand assets and design requirements

---

## 🚨 Common Issues & Solutions

### Issue: Gemini API too slow
**Solution**: Add loading states, implement timeout (60s), show progress animations

### Issue: PDF parsing fails
**Solution**: Show clear error message, offer manual data entry alternative

### Issue: Cloudflare deployment fails
**Solution**: Retry mechanism (max 3 attempts), log S3 error codes, verify R2 permissions

### Issue: Invalid HTML generated
**Solution**: Template system ensures valid structure, fallback to basic template if needed

### Issue: Subdomain already taken
**Solution**: Check uniqueness before creation, suggest alternatives (username-2, etc.)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is proprietary and confidential.

---

## 📞 Support

For questions or issues:
- GitHub Issues: [Create an issue](../../issues)
- Email: support@yourdomain.com
- Documentation: See markdown files in root directory

---

## 🎉 Acknowledgments

- **Google Gemini** - AI-powered CV parsing and design analysis
- **Cloudflare** - Reliable hosting and CDN
- **Vercel** - Seamless deployment platform
- **Next.js** - Amazing React framework

---

**Built with ❤️ using Next.js, TypeScript, and AI**
