import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  candidateId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date },
});

export default mongoose.model("Session", sessionSchema);
