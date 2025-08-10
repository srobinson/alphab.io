import type { Metadata } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export const metadata: Metadata = {
    title: 'AlphaB - Innovation at the Speed of Thought',
    description:
        'Explore cutting-edge AI consulting, experimental technology projects, and rapid prototyping services. Where innovation meets execution.',
    metadataBase: new URL(siteUrl),
    openGraph: {
        title: 'AlphaB - Innovation at the Speed of Thought',
        description:
            'Explore cutting-edge AI consulting, experimental technology projects, and rapid prototyping services. Where innovation meets execution.',
        type: 'website',
        url: siteUrl,
        siteName: 'AlphaB',
        images: [
            {
                url: `${siteUrl}/logo.png`,
                width: 1080,
                height: 1080,
                alt: 'AlphaB - Innovation at the Speed of Thought',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'AlphaB - Innovation at the Speed of Thought',
        description:
            'Explore cutting-edge AI consulting, experimental technology projects, and rapid prototyping services. Where innovation meets execution.',
        images: [`${siteUrl}/logo.png`],
        site: '@alphab_io',
        creator: '@alphab_io',
    },
    icons: {
        icon: [
            { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
            { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
            { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
        ],
        apple: [
            { url: '/apple-icon-57x57.png', sizes: '57x57' },
            { url: '/apple-icon-60x60.png', sizes: '60x60' },
            { url: '/apple-icon-72x72.png', sizes: '72x72' },
            { url: '/apple-icon-76x76.png', sizes: '76x76' },
            { url: '/apple-icon-114x114.png', sizes: '114x114' },
            { url: '/apple-icon-120x120.png', sizes: '120x120' },
            { url: '/apple-icon-144x144.png', sizes: '144x144' },
            { url: '/apple-icon-152x152.png', sizes: '152x152' },
            { url: '/apple-icon-180x180.png', sizes: '180x180' },
        ],
        other: [{ rel: 'manifest', url: '/manifest.json' }],
    },
}

export default function LandingLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}