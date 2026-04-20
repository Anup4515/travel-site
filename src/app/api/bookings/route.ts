import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { FlightBooking, HotelBooking, PackageBooking, CabBooking } from "@/models/Booking";
import Flight from "@/models/Flight";
import Hotel from "@/models/Hotel";
import Package from "@/models/Package";
import Cab from "@/models/Cab";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const userId = session.user.id;

    const [flights, hotels, packages, cabs] = await Promise.all([
      FlightBooking.find({ userId }).sort({ createdAt: -1 }),
      HotelBooking.find({ userId }).sort({ createdAt: -1 }),
      PackageBooking.find({ userId }).sort({ createdAt: -1 }),
      CabBooking.find({ userId }).sort({ createdAt: -1 }),
    ]);

    return NextResponse.json({ flights, hotels, packages, cabs });
  } catch {
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const userId = session.user.id;
    const body = await req.json();
    const { type, ...data } = body;

    let booking;

    switch (type) {
      case "flight": {
        const { flightId, flightNumber, departure, arrival, date, passengers, price } = data;
        let bookingData;
        if (flightId && !flightNumber) {
          const flight = await Flight.findById(flightId);
          if (!flight) return NextResponse.json({ error: "Flight not found" }, { status: 404 });
          bookingData = { flightNumber: flight.flightNumber, departure: flight.from, arrival: flight.to, date: date || new Date().toISOString().split("T")[0], passengers: passengers || 1, price: flight.price * (passengers || 1) };
        } else {
          bookingData = { flightNumber, departure, arrival, date, passengers, price };
        }
        booking = await FlightBooking.create({ userId, ...bookingData });
        break;
      }
      case "hotel": {
        const { hotelId, hotelName, location, checkIn, checkOut, guests, price } = data;
        let bookingData;
        if (hotelId && !hotelName) {
          const hotel = await Hotel.findById(hotelId);
          if (!hotel) return NextResponse.json({ error: "Hotel not found" }, { status: 404 });
          const nights = Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24));
          bookingData = { hotelName: hotel.name, location: hotel.location, checkIn, checkOut, guests: guests || 1, price: hotel.pricePerNight * nights * (guests || 1) };
        } else {
          bookingData = { hotelName, location, checkIn, checkOut, guests, price };
        }
        booking = await HotelBooking.create({ userId, ...bookingData });
        break;
      }
      case "package": {
        const { packageId, packageName, destination, startDate, travelers, price } = data;
        let bookingData;
        if (packageId && !packageName) {
          const pkg = await Package.findOne({ $or: [{ _id: packageId }, { packageId }] });
          if (!pkg) return NextResponse.json({ error: "Package not found" }, { status: 404 });
          bookingData = { packageName: pkg.name, destination: pkg.destination, startDate, travelers: travelers || 1, price: pkg.price * (travelers || 1) };
        } else {
          bookingData = { packageName, destination, startDate, travelers, price };
        }
        console.log("Package booking data:", bookingData);
        booking = await PackageBooking.create({ userId, ...bookingData });
        console.log("Package booking created:", booking);
        break;
      }
      case "cab": {
        const { cabId, cabName, cabType, pickupLocation, dropoffLocation, pickupDateTime, passengers, price } = data;
        let bookingData;
        if (cabId && !cabName) {
          const cab = await Cab.findById(cabId);
          if (!cab) return NextResponse.json({ error: "Cab not found" }, { status: 404 });
          bookingData = { cabId: cab._id, cabName: cab.cabName, cabType: cab.cabType, pickupLocation, dropoffLocation, pickupDateTime, passengers: passengers || 1, price: price || cab.basePrice };
        } else {
          bookingData = { cabName, cabType, pickupLocation, dropoffLocation, pickupDateTime, passengers, price };
        }
        booking = await CabBooking.create({ userId, ...bookingData });
        break;
      }
      default:
        return NextResponse.json({ error: "Invalid booking type" }, { status: 400 });
    }

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json({ error: "Failed to create booking", details: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const userId = session.user.id;
    const { searchParams } = new URL(req.url);
    const bookingId = searchParams.get("id");
    const type = searchParams.get("type");

    if (!bookingId || !type) {
      return NextResponse.json({ error: "Missing booking ID or type" }, { status: 400 });
    }

    let booking;
    const BookingModel = 
      type === "flight" ? FlightBooking :
      type === "hotel" ? HotelBooking :
      type === "package" ? PackageBooking :
      type === "cab" ? CabBooking :
      null;

    if (!BookingModel) {
      return NextResponse.json({ error: "Invalid booking type" }, { status: 400 });
    }

    booking = await BookingModel.findById(bookingId);
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (booking.userId.toString() !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    if (booking.status === "cancelled") {
      return NextResponse.json({ error: "Booking already cancelled" }, { status: 400 });
    }

    // Calculate refund based on cancellation policy
    const createdAt = new Date(booking.createdAt);
    const now = new Date();
    const daysElapsed = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
    
    let refundPercentage = 0;
    let refundReason = "";

    if (daysElapsed <= 7) {
      // Within 7 days: 100% refund
      refundPercentage = 100;
      refundReason = "Full refund - cancelled within 7 days";
    } else if (daysElapsed <= 14) {
      // Within 7-14 days: 50% refund
      refundPercentage = 50;
      refundReason = "50% refund - cancelled within 14 days";
    } else if (daysElapsed <= 30) {
      // Within 14-30 days: 50% refund
      refundPercentage = 50;
      refundReason = "50% refund - cancelled within 30 days";
    } else {
      // After 30 days: No refund
      refundPercentage = 0;
      refundReason = "No refund - cancelled after 30 days";
    }

    const refundAmount = Math.round((booking.price * refundPercentage) / 100);

    // Update booking status
    booking.status = "cancelled";
    booking.refundAmount = refundAmount;
    booking.refundReason = refundReason;
    booking.cancelledAt = new Date();

    await booking.save();

    return NextResponse.json({ 
      booking, 
      refund: { 
        amount: refundAmount, 
        percentage: refundPercentage, 
        reason: refundReason,
        originalPrice: booking.price
      } 
    });
  } catch {
    return NextResponse.json({ error: "Failed to cancel booking" }, { status: 500 });
  }
}
