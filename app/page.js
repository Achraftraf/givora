"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FaGift, FaArrowRight, FaMagic } from "react-icons/fa";

const HomePage = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.3,
        duration: 0.6
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6 }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      backgroundColor: "#9333ea", // Purple-600
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.98 }
  };

  // Benefits list
  const benefits = [
    "Perfect gifts for any occasion",
    "Personalized recommendations",
    "Save time and find thoughtful gifts",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 dark:from-gray-900 dark:to-purple-900 overflow-hidden">
      {/* Background decoration */}
      <motion.div
        className="absolute inset-0 overflow-hidden z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 1 }}
      >
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-br from-purple-300 to-pink-300 dark:from-purple-600 dark:to-pink-600 opacity-30"
            style={{
              width: `${Math.random() * 300 + 100}px`,
              height: `${Math.random() * 300 + 100}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 50 - 25],
              y: [0, Math.random() * 50 - 25],
            }}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: Math.random() * 10 + 10,
            }}
          />
        ))}
      </motion.div>

      <div className="container mx-auto px-6 py-16 relative z-10">
        <motion.div
          className="flex flex-col lg:flex-row items-center justify-between gap-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Hero content */}
          <motion.div 
            className="lg:w-1/2 text-center lg:text-left"
            variants={itemVariants}
          >
            <motion.div 
              className="inline-block mb-4 bg-purple-100 dark:bg-purple-900/50 p-3 rounded-xl"
              whileHover={{ rotate: [0, -5, 5, -5, 0], transition: { duration: 0.5 } }}
            >
              <FaGift className="text-purple-600 dark:text-purple-300 text-2xl" />
            </motion.div>
            
            <motion.h1 
              className="text-6xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500"
              variants={itemVariants}
            >
              GIVORA
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl font-light mt-4 mb-6 text-gray-700 dark:text-gray-200 leading-relaxed"
              variants={itemVariants}
            >
              Discover the perfect gift with AI-powered recommendations tailored for every occasion
            </motion.p>
            
            <motion.ul className="space-y-3 mb-8">
              {benefits.map((benefit, index) => (
                <motion.li 
                  key={index}
                  className="flex items-center space-x-2 text-gray-700 dark:text-gray-300"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + (index * 0.2) }}
                >
                  <FaMagic className="text-purple-500" />
                  <span>{benefit}</span>
                </motion.li>
              ))}
            </motion.ul>
            
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
            >
              <motion.div
                whileHover="hover"
                whileTap="tap"
                variants={buttonVariants}
              >
                <Link 
                  href="/chat" 
                  className="btn bg-purple-500 hover:bg-purple-600 text-white px-8 py-3 rounded-lg font-medium inline-flex items-center transition-all shadow-lg shadow-purple-500/30"
                >
                  Get Started
                  <FaArrowRight className="ml-2" />
                </Link>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
              </motion.div>
            </motion.div>
          </motion.div>
          
          {/* Hero image/illustration */}
          <motion.div 
            className="lg:w-1/2"
            variants={itemVariants}
          >
            <motion.div 
              className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-purple-100 dark:border-purple-900"
              whileHover={{ y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="aspect-w-16 aspect-h-12 rounded-lg overflow-hidden bg-gradient-to-r from-purple-200 to-pink-200 dark:from-purple-900 dark:to-pink-900">
                <div className="p-8 flex flex-col items-center justify-center text-center">
                  <motion.div 
                    className="text-6xl text-purple-600 dark:text-purple-300 mb-4"
                    animate={{ 
                      rotate: [0, 10, -10, 10, 0],
                      scale: [1, 1.1, 1] 
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity,
                      repeatDelay: 3 
                    }}
                  >
                    <FaGift />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Gift Ideas</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Personalized suggestions tailored to your recipient's preferences
                  </p>
                </div>
              </div>
              
              <div className="mt-6 space-y-3">
                {[...Array(3)].map((_, i) => (
                  <motion.div 
                    key={i} 
                    className="flex items-center space-x-3 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2 + (i * 0.2) }}
                  >
                    <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                    <div className="w-full h-6 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default HomePage;