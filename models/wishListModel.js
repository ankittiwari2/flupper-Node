const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const wishListModelSchema = new Schema(
  {
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product"
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("wishList", wishListModelSchema, "wishList");
