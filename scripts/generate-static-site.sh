#!/bin/bash

# Static Site Generator for alphab.io
# This script generates static HTML files that can be deployed without React/Next.js

set -e

# Configuration
OUTPUT_DIR="dist"
SITE_NAME="RADE - AI Solutions"
SITE_URL="https://alphab.io"
GA_MEASUREMENT_ID="${GA_MEASUREMENT_ID:-G-XXXXXXXXXX}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Generating static site for ${SITE_NAME}...${NC}"

# Clean and create output directory
rm -rf $OUTPUT_DIR
mkdir -p $OUTPUT_DIR/{css,js,images}

echo -e "${YELLOW}📁 Created output directory: $OUTPUT_DIR${NC}"

# Copy static assets
if [ -d "public" ]; then
  cp -r public/* $OUTPUT_DIR/
  echo -e "${GREEN}✅ Copied static assets${NC}"
fi

# Generate CSS (combining Tailwind-like styles)
cat > $OUTPUT_DIR/css/styles.css << 'EOF'
/* Reset and base styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    color: #1f2937;
    background: #ffffff;
    transition: all 0.3s ease;
}

.dark {
    background: #000000;
    color: #ffffff;
}

/* Container */
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1.5rem;
}

/* Header */
.header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid #e5e7eb;
    z-index: 1000;
    padding: 1rem 0;
}

.dark .header {
    background: rgba(0, 0, 0, 0.95);
    border-bottom-color: #374151;
}

.nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.logo {
    font-size: 1.5rem;
    font-weight: 900;
    color: #3b82f6;
    text-decoration: none;
}

.nav-links {
    display: flex;
    gap: 2rem;
    list-style: none;
}

.nav-links a {
    text-decoration: none;
    color: inherit;
    font-weight: 500;
    transition: color 0.3s ease;
}

.nav-links a:hover {
    color: #3b82f6;
}

/* Hero Section */
.hero {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 8rem 0 4rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
}

.hero-content h1 {
    font-size: clamp(2.5rem, 8vw, 6rem);
    font-weight: 900;
    margin-bottom: 1.5rem;
    line-height: 1.1;
}

.hero-content p {
    font-size: 1.25rem;
    margin-bottom: 2rem;
    opacity: 0.9;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
}

.cta-button {
    display: inline-block;
    background: #3b82f6;
    color: white;
    padding: 1rem 2rem;
    border-radius: 0.5rem;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.3s ease;
    border: none;
    cursor: pointer;
}

.cta-button:hover {
    background: #2563eb;
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);
}

/* Creator Intel Section */
.creator-intel {
    padding: 6rem 0;
    background: #f9fafb;
}

.dark .creator-intel {
    background: #111827;
}

.section-title {
    text-align: center;
    font-size: clamp(2rem, 6vw, 4rem);
    font-weight: 900;
    margin-bottom: 1rem;
    color: #1f2937;
}

.dark .section-title {
    color: #ffffff;
}

.section-subtitle {
    text-align: center;
    font-size: 1.5rem;
    color: #3b82f6;
    margin-bottom: 4rem;
    font-weight: 700;
}

.pillars-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-top: 3rem;
}

.pillar-card {
    background: white;
    padding: 2rem;
    border-radius: 1rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    border: 1px solid #e5e7eb;
}

.dark .pillar-card {
    background: #1f2937;
    border-color: #374151;
}

.pillar-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.pillar-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
}

.pillar-icon {
    width: 3rem;
    height: 3rem;
    background: #3b82f6;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.5rem;
}

.pillar-title {
    font-size: 1.25rem;
    font-weight: 900;
    color: #1f2937;
}

.dark .pillar-title {
    color: #ffffff;
}

.pillar-description {
    color: #6b7280;
    line-height: 1.6;
}

.dark .pillar-description {
    color: #d1d5db;
}

/* Footer */
.footer {
    background: #1f2937;
    color: white;
    padding: 3rem 0;
    text-align: center;
}

