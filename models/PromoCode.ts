import mongoose, { Schema, Document, models } from "mongoose";

export interface IPromoCode extends Document {
  code: string;
  discountType: "fixed" | "percent";
  discountValue: number;
  expiry: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PromoCodeSchema = new Schema<IPromoCode>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    discountType: {
      type: String,
      enum: ["fixed", "percent"],
      default: "fixed",
    },
    discountValue: {
      type: Number,
      required: true,
      min: 0,
    },
    expiry: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Auto-disable expired promo codes
PromoCodeSchema.pre("save", function (next) {
  if (this.expiry && new Date() > this.expiry) {
    this.isActive = false;
  }
  next();
});

const PromoCode =
  models.PromoCode || mongoose.model<IPromoCode>("PromoCode", PromoCodeSchema);

export default PromoCode;
