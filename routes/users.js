const express = require("express");
const Joi = require("joi");
const UserModel = require("./../models/User");

const router = express.Router();

const users = [
  {
    id: 1,
    name: "Leanne Graham",
  },
  {
    id: 2,
    name: "Ervin Howell",
  },
  {
    id: 3,
    name: "Clementine Bauch",
  },
];

router.get("/", async (req, res) => {
  const { page, count } = req.query;
  console.log(req.query);
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
  const user = await UserModel.findOne({ _id: req.params.id });
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

  const result = await user.save();

  res.send(result);
});

router.put("/:id", (req, res) => {
  const user = users.find((user) => user.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).send("user not found");
  }

  const { error } = validateUser(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  user.username = req.body.username;
  user.password = req.body.password;
  user.age = req.body.age;
  res.send(user);
});

router.delete("/:id", async (req, res) => {
  const user = await UserModel.findByIdAndRemove({ _id: req.params.id });
  if (!user) {
    return res.status(404).send("user not found");
  }

  res.send(user);
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

module.exports = router;
