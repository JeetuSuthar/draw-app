"use client"

import { useRef } from "react"
import { useInView } from "framer-motion"
import { motion } from "framer-motion"
import { Pen, Users, Zap, Globe, Layers, Lock, Share2, History } from 'lucide-react'

const features = [
  {
    name: "Intuitive Drawing Tools",
    description: "Sketch and draw with ease using our simple yet powerful tools.",
    icon: Pen,
  },
  {
    name: "Real-time Collaboration",
    description: "Work together with your team in real-time, no matter where you are.",
    icon: Users,
  },
  {
    name: "Lightning Fast",
    description: "Experience smooth and responsive drawing with our optimized performance.",
    icon: Zap,
  },
  {
    name: "Accessible Anywhere",
    description: "Access your whiteboards from any device with an internet connection.",
    icon: Globe,
  },
  {
    name: "Infinite Canvas",
    description: "Unlimited space to bring your ideas to life, with easy navigation.",
    icon: Layers,
  },
  {
    name: "Secure and Private",
    description: "Your drawings are encrypted and stored securely.",
    icon: Lock,
  },
  {
    name: "Multi-User Editing",
    description: "Multiple users can edit the same drawing simultaneously.",
    icon: Share2,
  },
  {
    name: "Version History",
    description: "Track and restore previous changes to your drawings effortlessly.",
    icon: History,
  },
]

export default function Features() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <div className="py-20 bg-white dark:bg-gray-900" id="features" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="inline-flex items-center px-4 py-1.5 mb-4 rounded-full text-xs sm:text-sm font-medium bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200"
          >
            <span className="flex h-2 w-2 mr-2 rounded-full bg-purple-500"></span>
            Powerful Features
          </motion.div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Everything you need to create and collaborate
          </h2>
          <p className="mt-4 max-w-2xl text-base sm:text-lg text-gray-500 dark:text-gray-400 mx-auto">
            CollabDraw provides all the tools you need for effective visual collaboration.
          </p>
        </motion.div>

        <div className="mt-12 sm:mt-16">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.name}
                className="relative bg-white dark:bg-gray-800 p-5 sm:p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 group"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="absolute -top-3 -left-3">
                  <div className="flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-lg transform transition-transform duration-300 group-hover:scale-110">
                    <feature.icon className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
                  </div>
                </div>
                <div className="mt-2 pt-4">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.name}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
