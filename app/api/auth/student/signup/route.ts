import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import User from "@/models/user"

export async function POST(req: Request) {
  try {
    await connectDB()

    const body = await req.json()
    const { name, rollNo, schoolName } = body

    if (!name || !rollNo || !schoolName) {
      return NextResponse.json(
        { error: "All fields required" },
        { status: 400 }
      )
    }

    const existing = await User.findOne({ rollNo, role: "STUDENT" })
    if (existing) {
      return NextResponse.json(
        { error: "Student already exists" },
        { status: 400 }
      )
    }

    const user = await User.create({
      name,
      rollNo,
      schoolName,
      role: "STUDENT",
    })

    return NextResponse.json({ message: "Student registered", user })
  } catch (err: any) {
    console.error("STUDENT SIGNUP ERROR:", err)
    return NextResponse.json(
      { error: "Server error", details: err.message },
      { status: 500 }
    )
  }
}
