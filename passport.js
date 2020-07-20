const passport = require("passport");
const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const config = require("./config/auth.config");
const db = require("./models");
const User = db.user;

const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies["access_token"];
    }
    return token;
};


// authorization
passport.use(
    new JwtStrategy({
            jwtFromRequest: cookieExtractor,
            secretOrKey: config.secret,
        },
        (payload, done) => {
            User.findOne({
                    where: {
                        id: payload.sub,
                    },
                },
                (err, user) => {
                    if (err) return done(err, false);

                    if (user) return done(null, user);
                    else return done(null, false);
                }
            );
        }
    )
);

// authenticated local strategy using username and password
passport.use(
    new LocalStrategy(async (username, password, done) => {
        User.findOne({
            where: {
                username: username,
            },
        }).then((err, user) => {
            // something went wrong with database
            if (err) return done(err);

            // if no user exist
            if (!user) return done(null, false);

            // check if password is correct
            bcrypt.compare(password, user.password).then((response) => {
                if (response !== true) {
                    console.log("passwords do not match");
                    return done(null, false);
                }
                console.log("user found & authenticated");
                return done(null, user);
            });
        });
    })
);