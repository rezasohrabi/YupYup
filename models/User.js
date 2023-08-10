const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  hobbies: [String],
  job: String,
  age: Number,
  email: String,
});

module.exports = mongoose.model("User", UserSchema);
