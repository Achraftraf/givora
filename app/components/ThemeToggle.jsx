"use client";

import { BsMoonFill, BsSunFill } from "react-icons/bs";
import { useState, useEffect } from "react";

const themes = {
  light: "light",
  dark: "dark",
};

const ThemeToggle = () => {
  const [theme, setTheme] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  // Set initial theme based on system preference or localStorage
  useEffect(() => {
    setIsMounted(true);
    
    // Get saved theme from localStorage if available
    let savedTheme = localStorage.getItem("theme");
    
    // If no saved theme, check system preference
    if (!savedTheme) {
      savedTheme = window.matchMedia("(prefers-color-scheme: dark)").matches 
        ? themes.dark 
        : themes.light;
      
      // Save the detected preference to localStorage
      localStorage.setItem("theme", savedTheme);
    }
    
    // Apply the theme
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === themes.dark);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === themes.light ? themes.dark : themes.light;
    
    // Update state and localStorage
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    
    // Update document attributes
    document.documentElement.setAttribute("data-theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === themes.dark);
  };

  // Avoid hydration mismatch
  if (!isMounted) return null;

  return (
    <button 
      onClick={toggleTheme} 
      className="ml-auto p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
      aria-label={`Switch to ${theme === themes.light ? 'dark' : 'light'} mode`}
    >
      {theme === themes.light ? (
        <BsMoonFill className="h-5 w-5 text-gray-700" />
      ) : (
        <BsSunFill className="h-5 w-5 text-yellow-400" />
      )}
    </button>
  );
};

export default ThemeToggle;