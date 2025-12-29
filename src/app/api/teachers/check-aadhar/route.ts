import { connectDB } from "@/lib/db";
import { Teacher } from "@/lib/models/Teacher";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  await connectDB();
  try {
    const { aadhar_number } = await req.json();

    if (!aadhar_number || !/^\d{12}$/.test(aadhar_number)) {
      return NextResponse.json({ exists: false, valid: false });
    }

    const existing = await Teacher.findOne({ aadhar_number });

    return NextResponse.json({
      exists: !!existing,
      valid: true
    });
  } catch (error) {
    return NextResponse.json({ exists: false, valid: false }, { status: 500 });
  }
}
