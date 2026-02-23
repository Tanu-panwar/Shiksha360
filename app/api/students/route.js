import { NextResponse } from "next/server";
import {connectDB} from "@/lib/db";   // ✅ default import
import Student from "@/models/Student";

export async function GET() {
  await connectDB();
  const students = await Student.find().sort({ createdAt: -1 });
  return NextResponse.json(students);
}

export async function POST(req) {
  await connectDB();
  const body = await req.json();
  const student = await Student.create(body);
  return NextResponse.json(student);
}
