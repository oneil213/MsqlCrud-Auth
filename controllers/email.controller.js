const { mailer } = require("../middleware");
const crypto = require("crypto");
const db = require("../models");
const User = db.user;

exports.sendmail = (req, res, next) => {
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const email = req.body.email;
  const message = req.body.message;
  const content = `firstname: ${firstname} \n lastname: ${lastname} \n email: ${email} \n message: ${message}`;
  const mailOptions = {
    from: firstname,
    to: "info@yourdomain.com",
    subject: "New Message from Website",
    text: content,
  };
  mailer.transporter.sendMail(mailOptions, (err, response) => {
    if (err) {
      console.log(err);
      res.status(400).json({
        message: {
          msgBody: "failed",
          msgError: true,
        },
      });
    } else {
      console.log("here is the res: ", response);
      res.status(200).json({
        message: {
          msgBody: "Message sent",
          msgError: false,
        },
      });
      mailer.transporter.sendMail(
        {
          from: "info@yourdomain.com",
          to: email,
          Subject: "Message from Yourwebsite",
          text: ` Thank you for contacting us! \n\nForm details\nfirstname: ${firstname}\nlastname: ${lastname} \n Email: ${email}\n Message: ${message}`,
        },
        function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log("Message sent: " + info.response);
          }
        }
      );
    }
  });
};

exports.resetmail = async (req, res, next) => {
  const email = req.body.email;
  return await User.findOne({
    where: {
      email: email,
    },
  }).then((user) => {
    if (!user) {
      res.status(401).json({
        message: {
          msgBody: "Email not found!",
          msgError: true,
        },
      });
      return null;
    } else {
      const token = crypto.randomBytes(20).toString("hex");
      user.update({
        resetPasswordToken: token,
        resetPasswordExpires: Date.now() + 3600000,
      });
      const mailOptions = {
        from: "info@yourwebsite.com",
        to: `${user.email}`,
        subject: "Link to reset password",
        text:
          "You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
          "Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n" +
          `http://localhost:5051/resetpassword/${token}\n\n` +
          "If you did not request this, please ignore this email and your password will remain unchanged.\n",
      };
      console.log("sending mail");

      mailer.transporter.sendMail(mailOptions, (err, response) => {
        if (err) {
          res.status(400).json({
            message: {
              msgBody: "failed",
              msgError: true,
            },
          });
        } else {
          console.log("here is the res: ", response);
          res.status(200).json({
            message: {
              msgBody: "Reset link sent, please check your inbox",
              msgError: false,
            },
          });
        }
      });
    }
  });
};
