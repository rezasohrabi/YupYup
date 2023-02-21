const express = require("express");

const app = express();

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

const port = process.env.PORT || 3000;
app.listen(port, console.log(`listening on port ${port}...`));
