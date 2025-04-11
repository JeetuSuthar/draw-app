import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Features from '@/components/Features'
import HowItWorks from '@/components/HowItWorks'

import Footer from '@/components/Footer'
import CTA from '@/components/CTA'
import { ThemeProvider } from 'next-themes'

export default function Home() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">

      <Header />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <div className='pt-5 pb-10 mb-10'>
        <div className="h-[50%] my-5 flex items-center w-[60%] mx-auto justify-center rounded-xl overflow-hidden scale-110 z-30">
          <video width="100%" height="100%" autoPlay loop muted>
            <source src="/Demo-vid.mp4" type="video/mp4" />
          </video>
        </div>
        </div>
        <CTA />
        
      </main>
      <Footer />
    </div>
    </ThemeProvider>
  )
}
