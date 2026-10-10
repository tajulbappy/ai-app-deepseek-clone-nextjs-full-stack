import { Webhook } from "svix";
import ConnectDB from "@/config/db";
import User from "@/models/User";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
    console.log("🔥 Clerk Webhook received");
    

    const headerPayload = headers();
    const svixHeaders = {
      "svix-id": headerPayload.get("svix-id"),
      "svix-signature": headerPayload.get("svix-signature"),
      "svix-timestamp": headerPayload.get("svix-timestamp"),
    };

    console.log("🟦 Headers:", svixHeaders);

    // ❗ MUST use raw body
    const body = await req.text();
    const payload = JSON.parse(body);

    console.log("🟧 Payload:", payload);

    // Verify using raw body
    const wh = new Webhook(process.env.SIGNING_SECRET);
    const { data, type } = wh.verify(body, svixHeaders);

    await ConnectDB();

    const userData = {
      _id: data.id,
      email: data.email_addresses?.[0]?.email_address,
      name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
      image: data.image_url,
    };

    console.log("🟩 Parsed User:", userData);
    console.log("🟨 Event Type:", type);

    switch (type) {
      case "user.created":
        await User.create(userData);
        break;

      case "user.updated":
        await User.findByIdAndUpdate(data.id, userData);
        break;

      case "user.deleted":
        await User.findByIdAndDelete(data.id);
        break;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Webhook Error:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
};
