import { NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Event from "@/models/Event"

export async function POST(req) {
  await connectDB()
  const holidays = await req.json()

  const docs = holidays.map((h:any) => ({
    ...h,
    type: "holiday",
  }))

  await Event.insertMany(docs)
  return NextResponse.json({ success: true })
}
