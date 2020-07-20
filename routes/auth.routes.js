const { verifySignUp } = require("../middleware");
const controller = require("../controller/auth.controller");
const passport = require("passport");
const passportConfig = require("../passport");
const cookieParser = require("cookie-parser");
const requireSignin = passport.authenticate("local", {
  session: false,
});

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "access_token, Origin, Content-Type, Accept"
    );

    next();
  });

  app.post(
    "/register",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted,
    ],
    controller.register
  );

  app.post("/login", requireSignin, controller.login);
};
