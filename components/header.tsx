"use client"

import { useState } from "react";
import { Menu, X, LogIn } from "lucide-react";
import Link from "next/link";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 shadow-md border-b border-gray-300">
      {/* Textured Blue Gradient Background */}
      <div className="relative w-full">
        {/* Blue Gradient Layer */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-blue-500 to-blue-900" />
        {/* SVG/Noise Overlay Layer for Texture */}
        <div className="absolute inset-0 bg-[url('/noise-texture.png')] opacity-20 mix-blend-overlay pointer-events-none"></div>
        {/* Banner Content */}
        <div className="relative z-10 flex items-center justify-between h-16 px-4 md:px-12">
          {/* Brand/Logo Section */}
          <Link href="/" className="flex items-center space-x-2">
            {/* Optional Image/Icon */}
            {/* <Image src="/logo-icon.png" alt="Logo" width={32} height={32} /> */}
            <span className="text-white font-extrabold text-xl tracking-wide">Shiksha360</span>
          </Link>

          {/* Centered Links */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/student" className="text-blue-100 hover:text-white font-semibold px-2 py-1 rounded transition">Student</Link>
            <Link href="/faculty" className="text-blue-100 hover:text-white font-semibold px-2 py-1 rounded transition">Faculty</Link>
            <Link href="/government" className="text-blue-100 hover:text-white font-semibold px-2 py-1 rounded transition">Government</Link>
          </nav>

          {/* Auth Buttons Section */}
          <div className="flex items-center space-x-3">
            <Link href="/login" className="bg-white text-blue-800 font-semibold px-4 py-1 rounded hover:bg-blue-100 shadow transition flex items-center gap-1">
              <LogIn size={18} /> Login
            </Link>
            <Link href="/register" className="bg-blue-700 text-white font-semibold px-4 py-1 rounded hover:bg-white hover:text-blue-800 border border-blue-700 shadow transition">
              Register
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="ml-3 md:hidden p-2 rounded hover:bg-blue-900/30 focus:outline-none" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={26} color="#fff"/> : <Menu size={26} color="#fff"/>}
          </button>
        </div>

        {/* Mobile Menu Drawer */}
        {isMenuOpen && (
          <div className="md:hidden relative z-20 bg-blue-900/95 text-white w-full px-4 py-4 flex flex-col gap-2">
            <Link href="/student" className="py-1 px-1 rounded hover:bg-blue-700/60" onClick={() => setIsMenuOpen(false)}>Student</Link>
            <Link href="/faculty" className="py-1 px-1 rounded hover:bg-blue-700/60" onClick={() => setIsMenuOpen(false)}>Faculty</Link>
            <Link href="/government" className="py-1 px-1 rounded hover:bg-blue-700/60" onClick={() => setIsMenuOpen(false)}>Government</Link>
            <Link href="/login" className="py-1 px-1 rounded hover:bg-blue-700/60 flex items-center gap-1" onClick={() => setIsMenuOpen(false)}>
              <LogIn size={18} /> Login
            </Link>
            <Link href="/register" className="py-1 px-1 rounded hover:bg-blue-700/60" onClick={() => setIsMenuOpen(false)}>
              Register
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}