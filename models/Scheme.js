import mongoose from "mongoose";

const SchemeSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    fieldType: String,
    eligibility: String,
    deadline: String,
    status: String,
  },
  { timestamps: true }
);

export default mongoose.models.Scheme || mongoose.model("Scheme", SchemeSchema);
