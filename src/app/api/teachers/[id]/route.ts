import { connectDB } from "@/lib/db";
import { Teacher } from "@/lib/models/Teacher";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  try {
    const { id } = await params;
    const teacher = await Teacher.findById(id);
    if (!teacher) {
      return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
    }
    return NextResponse.json(teacher);
  } catch (error) {
    return NextResponse.json({ error: "Invalid teacher id" }, { status: 400 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  try {
    const { id } = await params;
    const deleted = await Teacher.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Invalid teacher id" }, { status: 400 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  try {
    const { id } = await params;
    const data = await req.json();

    // Update the teacher with new data
    const teacher = await Teacher.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!teacher) {
      return NextResponse.json(
        { error: "Teacher not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(teacher, { status: 200 });
  } catch (err: any) {
    console.error("Teacher PATCH error", err);

    // Handle mongoose validation errors
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map((e: any) => e.message);
      return NextResponse.json({ error: errors.join(', ') }, { status: 400 });
    }

    // Handle cast error (invalid ID format)
    if (err.name === 'CastError') {
      return NextResponse.json({ error: "Invalid teacher ID" }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Failed to update teacher. Please try again." },
      { status: 500 }
    );
  }
}
