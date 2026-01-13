import { NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Event from "@/models/Event"

export async function POST(req) {
  await connectDB()
  const body = await req.json()

  const event = await Event.create(body)
  return NextResponse.json(event)
}

export async function GET() {
  await connectDB()
  const events = await Event.find()
  return NextResponse.json(events)
}
