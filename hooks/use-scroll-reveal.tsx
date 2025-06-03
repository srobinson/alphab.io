"use client"

import { useEffect, useRef, useState } from "react"

interface UseScrollRevealOptions {
    threshold?: number
    rootMargin?: string
    triggerOnce?: boolean
    delay?: number
}

export function useScrollReveal(options: UseScrollRevealOptions = {}) {
    const {
        threshold = 0.1,
        rootMargin = "0px 0px -100px 0px",
        triggerOnce = true,
        delay = 0
    } = options

    const [isVisible, setIsVisible] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const element = ref.current
        if (!element) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    if (delay > 0) {
                        setTimeout(() => setIsVisible(true), delay)
                    } else {
                        setIsVisible(true)
                    }

                    if (triggerOnce) {
                        observer.unobserve(element)
                    }
                } else if (!triggerOnce) {
                    setIsVisible(false)
                }
            },
            {
                threshold,
                rootMargin
            }
        )

        observer.observe(element)

        return () => {
            observer.unobserve(element)
        }
    }, [threshold, rootMargin, triggerOnce, delay])

    return { ref, isVisible }
}

// Animation variants for common use cases
export const scrollRevealVariants = {
    fadeInUp: {
        hidden: { opacity: 0, y: 60, scale: 0.95 },
        visible: { opacity: 1, y: 0, scale: 1 }
    },
    fadeInDown: {
        hidden: { opacity: 0, y: -60, scale: 0.95 },
        visible: { opacity: 1, y: 0, scale: 1 }
    },
    fadeInLeft: {
        hidden: { opacity: 0, x: -60, scale: 0.95 },
        visible: { opacity: 1, x: 0, scale: 1 }
    },
    fadeInRight: {
        hidden: { opacity: 0, x: 60, scale: 0.95 },
        visible: { opacity: 1, x: 0, scale: 1 }
    },
    scaleIn: {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1 }
    },
    slideInUp: {
        hidden: { opacity: 0, y: 100 },
        visible: { opacity: 1, y: 0 }
    }
}