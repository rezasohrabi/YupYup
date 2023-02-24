const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const config = require("config");
var fs = require("fs");
var path = require("path");
const debug = require("debug")("app:startup");
const logger = require("./middleware/logger");
const authenticator = require("./middleware/authenticator");
const users = require("./routes/users");
const home = require("./routes/home");
const app = express();

app.set("view engine", "pug");
app.set("views", "./views");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(helmet());
app.use(logger);
app.use(authenticator);

debug(`Application Name: ${config.get("name")}`);
debug(`Mail Server: ${config.get("mail.host")}`);
debug(`Mail Password: ${config.get("mail.password")}`);

if (app.get("env") == "production") {
  app.use(
    morgan("combined", {
      stream: fs.createWriteStream(path.join(__dirname, "access.log"), {
        flags: "a",
      }),
    })
  );
  debug("Morgan production logger enabled...");
} else {
  app.use(morgan("dev"));
  debug("Morgan development enabled...");
}

app.use("/api/users", users);
app.use("/api", home);

const port = process.env.PORT || 3000;
app.listen(port, console.log(`listening on port ${port}...`));
