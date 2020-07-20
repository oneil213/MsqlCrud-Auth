const config = require("../config/auth.config");
const bcrypt = require("bcrypt");
const passportConfig = require("../passport");
const JWT = require("jsonwebtoken");
const db = require("../models");
const User = db.user;
const Role = db.role;
const Op = db.Sequelize.Op;

const signToken = (userID) => {
    return JWT.sign({
            iss: config.secret,
            sub: userID,
        },
        config.secret, {
            expiresIn: "1h",
        }
    );
};

exports.register = (req, res) => {
    const {
        username,
        email,
        firstname,
        lastname,
        password
    } = req.body;
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

exports.login = async (req, res, next) => {

    if (req.isAuthenticated()) {
        const {
            id,
            username,
        } = req.user;
        const token = signToken(id);
        res.cookie('access_token', token, {
            httpOnly: true,
            sameSite: true
        });
        res.status(200).json({
            isAuthenticated: true,
            user: {
                username

            }
        });
    } else {
        User.findOne({
            where: {
                username
            }
        }), (err, user) => {
            if (err)
                res.status(500).json({
                    message: {
                        msgBody: "Error has occurred",
                        msgError: true
                    }
                });
            if (user)
                res.status(400).json({
                    message: {
                        msgBody: "Wrong password!",
                        msgError: true
                    }
                });
            else {
                res.status(401).json({
                    message: {
                        msgBody: "Please Register",
                        msgError: true
                    }
                });
            }

        }
    }
};