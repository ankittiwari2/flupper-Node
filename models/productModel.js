const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const productModelSchema = new Schema(
  {
    productCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "productCategory"
    },
    productName: {
      type: String,
    },
    quantity: {
      type: Number,
    },
    createdBy:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "users"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("product", productModelSchema, "product");
