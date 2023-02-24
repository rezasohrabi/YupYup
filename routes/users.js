const express = require("express");
const Joi = require("joi");

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

router.get("/", (req, res) => {
  res.send(users);
});

router.get("/:id", (req, res) => {
  const user = users.find((user) => user.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).send("user not found");
  }
  res.send(user);
});

router.post("/", (req, res) => {
  const { error } = validateUser(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const user = {
    id: users.length + 1,
    username: req.body.username,
    password: req.body.password,
    age: req.body.age,
  };
  users.push(user);
  res.send(user);
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

router.delete("/:id", (req, res) => {
  const user = users.find((user) => user.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).send("user not found");
  }

  const index = users.indexOf(user);
  users.splice(index, 1);
  res.send(user);
});

function validateUser(body) {
  const schema = Joi.object({
    username: Joi.string().min(8).required(),
    password: Joi.string(),
    age: Joi.number().min(18).max(70).required(),
  });
  return schema.validate(body);
}

module.exports = router;
