"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  const router = useRouter()

  const roles = [
    {
      title: "Student",
      desc: "Access classes, assignments and results",
      login: "/login/student",
      signup: "/signup/student",
    },
    {
      title: "Teacher",
      desc: "Manage classes, attendance and students",
      login: "/login/teacher",
      signup: "/signup/teacher",
    },
    {
      title: "Admin",
      desc: "Control school data and user management",
      login: "/login/admin",
      signup: "/signup/admin",
    },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-blue-100">
      <Header />

      {/* HERO SECTION */}
      <main className="flex-grow relative flex items-center justify-center px-6 py-16">
        {/* Background Image */}
        <Image
          src="/school-bg.webp"
          alt="School Background"
          fill
          className="object-cover opacity-20"
        />

        {/* Content */}
        <div className="relative z-10 w-full max-w-6xl">
          <h1 className="text-4xl md:text-5xl font-bold text-center text-blue-900 mb-4 drop-shadow-sm">
            Welcome to Shiksha360
          </h1>
          <p className="text-center text-blue-700 mb-12">
            A simple digital platform for government school management
          </p>

          {/* ROLE CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {roles.map((role) => (
              <Card
                key={role.title}
                className="
                  bg-white/80 backdrop-blur
                  border border-blue-400
                  shadow-lg rounded-2xl
                  transition-all duration-300
                  hover:-translate-y-1 hover:shadow-2xl
                "
              >
                <CardContent className="p-8 flex flex-col items-center text-center">
                  <div
                    className="
                      w-14 h-14 mb-4 rounded-xl
                      bg-gradient-to-br from-blue-600 to-blue-400
                      flex items-center justify-center
                      text-white text-2xl font-bold
                      shadow-md
                    "
                  >
                    {role.title.charAt(0)}
                  </div>

                  <h2 className="text-xl font-semibold text-blue-800 mb-2">
                    {role.title}
                  </h2>

                  <p className="text-sm text-blue-700 mb-6">
                    {role.desc}
                  </p>

                  <div className="flex gap-4 w-full">
                    <Button
                      onClick={() => router.push(role.login)}
                      className="
                        flex-1 bg-blue-600 hover:bg-blue-700
                        rounded-xl transition-all duration-200 cursor-pointer
                      "
                    >
                      Login
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => router.push(role.signup)}
                      className="
                        flex-1 border-blue-500 text-blue-700
                        hover:bg-blue-50 rounded-xl
                        transition-all duration-200 cursor-pointer
                      "
                    >
                      Sign Up
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
