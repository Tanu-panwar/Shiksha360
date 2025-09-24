"use client"

import Link from "next/link"

export default function Footer() {
  return (
    <footer className="relative w-full mt-12 border-t border-gray-300 shadow-inner">
      {/* Blue Gradient with Subtle Texture */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-800 via-blue-500 to-blue-900" />
      <div className="absolute inset-0 bg-[url('/noise-texture.png')] opacity-15 mix-blend-overlay pointer-events-none"></div>
      {/* Footer Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-10 text-white">
        {/* Branding Section */}
        <div className="flex flex-col gap-2">
          {/* <Image src="/logo-icon.png" width={40} height={40} alt="Shiksha360 Logo" /> */}
          <span className="font-bold text-2xl tracking-wide">Shiksha360</span>
          <span className="text-blue-100 text-sm">Empowering Education for Everyone</span>
        </div>
        {/* Links Section */}
        <div className="flex flex-col md:items-center gap-2">
          <span className="font-semibold text-base mb-2">Quick Links</span>
          <div className="flex flex-wrap gap-3 text-blue-100">
            <Link href="/student" className="hover:underline hover:text-white">Student</Link>
            <Link href="/faculty" className="hover:underline hover:text-white">Faculty</Link>
            <Link href="/government" className="hover:underline hover:text-white">Government</Link>
            <Link href="/login" className="hover:underline hover:text-white">Login</Link>
            <Link href="/register" className="hover:underline hover:text-white">Register</Link>
          </div>
        </div>
        {/* Info/Contact Section */}
        <div className="flex flex-col md:items-end gap-2">
          <span className="font-semibold text-base mb-2">Contact & Info</span>
          <span className="text-blue-100 text-sm">Email: info@shiksha360.com</span>
          <span className="text-blue-100 text-sm">Phone: +91-1234567890</span>
          <div className="flex gap-4 mt-2">
            {/* Social Icons (e.g., SVG, add as needed) */}
            <a href="https://twitter.com/" target="_blank" rel="noopener" aria-label="Twitter" className="hover:text-blue-300">🐦</a>
            <a href="https://facebook.com/" target="_blank" rel="noopener" aria-label="Facebook" className="hover:text-blue-300">📘</a>
            <a href="https://linkedin.com/" target="_blank" rel="noopener" aria-label="LinkedIn" className="hover:text-blue-300">🔗</a>
          </div>
        </div>
      </div>
      {/* Copyright Section */}
      <div className="relative z-10 py-3 px-4 border-t border-blue-900 text-center text-xs text-blue-100 bg-blue-950/80">
        © {new Date().getFullYear()} Shiksha360. All rights reserved.
      </div>
    </footer>
  );
}