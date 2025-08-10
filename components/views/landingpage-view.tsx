"use client"

import { useState, useEffect } from 'react';
import { ArrowRight, Zap, Star, Circle, Mail, CheckCircle, User, Lightbulb, Rocket } from 'lucide-react';
import { createClient } from '@/lib/supabase';

const Index = () => {
    const [time, setTime] = useState(new Date());
    const [mounted, setMounted] = useState(false);
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');
    const supabase = createClient();

    useEffect(() => {
        setMounted(true);
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const handleNewsletterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            if (!supabase) {
                throw new Error('Database connection not available. Please try again later.');
            }

            const { data, error } = await supabase.rpc('upsert_user_and_subscribe', {
                p_email: email,
                p_publication: 'general',
                p_source: 'landing_page'
            });

            if (error) throw error;

            setIsSubmitted(true);
            setEmail('');
        } catch (err: any) {
            setError(err.message || 'Failed to subscribe. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const links = [
        {
            title: "RADE AI CONSULTING",
            subtitle: "Strategic AI implementation and consulting services. Transform your business with custom AI solutions, governance frameworks, and expert guidance.",
            status: "LIVE NOW",
            color: "from-red-500 via-pink-500 to-yellow-500",
            accent: "red",
            url: "https://rade.alphab.io",
            emoji: "🤖"
        },
        {
            title: "AWAKE CAREFUL ANT",
            subtitle: "Innovative digital solutions and creative technology projects. Explore cutting-edge developments and experimental innovations.",
            status: "ACTIVE",
            color: "from-blue-500 via-purple-500 to-pink-500",
            accent: "blue",
            url: "https://awake-careful-ant.com",
            emoji: "🐜"
        },
        {
            title: "TECH ACCELERATOR",
            subtitle: "Rapid prototyping and technology acceleration services. Bringing tomorrow's innovations to today's challenges.",
            status: "WIP",
            color: "from-green-400 via-cyan-400 to-blue-500",
            accent: "green",
            url: "/accelerator",
            emoji: "⚡"
        }
    ];

    return (
        <div className="min-h-screen bg-black text-white overflow-hidden relative">
            {/* Animated background pattern */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,0,150,0.1),transparent_50%)]"></div>
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_48%,rgba(255,255,255,0.03)_49%,rgba(255,255,255,0.03)_51%,transparent_52%)] bg-[length:20px_20px] animate-pulse"></div>
            </div>

            {/* Top bar with time */}
            <div className="relative z-10 flex justify-between items-center p-6 border-b border-white/10">
                <div className="flex items-center space-x-2">
                    <Circle className="w-3 h-3 fill-red-500 text-red-500 animate-pulse" />
                    <span className="text-xs tracking-widest text-gray-400">LIVE</span>
                </div>
                <div className="text-xs tracking-widest text-gray-400 font-mono" suppressHydrationWarning>
                    {mounted ? time.toLocaleTimeString() : ""}
                </div>
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center min-h-[90vh] px-4 sm:px-6">
                {/* Main title */}
                <div className="text-center mb-16 w-full">
                    <div className="relative overflow-hidden px-2 sm:px-4">
                        <h1 className="text-[3.5rem] sm:text-[5rem] md:text-[8rem] lg:text-[12rem] xl:text-[16rem] font-black leading-none tracking-tighter whitespace-nowrap">
                            <span className="block bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent">
                                ALPHAB
                            </span>
                        </h1>
                        <div className="absolute inset-0 text-[3.5rem] sm:text-[5rem] md:text-[8rem] lg:text-[12rem] xl:text-[16rem] font-black leading-none tracking-tighter whitespace-nowrap px-2 sm:px-4">
                            <span className="block text-transparent bg-gradient-to-r from-red-500 via-pink-500 to-yellow-500 bg-clip-text opacity-30 blur-sm">
                                ALPHAB
                            </span>
                        </div>
                    </div>

                    <div className="mt-6 sm:mt-8 mb-4">
                        <div className="inline-block border border-white/20 rounded-full px-4 sm:px-6 py-2 backdrop-blur-sm">
                            <span className="text-xs sm:text-sm tracking-[0.2em] sm:tracking-[0.3em] text-gray-300 font-light">
                                INNOVATION AT THE SPEED OF THOUGHT
                            </span>
                        </div>
                    </div>

                    <h2 className="text-xl sm:text-2xl md:text-4xl font-bold tracking-wider mb-6 sm:mb-8 px-4 sm:px-0">
                        <span className="text-white">INTERESTING!</span>{' '}
                        <span className="bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
                            LINKS
                        </span>{' '}
                        <span className="text-white">&</span>{' '}
                        <span className="bg-gradient-to-r from-yellow-400 to-red-400 bg-clip-text text-transparent">
                            EXPERIMENTS
                        </span>
                    </h2>
                </div>

                {/* Links grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full max-w-7xl px-4 sm:px-0">
                    {links.map((link, index) => (
                        <a
                            key={index}
                            href={link.url}
                            className="group relative overflow-hidden block"
                            style={{ animationDelay: `${index * 0.1}s` }}
                            target={link.url.startsWith('http') ? '_blank' : '_self'}
                            rel={link.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                        >
                            {/* Status indicator */}
                            <div className="absolute top-4 right-4 z-20">
                                <div className={`text-xs px-2 py-1 rounded-full border ${link.accent === 'red' ? 'border-red-500/50 text-red-400' :
                                    link.accent === 'blue' ? 'border-blue-500/50 text-blue-400' :
                                        'border-green-500/50 text-green-400'
                                    }`}>
                                    {link.status}
                                </div>
                            </div>

                            {/* Main card */}
                            <div className="relative h-72 sm:h-80 border border-white/10 bg-black/50 backdrop-blur-sm group-hover:border-white/30 transition-all duration-500 overflow-hidden">
                                {/* Background gradient */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${link.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>

                                {/* Content */}
                                <div className="relative p-4 sm:p-6 lg:p-8 h-full flex flex-col justify-between">
                                    <div>
                                        <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">{link.emoji}</div>
                                        <h3 className="text-lg sm:text-xl lg:text-2xl font-black tracking-tighter mb-3 sm:mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-white group-hover:to-gray-400 transition-all duration-300">
                                            {link.title}
                                        </h3>
                                        <p className="text-gray-400 text-xs sm:text-sm tracking-wide leading-relaxed">
                                            {link.subtitle}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex space-x-1">
                                            {[...Array(3)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-4 h-4 ${link.accent === 'red' ? 'text-red-500' :
                                                        link.accent === 'blue' ? 'text-blue-500' :
                                                            'text-green-500'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                        <ArrowRight className="w-6 h-6 text-white group-hover:translate-x-2 transition-transform duration-300" />
                                    </div>
                                </div>

                                {/* Scan line effect */}
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent h-20 w-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-500"></div>
                            </div>
                        </a>
                    ))}
                </div>

                {/* About AlphaB Section - COMMENTED OUT FOR NOW */}
                {/*
                <div className="mt-16 sm:mt-24 lg:mt-32 w-full max-w-6xl px-4 sm:px-0">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-3xl"></div>

                        <div className="relative border border-white/10 bg-black/50 backdrop-blur-sm p-6 sm:p-8 lg:p-12 xl:p-16">
                            <div className="text-center mb-8 sm:mb-12">
                                <div className="inline-flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
                                    <User className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
                                    <span className="text-xs sm:text-sm tracking-[0.2em] sm:tracking-[0.3em] text-gray-300 font-light">WHO IS ALPHAB</span>
                                    <User className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
                                </div>
                                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-black tracking-tighter mb-4 sm:mb-6">
                                    <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                        AI
                                    </span>{' '}
                                    <span className="text-white">PLAYGROUND</span>
                                </h2>
                            </div>

                            <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
                                <div className="space-y-4 sm:space-y-6">
                                    <div className="space-y-3 sm:space-y-4 text-gray-300 leading-relaxed">
                                        <p className="text-sm sm:text-base lg:text-lg">
                                            <span className="text-white font-semibold">AlphaB</span> is where <span className="text-blue-400">AI becomes our favorite toy</span>.
                                            I'm a technologist who believes that the coolest tech should be
                                            <span className="text-purple-400"> fun to play with, not just functional</span>.
                                        </p>
                                        <p className="text-sm sm:text-base">
                                            From AI consulting through <span className="text-red-400 font-semibold">RADE</span> to wild
                                            experiments at <span className="text-blue-400 font-semibold">Awake Careful Ant</span>, we bring the toys out to play
                                            and have the time of our lives doing it.
                                        </p>
                                        <p className="text-sm sm:text-base">
                                            This isn't about pushing boundaries—it's a <span className="text-yellow-400">digital playground</span>
                                            where AI tools become the most entertaining toys you've ever seen.
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4 sm:space-y-6">
                                    <div className="grid gap-3 sm:gap-4">
                                        <div className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 border border-white/10 bg-gradient-to-r from-blue-500/5 to-transparent">
                                            <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 mt-1 flex-shrink-0" />
                                            <div>
                                                <h3 className="text-white font-semibold mb-1 text-sm sm:text-base">Play First</h3>
                                                <p className="text-gray-400 text-xs sm:text-sm">Making AI tools so fun you'll forget you're working</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 border border-white/10 bg-gradient-to-r from-purple-500/5 to-transparent">
                                            <Rocket className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400 mt-1 flex-shrink-0" />
                                            <div>
                                                <h3 className="text-white font-semibold mb-1 text-sm sm:text-base">Rapid Experimentation</h3>
                                                <p className="text-gray-400 text-xs sm:text-sm">From wild idea to working prototype in record time</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 border border-white/10 bg-gradient-to-r from-pink-500/5 to-transparent">
                                            <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-pink-400 mt-1 flex-shrink-0" />
                                            <div>
                                                <h3 className="text-white font-semibold mb-1 text-sm sm:text-base">Always Entertaining</h3>
                                                <p className="text-gray-400 text-xs sm:text-sm">Because the best AI toys are the ones that surprise you</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                */}

                {/* Newsletter Section */}
                <div className="mt-16 sm:mt-24 lg:mt-32 w-full max-w-6xl px-4 sm:px-0">
                    <div className="relative">
                        {/* Background glow */}
                        <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-yellow-500/10 to-pink-500/10 blur-3xl"></div>

                        <div className="relative border border-white/10 bg-black/50 backdrop-blur-sm p-6 sm:p-8 lg:p-12 text-center">
                            <div className="mb-6 sm:mb-8">
                                <div className="inline-flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
                                    <Mail className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400" />
                                    <span className="text-xs sm:text-sm tracking-[0.2em] sm:tracking-[0.3em] text-gray-300 font-light">STAY CONNECTED</span>
                                    <Mail className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400" />
                                </div>
                                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-5xl font-black tracking-tighter mb-3 sm:mb-4">
                                    <span className="text-white">JOIN THE</span>{' '}
                                    <span className="bg-gradient-to-r from-yellow-400 via-red-400 to-pink-400 bg-clip-text text-transparent">
                                        INNOVATION
                                    </span>{' '}
                                    <span className="text-white">JOURNEY</span>
                                </h2>
                                <p className="text-gray-400 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto px-4 sm:px-0">
                                    Get exclusive insights, early access to new projects, and behind-the-scenes updates
                                    from the AlphaB ecosystem. No spam, just pure innovation.
                                </p>
                            </div>

                            {!isSubmitted ? (
                                <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto">
                                    <div className="flex flex-col gap-3 sm:gap-4">
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Enter your email"
                                            required
                                            className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-black/50 border border-white/20 text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none transition-colors text-sm sm:text-base"
                                        />
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-yellow-500 to-red-500 text-black font-bold tracking-wider hover:from-yellow-400 hover:to-red-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                                        >
                                            {isSubmitting ? 'JOINING...' : 'JOIN NOW'}
                                        </button>
                                    </div>
                                    {error && (
                                        <p className="text-red-400 text-xs sm:text-sm mt-3 sm:mt-4">{error}</p>
                                    )}
                                </form>
                            ) : (
                                <div className="max-w-md mx-auto">
                                    <div className="flex items-center justify-center space-x-2 sm:space-x-3 text-green-400 mb-3 sm:mb-4">
                                        <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8" />
                                        <span className="text-lg sm:text-xl font-bold">WELCOME ABOARD!</span>
                                    </div>
                                    <p className="text-gray-400 text-sm sm:text-base px-4 sm:px-0">
                                        You're now part of the AlphaB innovation network.
                                        Expect amazing things in your inbox soon.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bottom CTA */}
                <div className="mt-20 text-center">
                    <a
                        href="https://rade.alphab.io"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative overflow-hidden border border-white/20 px-12 py-4 bg-black/50 backdrop-blur-sm hover:border-white/40 transition-all duration-300 inline-block"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-pink-500/20 to-yellow-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative flex items-center space-x-3">
                            <Zap className="w-5 h-5 text-yellow-400" />
                            <span className="text-lg tracking-wider font-medium">EXPLORE AI CONSULTING SERVICES</span>
                            <Zap className="w-5 h-5 text-yellow-400" />
                        </div>
                    </a>
                </div>
            </div>

            {/* Corner decorations */}
            <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-white/10"></div>
            <div className="absolute top-0 right-0 w-32 h-32 border-r-2 border-t-2 border-white/10"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 border-l-2 border-b-2 border-white/10"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-white/10"></div>
        </div>
    );
};

export default Index;