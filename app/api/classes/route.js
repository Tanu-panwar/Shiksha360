import { NextResponse } from "next/server"
import {connectDB} from "@/lib/db";
import Class from "@/models/Class"

export async function POST(req) {
  await connectDB()
  const body = await req.json()

  const { className, section, teacher, students } = body

  if (!className || !section || !teacher) {
    return NextResponse.json(
      { error: "All fields required" },
      { status: 400 }
    )
  }

  const created = await Class.create({
    className,
    section,
    teacher,
    students: students || 0,
  })

  return NextResponse.json(created)
}

export async function GET() {
  await connectDB()
  const classes = await Class.find().sort({ createdAt: -1 })
  return NextResponse.json(classes)
}
