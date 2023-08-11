const mongoose = require("mongoose");
const Joi = require("joi");

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

function validateUser(body) {
  const schema = Joi.object({
    username: Joi.string().alphanum().min(3).required(),
    age: Joi.number().min(18).max(70).required(),
    email: Joi.string().email().required(),
    hobbies: Joi.array(),
    job: Joi.string(),
  });
  return schema.validate(body);
}

module.exports.User = mongoose.model("User", userSchema);
module.exports.validate = validateUser;
