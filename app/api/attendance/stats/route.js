import { NextResponse } from "next/server"
import  connectDB  from "@/lib/db"
import Attendance from "@/models/Attendance"

export async function GET(req) {
  await connectDB()

  const { searchParams } = new URL(req.url)
  const date = searchParams.get("date")

  const records = await Attendance.find({ date })

  const total = records.length
  const present = records.filter((r) => r.status === "P").length
  const absent = total - present
  const percent = total === 0 ? 0 : Math.round((present / total) * 100)

  return NextResponse.json({
    total,
    present,
    absent,
    percent,
  })
}
