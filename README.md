# AlphaB - AI Solutions & Innovation

AlphaB delivers expert AI solutions and consulting services through RADE, our flagship AI consulting practice. Transform your business with ethical AI solutions, strategic implementation, and cutting-edge technologies.

## 🚀 Project Structure

```
/
├── src/                      # Application source code
│   ├── app/                  # Next.js App Router
│   │   ├── (routes)/
│   │   │   ├── page.tsx      # Server Component
│   │   │   ├── loading.tsx   # Loading UI
│   │   │   ├── error.tsx     # Error boundary
│   │   │   └── _components/  # Private folder for Client Components
│   │   └── api/              # API routes
│   ├── components/           # Shared React components
│   │   ├── ui/               # UI primitives
│   │   ├── sections/         # Page sections
│   │   └── layout/           # Layout components
│   ├── lib/                  # Utility functions
│   │   ├── blog.ts           # Blog data fetching
│   │   └── cache.ts          # Cache configuration
│   ├── hooks/                # Custom React hooks
│   └── styles/               # Global styles
├── content/                  # Content files (MDX, JSON)
├── public/                   # Static assets
└── (config files)            # Configuration at root
```

## 🏗️ Architecture

- **Server Components by default** for better performance
- **Client Components only for interactivity** (animations, forms)
- **Private folders (_components)** for colocated components
- **Shared utilities in /lib** directory
- **src/ directory** for clean separation of code and config

## 📡 Data Fetching

- Server-side data fetching with React cache()
- ISR with revalidation times (5 min for blog index, 1 hour for posts)
- API routes with cache headers
- generateStaticParams for static generation

## ⚡ Performance Optimizations

- Variable font loading with display: swap
- Loading states with loading.tsx files
- Error boundaries with error.tsx files
- Suspense boundaries for progressive rendering
- Image optimization with Next.js Image component
- Server Components reduce client bundle size

## 🛠️ Development

- Run `pnpm dev` to start development server
- All routes automatically support loading and error states
- Use `@/` alias for imports (points to src/)
- Private folders (prefixed with _) won't create routes

## 📋 Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm type-check` - Run TypeScript type checking

## 🔧 Configuration

- **Next.js 15** with App Router
- **React 19** with Server Components
- **TypeScript** with strict configuration
- **Tailwind CSS** for styling
- **Biome** for linting and formatting

## 📚 Key Features

- **Blog System**: MDX-based blog with static generation
- **Contact Forms**: Server-side form handling with validation
- **Service Pages**: Static content with animations
- **Error Boundaries**: Graceful error handling
- **Loading States**: Skeleton loaders for better UX
- **Responsive Design**: Mobile-first approach

## 🚀 Deployment

The application is optimized for deployment on Vercel with:
- Automatic static optimization
- ISR for dynamic content
- API route optimization
- Image optimization

## 📖 Next.js 15 Best Practices Implemented

### 1. **src/ Directory Structure**
- Clean separation between application code and configuration
- Better project organization for larger codebases
- Improved maintainability and scalability

### 2. **Server Components First**
- Faster initial page loads (no client-side JS for data fetching)
- Better SEO (content rendered on server)
- Smaller client bundle sizes
- Progressive enhancement with Suspense

### 3. **Loading & Error States**
- `loading.tsx` files for automatic loading UI
- `error.tsx` files for graceful error handling
- `not-found.tsx` files for custom 404 pages
- Consistent UX across all routes

### 4. **Font Optimization**
- Variable font configuration with `display: swap`
- CSS variables for font families
- Prevents FOIT (Flash of Invisible Text)
- Better performance with font fallbacks

### 5. **Data Fetching Patterns**
- React `cache()` for automatic request deduplication
- ISR with configurable revalidation times
- Centralized cache configuration
- Type-safe data fetching utilities

### 6. **API Route Optimization**
- TypeScript interfaces for request/response
- Enhanced error handling with specific messages
- Consistent cache headers
- Better logging for debugging

### 7. **Component Architecture**
- Server Components for static content
- Client Components only for interactivity
- Private folders for colocated components
- Shared utilities in dedicated directories

## 🎯 Performance Benefits

- **Faster Page Loads**: Server Components render content immediately
- **Better SEO**: Full content available to search engines
- **Smaller Bundles**: Less JavaScript sent to clients
- **Improved UX**: Loading states and error boundaries
- **Better Caching**: ISR and cache optimization strategies

## 🔒 Security

- Input validation and sanitization
- Rate limiting on API routes
- Error message sanitization
- Secure headers and CSP

## 📞 Support

For questions or support, please contact us through the contact form or email us directly at contact@alphab.io.