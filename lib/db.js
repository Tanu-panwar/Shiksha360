import mongoose from "mongoose";

let isConnected = false;

export default async function connectDB() {
  if (isConnected) {
    console.log("MongoDB already connected");
    return;
  }

  const conn = await mongoose.connect(process.env.MONGO_URI);
  isConnected = true;
  console.log("MongoDB Connected Successfully");
}
