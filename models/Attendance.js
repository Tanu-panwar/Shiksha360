import mongoose from "mongoose"

const AttendanceSchema = new mongoose.Schema(
  {
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    rollNo: String,
    name: String,
    status: String,
    date: String,
  },
  { timestamps: true }
)

export default mongoose.models.Attendance ||
  mongoose.model("Attendance", AttendanceSchema)
