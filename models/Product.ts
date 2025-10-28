import mongoose, { Schema, Document, Model } from "mongoose";

// ----------------------
// 📦 Sub-Schema Interfaces
// ----------------------

export interface ISlot {
  time: string;
  capacity: number;
  booked: number;
  status: "available" | "soldout";
}

export interface IDate {
  date: Date;
  slots: ISlot[];
}

export interface IPrice {
  basePrice: number;
  discountPrice?: number;
  currency: "INR" | "USD" | "EUR";
}

export interface IImage {
  url: string;
  public_id?: string;
}

export interface ILocation {
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  mapLink?: string;
}

export interface IGuide {
  name?: string;
  certified?: boolean;
}

export interface ISEO {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
}

// ----------------------
// 🧩 Main Product Interface
// ----------------------

export interface IProduct extends Document {
  title: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  images: IImage[];
  price: IPrice;
  location?: ILocation;
  guide?: IGuide;
  gearIncluded?: boolean;
  safetyInfo?: string;
  minAge?: number;
  maxGroupSize?: number;
  dates?: IDate[];
  category?: "Adventure" | "Water Sports" | "Wildlife" | "Camping" | "Other";
  duration?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  seo?: ISEO;
  createdAt?: Date;
  updatedAt?: Date;
}

// ----------------------
// 🧱 Sub-Schemas
// ----------------------

const SlotSchema = new Schema<ISlot>(
  {
    time: { type: String, required: true },
    capacity: { type: Number, required: true, default: 10 },
    booked: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["available", "soldout"],
      default: "available",
    },
  },
  { _id: false }
);

const DateSchema = new Schema<IDate>(
  {
    date: { type: Date, required: true },
    slots: { type: [SlotSchema], default: [] },
  },
  { _id: false }
);

const PriceSchema = new Schema<IPrice>(
  {
    basePrice: { type: Number, required: true },
    discountPrice: { type: Number, default: 0 },
    currency: { type: String, enum: ["INR", "USD", "EUR"], default: "INR" },
  },
  { _id: false }
);

// ----------------------
// 🧩 Main Product Schema
// ----------------------

const ProductSchema = new Schema<IProduct>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, trim: true },
    shortDescription: { type: String, trim: true },

    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String },
      },
    ],

    price: { type: PriceSchema, required: true },

    location: {
      address: String,
      city: String,
      state: String,
      country: String,
      mapLink: String,
    },

    guide: {
      name: String,
      certified: { type: Boolean, default: true },
    },

    gearIncluded: { type: Boolean, default: true },
    safetyInfo: {
      type: String,
      default:
        "Helmet and life jackets included. Certified guide ensures safety.",
    },
    minAge: { type: Number, default: 10 },
    maxGroupSize: { type: Number, default: 10 },

    dates: { type: [DateSchema], default: [] },

    category: {
      type: String,
      enum: ["Adventure", "Water Sports", "Wildlife", "Camping", "Other"],
      default: "Adventure",
    },
    duration: { type: String, default: "2 hours" },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },

    seo: {
      metaTitle: String,
      metaDescription: String,
      keywords: [String],
    },
  },
  { timestamps: true }
);

// ----------------------
// 🚀 Export Model
// ----------------------

const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
