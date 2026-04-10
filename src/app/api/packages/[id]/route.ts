import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Package from "@/models/Package";
import { mockPackages } from "@/lib/mockData";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await params;
    const dbCount = await Package.countDocuments();

    if (dbCount > 0) {
      const pkg = await Package.findOne({
        $or: [{ packageId: id }, ...(id.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: id }] : [])],
      });
      if (!pkg) return NextResponse.json({ error: "Package not found" }, { status: 404 });
      return NextResponse.json(pkg);
    }

    const pkg = mockPackages.find((p) => p._id === id || p.packageId === id);
    if (!pkg) return NextResponse.json({ error: "Package not found" }, { status: 404 });
    return NextResponse.json(pkg);
  } catch {
    return NextResponse.json({ error: "Failed to fetch package" }, { status: 500 });
  }
}
