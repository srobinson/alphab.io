import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Tech Accelerator - AlphaB',
    description: 'Rapid prototyping and technology acceleration services. Bringing tomorrow\'s innovations to today\'s challenges.',
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
    openGraph: {
        title: 'Tech Accelerator - AlphaB',
        description: 'Rapid prototyping and technology acceleration services. Bringing tomorrow\'s innovations to today\'s challenges.',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Tech Accelerator - AlphaB',
        description: 'Rapid prototyping and technology acceleration services. Bringing tomorrow\'s innovations to today\'s challenges.',
    },
}

export default function AcceleratorLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}