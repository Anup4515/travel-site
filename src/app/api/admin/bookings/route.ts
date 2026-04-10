import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { FlightBooking, HotelBooking, PackageBooking, CabBooking } from "@/models/Booking";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await dbConnect();

    const [flights, hotels, packages, cabs] = await Promise.all([
      FlightBooking.find().sort({ createdAt: -1 }).populate("userId", "name email").lean(),
      HotelBooking.find().sort({ createdAt: -1 }).populate("userId", "name email").lean(),
      PackageBooking.find().sort({ createdAt: -1 }).populate("userId", "name email").lean(),
      CabBooking.find().sort({ createdAt: -1 }).populate("userId", "name email").lean(),
    ]);

    const allBookings = [
      ...flights.map((b) => ({ ...b, type: "flight" })),
      ...hotels.map((b) => ({ ...b, type: "hotel" })),
      ...packages.map((b) => ({ ...b, type: "package" })),
      ...cabs.map((b) => ({ ...b, type: "cab" })),
    ].sort((a, b) => new Date(b.createdAt as string).getTime() - new Date(a.createdAt as string).getTime());

    return NextResponse.json(allBookings);
  } catch {
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}
