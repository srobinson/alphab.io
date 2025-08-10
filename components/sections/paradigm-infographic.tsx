"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import Link from "next/link";

const oldWayItems = [
    "Expensive agency retainers",
    "Multiple layers of account managers",
    "Slow implementation cycles",
    "Generic AI strategies",
    "Paying for overhead, not expertise",
];

const radeWayItems = [
    "Direct access to senior AI expertise",
    "Focused, high-impact engagements",
    "Immediate implementation and results",
    "Customized AI solutions for your needs",
    "100% of your investment goes to expertise",
];

export function ParadigmInfographic() {
    return (
        <motion.div
            className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 rounded-2xl md:rounded-3xl p-8 md:p-12 lg:p-16 border border-blue-400/30 shadow-2xl shadow-blue-500/25 relative overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-cyan-500/5 pointer-events-none" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Title */}
            <motion.h2
                className="relative z-10 text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black text-center mb-12 md:mb-16"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
            >
                <span className="text-white">THE</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                    NEW PARADIGM
                </span>
                <span className="text-white">OF AI CONSULTING</span>
            </motion.h2>

            {/* Comparison Grid */}
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
                {/* The Old Way */}
                <motion.div
                    className="space-y-6"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <div className="flex items-center gap-4 mb-8">
                        <div className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full shadow-xl">
                            <span className="text-white font-black text-xl md:text-2xl">
                                1
                            </span>
                        </div>
                        <h3 className="text-2xl md:text-3xl lg:text-4xl font-black text-white">
                            The Old Way
                        </h3>
                    </div>

                    <div className="space-y-4">
                        {oldWayItems.map((item, index) => (
                            <motion.div
                                key={index}
                                className="flex items-start gap-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl backdrop-blur-sm"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{
                                    duration: 0.5,
                                    delay: 0.6 + index * 0.1,
                                }}
                            >
                                <X className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
                                <span className="text-red-100 text-lg font-medium leading-relaxed">
                                    {item}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* The RADE Way */}
                <motion.div
                    className="space-y-6"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <div className="flex items-center gap-4 mb-8">
                        <div className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full shadow-xl">
                            <span className="text-white font-black text-xl md:text-2xl">
                                2
                            </span>
                        </div>
                        <h3 className="text-2xl md:text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                            The RADE Way
                        </h3>
                    </div>

                    <div className="space-y-4">
                        {radeWayItems.map((item, index) => (
                            <motion.div
                                key={index}
                                className="flex items-start gap-4 p-4 bg-green-500/10 border border-green-500/20 rounded-xl backdrop-blur-sm hover:bg-green-500/15 transition-all duration-300"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{
                                    duration: 0.5,
                                    delay: 0.6 + index * 0.1,
                                }}
                            >
                                <Check className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                                <span className="text-green-100 text-lg font-medium leading-relaxed">
                                    {item}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Bottom CTA */}
            <motion.div
                className="relative z-10 text-center mt-12 md:mt-16"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
            >
                <Link href="/contact" passHref legacyBehavior>
                    <Button
                        size="lg"
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold px-8 py-4 text-lg rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                    >
                        Ready to make the switch?
                    </Button>
                </Link>
            </motion.div>
        </motion.div>
    );
}
