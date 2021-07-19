const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UserModelSchema = new Schema(
  {
    email: {
      type: String
    },
    password: {
      type: String
    },
    name:{
        type: String
    },
   
  },
  { timestamps: true }
);

module.exports = mongoose.model("users", UserModelSchema, "users");
