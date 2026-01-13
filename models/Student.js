import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    name: String,
    roll: Number,
    class: String,
    section: String,
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Student ||
  mongoose.model("Student", studentSchema);
