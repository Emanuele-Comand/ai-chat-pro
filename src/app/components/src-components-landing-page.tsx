"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { MessageSquare, Image as ImageIcon, Music, ArrowRight, Sparkles, Github, Twitter, Linkedin, Facebook } from "lucide-react"
import Link from "next/link"
import { Variants } from 'framer-motion';
import { useRouter } from 'next/navigation'

export function LandingPageComponent() {
  const [email, setEmail] = useState("")
  const router = useRouter()

  const fadeIn: Variants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { 
      type: "tween", 
      transition: { ease: "easeOut" } 
    }
  }

  const stagger: Variants = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const pulse = {
    animate: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-gray-100">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative">
        <header className="container mx-auto px-4 py-8">
          <nav className="flex justify-between items-center">
            <motion.div 
              className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              AI Chat Pro
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Button 
                variant="outline" 
                className="border-gray-700 text-gray-800 hover:bg-gray-800 hover:text-gray-100"
                onClick={() => router.push('/app-page')}
              >
                Go to App
              </Button>
            </motion.div>
          </nav>
        </header>

        <main className="container mx-auto px-4 py-16">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <motion.div 
              className="lg:w-1/2 text-center lg:text-left"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                Unleash the Power of AI
              </h1>
              <p className="text-xl mb-8 text-gray-300">
                Experience the future of communication with our advanced AI assistant. Chat, create, and innovate like never before.
              </p>
              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                <Link href="/app">
                  <Button size="lg" className="bg-gradient-to-r from-purple-500 to-blue-500 text-gray-100 font-semibold">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="border-gray-700 text-gray-800 hover:bg-gray-800 hover:text-gray-100">
                  Watch Demo
                </Button>
              </div>
            </motion.div>
            <motion.div 
              className="lg:w-1/2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative">
                <motion.div
                  className="absolute -top-4 -left-4 bg-purple-500 rounded-full p-3 opacity-75 filter blur-md"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Sparkles className="w-6 h-6 text-white" />
                </motion.div>
                <motion.div
                  className="absolute -bottom-4 -right-4 bg-blue-500 rounded-full p-3 opacity-75 filter blur-md"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                >
                  <Sparkles className="w-6 h-6 text-white" />
                </motion.div>
                <motion.img
                  src="/Ai-Chat-Pro.jpg"
                  alt="Futuristic Ai assistant visualization"
                  className="rounded-lg shadow-2xl border border-gray-700"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                />
              </div>
            </motion.div>
          </div>

          <motion.div 
            className="mt-24 text-center"
            variants={stagger}
            initial="initial"
            animate="animate"
          >
            <motion.h2 
              className="text-3xl font-bold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400"
              variants={{
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 }
              }}
              transition={{ duration: 0.5 }}
            >
              Discover the Possibilities
            </motion.h2>
            <div className="flex flex-wrap justify-center gap-8">
              <motion.div variants={fadeIn} className="flex flex-col items-center max-w-xs">
                <motion.div variants={pulse} className="bg-purple-500 bg-opacity-20 p-6 rounded-full mb-4">
                  <MessageSquare className="w-12 h-12 text-purple-400" />
                </motion.div>
                <h3 className="text-xl font-semibold mb-2 text-gray-200">Intelligent Chat</h3>
                <p className="text-gray-400">Engage in natural conversations with our AI, powered by advanced language models.</p>
              </motion.div>
              <motion.div variants={fadeIn} className="flex flex-col items-center max-w-xs">
                <motion.div variants={pulse} className="bg-blue-500 bg-opacity-20 p-6 rounded-full mb-4">
                  <ImageIcon className="w-12 h-12 text-blue-400" />
                </motion.div>
                <h3 className="text-xl font-semibold mb-2 text-gray-200">Image Creation</h3>
                <p className="text-gray-400">Generate stunning visuals from text descriptions using cutting-edge AI technology.</p>
              </motion.div>
              <motion.div variants={fadeIn} className="flex flex-col items-center max-w-xs">
                <motion.div variants={pulse} className="bg-cyan-500 bg-opacity-20 p-6 rounded-full mb-4">
                  <Music className="w-12 h-12 text-cyan-400" />
                </motion.div>
                <h3 className="text-xl font-semibold mb-2 text-gray-200">Audio Generation</h3>
                <p className="text-gray-400">Create custom audio content, from music to voice-overs, with our AI-powered audio tools.</p>
              </motion.div>
            </div>
          </motion.div>

          <motion.div 
            className="mt-24 max-w-md mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Ready to Get Started?</h2>
            <p className="mb-6 text-gray-300">Join our community and experience the future of AI-powered communication.</p>
            <form onSubmit={(e) => e.preventDefault()} className="flex space-x-2">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className="flex-grow bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500"
              />
              <Button type="submit" className="bg-gradient-to-r from-purple-500 to-blue-500 text-gray-100 font-semibold">
                Sign Up
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </motion.div>
        </main>

        <motion.footer 
          className="bg-gray-900 mt-24 border-t border-gray-800"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-100">AI Chat Pro</h4>
                <p className="text-sm text-gray-400">Empowering conversations with advanced AI technology.</p>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-400 hover:text-blue-400">
                    <Twitter className="h-5 w-5" />
                    <span className="sr-only">Twitter</span>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-blue-400">
                    <Facebook className="h-5 w-5" />
                    <span className="sr-only">Facebook</span>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-blue-400">
                    <Linkedin className="h-5 w-5" />
                    <span className="sr-only">LinkedIn</span>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-blue-400">
                    <Github className="h-5 w-5" />
                    <span className="sr-only">GitHub</span>
                  </a>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4 text-gray-100">Product</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="text-gray-400 hover:text-blue-400">Features</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-blue-400">Pricing</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-blue-400">Use Cases</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-blue-400">API</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4 text-gray-100">Resources</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="text-gray-400 hover:text-blue-400">Documentation</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-blue-400">Blog</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-blue-400">Community</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-blue-400">Support</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4 text-gray-100">Company</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="text-gray-400 hover:text-blue-400">About Us</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-blue-400">Careers</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-blue-400">Press</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-blue-400">Contact</a></li>
                </ul>
              </div>
            </div>
            <div className="mt-12 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
              <p>&copy; 2024 AI Chat Pro. All rights reserved.</p>
              <div className="mt-2 space-x-4">
                <a href="#" className="hover:text-blue-400">Privacy Policy</a>
                <a href="#" className="hover:text-blue-400">Terms of Service</a>
                <a href="#" className="hover:text-blue-400">Cookie Policy</a>
              </div>
            </div>
          </div>
        </motion.footer>
      </div>
    </div>
  )
}
