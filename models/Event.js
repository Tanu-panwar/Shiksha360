import mongoose from "mongoose"

const EventSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    date: String, // YYYY-MM-DD
    type: {
      type: String,
      enum: ["meeting", "exam", "cultural", "training", "holiday", "annual"],
    },
  },
  { timestamps: true }
)

export default mongoose.models.Event ||
  mongoose.model("Event", EventSchema)
