const bcrypt = require("bcrypt");
module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
    username: {
      type: Sequelize.STRING,
      required: true,
    },
    email: {
      type: Sequelize.STRING,
      required: true,
    },
    firstname: {
      type: Sequelize.STRING,
      required: true,
    },
    lastname: {
      type: Sequelize.STRING,
      required: true,
    },
    password: {
      type: Sequelize.STRING,
      required: true,
    },
    resetPasswordToken: {
      type: Sequelize.STRING,
    },
    resetPasswordExpires: {
      type: Sequelize.STRING,
    },
  });
  User.prototype.comparePassword = function comparePassword(
    candidatePassword,
    cb
  ) {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
      cb(err, isMatch);
    });
  };
  return User;
};
