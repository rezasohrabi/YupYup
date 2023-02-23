const express = require("express");
const Joi = require("joi");
const helmet = require("helmet");
const morgan = require("morgan");
const logger = require("./middleware/logger");
const authenticator = require("./middleware/authenticator");

const app = express();
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));
app.use(helmet());
app.use(morgan("common"));

app.use(logger);
app.use(authenticator);

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

app.put("/api/users/:id", (req, res) => {
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

app.delete("/api/users/:id", (req, res) => {
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

const port = process.env.PORT || 3000;
app.listen(port, console.log(`listening on port ${port}...`));
