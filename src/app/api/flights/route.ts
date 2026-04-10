import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Flight from "@/models/Flight";
import { mockFlights } from "@/lib/mockData";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const flightClass = searchParams.get("class");
    const maxPrice = searchParams.get("maxPrice");
    const stops = searchParams.get("stops");

    const dbCount = await Flight.countDocuments();

    if (dbCount > 0) {
      const query: Record<string, unknown> = { active: true };
      if (from) query.from = new RegExp(from, "i");
      if (to) query.to = new RegExp(to, "i");
      if (flightClass) query.class = flightClass;
      if (maxPrice) query.price = { $lte: parseInt(maxPrice) };
      if (stops !== null && stops !== undefined) query.stops = parseInt(stops);
      const flights = await Flight.find(query).sort({ price: 1 });
      return NextResponse.json(flights);
    }

    let results = [...mockFlights];
    if (from) results = results.filter((f) => f.from.toLowerCase().includes(from.toLowerCase()));
    if (to) results = results.filter((f) => f.to.toLowerCase().includes(to.toLowerCase()));
    if (flightClass) results = results.filter((f) => f.class === flightClass);
    if (maxPrice) results = results.filter((f) => f.price <= parseInt(maxPrice));
    if (stops) results = results.filter((f) => f.stops === parseInt(stops));
    return NextResponse.json(results);
  } catch {
    return NextResponse.json({ error: "Failed to search flights" }, { status: 500 });
  }
}
