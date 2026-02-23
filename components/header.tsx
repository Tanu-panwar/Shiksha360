"use client"
import Link from "next/link"

export default function Header() {
  return (
    <header className="w-full bg-blue-100 border-b border-blue-200 py-4 px-6">
      <div className="max-w-8xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-800">Shiksha360</h1>

        <nav className="space-x-4 text-blue-700 text-md">
          <Link href="/" className="hover:underline cursor-pointer">
            Home
          </Link>
          <Link href="#" className="hover:underline">
            About
          </Link>
          <Link href="#" className="hover:underline">
            Contact
          </Link>
        </nav>
      </div>
    </header>
  )
}
