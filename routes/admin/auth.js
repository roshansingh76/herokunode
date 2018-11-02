var express = require("express");
var router = express.Router();

var mongoose = require("mongoose");

var User = require("./../../modal/User.js");
var async = require("async");
var crypto = require("crypto"),
  hmac,
  signature;

const { check, validationResult } = require("express-validator/check");
const { matchedData, sanitize } = require("express-validator/filter");
var helpers = require("./../../helpers/utilitieshelper");
var moment = require("moment");
const multer = require("multer");
var passport = require("passport");
require("./../../config/passport");

/* GET users listing. */
router.get("/", function(req, res, next) {
  res.render("admin/auth/login", { title: "Admin Login" });
});

router.get("/register", function(req, res, next) {
  res.render("admin/auth/register", { title: "Admin Register" });
});

function findUserByEmail(email) {
  if (email) {
    return new Promise((resolve, reject) => {
      User.findOne({ email: email }).exec((err, doc) => {
        if (err) return reject(err);
        if (doc)
          return reject(
            new Error("This email already exists. Please enter another email.")
          );
        else return resolve(email);
      });
    });
  }
}
router.get("/register", function(req, res, next) {
  res.render("admin/auth/register", { title: "Admin Register" });
});
router.post(
  "/createUser",
  [
    check("full_name", "Full name cannot be left blank").isLength({ min: 1 }),
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email address")
      .trim()
      .normalizeEmail()
      .custom(value => {
        return findUserByEmail(value).then(User => {
          //if user email already exists throw an error
          // throw new Error("Email Already exits");
        });
      }),

    check("password")
      .isLength({ min: 7 })
      .withMessage("Password must be at least 7 chars long with number")
      .matches(/\d/)
      .withMessage("Password must contain one number")
      .custom((value, { req, loc, path }) => {
        if (value !== req.body.cpassword) {
          console.log(vale);
          return false;
          res.json({ status: "faild", msg: "Passwords don't match" });
        } else {
          return value;
        }
      })
  ],
  function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.json({ status: "faild", message: errors.array() });
    } else {
      var document = {
        full_name: req.body.full_name,
        email: req.body.email,
        password: req.body.cpassword
      };
      var user = new User(document);
      user.save(function(error) {
        if (error) {
          throw error;
        }
        res.json({
          status: "success",
          msg:
            "Your account created successfully. Please verified your email id"
        });
      });
    }
  }
);


var storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, "./public/uploads/category"); // set the destination
  },
  filename: function(req, file, callback) {
    callback(null, Date.now() + ".jpg"); // set the file name and extension
  }
});
var upload = multer({ storage: storage });

router.post(
  "/userLogin",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email address")
      .trim()
      .normalizeEmail(),
    check("password")
      .isLength({ min: 1 })
      .withMessage("Password is required.")
  ],
  function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.json({ status: "faild", message: errors.array() });
    } else {
      passport.authenticate("local", (err, user) => {
        if (err) {
          return next(err);
        }
        if (!user) {
          return res.send({
            status: "authfaild",
            msg: "Invalid email and password !"
          });
        }
        req.logIn(user, function(err) {
          if (err) {
            throw err;
          }
          return res.send({ status: "success" });
        });
      })(req, res, next);
    }
  }
);

router.get("/logout", function(req, res) {
  req.session.destroy(function(err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/admin");
    }
  });
});

module.exports = router;
