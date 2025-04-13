"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Play, ChevronDown } from 'lucide-react'
import { motion, useScroll, useTransform } from "framer-motion"
import { Dialog, DialogContent } from "@/components/ui/dialog"

export default function Hero() {
  const [isVideoOpen, setIsVideoOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  })
  
  const y = useTransform(scrollYProgress, [0, 1], [0, 200])
  
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      }
    })
  }

  return (
    <div ref={ref} className="relative overflow-hidden bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 min-h-screen flex flex-col justify-center">
      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-[10%] right-[15%] w-16 h-16 rounded-full bg-purple-200 dark:bg-purple-900/30 blur-xl"
          animate={{ 
            y: [0, 15, 0],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{ 
            duration: 5, 
            repeat: Infinity,
            repeatType: "reverse" 
          }}
        />
        <motion.div 
          className="absolute bottom-[20%] left-[10%] w-24 h-24 rounded-full bg-indigo-200 dark:bg-indigo-900/30 blur-xl"
          animate={{ 
            y: [0, -20, 0],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ 
            duration: 7, 
            repeat: Infinity,
            repeatType: "reverse" 
          }}
        />
        <motion.div 
          className="absolute top-[30%] left-[20%] w-12 h-12 rounded-full bg-pink-200 dark:bg-pink-900/30 blur-xl"
          animate={{ 
            y: [0, 10, 0],
            opacity: [0.4, 0.7, 0.4]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity,
            repeatType: "reverse" 
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 relative z-10">
        <div className="text-center mb-12">
          <motion.div 
            className="inline-flex items-center px-4 py-1.5 mb-6 rounded-full text-sm font-medium bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200 backdrop-blur-sm"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="flex h-2 w-2 mr-2 rounded-full bg-purple-500"></span>
            Visual collaboration reimagined
          </motion.div>
          
          <motion.h1 
            className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl max-w-4xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span className="block mb-2">Collaborate and create</span>
            <span className="block bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              with CollabDraw
            </span>
          </motion.h1>
          
          <motion.p 
            className="mt-6 text-lg text-gray-500 dark:text-gray-300 sm:text-xl max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Unleash your creativity with our intuitive whiteboard tool. Sketch, brainstorm, and
            collaborate in real-time with your team, no matter where you are.
          </motion.p>
          
          <motion.div 
            className="mt-8 flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link
              href="/signin"
              className="group inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-md transition-all duration-200 hover:shadow-lg"
            >
              Get started
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            
            <button
              onClick={() => setIsVideoOpen(true)}
              className="group inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-md transition-all duration-200 hover:shadow-lg"
            >
              <Play className="mr-2 h-4 w-4 text-purple-600" />
              Live demo
            </button>
          </motion.div>
        </div>
        
        {/* 3D Floating Image */}
        <motion.div 
          className="relative mx-auto max-w-5xl"
          style={{ y }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <div className="relative">
            {/* Shadow element */}
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-[90%] h-8 bg-black/10 dark:bg-black/20 blur-xl rounded-full"></div>
            
            {/* Main image with 3D effect */}
            <div className="relative rounded-xl overflow-hidden shadow-2xl transform perspective-1000 hover:rotate-y-1 transition-transform duration-500">
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/10 to-indigo-600/10 mix-blend-overlay dark:mix-blend-overlay rounded-xl"></div>
              
              {/* Reflection effect */}
              
              <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent mix-blend-overlay rounded-xl"></div>
              
              <Image
                className="w-full block dark:hidden rounded-xl"
                src="https://res.cloudinary.com/dwnapxhev/image/upload/v1737348443/Excalidraw_Live_Presentation_bihmed.png"
                alt="CollabDraw Whiteboard"
                width={1200}
                height={800}
              />
              <Image
                className="w-full hidden dark:block rounded-xl"
                src="https://i.ibb.co/ssw377M/darkmodehero.png"
                alt="CollabDraw Whiteboard"
                width={1200}
                height={800}
              />
              
              {/* Floating UI elements */}
              <motion.div 
                className="absolute top-[10%] right-[5%] bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 flex items-center space-x-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                whileHover={{ y: -5 }}
              >
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm font-medium">Alex joined</span>
              </motion.div>
              
              <motion.div 
                className="absolute bottom-[15%] left-[8%] bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  <span className="text-sm font-medium">3 people editing</span>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
        
        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          <span className="text-sm text-gray-500 dark:text-gray-400 mb-2">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ChevronDown className="h-6 w-6 text-gray-400" />
          </motion.div>
        </motion.div>
      </div>
      
      {/* Video Modal */}
      <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
        <DialogContent className="sm:max-w-4xl p-0 bg-transparent border-none">
          <div className="aspect-video w-full overflow-hidden rounded-lg shadow-2xl">
            <video 
              className="w-full h-full" 
              controls 
              autoPlay
              src="/Demo-vid.mp4"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
