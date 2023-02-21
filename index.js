const express = require("express");
const Joi = require("joi");

const app = express();
app.use(express.json());

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

app.get("/api", (req, res) => {
  res.send("Welcome to Yup Yup api");
});

app.get("/api/users", (req, res) => {
  res.send(users);
});

app.get("/api/users/:id", (req, res) => {
  const user = users.find((user) => user.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).send("user not found");
  }
  res.send(user);
});

app.post("/api/users", (req, res) => {
  const schema = Joi.object({
    username: Joi.string().min(8).required(),
    password: Joi.string(),
    age: Joi.number().min(18).max(70).required(),
  });
  const { error } = schema.validate(req.body);
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

const port = process.env.PORT || 3000;
app.listen(port, console.log(`listening on port ${port}...`));
