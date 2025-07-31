const mongoose = require("mongoose");

const planSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    exercise: {
      type: String,
      required: true,
    },
    repetitons: {
      type: Number,
      default: 1,
    },
    status: {
      type: String,
      enum: ["finished", "not finished"],
      default: "not finished",
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

const Plan = mongoose.model("Plan", planSchema);

module.exports = Plan;
