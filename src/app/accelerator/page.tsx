import { Code, Gauge, Lightbulb, Rocket } from "lucide-react";
import type { Metadata } from "next";
import { EmailSignup } from "@/components/accelerator/email-signup";
import { Intro } from "@/components/intro";

export const metadata: Metadata = {
  title: "Tech Accelerator - AlphaB",
  description:
    "Rapid prototyping and technology acceleration services. Bringing tomorrow's innovations to today's challenges.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: {
    title: "Tech Accelerator - AlphaB",
    description:
      "Rapid prototyping and technology acceleration services. Bringing tomorrow's innovations to today's challenges.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tech Accelerator - AlphaB",
    description:
      "Rapid prototyping and technology acceleration services. Bringing tomorrow's innovations to today's challenges.",
  },
};

const TechAccelerator = () => {
  const services = [
    {
      icon: Rocket,
      title: "RAPID PROTOTYPING",
      description: "FROM CONCEPT TO REALITY IN DAYS, NOT MONTHS",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: Code,
      title: "MVP DEVELOPMENT",
      description: "MINIMUM VIABLE PRODUCTS THAT MAXIMIZE IMPACT",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Lightbulb,
      title: "INNOVATION LABS",
      description: "EXPERIMENTAL TECH FOR BREAKTHROUGH SOLUTIONS",
      color: "from-cyan-500 to-blue-500",
    },
    {
      icon: Gauge,
      title: "PERFORMANCE OPTIMIZATION",
      description: "SPEED IS EVERYTHING IN THE DIGITAL RACE",
      color: "from-green-500 to-teal-500",
    },
  ];

  const stats = [
    { number: "72H", label: "AVERAGE PROTOTYPE TIME" },
    { number: "300%", label: "FASTER DEVELOPMENT" },
    { number: "24/7", label: "CONTINUOUS ACCELERATION" },
    { number: "∞", label: "INNOVATION POTENTIAL" },
  ];

  return (
    <>
      <Intro />

      <div className="min-h-screen bg-black text-white overflow-hidden relative">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(0,255,150,0.1),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,0,0.1),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_48%,rgba(255,255,255,0.02)_49%,rgba(255,255,255,0.02)_51%,transparent_52%)] bg-size-[15px_15px] animate-pulse"></div>
        </div>

        <div className="relative z-10 px-4 sm:px-6 pt-4 sm:pt-6 pb-8 sm:pb-12">
          {/* Main header */}
          <div className="text-center mb-12 sm:mb-16">
            <div className="relative mb-6 sm:mb-8">
              <h1 className="text-[3rem] sm:text-[4rem] md:text-[6rem] lg:text-[8rem] xl:text-[12rem] font-black leading-none tracking-tighter">
                <span className="block bg-linear-to-r from-green-400 via-yellow-400 to-green-400 bg-clip-text text-transparent">
                  TECH
                </span>
                <span className="block bg-linear-to-r from-yellow-400 via-green-400 to-yellow-400 bg-clip-text text-transparent -mt-2 sm:-mt-4">
                  ACCELERATOR
                </span>
              </h1>
              <div className="absolute inset-0 text-[3rem] sm:text-[4rem] md:text-[6rem] lg:text-[8rem] xl:text-[12rem] font-black leading-none tracking-tighter">
                <span className="block text-transparent bg-linear-to-r from-green-500 via-yellow-500 to-green-500 bg-clip-text opacity-20 blur-xs">
                  TECH
                </span>
                <span className="block text-transparent bg-linear-to-r from-yellow-500 via-green-500 to-yellow-500 bg-clip-text opacity-20 blur-xs -mt-2 sm:-mt-4">
                  ACCELERATOR
                </span>
              </div>
            </div>

            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-4xl font-bold tracking-wider mb-6 sm:mb-8 max-w-4xl mx-auto px-4 sm:px-0">
              <span className="text-white">RAPID</span>{" "}
              <span className="bg-linear-to-r from-green-400 to-yellow-400 bg-clip-text text-transparent">
                PROTOTYPING
              </span>{" "}
              <span className="text-white">&</span>{" "}
              <span className="bg-linear-to-r from-yellow-400 to-green-400 bg-clip-text text-transparent">
                TECHNOLOGY
              </span>{" "}
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
                className="group relative overflow-hidden border border-white/10 bg-black/50 backdrop-blur-xs hover:border-green-400/50 transition-all duration-500 p-4 sm:p-6 lg:p-8"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div
                  className={`absolute inset-0 bg-linear-to-br ${service.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                ></div>

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
                <div className="absolute inset-0 bg-linear-to-b from-transparent via-green-400/10 to-transparent h-20 w-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-500"></div>
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
          <EmailSignup />
        </div>
      </div>
    </>
  );
};

export default TechAccelerator;
