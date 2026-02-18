"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

/**
 * Theme Toggle Button for POS Interface
 * Allows switching between light and dark mode
 */
export function ThemeToggle() {
    const { setTheme, resolvedTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    // Prevent hydration mismatch
    React.useEffect(() => {
        setMounted(true)
    }, [])

    const toggleTheme = () => {
        setTheme(resolvedTheme === "dark" ? "light" : "dark")
    }

    if (!mounted) {
        // Return placeholder with same dimensions to prevent layout shift
        return (
            <Button
                variant="ghost"
                size="icon"
                className="relative h-9 w-9 rounded-full hover:bg-white/10"
            >
                <span className="sr-only">Toggle theme</span>
            </Button>
        )
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="relative h-9 w-9 rounded-full hover:bg-white/10 text-white"
            title={resolvedTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
        </Button>
    )
}
