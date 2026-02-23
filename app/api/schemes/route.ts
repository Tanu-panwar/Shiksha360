import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Scheme from "@/models/Scheme";

// ⬇️ CREATE scheme — AddScheme page ke liye
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    console.log("BODY RECEIVED =>", body);

    const scheme = new Scheme(body);
    await scheme.save();

    return NextResponse.json({ success: true, scheme });
  } catch (error: any) {
    console.error("ERROR =>", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// ⬇️ READ — fetch ALL schemes for table UI
export async function GET() {
  try {
    await connectDB();
    const schemes = await Scheme.find({}).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: schemes });
  } catch (error: any) {
    console.error("GET ERROR =>", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
