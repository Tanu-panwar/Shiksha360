import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import User from "@/models/user"

export async function POST(req: Request) {
  await connectDB()
  const { name, adminId } = await req.json()

  const existing = await User.findOne({ adminId, role: "ADMIN" })
  if (existing) {
    return NextResponse.json({ error: "Admin already exists" }, { status: 400 })
  }

  const user = await User.create({
    name,
    adminId,
    role: "ADMIN",
  })

  return NextResponse.json({ message: "Admin registered", user })
}