.footer p {
    opacity: 0.8;
}

/* Theme Toggle */
.theme-toggle {
    background: none;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    padding: 0.5rem;
    cursor: pointer;
    transition: all 0.3s ease;
}

.dark .theme-toggle {
    border-color: #374151;
}

/* Responsive */
@media (max-width: 768px) {
    .nav-links {
        display: none;
    }
    
    .hero {
        padding: 6rem 0 3rem;
    }
    
    .pillars-grid {
        grid-template-columns: 1fr;
    }
}

/* Animations */
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-in-up {
    animation: fadeInUp 0.6s ease-out;
}

/* Utility Classes */
.text-center { text-align: center; }
.mb-4 { margin-bottom: 1rem; }
.mb-8 { margin-bottom: 2rem; }
.mt-8 { margin-top: 2rem; }
.hidden { display: none; }
EOF

echo -e "${GREEN}✅ Generated CSS styles${NC}"

# Generate JavaScript for interactivity
cat > $OUTPUT_DIR/js/main.js << EOF
// Theme Toggle Functionality
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;
    
    // Check for saved theme or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    html.classList.toggle('dark', savedTheme === 'dark');
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isDark = html.classList.contains('dark');
            html.classList.toggle('dark', !isDark);
            localStorage.setItem('theme', !isDark ? 'dark' : 'light');
        });
    }
}

