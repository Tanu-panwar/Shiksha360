import mongoose from "mongoose"

const TeacherSchema = new mongoose.Schema(
  {
    schoolName: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    contactNo: {
      type: String,
      required: true,
    },

    subjects: {
      type: [String],
      default: [],
    },

    classes: {
      type: [String],
      default: [],
    },

    password: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["INVITED", "ACTIVE"],
      default: "INVITED",
    },
  },
  { timestamps: true }
)

export default mongoose.models.Teacher ||
  mongoose.model("Teacher", TeacherSchema)
