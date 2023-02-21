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

app.get("/", (req, res) => {
  res.send(users);
});

app.get("/users", (req, res) => {
  res.send(users);
});

const port = process.env.PORT || 3000;
app.listen(port, console.log(`listening on port ${port}...`));
