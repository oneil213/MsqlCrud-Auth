const db = require("../models");
const User = db.user;
const bcrypt = require("bcrypt");

checkUserExistAndPassword = (req, res, next) => {
  User.findOne({
    where: {
      username: req.body.username,
    },
  }).then((user) => {
    if (!user) {
      res.status(401).json({
        message: {
          msgBody: "Please Register",
          msgError: true,
        },
      });
      return;
    }

    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

    if (!passwordIsValid) {
      res.status(400).json({
        message: {
          msgBody: "Wrong password!",
          msgError: true,
        },
      });
      return;
    }
    next();
  });
};

const verifySignIn = {
  checkUserExistAndPassword: checkUserExistAndPassword,
};

module.exports = verifySignIn;
