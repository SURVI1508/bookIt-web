import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/db";
import File from "../../../models/File";
import cloudinary from "../../../lib/cloudinary";
import { getUserFromRequest } from "../../../lib/auth";

export async function GET() {
  try {
    await connectDB();
    const files = await File.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, files });
  } catch (error) {
    console.error("GET files error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch files" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await connectDB();

    const user = getUserFromRequest(req);
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized access" },
        { status: 403 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file uploaded" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "mern_uploads" }, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        })
        .end(buffer);
    });

    const savedFile = await File.create({
      public_id: uploadResult.public_id,
      url: uploadResult.secure_url,
      original_name: file.name,
      format: uploadResult.format,
      size: uploadResult.bytes,
      uploadedBy: user.id,
    });

    return NextResponse.json(
      { success: true, message: "File uploaded successfully", file: savedFile },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST upload error:", error);
    return NextResponse.json(
      { success: false, error: "File upload failed" },
      { status: 500 }
    );
  }
}
