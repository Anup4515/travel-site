import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Cab from "@/models/Cab";

export async function GET() {
  try {
    await dbConnect();
    const cabs = await Cab.find();
    return NextResponse.json({ success: true, data: cabs });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to fetch cabs" }, { status: 500 });
  }
}
