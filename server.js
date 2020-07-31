const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const xss = require("xss-clean");

app.use(helmet());
//Data SanitiZation against XSS
app.use(xss());

// database
const db = require("./models");
const rateLimit = require("express-rate-limit");
const Role = db.role;
db.sequelize
  .sync()
  .then(() => console.log("database connected"))
  .catch((error) => console.log("This error occurred", error));
// force: true will drop the table if it already exists
// db.sequelize
// .sync({
//     force: true,
// })
// .then(() => {
//     console.log("Drop and Resync Database with { force: true }");
//     initial();
// });

// parsing cookies to app
app.use(cookieParser());
// content-type - application/json
app.use(express.json({ limit: "10kb" })); //Body limit is 10kb
app.use(bodyParser.json());

// content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

// Declare cors options
var corsOptions = {
  origin: "http://localhost:5051",
};
app.use(cors(corsOptions));

//Set maximum amount of request for users
const limit = rateLimit({
  max: 100, // max requests
  windowMs: 60 * 60 * 1000, // 1 Hour
  message: "Too many requests", // message to send
});

// test route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Adeola's application." });
});

// routes
require("./routes/auth.routes")(app);
require("./routes/mailer.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(` express server is running on port ${PORT}.`);
});

function initial() {
  Role.create({ id: 3, name: "user" });

  Role.create({ id: 2, name: "manager" });

  Role.create({ id: 1, name: "admin" });
}
