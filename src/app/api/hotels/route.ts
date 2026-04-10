import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Hotel from "@/models/Hotel";
import { mockHotels } from "@/lib/mockData";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const location = searchParams.get("location");
    const city = searchParams.get("city");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const minRating = searchParams.get("minRating");

    const dbCount = await Hotel.countDocuments();

    if (dbCount > 0) {
      const query: Record<string, unknown> = { active: true };
      if (location) query.location = new RegExp(location, "i");
      if (city) query.city = new RegExp(city, "i");
      if (minPrice || maxPrice) {
        const priceQuery: Record<string, number> = {};
        if (minPrice) priceQuery.$gte = parseInt(minPrice);
        if (maxPrice) priceQuery.$lte = parseInt(maxPrice);
        query.pricePerNight = priceQuery;
      }
      if (minRating) query.rating = { $gte: parseFloat(minRating) };
      const hotels = await Hotel.find(query).sort({ rating: -1, pricePerNight: 1 });
      return NextResponse.json(hotels);
    }

    let results = [...mockHotels];
    if (location) results = results.filter((h) => h.location.toLowerCase().includes(location.toLowerCase()));
    if (city) results = results.filter((h) => h.city.toLowerCase().includes(city.toLowerCase()));
    if (minPrice) results = results.filter((h) => h.pricePerNight >= parseInt(minPrice));
    if (maxPrice) results = results.filter((h) => h.pricePerNight <= parseInt(maxPrice));
    if (minRating) results = results.filter((h) => h.rating >= parseFloat(minRating));
    return NextResponse.json(results);
  } catch {
    return NextResponse.json({ error: "Failed to search hotels" }, { status: 500 });
  }
}
