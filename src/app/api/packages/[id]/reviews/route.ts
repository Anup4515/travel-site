import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Package from "@/models/Package";
import { IReview } from "@/types";
import { Types } from "mongoose";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();

    if (!session?.user?.email) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { rating, title, comment } = await req.json();

    if (!rating || !title || !comment) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (rating < 1 || rating > 5) {
      return Response.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
    }

    await dbConnect();

    // Find package by packageId or MongoDB _id (only if valid ObjectId)
    let pkg = await Package.findOne(
      Types.ObjectId.isValid(id) ? { $or: [{ packageId: id }, { _id: id }] } : { packageId: id }
    );

    if (!pkg) {
      return Response.json({ error: "Package not found" }, { status: 404 });
    }

    console.log("[REVIEW API] Package ID:", pkg._id);
    console.log("[REVIEW API] Current reviews:", pkg.reviews);

    // Ensure reviews array exists
    if (!pkg.reviews) {
      pkg.reviews = [];
      console.log("[REVIEW API] Initialized empty reviews array");
    }

    // Create new review object
    const newReview: any = {
      userId: session.user.email,
      userName: session.user.name || "Anonymous",
      userEmail: session.user.email,
      rating: parseInt(rating),
      title,
      comment,
      helpful: 0,
    };

    console.log("[REVIEW API] New review to add:", newReview);

    // Add review to the array
    pkg.reviews.push(newReview);
    console.log("[REVIEW API] Reviews after push:", pkg.reviews.length);

    // Save the document
    const savedPkg = await pkg.save();
    console.log("[REVIEW API] Package saved");
    console.log("[REVIEW API] Saved reviews count:", savedPkg.reviews?.length || 0);

    if (!savedPkg.reviews || savedPkg.reviews.length === 0) {
      console.log("[REVIEW API] Error: No reviews after save");
      return Response.json({ error: "Failed to add review" }, { status: 500 });
    }

    // Return the newly added review (last one in the array)
    const addedReview = savedPkg.reviews[savedPkg.reviews.length - 1];
    console.log("[REVIEW API] Returning review:", addedReview);
    return Response.json(addedReview, { status: 201 });
  } catch (error) {
    console.error("Error adding review:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
