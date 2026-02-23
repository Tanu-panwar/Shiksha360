import {connectDB} from "@/lib/db"
import Teacher from "@/models/Teacher"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { NextResponse } from "next/server"

export async function POST(req) {
  await connectDB()

  const { email, password } = await req.json()

  // 🔹 basic validation
  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required" },
      { status: 400 }
    )
  }

  const teacher = await Teacher.findOne({ email })

  if (!teacher) {
    return NextResponse.json(
      { error: "No account found with this email" },
      { status: 404 }
    )
  }

  if (!teacher.password) {
    return NextResponse.json(
      { error: "Account not activated. Contact admin." },
      { status: 400 }
    )
  }

  const isMatch = await bcrypt.compare(password, teacher.password)

  if (!isMatch) {
    return NextResponse.json(
      { error: "Invalid password. Try again." },
      { status: 401 }
    )
  }

  const token = jwt.sign(
    { id: teacher._id, role: "teacher" },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  )

  return NextResponse.json({
    message: "Login successful",
    token,
  })
}
