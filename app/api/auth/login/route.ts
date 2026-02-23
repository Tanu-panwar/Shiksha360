import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import User from "@/models/user"
import jwt from "jsonwebtoken"

export async function POST(req: Request) {
  try {
    await connectDB()

    const body = await req.json()
    const { role, name, rollNo, teacherId, adminId } = body

    if (!role || !name) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    let user = null

    if (role === "STUDENT") {
      if (!rollNo)
        return NextResponse.json({ error: "Roll number required" }, { status: 400 })

      user = await User.findOne({ name, rollNo, role: "STUDENT" })
    }

    if (role === "TEACHER") {
      if (!teacherId)
        return NextResponse.json({ error: "Teacher ID required" }, { status: 400 })

      user = await User.findOne({ name, teacherId, role: "TEACHER" })
    }

    if (role === "ADMIN") {
      if (!adminId)
        return NextResponse.json({ error: "Admin ID required" }, { status: 400 })

      user = await User.findOne({ name, adminId, role: "ADMIN" })
    }

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
        name: user.name,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "2h" }
    )

    return NextResponse.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
      },
    })
  } catch (err: any) {
    console.error("LOGIN ERROR:", err)
    return NextResponse.json(
      { error: "Server error", details: err.message },
      { status: 500 }
    )
  }
}
