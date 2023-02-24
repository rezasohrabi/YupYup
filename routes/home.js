const express = require("express");
const config = require("config");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("index", {
    title: config.get("name"),
    message: `Welcome to ${config.get("name")}`,
    description:
      "you can use routes like localhost:3000/api/users to get results",
  });
  res.send("Welcome to Yup Yup api");
});

module.exports = router;
