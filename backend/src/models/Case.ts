import mongoose from "mongoose";

const caseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    priority: { type: String, enum: ["low", "medium", "high"], required: true },
    status: { type: String, enum: ["open", "in-progress", "closed"], default: "open" },
  },
  { timestamps: true }
);

const Case = mongoose.model("Case", caseSchema);
export default Case;