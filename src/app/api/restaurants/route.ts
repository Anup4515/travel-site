import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { RestaurantCache } from "@/models/Booking";
import axios from "axios";

const cityCenters: Record<string, { lat: number; lng: number }> = {
  delhi: { lat: 28.7041, lng: 77.1025 },
  agra: { lat: 27.1769, lng: 78.0081 },
  jaipur: { lat: 26.912434, lng: 75.78727 },
};

function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(1);
}

function convertDishSlugToText(slug: string) {
  return slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get("city");
    const dish = searchParams.get("dish");

    if (!city || !dish) {
      return NextResponse.json({ error: "Both 'city' and 'dish' query parameters are required" }, { status: 400 });
    }

    await dbConnect();
    const cityName = city.toLowerCase();
    const dishLower = dish.toLowerCase();

    try {
      const cached = await RestaurantCache.findOne({ city: cityName, dish: dishLower });
      if (cached) {
        const daysSinceUpdate = (Date.now() - new Date(cached.lastUpdated).getTime()) / (1000 * 60 * 60 * 24);
        if (daysSinceUpdate < 7) return NextResponse.json(cached.restaurants);
      }
    } catch { /* continue without cache */ }

    const cityCenter = cityCenters[cityName];
    if (!cityCenter) {
      return NextResponse.json({ error: `City '${city}' not supported. Supported: delhi, agra, jaipur` }, { status: 400 });
    }

    const dishName = convertDishSlugToText(dish);
    const response = await axios.get("https://maps.googleapis.com/maps/api/place/textsearch/json", {
      params: { query: `${dishName} restaurant in ${city}`, key: process.env.GOOGLE_PLACES_API_KEY },
    });

    if (response.data.status === "ZERO_RESULTS" || !response.data.results) {
      return NextResponse.json([]);
    }

    const restaurants = response.data.results.slice(0, 10).map((place: Record<string, unknown>) => {
      const geometry = place.geometry as { location: { lat: number; lng: number } };
      const photos = place.photos as Array<{ photo_reference: string }> | undefined;
      const openingHours = place.opening_hours as { open_now?: boolean } | undefined;
      const photoUrl = photos?.[0]
        ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photos[0].photo_reference}&key=${process.env.GOOGLE_PLACES_API_KEY}`
        : "/images/placeholders/restaurant.jpg";

      return {
        name: place.name,
        rating: place.rating || null,
        reviewCount: place.user_ratings_total || 0,
        address: place.formatted_address,
        location: geometry.location,
        distance: `${calculateDistance(cityCenter.lat, cityCenter.lng, geometry.location.lat, geometry.location.lng)} km`,
        photo: photoUrl,
        placeId: place.place_id,
        mapsLink: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
        types: place.types || [],
        isOpen: openingHours?.open_now || null,
      };
    });

    try {
      await RestaurantCache.updateOne({ city: cityName, dish: dishLower }, { restaurants, lastUpdated: new Date() }, { upsert: true });
    } catch { /* caching optional */ }

    return NextResponse.json(restaurants);
  } catch {
    return NextResponse.json({ error: "Failed to search for restaurants" }, { status: 500 });
  }
}
