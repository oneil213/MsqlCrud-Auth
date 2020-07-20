const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");

// database
const db = require("./models");
const Role = db.role;
db.sequelize
  .sync()
  .then(() =>
    console.log(
      "users table has been successfully created, if one doesn't exist"
    )
  )
  .catch((error) => console.log("This error occurred", error));
// force: true will drop the table if it already exists
// db.sequelize
//   .sync({
//     force: true,
//   })
//   .then(() => {
//     console.log("Drop and Resync Database with { force: true }");
//     initial();
//   });

//parsing cookies to app
app.use(cookieParser());
//content-type - application/json
app.use(express.json());

//content-type - application/x-www-form-urlencoded
app.use(
  express.urlencoded({
    extended: true,
  })
);

//Declare cors options
var corsOptions = {
  origin: "http://localhost:5051",
};
app.use(cors(corsOptions));

// test route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Adeola's application.",
  });
});

// routes
require("./routes/auth.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(` express server is running on port ${PORT}.`);
});

function initial() {
  Role.create({
    id: 3,
    name: "user",
  });

  Role.create({
    id: 2,
    name: "manager",
  });

  Role.create({
    id: 1,
    name: "admin",
  });
}
