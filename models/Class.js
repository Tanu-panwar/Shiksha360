import mongoose from "mongoose"

const ClassSchema = new mongoose.Schema({
  className: { type: String, required: true },
  section: { type: String, required: true },
  teacher: { type: String, required: true },
  students: { type: Number, default: 0 },
  lastAttendanceDate: {
  type: String
},
}, { timestamps: true })

export default mongoose.models.Class ||
  mongoose.model("Class", ClassSchema)
