import { ArrowRight, Circle, Star, Zap } from "lucide-react";
import { useEffect, useState } from "react";

const Index = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const links = [
    {
      title: "RADE AI CONSULTING",
      subtitle:
        "Strategic AI implementation and consulting services. Transform your business with custom AI solutions, governance frameworks, and expert guidance.",
      status: "LIVE NOW",
      color: "from-red-500 via-pink-500 to-yellow-500",
      accent: "red",
      url: "https://rade.alphab.io",
      emoji: "🤖",
    },
    {
      title: "AWAKE CAREFUL ANT",
      subtitle:
        "Innovative digital solutions and creative technology projects. Explore cutting-edge developments and experimental innovations.",
      status: "ACTIVE",
      color: "from-blue-500 via-purple-500 to-pink-500",
      accent: "blue",
      url: "https://awake-careful-ant.com",
      emoji: "🐜",
    },
    {
      title: "TECH ACCELERATOR",
      subtitle:
        "Rapid prototyping and technology acceleration services. Bringing tomorrow's innovations to today's challenges.",
      status: "WIP",
      color: "from-green-400 via-cyan-400 to-blue-500",
      accent: "green",
      url: "/tech-accelerator",
      emoji: "⚡",
    },
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
        <div className="flex items-center space-x-4">
          <Circle className="w-3 h-3 fill-red-500 text-red-500 animate-pulse" />
          <span className="text-xs tracking-widest text-gray-400">LIVE</span>
        </div>
        <div className="text-xs tracking-widest text-gray-400 font-mono">
          {time.toLocaleTimeString()}
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-[90vh] px-6">
        {/* Main title */}
        <div className="text-center mb-16">
          <div className="relative">
            <h1 className="text-[12rem] md:text-[20rem] font-black leading-none tracking-tighter">
              <span className="block bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent">
                ALPHAB
              </span>
            </h1>
            <div className="absolute inset-0 text-[12rem] md:text-[20rem] font-black leading-none tracking-tighter">
              <span className="block text-transparent bg-gradient-to-r from-red-500 via-pink-500 to-yellow-500 bg-clip-text opacity-30 blur-sm">
                ALPHAB
              </span>
            </div>
          </div>

          <div className="mt-8 mb-4">
            <div className="inline-block border border-white/20 rounded-full px-6 py-2 backdrop-blur-sm">
              <span className="text-sm tracking-[0.3em] text-gray-300 font-light">
                INNOVATION AT THE SPEED OF THOUGHT
              </span>
            </div>
          </div>

          <h2 className="text-2xl md:text-4xl font-bold tracking-wider mb-8">
            <span className="text-white">INTERESTING</span>{" "}
            <span className="bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
              LINKS
            </span>{" "}
            <span className="text-white">&</span>{" "}
            <span className="bg-gradient-to-r from-yellow-400 to-red-400 bg-clip-text text-transparent">
              EXPERIMENTS
            </span>
          </h2>
        </div>

        {/* Links grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-7xl">
          {links.map((link, index) => (
            <a
              key={index}
              href={link.url}
              className="group relative overflow-hidden block"
              style={{ animationDelay: `${index * 0.1}s` }}
              target={link.url.startsWith("http") ? "_blank" : "_self"}
              rel={link.url.startsWith("http") ? "noopener noreferrer" : undefined}
            >
              {/* Status indicator */}
              <div className="absolute top-4 right-4 z-20">
                <div
                  className={`text-xs px-2 py-1 rounded-full border ${
                    link.accent === "red"
                      ? "border-red-500/50 text-red-400"
                      : link.accent === "blue"
                        ? "border-blue-500/50 text-blue-400"
                        : "border-green-500/50 text-green-400"
                  }`}
                >
                  {link.status}
                </div>
              </div>

              {/* Main card */}
              <div className="relative h-80 border border-white/10 bg-black/50 backdrop-blur-sm group-hover:border-white/30 transition-all duration-500 overflow-hidden">
                {/* Background gradient */}
                {/* <div className={`absolute inset-0 bg-gradient-to-br ${link.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div> */}

                {/* Content */}
                <div className="relative p-8 h-full flex flex-col justify-between">
                  <div>
                    <div className="text-4xl mb-4">{link.emoji}</div>
                    <h3 className="text-2xl font-black tracking-tighter mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-white group-hover:to-gray-400 transition-all duration-300">
                      {link.title}
                    </h3>
                    <p className="text-gray-400 text-sm tracking-wide leading-relaxed">
                      {link.subtitle}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex space-x-1">
                      {[...Array(3)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            link.accent === "red"
                              ? "text-red-500"
                              : link.accent === "blue"
                                ? "text-blue-500"
                                : "text-green-500"
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
              <span className="text-lg tracking-wider font-medium">
                EXPLORE AI CONSULTING SERVICES
              </span>
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
