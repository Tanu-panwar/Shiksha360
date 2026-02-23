import mongoose, { Schema, models, model } from "mongoose";

const SchemeSchema = new Schema(
  {
    title: { type: String },
    description: { type: String },
    fieldType: { type: String },
    eligibility: { type: String },
    deadline: { type: String },
    status: { type: String },
  },
  { timestamps: true }
);

const Scheme = models.Scheme || model("Scheme", SchemeSchema);

export default Scheme;
