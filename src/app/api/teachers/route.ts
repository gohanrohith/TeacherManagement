import { connectDB } from "@/lib/db";
import { Teacher } from "@/lib/models/Teacher";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  await connectDB();
  try {
    const data = await req.json();

    // Validate Aadhar
    if (!data.aadhar_number || !/^\d{12}$/.test(data.aadhar_number)) {
      return NextResponse.json({ error: "Valid 12-digit Aadhar number is required" }, { status: 400 });
    }

    // Check for duplicate Aadhar
    const existing = await Teacher.findOne({ aadhar_number: data.aadhar_number });
    if (existing) {
      return NextResponse.json({ error: "This Aadhar number is already registered" }, { status: 409 });
    }

    // Validate required fields
    const requiredFields = [
      'full_name', 'email', 'phone', 'date_of_birth', 'gender',
      'street', 'pincode', 'state',
      'current_branch', 'bank_name', 'account_number', 'ifsc_code', 'pan_number'
    ];

    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 });
      }
    }

    // Validate education required fields
    if (!data.tenth || !data.tenth.board || !data.tenth.year || !data.tenth.percentage) {
      return NextResponse.json({ error: "10th standard details are required" }, { status: 400 });
    }

    if (!data.twelfth || !data.twelfth.board || !data.twelfth.year || !data.twelfth.percentage) {
      return NextResponse.json({ error: "12th standard details are required" }, { status: 400 });
    }

    if (!data.ug || !data.ug.degree || !data.ug.university || !data.ug.year || !data.ug.percentage) {
      return NextResponse.json({ error: "UG details are required" }, { status: 400 });
    }

    // Create teacher record
    const teacher = await Teacher.create({
      aadhar_number: data.aadhar_number,
      profilePic: data.profilePic || '',

      full_name: data.full_name,
      email: data.email,
      phone: data.phone,
      date_of_birth: data.date_of_birth,
      gender: data.gender,
      blood_group: data.blood_group || '',
      emergency_contact_name: data.emergency_contact_name || '',
      emergency_contact_relation: data.emergency_contact_relation || '',
      emergency_contact_mobile: data.emergency_contact_mobile || '',

      street: data.street,
      pincode: data.pincode,
      state: data.state,

      tenth: data.tenth,
      twelfth: data.twelfth,
      ug: data.ug,
      pg: data.pg || [],

      bed: data.bed || {},
      med: data.med || {},

      previous_school_name: data.previous_school_name || '',
      previous_classes_taught: data.previous_classes_taught || [],
      previous_subjects_taught: data.previous_subjects_taught || [],

      current_school: data.current_school,
      current_branch: data.current_branch,
      current_class: data.current_class || '',
      current_subject: data.current_subject || '',

      bank_name: data.bank_name,
      account_number: data.account_number,
      ifsc_code: data.ifsc_code,
      pan_number: data.pan_number,
      pf_number: data.pf_number || '',
      esi_number: data.esi_number || '',

      status: 'pending',
    });

    return NextResponse.json(teacher, { status: 201 });
  } catch (err: any) {
    console.error("Teacher POST error", err);

    // Handle mongoose validation errors
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map((e: any) => e.message);
      return NextResponse.json({ error: errors.join(', ') }, { status: 400 });
    }

    // Handle duplicate key error
    if (err.code === 11000) {
      return NextResponse.json({ error: "This Aadhar number is already registered" }, { status: 409 });
    }

    return NextResponse.json({ error: "Registration failed. Please try again." }, { status: 500 });
  }
}

export async function GET() {
  await connectDB();
  const teachers = await Teacher.find({}).sort({ createdAt: -1 });
  return NextResponse.json(teachers);
}
