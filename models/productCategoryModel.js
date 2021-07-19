const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const productCategoryModelSchema = new Schema(
  {
    name: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("productCategory", productCategoryModelSchema, "productCategory");
