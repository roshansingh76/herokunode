var express = require("express");
var router = express.Router();

var mongoose = require("mongoose");

var User = require("./../../modal/User.js");
var Categories = require("./../../modal/Categories.js");
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


router.get("/", [helpers.loggedIn], function(req, res, next) {

  res.render("admin/dashboard/index", { title: "Admin Dashboard" });
});

module.exports = router;
