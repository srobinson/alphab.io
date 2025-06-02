"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ThemeToggleButton() {
  const { theme, resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
    console.log("ThemeToggleButton mounted. Initial theme:", theme, "Initial resolvedTheme:", resolvedTheme)
  }, []) // Only run on initial mount for this log

  // Log when theme/resolvedTheme actually changes
  React.useEffect(() => {
    if (mounted) {
      // Avoid logging during server render or before initial mount effect
      console.log(`Theme state updated. New theme: ${theme}, New resolvedTheme: ${resolvedTheme}`)
    }
  }, [theme, resolvedTheme, mounted])

  if (!mounted) {
    // console.log("ThemeToggleButton not yet mounted (server render or initial client render before effect).")
    return <div className="w-10 h-10" /> // Placeholder
  }

  const toggleTheme = () => {
    console.log(`Toggle theme button clicked.`)
    console.log(`Current theme: ${theme}, Current resolvedTheme: ${resolvedTheme}`)
    const newTheme = resolvedTheme === "dark" ? "light" : "dark"
    console.log(`Attempting to set theme to: ${newTheme}`)
    setTheme(newTheme)
  }

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
      {resolvedTheme === "dark" ? (
        <Sun className="h-[1.2rem] w-[1.2rem] transition-all" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem] transition-all" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
