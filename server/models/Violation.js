import mongoose from "mongoose";

const violationSchema = new mongoose.Schema({
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: "Session", required: true },
  type: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model("Violation", violationSchema);
