"use client"

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface PageTransitionProps {
    children: ReactNode;
}

const pageVariants = {
    initial: {
        opacity: 0,
        scale: 0.95,
        rotateX: -5,
        y: 50,
    },
    animate: {
        opacity: 1,
        scale: 1,
        rotateX: 0,
        y: 0,
        transition: {
            duration: 0.8,
            ease: [0.25, 0.46, 0.45, 0.94],
            staggerChildren: 0.1,
        }
    },
    exit: {
        opacity: 0,
        scale: 1.05,
        rotateX: 5,
        y: -50,
        transition: {
            duration: 0.6,
            ease: [0.55, 0.06, 0.68, 0.19],
        }
    }
};

const unpackVariants = {
    initial: {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
        opacity: 0,
    },
    animate: {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        opacity: 1,
        transition: {
            duration: 1.2,
            ease: [0.25, 0.46, 0.45, 0.94],
            clipPath: {
                duration: 1.0,
                ease: [0.25, 0.46, 0.45, 0.94],
            }
        }
    },
    exit: {
        clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
        opacity: 0,
        transition: {
            duration: 0.8,
            ease: [0.55, 0.06, 0.68, 0.19],
        }
    }
};

const overlayVariants = {
    initial: {
        scaleY: 0,
        originY: 0,
    },
    animate: {
        scaleY: [0, 1, 0],
        transition: {
            duration: 1.2,
            times: [0, 0.5, 1],
            ease: [0.25, 0.46, 0.45, 0.94],
        }
    }
};

export default function PageTransition({ children }: PageTransitionProps) {
    const pathname = usePathname();

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={pathname}
                style={{ perspective: 1000 }}
                className="relative"
            >
                {/* Transition overlay */}
                <motion.div
                    className="fixed inset-0 z-50 bg-gradient-to-br from-black via-gray-900 to-black"
                    variants={overlayVariants}
                    initial="initial"
                    animate="animate"
                    style={{ transformOrigin: "top" }}
                />

                {/* Page content with unpack effect */}
                <motion.div
                    variants={unpackVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    style={{ perspective: 1000 }}
                >
                    <motion.div
                        variants={pageVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                    >
                        {children}
                    </motion.div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}