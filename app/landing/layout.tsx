import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'AlphaB - Innovation at the Speed of Thought',
    description: 'Explore cutting-edge AI consulting, experimental technology projects, and rapid prototyping services. Where innovation meets execution.',
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
    openGraph: {
        title: 'AlphaB - Innovation at the Speed of Thought',
        description: 'Explore cutting-edge AI consulting, experimental technology projects, and rapid prototyping services. Where innovation meets execution.',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'AlphaB - Innovation at the Speed of Thought',
        description: 'Explore cutting-edge AI consulting, experimental technology projects, and rapid prototyping services. Where innovation meets execution.',
    },
}

export default function LandingLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}