// Smooth scrolling for anchor links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Google Analytics
function initAnalytics() {
    if ('${GA_MEASUREMENT_ID}' && '${GA_MEASUREMENT_ID}' !== 'G-XXXXXXXXXX') {
        // Load Google Analytics
        const script1 = document.createElement('script');
        script1.async = true;
        script1.src = 'https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}';
        document.head.appendChild(script1);
        
        const script2 = document.createElement('script');
        script2.innerHTML = \`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
        \`;
        document.head.appendChild(script2);
        
        // Make gtag available globally
        window.gtag = function(){dataLayer.push(arguments);};
    }
}

// Track events
function trackEvent(action, category, label, value) {
    if (window.gtag) {
        gtag('event', action, {
            event_category: category,
            event_label: label,
            value: value
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    initSmoothScroll();
    initAnalytics();
    
    // Add click tracking to CTA buttons
    document.querySelectorAll('.cta-button').forEach(button => {
        button.addEventListener('click', () => {
            trackEvent('click', 'button', 'cta-button');
        });
    });
});
EOF

echo -e "${GREEN}✅ Generated JavaScript${NC}"

# Generate main HTML file
cat > $OUTPUT_DIR/index.html << EOF
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${SITE_NAME} | AI Solutions & Consulting</title>
    <meta name="description" content="Expert AI consulting and custom AI development services. Transform your business with ethical AI solutions, strategic implementation, and cutting-edge AI technologies.">
    <meta name="keywords" content="AI consulting, AI solutions, custom AI development, AI strategy, AI implementation, machine learning consulting">
    
    <!-- Open Graph -->
    <meta property="og:title" content="${SITE_NAME} - AI Solutions & Consulting">
    <meta property="og:description" content="Expert AI consulting and custom AI development services. Transform your business with ethical AI solutions.">
    <meta property="og:url" content="${SITE_URL}">
    <meta property="og:type" content="website">
    <meta property="og:image" content="${SITE_URL}/images/og-image.jpg">
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${SITE_NAME} - AI Solutions & Consulting">
    <meta name="twitter:description" content="Expert AI consulting and custom AI development services.">
    <meta name="twitter:image" content="${SITE_URL}/images/twitter-image.jpg">
    
    <!-- Favicon -->
    <link rel="icon" type="image/svg+xml" href="/placeholder-logo.svg">
    
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap" rel="stylesheet">
    
    <!-- Styles -->
    <link rel="stylesheet" href="/css/styles.css">
    
    <!-- Structured Data -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "${SITE_NAME}",
        "url": "${SITE_URL}",
        "logo": "${SITE_URL}/images/rade-logo.svg",
        "description": "Expert AI consulting and custom AI development services specializing in ethical AI solutions and strategic implementation.",
        "foundingDate": "2024",
        "areaServed": "Worldwide",
        "serviceType": [
            "AI Consulting",
            "Custom AI Development",
            "AI Strategy",
            "AI Implementation",
            "Machine Learning Solutions"
        ]
    }
    </script>
</head>
<body>
    <!-- Header -->
    <header class="header">
        <nav class="nav container">
            <a href="/" class="logo">RADE</a>
            <ul class="nav-links">
                <li><a href="#services">Services</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
            <button id="theme-toggle" class="theme-toggle" aria-label="Toggle theme">
                🌙
            </button>
        </nav>
    </header>

    <!-- Hero Section -->
    <section class="hero">
        <div class="container">
            <div class="hero-content animate-fade-in-up">
                <h1>Elevate Your Influence.</h1>
                <p>Navigate the AI landscape with expert insights, curated intelligence, and strategic guidance for creators and businesses.</p>
                <a href="#services" class="cta-button">Explore AI Solutions</a>
            </div>
        </div>
    </section>

    <!-- Creator Intel Section -->
    <section id="services" class="creator-intel">
        <div class="container">
            <h2 class="section-title">AI Landscape Intelligence</h2>
            <p class="section-subtitle">Navigating AI complexity so you don't have to</p>
            
            <div class="pillars-grid">
                <div class="pillar-card animate-fade-in-up">
                    <div class="pillar-header">
                        <div class="pillar-icon">🔍</div>
                        <h3 class="pillar-title">DISCOVER EMERGING TOOLS</h3>
                    </div>
                    <p class="pillar-description">
                        Daily testing and evaluation of new AI tools, separating signal from noise in the rapidly evolving landscape.
                    </p>
                </div>
                
                <div class="pillar-card animate-fade-in-up">
                    <div class="pillar-header">
                        <div class="pillar-icon">📊</div>
                        <h3 class="pillar-title">TRACK INDUSTRY SHIFTS</h3>
                    </div>
                    <p class="pillar-description">
                        Monitoring AI developments, funding rounds, and strategic moves to identify trends before they become mainstream.
                    </p>
                </div>
                
                <div class="pillar-card animate-fade-in-up">
                    <div class="pillar-header">
                        <div class="pillar-icon">💡</div>
                        <h3 class="pillar-title">CURATE ACTIONABLE INSIGHTS</h3>
                    </div>
                    <p class="pillar-description">
                        Distilling complex AI trends into practical takeaways that creators and businesses can immediately implement.
                    </p>
                </div>
                
                <div class="pillar-card animate-fade-in-up">
                    <div class="pillar-header">
                        <div class="pillar-icon">⚡</div>
                        <h3 class="pillar-title">EXPERIMENT WITH WORKFLOWS</h3>
                    </div>
                    <p class="pillar-description">
                        Real-world testing of AI integrations and workflows to validate effectiveness before recommending to clients.
                    </p>
                </div>
                
                <div class="pillar-card animate-fade-in-up">
                    <div class="pillar-header">
                        <div class="pillar-icon">🎯</div>
                        <h3 class="pillar-title">STRATEGIC IMPLEMENTATION</h3>
                    </div>
                    <p class="pillar-description">
                        Bridging the gap between AI potential and practical reality with strategic guidance and implementation support.
                    </p>
                </div>
                
                <div class="pillar-card animate-fade-in-up">
                    <div class="pillar-header">
                        <div class="pillar-icon">🌐</div>
                        <h3 class="pillar-title">COMMUNITY INTELLIGENCE</h3>
                    </div>
                    <p class="pillar-description">
                        Crowdsourcing insights from creator networks and industry experts to provide comprehensive market intelligence.
                    </p>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <p>&copy; 2024 ${SITE_NAME}. All rights reserved.</p>
        </div>
    </footer>

    <!-- Scripts -->
    <script src="/js/main.js"></script>
</body>
</html>
EOF

echo -e "${GREEN}✅ Generated index.html${NC}"

# Generate additional pages
mkdir -p $OUTPUT_DIR/{services,about,contact}

# Services page
cat > $OUTPUT_DIR/services/index.html << EOF
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Services | ${SITE_NAME}</title>
    <meta name="description" content="Comprehensive AI consulting services including strategy development, custom AI solutions, and implementation support.">
    <link rel="stylesheet" href="/css/styles.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap" rel="stylesheet">
</head>
<body>
    <header class="header">
        <nav class="nav container">
            <a href="/" class="logo">RADE</a>
            <ul class="nav-links">
                <li><a href="/services">Services</a></li>
                <li><a href="/about">About</a></li>
                <li><a href="/contact">Contact</a></li>
            </ul>
            <button id="theme-toggle" class="theme-toggle">🌙</button>
        </nav>
    </header>

    <main style="padding-top: 6rem;">
        <section class="creator-intel">
            <div class="container">
                <h1 class="section-title">Our Services</h1>
                <p class="section-subtitle">Comprehensive AI solutions for modern businesses</p>
                
                <div class="pillars-grid">
                    <div class="pillar-card">
                        <div class="pillar-header">
                            <div class="pillar-icon">🎯</div>
                            <h3 class="pillar-title">AI STRATEGY & CONSULTING</h3>
                        </div>
                        <p class="pillar-description">
                            Develop clear, actionable AI roadmaps aligned with your business goals and market opportunities.
                        </p>
                    </div>
                    
                    <div class="pillar-card">
                        <div class="pillar-header">
                            <div class="pillar-icon">🔧</div>
                            <h3 class="pillar-title">CUSTOM AI DEVELOPMENT</h3>
                        </div>
                        <p class="pillar-description">
                            Bespoke AI models and solutions tailored to your unique data, challenges, and requirements.
                        </p>
                    </div>
                    
                    <div class="pillar-card">
                        <div class="pillar-header">
                            <div class="pillar-icon">⚡</div>
                            <h3 class="pillar-title">AI IMPLEMENTATION</h3>
                        </div>
                        <p class="pillar-description">
                            Seamless integration of AI capabilities into your existing workflows and systems.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    </main>

    <footer class="footer">
        <div class="container">
            <p>&copy; 2024 ${SITE_NAME}. All rights reserved.</p>
        </div>
    </footer>

    <script src="/js/main.js"></script>
</body>
</html>
EOF

echo -e "${GREEN}✅ Generated services page${NC}"

# Generate robots.txt
cat > $OUTPUT_DIR/robots.txt << EOF
User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
EOF

# Generate sitemap.xml
cat > $OUTPUT_DIR/sitemap.xml << EOF
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>${SITE_URL}/</loc>
        <lastmod>$(date +%Y-%m-%d)</lastmod>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>${SITE_URL}/services/</loc>
        <lastmod>$(date +%Y-%m-%d)</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>
</urlset>
EOF

echo -e "${GREEN}✅ Generated SEO files (robots.txt, sitemap.xml)${NC}"

# Create deployment script
cat > $OUTPUT_DIR/deploy.sh << 'EOF'
#!/bin/bash
# Simple deployment script
# Usage: ./deploy.sh [target]

TARGET=${1:-"local"}

case $TARGET in
    "netlify")
        echo "Deploying to Netlify..."
        npx netlify deploy --prod --dir=.
        ;;
    "surge")
        echo "Deploying to Surge.sh..."
        npx surge . --domain your-domain.surge.sh
        ;;
    "github-pages")
        echo "Deploying to GitHub Pages..."
        git add .
        git commit -m "Deploy static site"
        git push origin gh-pages
        ;;
    "local")
        echo "Starting local server..."
        python3 -m http.server 8000 || python -m SimpleHTTPServer 8000
        ;;
    *)
        echo "Unknown target: $TARGET"
        echo "Available targets: netlify, surge, github-pages, local"
        ;;
esac
EOF

chmod +x $OUTPUT_DIR/deploy.sh

echo -e "${GREEN}✅ Generated deployment script${NC}"

# Generate summary
echo -e "\n${BLUE}📋 Static Site Generation Complete!${NC}"
echo -e "${YELLOW}Output directory: $OUTPUT_DIR${NC}"
echo -e "${YELLOW}Files generated:${NC}"
echo "  📄 index.html (main page)"
echo "  📄 services/index.html"
echo "  🎨 css/styles.css"
echo "  ⚡ js/main.js"
echo "  🤖 robots.txt"
echo "  🗺️  sitemap.xml"
echo "  🚀 deploy.sh"

echo -e "\n${GREEN}🎯 Next Steps:${NC}"
echo "1. Set GA_MEASUREMENT_ID environment variable before running"
echo "2. Test locally: cd $OUTPUT_DIR && ./deploy.sh local"
echo "3. Deploy: cd $OUTPUT_DIR && ./deploy.sh [netlify|surge|github-pages]"
echo "4. Update any placeholder content and images"

echo -e "\n${BLUE}✨ Your static site is ready for deployment!${NC}"
EOF

chmod +x scripts/generate-static-site.sh

echo -e "${GREEN}✅ Created static site generator script${NC}"

# Create a simple usage guide
cat > DOCS/STATIC_SITE_GENERATION.md << 'EOF'
# Static Site Generation Guide

This guide explains how to generate and deploy static HTML files from your Next.js application.

## Quick Start

```bash
# Set your Google Analytics ID (optional)
export GA_MEASUREMENT_ID="G-XXXXXXXXXX"

# Generate static site
./scripts/generate-static-site.sh

# Test locally
cd dist && ./deploy.sh local

# Deploy to hosting service
cd dist && ./deploy.sh netlify
```

## What Gets Generated

- **index.html** - Main homepage with AI Intelligence section
- **services/index.html** - Services page
- **css/styles.css** - Complete styling (Tailwind-inspired)
- **js/main.js** - Interactive features and analytics
- **robots.txt** - SEO configuration
- **sitemap.xml** - Search engine sitemap
- **deploy.sh** - Deployment helper script

## Features Included

✅ Responsive design
✅ Dark/light theme toggle
✅ Google Analytics integration
✅ SEO optimization
✅ Smooth scrolling
✅ Modern CSS animations
✅ Cross-browser compatibility

## Deployment Options

### Netlify
```bash
cd dist
./deploy.sh netlify
```

### Surge.sh
```bash
cd dist
./deploy.sh surge
```

### GitHub Pages
```bash
cd dist
./deploy.sh github-pages
```

### Any Static Host
Simply upload the contents of the `dist` folder to your hosting provider.

## Customization

### Update Content
Edit the HTML templates in `scripts/generate-static-site.sh`

### Modify Styles
Update the CSS section in the generator script

### Add Pages
Add new page generation in the script following the existing pattern

### Environment Variables
- `GA_MEASUREMENT_ID` - Google Analytics measurement ID
- `SITE_URL` - Your site's URL (defaults to https://alphab.io)
- `SITE_NAME` - Your site's name (defaults to RADE - AI Solutions)

## Benefits of Static Generation

- **Performance** - No server-side rendering overhead
- **Security** - No server vulnerabilities
- **Cost** - Free hosting on many platforms
- **Reliability** - No server downtime
- **SEO** - Perfect for search engines
- **CDN** - Easy to distribute globally

## File Structure

```
dist/
├── index.html
├── services/
│   └── index.html
├── css/
│   └── styles.css
├── js/
│   └── main.js
├── images/ (copied from public/)
├── robots.txt
├── sitemap.xml
└── deploy.sh
```
EOF

echo -e "${GREEN}✅ Created static site documentation${NC}"
