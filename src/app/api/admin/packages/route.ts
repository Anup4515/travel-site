import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Package from "@/models/Package";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await dbConnect();
    const packages = await Package.find().sort({ createdAt: -1 });
    return NextResponse.json(packages);
  } catch {
    return NextResponse.json({ error: "Failed to fetch packages" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await dbConnect();
    const body = await req.json();

    // Generate packageId from name if not provided
    if (!body.packageId) {
      body.packageId = body.name?.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") || `pkg-${Date.now()}`;
    }

    const pkg = await Package.create(body);
    return NextResponse.json(pkg, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create package";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
