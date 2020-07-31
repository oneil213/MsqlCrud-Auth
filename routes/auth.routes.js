const { verifySignUp, verifySignIn } = require("../middleware");
const controller = require("../controllers/auth.controller");
const passport = require("passport");
const passportConfig = require("../passport");
const requireSignin = passport.authenticate("local", { session: false });

const requireLogout = passport.authenticate("jwt", { session: false });
const requireAdmin = passport.authenticate("jwt", { session: false });

const requireManager = passport.authenticate("jwt", { session: false });

const requireAuthentication = passport.authenticate("jwt", { session: false });

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

  app.post(
    "/login",
    verifySignIn.checkUserExistAndPassword,
    requireSignin,
    controller.login
  );
  app.get("/logout", requireLogout, controller.logout);
  app.get("/admin", requireAdmin, controller.admin);
  app.get("/manager", requireManager, controller.manager);
  app.get("/authenticated", requireAuthentication, controller.authenticate);
  app.get("/resetpassword", controller.resetPassword);
  app.put("/updatepassword", controller.updatePassword);
};
