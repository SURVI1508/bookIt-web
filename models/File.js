import mongoose from "mongoose";

const FileSchema = new mongoose.Schema(
  {
    public_id: {
      type: String,
      required: true,
      unique: true,
    },
    url: {
      type: String,
      required: true,
    },
    original_name: {
      type: String,
      required: true,
    },
    format: String,
    size: Number,
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.models.File || mongoose.model("File", FileSchema);
