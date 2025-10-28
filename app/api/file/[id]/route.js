import { NextResponse } from "next/server";

import File from "../../../../models/File";
import cloudinary from "../../../../lib/cloudinary";
import { connectDB } from "../../../../lib/db";
import { getUserFromRequest } from "../../../../lib/auth";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const file = await File.findById(params.id);
    if (!file) {
      return NextResponse.json(
        { success: false, error: "File not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, file });
  } catch (error) {
    console.error("GET file error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch file" },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    await connectDB();
    const user = getUserFromRequest(req);
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized access" },
        { status: 403 }
      );
    }

    const { newName } = await req.json();
    const file = await File.findById(params.id);
    if (!file)
      return NextResponse.json(
        { success: false, error: "File not found" },
        { status: 404 }
      );

    // Rename file in Cloudinary
    const newPublicId = `mern_uploads/${newName}`;
    await cloudinary.uploader.rename(file.public_id, newPublicId);

    // Update DB record
    file.public_id = newPublicId;
    file.original_name = newName;
    await file.save();

    return NextResponse.json({ success: true, message: "File renamed", file });
  } catch (error) {
    console.error("PUT rename error:", error);
    return NextResponse.json(
      { success: false, error: "Rename failed" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const user = getUserFromRequest(req);
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized access" },
        { status: 403 }
      );
    }

    const file = await File.findById(params.id);
    if (!file)
      return NextResponse.json(
        { success: false, error: "File not found" },
        { status: 404 }
      );

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(file.public_id);

    // Delete from DB
    await File.findByIdAndDelete(params.id);

    return NextResponse.json({
      success: true,
      message: "File deleted successfully",
    });
  } catch (error) {
    console.error("DELETE file error:", error);
    return NextResponse.json(
      { success: false, error: "Delete failed" },
      { status: 500 }
    );
  }
}
