import { NextResponse } from "next/server"
import  connectDB  from "@/lib/db"
import Attendance from "@/models/Attendance"
import Class from "@/models/Class"

export async function POST(req) {
  await connectDB()

  const { classId, date, records } = await req.json()

  for (const r of records) {
    await Attendance.updateOne(
      { classId, rollNo: r.rollNo, date },
      {
        $set: {
          name: r.name,
          status: r.status,
        },
      },
      { upsert: true }
    )
  }

  // 👇 UI badge + refresh ke liye MUST
  await Class.findByIdAndUpdate(classId, {
    lastAttendanceDate: date,
  })

  return NextResponse.json({ success: true })
}
