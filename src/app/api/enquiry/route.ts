import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, serviceType, tripDetails } = body;

    // Validate required fields
    if (!name || !email || !phone || !tripDetails) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Here you would typically:
    // 1. Save to database
    // 2. Send email notification to admin
    // 3. Send confirmation email to user
    // 4. Integrate with CRM/marketing tools

    console.log("Enquiry received:", {
      name,
      email,
      phone,
      serviceType,
      tripDetails,
      timestamp: new Date().toISOString(),
    });

    // TODO: Implement database storage
    // const enquiry = await db.enquiry.create({
    //   name,
    //   email,
    //   phone,
    //   serviceType,
    //   tripDetails,
    // });

    // TODO: Send email notifications
    // await sendEmailToAdmin(enquiry);
    // await sendConfirmationEmailToUser(email, name);

    return NextResponse.json(
      {
        success: true,
        message: "Enquiry received successfully. We'll contact you within 2 hours.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Enquiry submission error:", error);
    return NextResponse.json(
      { error: "Failed to process enquiry" },
      { status: 500 }
    );
  }
}
