"use client"

import { useState, useEffect } from 'react';
import { ArrowLeft, Zap, Cpu, Rocket, Code, Lightbulb, Gauge, Mail, CheckCircle } from 'lucide-react';
import Link from 'next/link';

const TechAccelerator = () => {
    const [time, setTime] = useState(new Date());
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            const resp = await fetch('/api/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    publication: 'tech_accelerator',
                    source: 'tech_accelerator_page',
                }),
            })
            if (!resp.ok) {
                const data = await resp.json().catch(() => ({}))
                throw new Error(data.error || 'Failed to subscribe')
            }

            setIsSubmitted(true);
            setEmail('');
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Failed to save email. Please try again.';
            setError(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const services = [
        {
            icon: Rocket,
            title: "RAPID PROTOTYPING",
            description: "FROM CONCEPT TO REALITY IN DAYS, NOT MONTHS",
            color: "from-orange-500 to-red-500"
        },
        {
            icon: Code,
            title: "MVP DEVELOPMENT",
            description: "MINIMUM VIABLE PRODUCTS THAT MAXIMIZE IMPACT",
            color: "from-purple-500 to-pink-500"
        },
        {
            icon: Lightbulb,
            title: "INNOVATION LABS",
            description: "EXPERIMENTAL TECH FOR BREAKTHROUGH SOLUTIONS",
            color: "from-cyan-500 to-blue-500"
        },
        {
            icon: Gauge,
            title: "PERFORMANCE OPTIMIZATION",
            description: "SPEED IS EVERYTHING IN THE DIGITAL RACE",
            color: "from-green-500 to-teal-500"
        }
    ];

    const stats = [
        { number: "72H", label: "AVERAGE PROTOTYPE TIME" },
        { number: "300%", label: "FASTER DEVELOPMENT" },
        { number: "24/7", label: "CONTINUOUS ACCELERATION" },
        { number: "∞", label: "INNOVATION POTENTIAL" }
    ];

    return (
        <div className="min-h-screen bg-black text-white overflow-hidden relative">
            {/* Animated background */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(0,255,150,0.1),transparent_50%)]"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,0,0.1),transparent_50%)]"></div>
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_48%,rgba(255,255,255,0.02)_49%,rgba(255,255,255,0.02)_51%,transparent_52%)] bg-[length:15px_15px] animate-pulse"></div>
            </div>

            {/* Top navigation */}
            <div className="relative z-10 flex justify-between items-center p-4 sm:p-6 border-b border-white/10">
                <Link
                    href="/"
                    className="flex items-center space-x-2 sm:space-x-3 text-white hover:text-green-400 transition-colors group"
                >
                    <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-xs sm:text-sm tracking-widest">BACK TO ALPHAB</span>
                </Link>
                <div className="text-[10px] sm:text-xs tracking-widest text-gray-400 font-mono">
                    {time.toLocaleTimeString()}
                </div>
            </div>

            <div className="relative z-10 px-4 sm:px-6 py-8 sm:py-12">
                {/* Main header */}
                <div className="text-center mb-12 sm:mb-16">

                    <div className="relative mb-6 sm:mb-8">
                        <h1 className="text-[3rem] sm:text-[4rem] md:text-[6rem] lg:text-[8rem] xl:text-[12rem] font-black leading-none tracking-tighter">
                            <span className="block bg-gradient-to-r from-green-400 via-yellow-400 to-green-400 bg-clip-text text-transparent">
                                TECH
                            </span>
                            <span className="block bg-gradient-to-r from-yellow-400 via-green-400 to-yellow-400 bg-clip-text text-transparent -mt-2 sm:-mt-4">
                                ACCELERATOR
                            </span>
                        </h1>
                        <div className="absolute inset-0 text-[3rem] sm:text-[4rem] md:text-[6rem] lg:text-[8rem] xl:text-[12rem] font-black leading-none tracking-tighter">
                            <span className="block text-transparent bg-gradient-to-r from-green-500 via-yellow-500 to-green-500 bg-clip-text opacity-20 blur-sm">
                                TECH
                            </span>
                            <span className="block text-transparent bg-gradient-to-r from-yellow-500 via-green-500 to-yellow-500 bg-clip-text opacity-20 blur-sm -mt-2 sm:-mt-4">
                                ACCELERATOR
                            </span>
                        </div>
                    </div>

                    <h2 className="text-lg sm:text-xl md:text-2xl lg:text-4xl font-bold tracking-wider mb-6 sm:mb-8 max-w-4xl mx-auto px-4 sm:px-0">
                        <span className="text-white">RAPID</span>{' '}
                        <span className="bg-gradient-to-r from-green-400 to-yellow-400 bg-clip-text text-transparent">
                            PROTOTYPING
                        </span>{' '}
                        <span className="text-white">&</span>{' '}
                        <span className="bg-gradient-to-r from-yellow-400 to-green-400 bg-clip-text text-transparent">
                            TECHNOLOGY
                        </span>{' '}
                        <span className="text-white">ACCELERATION</span>
                    </h2>

                    <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed px-4 sm:px-0">
                        BRINGING TOMORROW&rsquo;S INNOVATIONS TO TODAY&rsquo;S CHALLENGES
                    </p>
                </div>

                {/* Services grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto mb-12 sm:mb-16 lg:mb-20">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className="group relative overflow-hidden border border-white/10 bg-black/50 backdrop-blur-sm hover:border-green-400/50 transition-all duration-500 p-4 sm:p-6 lg:p-8"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>

                            <div className="relative">
                                <service.icon className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-green-400 mb-4 sm:mb-6" />
                                <h3 className="text-lg sm:text-xl lg:text-2xl font-black tracking-tighter mb-3 sm:mb-4 text-white">
                                    {service.title}
                                </h3>
                                <p className="text-gray-400 text-xs sm:text-sm tracking-wide leading-relaxed">
                                    {service.description}
                                </p>
                            </div>

                            {/* Scan line effect */}
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-400/10 to-transparent h-20 w-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-500"></div>
                        </div>
                    ))}
                </div>

                {/* Stats section */}
                <div className="border-t border-b border-white/10 py-8 sm:py-12 lg:py-16 mb-12 sm:mb-16 lg:mb-20">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 max-w-4xl mx-auto">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-black text-green-400 mb-1 sm:mb-2">
                                    {stat.number}
                                </div>
                                <div className="text-[10px] sm:text-xs tracking-widest text-gray-400 px-1">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Email signup section */}
                <div className="text-center max-w-4xl mx-auto">
                    <div className="border border-white/20 bg-black/50 backdrop-blur-sm p-6 sm:p-8 lg:p-12">
                        <Cpu className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 text-yellow-400 mx-auto mb-6 sm:mb-8 animate-pulse" />
                        <h3 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tighter mb-4 sm:mb-6">
                            <span className="text-white">LAUNCHING</span>{' '}
                            <span className="bg-gradient-to-r from-yellow-400 to-green-400 bg-clip-text text-transparent">
                                SOON
                            </span>
                        </h3>
                        <p className="text-gray-300 text-sm sm:text-base lg:text-lg mb-6 sm:mb-8 leading-relaxed px-4 sm:px-0">
                            Revolutionary acceleration services are being engineered.<br className="hidden sm:block" />
                            <span className="sm:hidden"> </span>Be the first to know when we launch.
                        </p>

                        {!isSubmitted ? (
                            <form onSubmit={handleEmailSubmit} className="max-w-md mx-auto mb-6 sm:mb-8">
                                <div className="flex flex-col gap-3 sm:gap-4">
                                    <div className="w-full">
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Enter your email"
                                            required
                                            className="w-full px-4 py-3 bg-black/70 border border-green-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20 text-sm sm:text-base"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full px-6 sm:px-8 py-3 bg-gradient-to-r from-green-500 to-yellow-500 text-black font-bold rounded-lg hover:from-green-400 hover:to-yellow-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                                                JOINING...
                                            </>
                                        ) : (
                                            <>
                                                <Mail className="w-4 h-4" />
                                                GET NOTIFIED
                                            </>
                                        )}
                                    </button>
                                </div>
                                {error && (
                                    <p className="text-red-400 text-xs sm:text-sm mt-2">{error}</p>
                                )}
                            </form>
                        ) : (
                            <div className="max-w-md mx-auto mb-6 sm:mb-8 p-4 sm:p-6 bg-green-500/10 border border-green-500/30 rounded-lg">
                                <div className="flex items-center justify-center gap-2 sm:gap-3 text-green-400 mb-2">
                                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                                    <span className="text-base sm:text-lg font-bold">SUCCESS!</span>
                                </div>
                                <p className="text-gray-300 text-sm sm:text-base">
                                    You&apos;ll be the first to know when Tech Accelerator launches.
                                </p>
                            </div>
                        )}

                        <div className="flex items-center justify-center space-x-2 sm:space-x-4 text-green-400">
                            <Zap className="w-4 h-4 sm:w-6 sm:h-6 flex-shrink-0" />
                            <span className="text-xs sm:text-sm lg:text-lg tracking-wider text-center">UNPRECEDENTED DEVELOPMENT VELOCITY</span>
                            <Zap className="w-4 h-4 sm:w-6 sm:h-6 flex-shrink-0" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Corner decorations */}
            <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-green-500/20"></div>
            <div className="absolute top-0 right-0 w-32 h-32 border-r-2 border-t-2 border-green-500/20"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 border-l-2 border-b-2 border-green-500/20"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-green-500/20"></div>
        </div>
    );
};

export default TechAccelerator;
