import { NextResponse } from "next/server";

import User from "@/models/User";
import { connectDB } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req) {
  console.log(req, "user");

  const user = getUserFromRequest(req);
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (user.role !== "admin")
    return NextResponse.json(
      { error: "Forbidden: Admins only" },
      { status: 403 }
    );

  try {
    await connectDB();
    const users = await User.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, users });
  } catch (error) {
    console.error("GET users error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// export async function POST(req) {
//   try {
//     await connectDB();

//     const user = getUserFromRequest(req);
//     if (!user || user.role !== "admin") {
//       return NextResponse.json(
//         { success: false, error: "Unauthorized access" },
//         { status: 403 }
//       );
//     }

//     const { name, description } = await req.json();
//     if (!name) {
//       return NextResponse.json(
//         { success: false, error: "Category name is required" },
//         { status: 400 }
//       );
//     }

//     const slug = name.toLowerCase().replace(/\s+/g, "-");

//     const existing = await Category.findOne({ slug });
//     if (existing) {
//       return NextResponse.json(
//         { success: false, error: "Category already exists" },
//         { status: 400 }
//       );
//     }

//     const newCategory = await Category.create({ name, slug, description });

//     return NextResponse.json(
//       { success: true, message: "Category created", category: newCategory },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("POST category error:", error);
//     return NextResponse.json(
//       { success: false, error: "Failed to create category" },
//       { status: 500 }
//     );
//   }
// }
