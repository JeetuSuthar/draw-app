"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Menu, X, Sun, Moon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const navigation = [
  { name: "How it works", href: "#how-it-works" },
  { name: "Features", href: "#features" },
  { name: "CTA", href: "#cta" },
]

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme, setTheme } = useTheme()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Handle mounting - prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-sm" : "bg-transparent"}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 md:justify-start md:space-x-10">
          <div className="flex justify-start lg:w-0 lg:flex-1">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M15 3.5C16.9587 3.5 18.3575 3.5 19.3888 3.88698C20.5585 4.33456 21.4937 5.15463 22.0284 6.22593C22.5 7.17771 22.5 8.42353 22.5 10.9152V15.5C22.5 17.9917 22.5 19.2375 22.0284 20.1893C21.4937 21.2606 20.5585 22.0806 19.3888 22.5282C18.3575 22.9152 16.9587 22.9152 15 22.9152H9C7.04128 22.9152 5.64253 22.9152 4.6112 22.5282C3.44151 22.0806 2.50628 21.2606 1.97161 20.1893C1.5 19.2375 1.5 17.9917 1.5 15.5V10.9152C1.5 8.42353 1.5 7.17771 1.97161 6.22593C2.50628 5.15463 3.44151 4.33456 4.6112 3.88698C5.64253 3.5 7.04128 3.5 9 3.5H15Z"
                    stroke="white"
                    strokeWidth="2"
                  />
                  <path d="M12 8L17 15H7L12 8Z" stroke="white" strokeWidth="2" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-white">CollabDraw</span>
            </Link>
          </div>

          <div className="-mr-2 -my-2 md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
              onClick={() => setIsOpen(!isOpen)}
            >
              <span className="sr-only">Open menu</span>
              {isOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
            </button>
          </div>

          <nav className="hidden md:flex space-x-10">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-base font-medium text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0 space-x-4">
            {/* Theme toggle button - only render after mounted */}
            {mounted ? (
              <button
                onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                className="p-2 rounded-full text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline-none"
              >
                {resolvedTheme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
            ) : (
              <div className="w-9 h-9" /> // Placeholder with same dimensions
            )}

            <Link
              href="/signin"
              className="whitespace-nowrap text-base font-medium text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              Sign in
            </Link>

            <Link
              href="/signup"
              className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white dark:bg-gray-800 divide-y-2 divide-gray-50 dark:divide-gray-700">
              <div className="pt-5 pb-6 px-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M15 3.5C16.9587 3.5 18.3575 3.5 19.3888 3.88698C20.5585 4.33456 21.4937 5.15463 22.0284 6.22593C22.5 7.17771 22.5 8.42353 22.5 10.9152V15.5C22.5 17.9917 22.5 19.2375 22.0284 20.1893C21.4937 21.2606 20.5585 22.0806 19.3888 22.5282C18.3575 22.9152 16.9587 22.9152 15 22.9152H9C7.04128 22.9152 5.64253 22.9152 4.6112 22.5282C3.44151 22.0806 2.50628 21.2606 1.97161 20.1893C1.5 19.2375 1.5 17.9917 1.5 15.5V10.9152C1.5 8.42353 1.5 7.17771 1.97161 6.22593C2.50628 5.15463 3.44151 4.33456 4.6112 3.88698C5.64253 3.5 7.04128 3.5 9 3.5H15Z"
                          stroke="white"
                          strokeWidth="2"
                        />
                        <path d="M12 8L17 15H7L12 8Z" stroke="white" strokeWidth="2" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                  <div className="-mr-2">
                    <button
                      type="button"
                      className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                      onClick={() => setIsOpen(false)}
                    >
                      <span className="sr-only">Close menu</span>
                      <X className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                </div>
                <div className="mt-6">
                  <nav className="grid gap-y-8">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="text-base font-medium text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </nav>
                </div>
              </div>
              <div className="py-6 px-5 space-y-6">
                <div className="flex items-center justify-between">
                  <Link
                    href="/signin"
                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    Sign in
                  </Link>
                  <div className="ml-3">
                    {/* Theme toggle in mobile menu - only render after mounted */}
                    {mounted ? (
                      <button
                        onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                        className="p-2 rounded-full text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline-none"
                      >
                        {resolvedTheme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                      </button>
                    ) : (
                      <div className="w-9 h-9" /> // Placeholder
                    )}
                  </div>
                </div>
                <div>
                  <Link
                    href="/signup"
                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                  >
                    Sign up
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}