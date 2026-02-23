import mongoose, { Schema, models } from "mongoose"

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    role: { type: String, enum: ["STUDENT", "TEACHER", "ADMIN"], required: true },

    rollNo: String,      // student
    schoolName: String, 

    teacherId: String,  // teacher
    collegeName: String,

    adminId: String,    // admin
  },
  { timestamps: true }
)

export default models.User || mongoose.model("User", UserSchema)
