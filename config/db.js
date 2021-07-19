const mongoose = require("mongoose");

mongoose.connect(
  "mongodb://localhost:27017/naukari",
  { useNewUrlParser: true, useUnifiedTopology: true },
  err => {
    if (err) {
      console.log("error in connection");
    }
    console.log("Database connected");
  }
);
module.exports = mongoose.set('debug', true);
// module.exports = mongoose
