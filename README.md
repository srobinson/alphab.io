# RADE - AI Solutions Website

A modern, responsive Next.js website for RADE (Chief Artificial Intelligence Officer), showcasing AI consulting services and solutions for content creators and businesses.

## 🚀 Overview

RADE is a professional AI consulting platform that helps content creators and businesses leverage artificial intelligence to amplify their influence and maximize their impact. The website features a sleek, modern design with advanced animations and interactive elements.

## ✨ Features

### 🎨 Design & User Experience

- **Modern Dark/Light Theme** - Seamless theme switching with system preference detection
- **Responsive Design** - Optimized for all devices from mobile to desktop
- **Advanced Animations** - Smooth Framer Motion animations and transitions
- **Interactive Elements** - Animated clock background, particle effects, and hover states
- **Professional Typography** - Clean, readable fonts with proper hierarchy

### 🛠 Technical Features

- **Next.js 15** - Latest React framework with App Router
- **TypeScript** - Full type safety throughout the application
- **Tailwind CSS** - Utility-first CSS framework for rapid styling
- **Shadcn/ui Components** - High-quality, accessible UI components
- **Framer Motion** - Advanced animations and micro-interactions
- **Supabase Integration** - Real-time database and authentication
- **SEO Optimized** - Proper meta tags and structured data

### 🤖 Content Automation (NEW!)

- **Automated Industry Moves** - Real-time AI industry news from 8+ sources
- **Smart Content Classification** - AI-powered categorization and relevance scoring
- **RSS Feed Monitoring** - Hourly sync from TechCrunch, MIT Tech Review, Wired, etc.
- **Breaking News Detection** - Automatically identifies urgent developments
- **Quality Filtering** - Spam detection and relevance scoring (40+ threshold)
- **Self-Managing Blog** - Automated content curation with manual override

### 📱 Components & Pages

- **Home Page** - Hero section with animated clock and AI dispatch briefings
- **Industry Moves** - Real-time AI industry developments and trends
- **Blog System** - Automated content curation with RSS integration
- **Services** - Comprehensive AI service offerings with detailed descriptions
- **My Approach** - Personal methodology and philosophy
- **Pricing** - Service pricing and packages
- **Contact** - Professional contact form and information
- **Header Navigation** - Sticky header with mobile-responsive menu
- **Theme Toggle** - Dark/light mode switcher

## 🏗 Project Structure

```
├── app/                          # Next.js App Router pages
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout with theme provider
│   ├── page.tsx                 # Home page
│   ├── industry-moves/          # Real-time industry updates
│   ├── blog/                    # Automated blog system
│   ├── api/
│   │   ├── curated-news/        # Industry moves API (real data)
│   │   ├── blog/                # Blog articles API
│   │   ├── cron/content-sync/   # Automated content sync
│   │   ├── contacts/            # Contact form handler
│   │   └── subscribe/           # Newsletter subscription
│   ├── contact/page.tsx         # Contact page
│   ├── my-approach/page.tsx     # Approach page
│   ├── pricing/page.tsx         # Pricing page
│   └── services/page.tsx        # Services page
├── components/                   # Reusable components
│   ├── layout/
│   │   └── header.tsx           # Main navigation header
│   ├── ui/                      # Shadcn/ui components
│   │   ├── button.tsx           # Button component
│   │   ├── card.tsx             # Card component
│   │   ├── theme-toggle-button.tsx # Theme switcher
│   │   ├── animated-underline-text.tsx # Text animations
│   │   ├── particle-background.tsx # Particle effects
│   │   └── ...                  # Other UI components
│   ├── utils/
│   │   └── scroll-to-top.tsx    # Scroll to top functionality
│   ├── views/
│   │   ├── home-view.tsx        # Main home page content
│   │   └── home/
│   │       └── ai-dispatch.tsx  # AI briefings component
│   ├── industry-moves.tsx       # Industry updates component
│   ├── news-ticker.tsx          # News ticker component
│   └── theme-provider.tsx       # Theme context provider
├── lib/                         # Utility functions
│   ├── content/                 # Content automation (NEW!)
│   │   ├── sources.ts           # RSS source definitions
│   │   ├── rss-parser.ts        # RSS fetching and parsing
│   │   ├── classifier.ts        # AI content classification
│   │   └── sync-service.ts      # Content sync orchestration
│   ├── server/
│   │   ├── ingest.ts            # Content ingestion utilities
│   │   └── summarize.ts         # AI summarization
│   ├── utils.ts                 # General utilities
│   ├── supabase.ts              # Supabase client
│   └── news-feeds.ts            # News feed configuration
├── scripts/                     # Automation scripts
│   ├── ingest.ts                # Manual content ingestion
│   ├── test-automation.ts       # Automation testing suite
│   └── content.ts               # Content management CLI
├── supabase/                    # Database schema
│   ├── schema.sql               # Newsletter system schema
│   └── migrations/
│       ├── 20250810_articles.sql # Articles table
│       └── 20250130_content_automation.sql # Automation tables
├── public/                      # Static assets
│   └── images/                  # Image assets
└── styles/                      # Additional styles
```

## 🚀 Getting Started

### Prerequisites

