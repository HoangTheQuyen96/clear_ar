const mongoose = require("mongoose");
const { v4 } = require('uuid')

const PromotionSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      unique: true,
      index: true,
      required: true,
      default: v4,
    },
    name: {
      type: String
    },
    description: {
      type: String
    },
    title: {
      type: String
    },
    type: {
      type: String
    },
    method: {
      type: String
    }
  },
  { versionKey: false },
);

module.exports.Promotion = mongoose.model("promotions", PromotionSchema);


