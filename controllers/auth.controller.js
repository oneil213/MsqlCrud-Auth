const config = require("../config/auth.config");
const bcrypt = require("bcrypt");
const passportConfig = require("../passport");
const passport = require("passport");

const JWT = require("jsonwebtoken");
const db = require("../models");

const User = db.user;
const Role = db.role;
const Op = db.Sequelize.Op;

const signToken = (userID) => {
  return JWT.sign(
    {
      iss: config.secret,
      sub: userID,
    },
    config.secret,
    { expiresIn: "1h" }
  );
};

exports.register = (req, res) => {
  const { username, email, firstname, lastname, password } = req.body;
  User.create({
    username: username,
    email: email,
    firstname: firstname,
    lastname: lastname,
    password: bcrypt.hashSync(password, 10),
  })
    .then((user) => {
      if (req.body.roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles,
            },
          },
        }).then((roles) => {
          user.setRoles(roles).then(() => {
            res.status(201).json({
              message: {
                msgBody: "Account successfully created",
                msgError: false,
              },
            });
          });
        });
      } else {
        user.setRoles([3]).then(() => {
          res.status(201).json({
            message: {
              msgBody: "Account successfully created",
              msgError: false,
            },
          });
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: {
          msgBody: err.message,
          msgError: true,
        },
      });
    });
};

exports.login = async (req, res) => {
  try {
    if (req.isAuthenticated()) {
      const { id, username, roles } = req.user;
      const token = signToken(id);
      res.cookie("access_token", token, {
        httpOnly: true,
        sameSite: true,
      });
      var authorities = [];
      req.user.getRoles().then((roles) => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push(roles[i].name);
        }
        res.status(200).json({
          isAuthenticated: true,
          user: {
            username,
            role: authorities,
          },
        });
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: {
        msgBody: "Error has occurred",
        msgError: true,
      },
    });
  }
};

exports.logout = async (req, res) => {
  try {
    await res.clearCookie("access_token");
    res.json({
      user: {
        username: "",
        role: "",
      },
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.admin = async (req, res) => {
  User.findByPk(req.user.id).then((user) => {
    user.getRoles().then((roles) => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "admin") {
          res.status(200).json({
            message: {
              msgBody: "You are an admin",
              msgError: false,
            },
          });
        } else
          res.status(403).json({
            message: {
              msgBody: "You're not an admin,go away",
              msgError: true,
            },
          });
      }
    });
  });
};

exports.manager = async (req, res) => {
  try {
    await User.findByPk(req.user.id).then((user) => {
      user.getRoles().then((roles) => {
        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "admin" || "manager") {
            res.status(200).json({
              message: {
                msgBody: "You are a manager",
                msgError: false,
              },
            });
          } else
            res.status(403).json({
              message: {
                msgBody: "You're not a manager,go away",
                msgError: true,
              },
            });
        }
      });
    });
  } catch (error) {
    res.status(500).json({
      message: {
        msgBody: "Error has occurred",
        msgError: true,
      },
    });
  }
};

exports.authenticate = async (req, res) => {
  const { username, firstname, lastname, email, id } = req.user;

  User.findByPk(id).then((user) => {
    var authorities = [];
    user.getRoles().then((roles) => {
      for (let i = 0; i < roles.length; i++) {
        authorities.push(roles[i].name);
      }
      res.status(200).json({
        isAuthenticated: true,
        user: {
          username,
          firstname,
          lastname,
          email,
          role: authorities,
        },
      });
    });
  });
};

exports.resetPassword = async (req, res, next) => {
  await User.findOne({
    where: {
      resetPasswordToken: req.query.resetPasswordToken,
      resetPasswordExpires: {
        [Op.gt]: Date.now(),
      },
    },
  }).then((user) => {
    if (user == null) {
      res.status(403).send({
        message: {
          msgBody: "password reset link is invalid or has expired",
          msgError: true,
        },
      });
    } else {
      res.status(200).send({
        username: user.username,
        message: {
          msgBody: "Please enter a new password",
          msgError: false,
        },
      });
    }
  });
};

exports.updatePassword = async (req, res, next) => {
  await User.findOne({
    where: {
      username: req.body.username,
      resetPasswordToken: req.body.resetPasswordToken,
      resetPasswordExpires: {
        [Op.gt]: Date.now(),
      },
    },
  }).then((user) => {
    if (user == null) {
      console.error("password reset link is invalid or has expired");
      res.status(403).send({
        message: {
          msgBody: "password reset link is invalid or has expired",
          msgError: true,
        },
      });
    } else if (user != null) {
      bcrypt
        .hash(req.body.password, 12)
        .then((hashedPassword) => {
          user.update({
            password: hashedPassword,
            resetPasswordToken: null,
            resetPasswordExpires: null,
          });
        })
        .then(() => {
          res.status(200).send({
            message: {
              msgBody: "Password updated",
              msgError: false,
            },
          });
        });
    } else {
      res.status(401).send({
        message: {
          msgBody: "no user found for update",
          msgError: true,
        },
      });
    }
  });
};
