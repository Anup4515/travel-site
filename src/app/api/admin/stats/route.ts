import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Package from "@/models/Package";
import { FlightBooking, HotelBooking, PackageBooking, CabBooking } from "@/models/Booking";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const [users, packages, flightBookings, hotelBookings, packageBookings, cabBookings] = await Promise.all([
      User.countDocuments(),
      Package.countDocuments(),
      FlightBooking.countDocuments(),
      HotelBooking.countDocuments(),
      PackageBooking.countDocuments(),
      CabBooking.countDocuments(),
    ]);

    const [flightRevenue, hotelRevenue, packageRevenue, cabRevenue] = await Promise.all([
      FlightBooking.aggregate([{ $group: { _id: null, total: { $sum: "$price" } } }]),
      HotelBooking.aggregate([{ $group: { _id: null, total: { $sum: "$price" } } }]),
      PackageBooking.aggregate([{ $group: { _id: null, total: { $sum: "$price" } } }]),
      CabBooking.aggregate([{ $group: { _id: null, total: { $sum: "$price" } } }]),
    ]);

    const totalRevenue =
      (flightRevenue[0]?.total || 0) +
      (hotelRevenue[0]?.total || 0) +
      (packageRevenue[0]?.total || 0) +
      (cabRevenue[0]?.total || 0);

    const totalBookings = flightBookings + hotelBookings + packageBookings + cabBookings;

    const recentBookings = await Promise.all([
      FlightBooking.find().sort({ createdAt: -1 }).limit(5).lean(),
      HotelBooking.find().sort({ createdAt: -1 }).limit(5).lean(),
      PackageBooking.find().sort({ createdAt: -1 }).limit(5).lean(),
    ]);

    const recent = [...recentBookings[0].map((b) => ({ ...b, type: "flight" })), ...recentBookings[1].map((b) => ({ ...b, type: "hotel" })), ...recentBookings[2].map((b) => ({ ...b, type: "package" }))]
      .sort((a, b) => new Date(b.createdAt as string).getTime() - new Date(a.createdAt as string).getTime())
      .slice(0, 10);

    return NextResponse.json({
      users,
      packages,
      totalBookings,
      totalRevenue,
      bookingBreakdown: { flights: flightBookings, hotels: hotelBookings, packages: packageBookings, cabs: cabBookings },
      recentBookings: recent,
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
