const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    minLength: 3,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  hobbies: [String],
  job: String,
  age: {
    type: Number,
    min: 18,
    max: 70,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("User", userSchema);
