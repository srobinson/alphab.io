"use client";

import { Button } from "@/components/ui/button";
import { ThemeToggleButton } from "@/components/ui/theme-toggle-button";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/my-approach", label: "My Approach" },
    { href: "/services", label: "Services" },
    { href: "/industry-moves", label: "Industry Moves" },
    { href: "/pricing", label: "Pricing" },
    { href: "/blog", label: "Blog" },
  ];

  const toggleMobileMenu = () => {
    try {
      setIsMobileMenuOpen(!isMobileMenuOpen);
    } catch (error) {
      console.warn("Error toggling mobile menu:", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b 
                       bg-white/80 backdrop-blur-lg 
                       border-gray-200/80
                       dark:bg-black/80 dark:border-gray-700/80">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="mr-6 flex items-center space-x-2 group">
          <svg
            width="32"
            height="32"
            viewBox="0 0 331.000000 331.000000"
            className="text-gray-900 dark:text-white transition-colors duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-400"
          >
            <g
              transform="translate(0.000000,331.000000) scale(0.100000,-0.100000)"
              fill="currentColor"
              stroke="none"
            >
              <path d="M3043 3046 c-79 -141 -143 -259 -143 -262 0 -2 9 -4 20 -4 65 0 110
-69 118 -183 l5 -70 -27 7 c-31 8 -33 -2 -5 -38 l21 -27 -46 -457 c-26 -251
-49 -467 -52 -479 -3 -15 -12 -23 -25 -23 -49 0 -119 -65 -119 -110 0 -12 -76
-33 -326 -93 -179 -43 -331 -80 -337 -83 -9 -3 -12 38 -13 153 0 142 -3 167
-28 248 -29 96 -97 233 -146 295 l-29 37 11 118 12 118 -28 23 c-17 15 -24 29
-20 37 5 6 60 77 124 157 228 286 253 321 267 374 17 65 16 90 -2 125 -26 51
-66 54 -151 11 -66 -33 -51 -10 -266 -385 -60 -104 -113 -193 -117 -198 -7 -7
-112 34 -108 43 1 3 77 155 170 338 153 305 167 337 167 385 -1 82 -15 129
-51 161 -26 23 -38 27 -67 22 -42 -6 -134 -67 -161 -105 -10 -14 -74 -189
-141 -389 l-123 -364 -61 7 c-34 4 -63 9 -64 10 -2 2 26 104 62 227 110 376
110 375 96 443 -16 78 -56 120 -103 111 -39 -8 -113 -79 -126 -120 -10 -34
-51 -299 -79 -516 l-18 -135 -29 -5 c-24 -4 -43 -25 -102 -109 l-72 -103 -98
-48 c-188 -93 -329 -233 -418 -415 -73 -148 -90 -225 -89 -395 1 -176 20 -258
94 -405 27 -56 50 -103 50 -107 0 -17 -110 -51 -170 -51 -112 -1 -160 41 -185
160 -18 83 -18 112 -4 226 9 66 16 90 28 94 83 25 117 68 108 136 -14 101
-139 140 -209 65 -40 -43 -40 -114 1 -160 28 -32 29 -36 20 -83 -15 -79 -12
-273 5 -328 21 -71 61 -123 113 -148 38 -18 57 -21 136 -17 76 4 102 9 146 32
l54 28 36 -43 c54 -65 171 -153 269 -202 48 -24 93 -46 99 -48 9 -3 3 -62 -20
-203 l-32 -199 -75 -31 c-57 -24 -75 -36 -75 -51 0 -31 35 -29 119 6 89 37 81
18 122 279 15 96 28 176 29 177 1 2 36 -4 79 -12 122 -23 269 -16 407 20 l27
7 7 -179 c4 -98 10 -191 14 -207 5 -22 22 -37 71 -65 88 -50 97 -53 115 -35
21 21 9 34 -70 78 l-63 36 -6 157 c-4 87 -9 175 -12 195 l-6 37 69 35 c218
109 389 307 458 527 l18 57 116 27 c64 15 223 53 353 85 l237 57 22 -24 c13
-12 37 -28 55 -35 26 -9 32 -16 29 -32 -2 -12 -25 -228 -51 -481 l-46 -460
-45 -72 -44 -72 42 -56 42 -55 51 47 c28 26 52 47 54 48 1 1 -9 26 -23 56
l-25 55 53 512 c51 485 55 513 75 528 29 20 52 66 52 102 0 16 -11 46 -25 67
l-26 37 51 486 c50 482 51 487 77 514 26 27 26 28 5 28 -32 0 -28 33 11 104
42 75 75 101 127 100 22 -1 40 3 40 8 0 5 -25 125 -55 266 -30 142 -55 268
-57 281 -2 18 -41 -43 -145 -233z m-1723 -914 c167 -59 307 -173 393 -320 64
-111 104 -326 80 -436 -11 -52 -53 -74 -172 -89 -128 -16 -236 0 -302 45 -38
26 -47 37 -42 53 3 10 8 44 12 75 42 369 -332 633 -664 469 l-59 -30 29 32
c105 113 235 190 370 219 72 16 293 5 355 -18z m112 -858 c95 -21 252 -24 296
-5 18 7 36 11 39 7 4 -3 -15 -50 -42 -104 -40 -81 -61 -111 -134 -182 -139
-138 -287 -200 -481 -200 -119 0 -202 20 -308 72 -132 65 -264 201 -320 332
-13 29 -12 29 30 -10 197 -181 478 -171 660 24 58 62 67 68 108 71 25 1 47 5
49 7 7 7 27 5 103 -12z" />
            </g>
          </svg>
          <span
            className={cn(
              "font-bold text-2xl text-gray-900 dark:text-white transition-colors duration-300 group-hover:text-blue-500 dark:group-hover:text-blue-400",
            )}
          >
            RADE
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link key={link.href} href={link.href} legacyBehavior passHref>
                <a
                  className={cn(
                    "relative px-3 py-2 text-sm font-medium transition-colors duration-200 ease-out cursor-pointer group",
                    isActive
                      ? "text-gray-900 dark:text-white"
                      : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white",
                  )}
                >
                  {link.label}
                  <span
                    className={cn(
                      "absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 dark:bg-blue-400 transition-transform duration-300 ease-out origin-center",
                      isActive
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100",
                    )}
                  />
                </a>
              </Link>
            );
          })}

          <Link href="/contact" legacyBehavior passHref>
            <Button
              variant={pathname === "/contact" ? "default" : "outline"}
              size="sm"
              className={cn(
                "transition-all duration-200 ease-out ml-2",
                pathname === "/contact"
                  ? "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white dark:text-white border-transparent dark:border-transparent"
                  : "text-gray-800 border-gray-800 hover:bg-gray-800 hover:text-white dark:text-white dark:border-white dark:hover:bg-white dark:hover:text-gray-900",
              )}
            >
              Contact
            </Button>
          </Link>
          <ThemeToggleButton />
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggleButton />
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMobileMenu}
            className="relative z-50"
            aria-label="Toggle mobile menu"
          >
            <AnimatePresence mode="wait" initial={false}>
              {isMobileMenuOpen
                ? (
                  <motion.div
                    key="close-icon"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-6 w-6" />
                  </motion.div>
                )
                : (
                  <motion.div
                    key="menu-icon"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-6 w-6" />
                  </motion.div>
                )}
            </AnimatePresence>
          </Button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence initial={false}>
        {isMobileMenuOpen && (
          <motion.div
            key="mobile-menu-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={toggleMobileMenu}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 h-full w-80 max-w-[85vw] 
                         bg-white/95 dark:bg-black/95 backdrop-blur-lg
                         border-l border-gray-200/80 dark:border-gray-700/80
                         shadow-2xl"
            >
              <div className="flex flex-col h-full pt-20 px-6">
                {/* Navigation Links */}
                <nav className="flex flex-col space-y-1">
                  {navLinks.map((link, index) => {
                    const isActive = pathname === link.href;
                    return (
                      <motion.div
                        key={link.href}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + 0.1 }}
                      >
                        <Link href={link.href} legacyBehavior passHref>
                          <a
                            className={cn(
                              "flex items-center px-4 py-3 text-lg font-medium rounded-lg transition-all duration-200 ease-out group",
                              isActive
                                ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-l-4 border-blue-500"
                                : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800/50 hover:text-blue-600 dark:hover:text-blue-400",
                            )}
                            onClick={toggleMobileMenu}
                          >
                            <span className="relative">
                              {link.label}
                              {isActive && (
                                <motion.div
                                  layoutId="mobile-active-indicator"
                                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-500 rounded-full"
                                />
                              )}
                            </span>
                          </a>
                        </Link>
                      </motion.div>
                    );
                  })}

                  {/* Contact Button */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: navLinks.length * 0.1 + 0.1 }}
                    className="pt-4"
                  >
                    <Link href="/contact" legacyBehavior passHref>
                      <Button
                        variant={pathname === "/contact"
                          ? "default"
                          : "outline"}
                        size="lg"
                        className={cn(
                          "w-full justify-center text-lg font-medium py-3",
                          pathname === "/contact"
                            ? "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white"
                            : "border-2 border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-400 dark:hover:text-gray-900",
                        )}
                        onClick={toggleMobileMenu}
                      >
                        Contact
                      </Button>
                    </Link>
                  </motion.div>
                </nav>

                {/* Footer */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="mt-auto pb-6 text-center"
                >
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    AI Leadership Solutions
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
