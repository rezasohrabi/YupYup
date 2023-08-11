const express = require("express");
const debug = require("debug")("app:db");
const { User, validate } = require("./../models/User");

const router = express.Router();

router.get("/", async (req, res) => {
  const { page, count } = req.query;
  const total = await User.find().count();
  const users = await User.find()
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
  const user = await User.findOne({ _id: req.params.id });
  if (!user) {
    return res.status(404).send("user not found");
  }
  res.send(user);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const user = new User({
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
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  try {
    const user = await User.findByIdAndUpdate(
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
    res.send(user);
  } catch (ex) {
    for (field in ex.errors) debug(ex.errors[field].message);
    res.status(400).send(ex.errors);
  }
});

router.delete("/:id", async (req, res) => {
  const user = await User.findByIdAndRemove(req.params.id);
  if (!user) {
    return res.status(404).send("user not found");
  }

  res.send(user);
});

module.exports = router;
