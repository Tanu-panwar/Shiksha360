import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"
import Teacher from "@/models/Teacher"
import {connectDB} from "@/lib/db"

export async function GET() {
  await connectDB()
  const teachers = await Teacher.find().sort({ createdAt: -1 })
  return NextResponse.json(teachers)
}

export async function POST(req) {
  await connectDB()
  const body = await req.json()

  const {
    schoolName,
    name,
    email,
    contactNo,
    subjects,
    classes,
    password,
  } = body

  if (!password || password.length < 8) {
    return new Response(
      JSON.stringify({ error: "Password must be at least 8 characters" }),
      { status: 400 }
    )
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const teacher = await Teacher.create({
    schoolName,
    name,
    email,
    contactNo,
    subjects,
    classes,
    password: hashedPassword, // ✅ stored properly
    status: "ACTIVE",
  })

  return Response.json(teacher)
}
