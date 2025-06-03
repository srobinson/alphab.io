"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

export function ClockBackground() {
    const [time, setTime] = useState(new Date())
    const [isVisible, setIsVisible] = useState(false)
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date())
        }, 1000)

        // Check if mobile
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768)
        }

        checkMobile()
        window.addEventListener('resize', checkMobile)

        // Clock reveal animation
        const revealTimer = setTimeout(() => {
            setIsVisible(true)
        }, 200)

        return () => {
            clearInterval(timer)
            clearTimeout(revealTimer)
            window.removeEventListener('resize', checkMobile)
        }
    }, [])

    // Calculate angles for clock hands
    const seconds = time.getSeconds()
    const minutes = time.getMinutes()
    const hours = time.getHours() % 12

    const secondAngle = seconds * 6 - 90
    const minuteAngle = minutes * 6 + seconds * 0.1 - 90
    const hourAngle = hours * 30 + minutes * 0.5 - 90

    return (
        <div
            className="absolute top-0 left-0 right-0 pointer-events-none m-0"
            style={{
                perspective: "5000px",
                perspectiveOrigin: "top center",
            }}
        >
            <motion.div
                className="absolute top-0 left-0 right-0 transform -translate-x-1/2 md:-translate-y-0 -translate-y-0"
                style={{
                    width: "140vw",
                    height: "140vh",
                    transformOrigin: "top top",
                }}
                initial={{
                    opacity: 0,
                    scale: 0.6,
                    rotateX: -60,
                    rotateY: -30,
                    rotateZ: 15,
                    z: -500
                }}
                animate={{
                    opacity: isVisible ? 0.8 : 0,
                    scale: isVisible ? (isMobile ? 1.2 : 1.6) : 0.6,
                    rotateX: isVisible ? (isMobile ? 30 : 45) : -60,
                    rotateY: isVisible ? -15 : -30,
                    rotateZ: isVisible ? 8 : 15,
                    z: isVisible ? 0 : -500
                }}
                transition={{
                    duration: 2,
                    ease: "easeOut",
                    type: "spring",
                    stiffness: 40,
                    damping: 25
                }}
            >
                <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 400 400"
                    className="text-blue-500/15 dark:text-blue-400/15"
                    style={{
                        filter: "drop-shadow(0 0 80px rgba(59, 130, 246, 0.4))",
                    }}
                >
                    {/* Multiple clock rings for depth */}
                    <circle cx="200" cy="200" r="195" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" />
                    <circle cx="200" cy="200" r="180" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.5" />
                    <circle cx="200" cy="200" r="160" fill="none" stroke="currentColor" strokeWidth="3" opacity="0.7" />
                    <circle cx="200" cy="200" r="140" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.5" />
                    <circle cx="200" cy="200" r="120" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" />

                    {/* Hour markers with varying sizes */}
                    {Array.from({ length: 12 }, (_, i) => {
                        const angle = i * 30 * (Math.PI / 180)
                        const isMainHour = i % 3 === 0
                        const outerRadius = isMainHour ? 150 : 155
                        const innerRadius = isMainHour ? 130 : 140
                        const x1 = 200 + outerRadius * Math.sin(angle)
                        const y1 = 200 - outerRadius * Math.cos(angle)
                        const x2 = 200 + innerRadius * Math.sin(angle)
                        const y2 = 200 - innerRadius * Math.cos(angle)
                        return (
                            <line
                                key={`marker-${i}`}
                                x1={x1}
                                y1={y1}
                                x2={x2}
                                y2={y2}
                                stroke="currentColor"
                                strokeWidth={isMainHour ? "4" : "2"}
                                opacity={isMainHour ? "0.8" : "0.6"}
                                strokeLinecap="round"
                            />
                        )
                    })}

                    {/* Numbers with better positioning */}
                    {Array.from({ length: 12 }, (_, i) => {
                        const angle = i * 30 * (Math.PI / 180)
                        const x = 200 + 110 * Math.sin(angle)
                        const y = 200 - 110 * Math.cos(angle)
                        const number = i === 0 ? 12 : i
                        return (
                            <text
                                key={`num-${i}`}
                                x={x}
                                y={y}
                                textAnchor="middle"
                                dominantBaseline="central"
                                fontSize="24"
                                fontWeight="bold"
                                fill="currentColor"
                                opacity="0.7"
                            >
                                {number}
                            </text>
                        )
                    })}

                    {/* Clock hands with smooth animation */}
                    <line
                        x1="200"
                        y1="200"
                        x2="200"
                        y2="130"
                        stroke="currentColor"
                        strokeWidth="8"
                        strokeLinecap="round"
                        opacity="0.8"
                        transform={`rotate(${hourAngle} 200 200)`}
                        style={{ transition: "transform 1s ease-in-out" }}
                    />
                    <line
                        x1="200"
                        y1="200"
                        x2="200"
                        y2="100"
                        stroke="currentColor"
                        strokeWidth="6"
                        strokeLinecap="round"
                        opacity="0.8"
                        transform={`rotate(${minuteAngle} 200 200)`}
                        style={{ transition: "transform 1s ease-in-out" }}
                    />
                    <line
                        x1="200"
                        y1="220"
                        x2="200"
                        y2="80"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        opacity="0.9"
                        transform={`rotate(${secondAngle} 200 200)`}
                        style={{ transition: "transform 0.1s ease-out" }}
                    />

                    {/* Center dot */}
                    <circle cx="200" cy="200" r="8" fill="currentColor" opacity="0.8" />
                    <circle cx="200" cy="200" r="4" fill="rgba(59, 130, 246, 0.8)" opacity="1" />
                </svg>
            </motion.div>
        </div>
    )
}