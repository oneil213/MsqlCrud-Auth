const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const config = require("./config/auth.config");
const db = require("./models");
const User = db.user;

passport.serializeUser((user, done) => {
  console.log("serializing user: ", user.id);
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findByPk(id)
    .then((user, err) => {
      done(user, err);
    })
    .catch(done);
});

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["access_token"];
  }
  return token;
};

// authorization
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: cookieExtractor,
      secretOrKey: config.secret,
    },
    (payload, done) => {
      try {
        User.findOne({
          where: {
            id: payload.sub,
          },
        }).then((user, err) => {
          if (err) return done(err, false);

          if (user) return done(null, user);
          else console.log("user not found in db");

          return done(null, false);
        });
      } catch (error) {
        done(err);
      }
    }
  )
);

// authenticated local strategy using username and password
passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
    },
    (username, password, done) => {
      User.findOne({
        where: {
          username: username,
        },
      }).then((user, err) => {
        if (err) return done(err);

        if (!user) {
          return done(null, false);
        }
        user.comparePassword(password, (err, isMatch) => {
          if (err) {
            return done(err);
          }
          if (isMatch) {
            return done(null, user);
          }
          return done(null, false);
        });
      });
    }
  )
);
