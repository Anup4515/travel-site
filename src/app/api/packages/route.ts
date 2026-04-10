import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Package from "@/models/Package";
import { mockPackages } from "@/lib/mockData";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const city = searchParams.get("city");
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");

    const dbCount = await Package.countDocuments();

    if (dbCount > 0) {
      const query: Record<string, unknown> = { active: true };
      if (city) {
        query.$or = [
          { destination: new RegExp(city, "i") },
          { cities: new RegExp(city, "i") },
        ];
      }
      if (category) query.category = category;
      if (featured === "true") query.featured = true;
      const pkgs = await Package.find(query).sort({ featured: -1, price: 1 });
      return NextResponse.json(pkgs);
    }

    let results = [...mockPackages];
    if (city) results = results.filter((p) => p.destination.toLowerCase().includes(city.toLowerCase()) || p.cities.some((c) => c.toLowerCase().includes(city.toLowerCase())));
    if (category) results = results.filter((p) => p.category === category);
    if (featured === "true") results = results.filter((p) => p.featured);
    return NextResponse.json(results);
  } catch {
    return NextResponse.json({ error: "Failed to search packages" }, { status: 500 });
  }
}
