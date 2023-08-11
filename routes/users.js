const express = require("express");
const Joi = require("joi");
const debug = require("debug")("app:db");
const UserModel = require("./../models/User");

const router = express.Router();

router.get("/", async (req, res) => {
  const { page, count } = req.query;
  const total = await UserModel.find().count();
  const users = await UserModel.find()
    .skip((page - 1) * count)
    .limit(count);
  res.send({
    data: users,
    meta: {
      page: page,
      total,
    },
  });
});

router.get("/:id", async (req, res) => {
  const user = await UserModel.findOne(req.params.id);
  if (!user) {
    return res.status(404).send("user not found");
  }
  res.send(user);
});

router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const user = new UserModel({
    username: req.body.username,
    email: req.body.email,
    job: req.body.job,
    age: req.body.age,
    hobbies: req.body.hobbies,
  });

  try {
    const result = await user.save();
    res.send(result);
  } catch (ex) {
    for (field in ex.errors) debug(ex.errors[field].message);
    res.status(400).send(ex.errors);
  }
});

router.put("/:id", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  try {
    const user = await UserModel.findByIdAndUpdate(
      req.params.id,
      {
        username: req.body.username,
        email: req.body.email,
        job: req.body.job,
        age: req.body.age,
        hobbies: req.body.hobbies,
      },
      {
        new: true,
      }
    );
    if (!user) {
      return res.status(404).send("user not found");
    }
  } catch (ex) {
    for (field in ex.errors) debug(ex.errors[field].message);
    res.status(400).send(ex.errors);
  }
});

router.delete("/:id", async (req, res) => {
  const user = await UserModel.findByIdAndRemove(req.params.id);
  if (!user) {
    return res.status(404).send("user not found");
  }

  res.send(user);
});

function validateUser(body) {
  const schema = Joi.object({
    username: Joi.string(),
    age: Joi.number(),
    email: Joi.string().email().required(),
    hobbies: Joi.array(),
    job: Joi.string(),
  });
  return schema.validate(body);
}

module.exports = router;
