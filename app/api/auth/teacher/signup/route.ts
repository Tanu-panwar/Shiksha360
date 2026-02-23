import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import User from "@/models/user"

export async function POST(req: Request) {
  await connectDB()
  const { name, teacherId, collegeName } = await req.json()

  const existing = await User.findOne({ teacherId, role: "TEACHER" })
  if (existing) {
    return NextResponse.json({ error: "Teacher already exists" }, { status: 400 })
  }

  const user = await User.create({
    name,
    teacherId,
    collegeName,
    role: "TEACHER",
  })

  return NextResponse.json({ message: "Teacher registered", user })
}
