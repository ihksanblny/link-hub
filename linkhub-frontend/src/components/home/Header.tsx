// src/components/home/Header.tsx
"use client"; 

import Link from "next/link";
import { ChevronRight, Link2Icon, LinkIcon } from "lucide-react"; // <--- IMPORT LinkIcon DI SINI
import { useState, useEffect, useCallback } from 'react'; 
// ... (Import lainnya)

// ... (logika hooks handleScroll dan useEffect tetap sama)

export default function Header() {
  const [shouldShow, setShouldShow] = useState(true); 
  const [lastScrollY, setLastScrollY] = useState(0); 
  
  const handleScroll = useCallback(() => {
    if (window.scrollY > lastScrollY && window.scrollY > 100) {
      setShouldShow(false); 
    } else {
      setShouldShow(true); 
    }
    setLastScrollY(window.scrollY);
  }, [lastScrollY]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true }); 

    return () => {
      window.removeEventListener('scroll', handleScroll); 
    };
  }, [handleScroll]); 

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 px-4 sm:px-8 pt-8 transition-transform duration-500 ease-in-out ${
        shouldShow ? 'translate-y-0' : '-translate-y-full' 
      }`}
    >
      <div 
        className="mx-auto max-w-7xl h-16 rounded-full bg-black/50 shadow-2xl backdrop-blur-md flex items-center justify-between px-4 sm:px-8"
      >
        
        {/* LOGO LINK-HUB dengan ICON */}
        <Link href="/" className="flex items-center space-x-2 font-extrabold text-xl sm:text-2xl text-white tracking-tight">
          <Link2Icon className="h-6 w-6 text-green-400" /> {/* <--- ICON LINK */}
          <span>Link-Hub</span>
        </Link>
        
        {/* Navigasi Utama */}
        <nav className="hidden lg:flex items-center space-x-8 text-sm font-medium text-gray-300">
          <Link href="/" className="hover:text-white transition-colors duration-200">Home</Link>
          <Link href="#about" className="hover:text-white transition-colors duration-200">About Us</Link>
          <Link href="#blogs" className="hover:text-white transition-colors duration-200">Blogs</Link>
          <Link href="#services" className="hover:text-white transition-colors duration-200">Services</Link>
          <Link href="#faqs" className="hover:text-white transition-colors duration-200">FAQs</Link>
        </nav>
        
        {/* Tombol CTA */}
        <div className="flex items-center">
          <Link
            href="#contact" 
            className="inline-flex items-center justify-center h-10 px-6 rounded-full text-sm font-semibold text-white transition-all duration-300 
                       bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 shadow-lg"
          >
            Let's Talk 
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}