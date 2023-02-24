const express = require("express");
const Joi = require("joi");
const helmet = require("helmet");
const morgan = require("morgan");
const config = require("config");
const debug = require("debug")("app:startup");
const logger = require("./middleware/logger");
const authenticator = require("./middleware/authenticator");
const users = require("./routes/users");
const home = require("./routes/home");
const app = express();

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));
app.use(helmet());

app.use(logger);
app.use(authenticator);
app.use("/api/users", users);
app.use("/api", home);

app.set("view engine", "pug");
app.set("views", "./views");

console.log(`Application Name: ${config.get("name")}`);
console.log(`Mail Server: ${config.get("mail.host")}`);
console.log(`Mail Password: ${config.get("mail.password")}`);

if (app.get("env") === "development") {
  app.use(morgan("common"));
  debug("Morgan enabled...");
}

const port = process.env.PORT || 3000;
app.listen(port, console.log(`listening on port ${port}...`));
