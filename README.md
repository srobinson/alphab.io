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
- **News Ticker** - Real-time news feed integration
- **SEO Optimized** - Proper meta tags and structured data

### 📱 Components & Pages

- **Home Page** - Hero section with animated clock and AI dispatch briefings
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
│   ├── api/news/route.ts        # News API endpoint
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
│   ├── news-ticker.tsx          # News ticker component
│   └── theme-provider.tsx       # Theme context provider
├── hooks/                       # Custom React hooks
├── lib/                         # Utility functions
│   ├── utils.ts                 # General utilities
│   └── news-feeds.ts            # News feed configuration
├── public/                      # Static assets
│   └── images/                  # Image assets
└── styles/                      # Additional styles
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd aplab.io
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Run the development server**

   ```bash
   pnpm dev
   # or
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
pnpm build
pnpm start
```

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

### Animation & Interaction

- **[Framer Motion](https://www.framer.com/motion/)** - Animation library
- **[React Fast Marquee](https://www.react-fast-marquee.com/)** - News ticker

### Development Tools

- **[PostCSS](https://postcss.org/)** - CSS processing
- **[Autoprefixer](https://autoprefixer.github.io/)** - CSS vendor prefixes
- **[ESLint](https://eslint.org/)** - Code linting

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

### News Ticker

Configure news feeds in [`lib/news-feeds.ts`](lib/news-feeds.ts)

### Animations

Animation settings can be customized in individual components using Framer Motion variants.

## 📈 Performance

- **Core Web Vitals** optimized
- **Image optimization** with Next.js Image component
- **Code splitting** with dynamic imports
- **CSS optimization** with Tailwind CSS purging
- **Bundle analysis** available with `pnpm analyze`

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Configure environment variables if needed
3. Deploy automatically on push to main branch

### Other Platforms

The project can be deployed to any platform supporting Next.js:

- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

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

- **Website**: [Your Website URL]
- **Email**: [Your Email]
- **LinkedIn**: [Your LinkedIn Profile]

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**
