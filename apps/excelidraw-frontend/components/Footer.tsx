"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Twitter, Github, Linkedin, Instagram, Mail, Heart } from 'lucide-react'

const footerLinks = [
  {
    title: "Product",
    links: [
      { name: "Features", href: "#features" },
      { name: "How It Works", href: "#how-it-works" },
      { name: "CTA", href: "#cta" }
   
    ],
  },
]

const socialLinks = [
  { name: "GitHub", icon: Github, href: "https://github.com/jeetusuthar" },
  { name: "X (Twitter)", icon: Twitter, href: "https://x.com/JeetuSutha34992" },
  { name: "LinkedIn", icon: Linkedin, href: "https://linkedin/u/jeetusuthar" },
  
]

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 pb-12">
          <div className="col-span-2">
            <div className="flex items-center space-x-2">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M15 3.5C16.9587 3.5 18.3575 3.5 19.3888 3.88698C20.5585 4.33456 21.4937 5.15463 22.0284 6.22593C22.5 7.17771 22.5 8.42353 22.5 10.9152V15.5C22.5 17.9917 22.5 19.2375 22.0284 20.1893C21.4937 21.2606 20.5585 22.0806 19.3888 22.5282C18.3575 22.9152 16.9587 22.9152 15 22.9152H9C7.04128 22.9152 5.64253 22.9152 4.6112 22.5282C3.44151 22.0806 2.50628 21.2606 1.97161 20.1893C1.5 19.2375 1.5 17.9917 1.5 15.5V10.9152C1.5 8.42353 1.5 7.17771 1.97161 6.22593C2.50628 5.15463 3.44151 4.33456 4.6112 3.88698C5.64253 3.5 7.04128 3.5 9 3.5H15Z" stroke="white" strokeWidth="2"/>
                  <path d="M12 8L17 15H7L12 8Z" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">Collabdraw</span>
            </div>
            <p className="mt-4 text-gray-500 dark:text-gray-400 max-w-xs">
              The collaborative whiteboard tool that makes drawing and sketching together easy and fun.
            </p>
            <div className="mt-6 flex space-x-4">
              {socialLinks.map((item) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {footerLinks.map((group) => (
            <div key={group.title} className="col-span-1">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white tracking-wider uppercase">
                {group.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {group.links.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-base text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="col-span-2 md:col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white tracking-wider uppercase">
              Subscribe
            </h3>
            <p className="mt-4 text-base text-gray-500 dark:text-gray-400">
              Get the latest news and updates.
            </p>
            <div className="mt-4">
              <form className="flex flex-col sm:flex-row gap-2">
                <div className="min-w-0 flex-1">
                  <input
                    type="email"
                    className="block w-full rounded-md border border-gray-300 dark:border-gray-700 px-4 py-2 text-base text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-800"
                    placeholder="Enter your email"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-md border border-transparent bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="pt-8 mt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-base text-gray-500 dark:text-gray-400">
              &copy; {new Date().getFullYear()} CollabDraw, Inc. All rights reserved.
            </p>
            <div className="flex items-center mt-4 md:mt-0">
              <span className="inline-flex items-center text-gray-500 dark:text-gray-400 text-sm">
                Made with <Heart className="h-4 w-4 mx-1 text-red-500" /> by Jeetu
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