- Node.js 22+
- pnpm (recommended) or npm
- Supabase account and project

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd alphab.io
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   Copy `.env.local.example` to `.env.local` and configure:

   ```bash
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

   # Content Automation
   CRON_SECRET=your_secure_random_secret
   OPENROUTER_API_KEY=your_openrouter_key

   # Email Configuration
   RESEND_API_KEY=your_resend_api_key
   WELCOME_FROM_EMAIL=welcome@yourdomain.com

   # Site Configuration
   NEXT_PUBLIC_SITE_URL=https://yourdomain.com
   ```

4. **Set up the database**

   ```bash
   # Run migrations in Supabase dashboard or CLI
   supabase migration up
   ```

5. **Run the development server**

   ```bash
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
pnpm build
pnpm start
```

## 🤖 Content Automation

### Automated Features

- **RSS Monitoring**: 8 active sources including TechCrunch, MIT Tech Review, Wired
- **Hourly Sync**: Automatic content updates via Vercel Cron
- **AI Classification**: Breaking/trending/update/insight categorization
- **Quality Filtering**: Relevance scoring with 40+ threshold
- **Real-time Updates**: Industry moves page shows live content

### Management Commands

```bash
# Test RSS sources
pnpm content test

# Check system status
pnpm content status

# Run manual sync
pnpm content sync

# Update industry moves cache
pnpm content cache

# Full automation test
pnpm test-automation
```

### Content Sources

| Source | Priority | Items | Category |
|--------|----------|-------|----------|
| TechCrunch AI | High | 15 | AI |
| MIT Technology Review | High | 8 | Research |
| Wired Tech | High | 10 | Tech |
| The Verge | High | 10 | Tech |
| VentureBeat AI | High | 15 | AI |
| Ars Technica | Medium | 8 | Tech |
| AI News | Medium | 12 | AI |
| Hacker News AI | Medium | 10 | AI |

## 🛠 Technology Stack

### Core Framework

- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety

### Styling & UI

- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Shadcn/ui](https://ui.shadcn.com/)** - Component library
- **[Radix UI](https://www.radix-ui.com/)** - Accessible component primitives
- **[Lucide React](https://lucide.dev/)** - Icon library

### Database & Backend

- **[Supabase](https://supabase.com/)** - PostgreSQL database and auth
- **[RSS Parser](https://www.npmjs.com/package/rss-parser)** - RSS feed processing
- **[OpenRouter](https://openrouter.ai/)** - AI summarization API

### Animation & Interaction

- **[Framer Motion](https://www.framer.com/motion/)** - Animation library
- **[React Fast Marquee](https://www.react-fast-marquee.com/)** - News ticker

### Development Tools

- **[PostCSS](https://postcss.org/)** - CSS processing
- **[ESLint](https://eslint.org/)** - Code linting
- **[TSX](https://tsx.is/)** - TypeScript execution

## 🎨 Design System

### Color Palette

- **Primary Blue**: `#3B82F6` (blue-500)
- **Dark Blue**: `#2563EB` (blue-600)
- **Light Blue**: `#60A5FA` (blue-400)
- **Background**: White/Black with theme switching
- **Text**: Gray scale with proper contrast ratios

### Typography

- **Font Family**: Inter (Google Fonts)
- **Headings**: Font weights 700-900 (bold to black)
- **Body Text**: Font weight 400-500 (normal to medium)

### Components

- **Buttons**: Multiple variants with hover states
- **Cards**: Elevated design with subtle shadows
- **Navigation**: Sticky header with smooth transitions
- **Forms**: Accessible with proper validation

## 📱 Responsive Design

The website is fully responsive with breakpoints:

- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

## 🔧 Configuration

### Theme Configuration

The theme system supports:

- Light/Dark mode toggle
- System preference detection
- Persistent theme selection
- Smooth transitions between themes

### Content Automation

Configure RSS sources in [`lib/content/sources.ts`](lib/content/sources.ts)

```typescript
{
  id: 'new-source',
  name: 'New Tech Blog',
  rssUrl: 'https://example.com/feed.xml',
  category: 'ai', // 'ai' | 'tech' | 'business' | 'research'
  priority: 'high', // 'high' | 'medium' | 'low'
  isActive: true,
  maxItems: 10
}
```

### Vercel Deployment

The project includes Vercel configuration:

```json
{
  "crons": [
    {
      "path": "/api/cron/content-sync",
      "schedule": "0 * * * *"
    }
  ]
}
```

## 📈 Performance

- **Core Web Vitals** optimized
- **Image optimization** with Next.js Image component
- **Code splitting** with dynamic imports
- **CSS optimization** with Tailwind CSS purging
- **Content Caching** with 5-minute revalidation
- **Database Optimization** with proper indexes

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Configure environment variables
3. Deploy automatically on push to main branch

### Other Platforms

The project can be deployed to any platform supporting Next.js:

- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

## 📊 Monitoring

### Content Automation Metrics

- **Content Volume**: 50-100 articles/day
- **Sync Success Rate**: 95%+ target
- **Processing Speed**: <5 minutes for full sync
- **Cache Hit Rate**: 80%+ for industry moves

### Performance Metrics

- **First Load JS**: ~157kB gzipped
- **Build Time**: <2 minutes
- **API Response Time**: <500ms average
- **Lighthouse Score**: 95+ target

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary and confidential. All rights reserved.

## 📞 Contact

For questions about this project or AI consulting services:

- **Website**: https://alphab.io
- **LinkedIn**: https://www.linkedin.com/in/your-profile

---

**Built with ❤️ using Next.js, TypeScript, Tailwind CSS, and AI-powered automation**
