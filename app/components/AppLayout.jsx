"use client";

import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";

// Layout component that wraps all pages
export default function AppLayout({ children }) {
  const [mounted, setMounted] = useState(false);

  // Handle mounting state to prevent hydration errors
  useEffect(() => {
    setMounted(true);
    
    // Apply saved theme on initial load
    const savedTheme = localStorage.getItem("theme") || 
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    
    document.documentElement.setAttribute("data-theme", savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-base-100"></div>;
  }

  return (
    <>
      <Toaster 
        position="top-center" 
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            iconTheme: {
              primary: '#4ade80',
              secondary: 'white',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: 'white',
            },
          }
        }}
      />
      {children}
    </>
  );
}