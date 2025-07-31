const mongoose = require("mongoose");

// user.js

const weightSchema = new mongoose.Schema(
  {
    user_id:{
      type: mongoose.Schema.Types.ObjectId,
        ref:'User',
    }
  },
  {
    weight: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

const Weight = mongoose.model("Weight", foodSchema);

module.exports = Food;
