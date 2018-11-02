var express = require("express");
var router = express.Router();

var mongoose = require("mongoose");
var User = require("./../../modal/User.js");
var Categories = require("./../../modal/Categories.js");
var Blogstatus = require("./../../modal/Blogstatus.js");
var Blog = require("../../modal/Blog.js");
var Blogcategory = require("./../../modal/Blogcategory.js");
var async = require("async");

var crypto = require("crypto"),
  hmac,
  signature;
const { check, validationResult } = require("express-validator/check");
const { matchedData, sanitize } = require("express-validator/filter");
var helpers = require("./../../helpers/utilitieshelper");
var moment = require("moment");
const multer = require("multer");

/* GET users listing. */
router.get("/", [helpers.loggedIn], function(req, res, next) {
  res.render("admin/blog/index", { title: "Admin Blog" });
});

router.get("/addblogs", [helpers.loggedIn], function(req, res, next) {
  res.render("admin/blog/form", { title: "Admin Create", id: "" });
});

router.get("/addblogs/(:id)", [helpers.loggedIn], function(req, res, next) {
  var o_id = req.params.id;

  if (o_id) {
    o_id = o_id;
  } else {
    o_id = "";
  }
  res.render("admin/blog/form", { title: "Admin Create", id: o_id });
});
router.get("/getEditdata/(:id)", function(req, res, next) {
  var o_id = req.params.id;
  var local = {};
  var tasks = [
    function(callback) {
      Blog.find({ _id: o_id }).exec((err, doc) => {
        if (err) throw err;
        local.blogdata = doc;
        callback();
      });
    },
    function(callback) {
      Blogcategory.find({ blog_id: o_id }).exec((err, doc) => {
        if (err) throw err;
        var xarray = [];
        doc.forEach(function(countElement) {
          xarray.push(countElement.category_id[0]);
        });
        local.blogcatdata = xarray;
        callback();
      });
    }
  ];

  async.parallel(tasks, function(err) {
    if (err) throw err;
    res.json({ status: "success", data: local });
  });
});

router.get("/getblogstatus",[helpers.loggedIn], function(req, res, next) {
  Blogstatus.find({}, function(err, data) {
    if (err) throw err;
    res.json({ status: "success", data: data });
  });
});

router.get("/getBlog",[helpers.loggedIn], function(req, res, next) {
  Blog.aggregate([
    {
      $lookup: {
        from: "blogstatus",
        localField: "status",
        foreignField: "_id",
        as: "blogstatusinfo"
      }
    },
    { $sort: { order_number: -1 } },
    {
      $skip: 0
    },
    {
      $limit: 11
    },
    {
      $unwind: "$blogstatusinfo"
    }
  ]).exec((err, doc) => {
    if (err) throw err;
    res.json({ status: "success", data: doc });
  });
});

router.get("/searchBlog",[helpers.loggedIn], function(req, res, next) {
  var term = req.query["term"];
  if (term) {
    Blog.aggregate([
      {
        $match: {
          title: { $regex: term, $options: "i" }
        }
      },
      {
        $lookup: {
          from: "blogstatus",
          localField: "status",
          foreignField: "_id",
          as: "blogstatusinfo"
        }
      },
      {
        $unwind: "$blogstatusinfo"
      }
    ]).exec((err, doc) => {
      if (err) throw err;
      res.json({ status: "success", data: doc });
    });
  } else {
    Blog.aggregate([
      {
        $lookup: {
          from: "blogstatus",
          localField: "status",
          foreignField: "_id",
          as: "blogstatusinfo"
        }
      },
      { $sort: { order_number: -1 } },
      {
        $skip: 0
      },
      {
        $limit: 11
      },
      {
        $unwind: "$blogstatusinfo"
      }
    ]).exec((err, doc) => {
      if (err) throw err;
      res.json({ status: "success", data: doc });
    });
  }
});

router.get("/deleteBlog/:id",[helpers.loggedIn], function(req, res, next) {
  Blog.remove(
    {
      _id: req.params.id
    },
    function(err, user) {
      if (err) return res.send(err);
      res.json({
        status: "success",
        message: "Congratulations Blog deleted successfully."
      });
    }
  );
});

var storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, "./public/uploads/blog"); // set the destination
  },
  filename: function(req, file, callback) {
    callback(null, Date.now() + ".jpg"); // set the file name and extension
  }
});
var upload = multer({ storage: storage });

router.post(
  "/saveBlog",
  [
    check("title", "Title cannot be left blank")
      .isEmpty()
      .withMessage("Title cannot be left blank"),
    check("status", "Status cannot be left blank")
      .isEmpty()
      .withMessage("Select blog status"),
    upload.single("imgUploader"),
    helpers.loggedIn
  ],
  function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.json({ status: "faild", message: errors.array() });
      return false;
    }
    if (typeof req.file != "undefined") {
      var image = req.file.filename;
    } else {
      var image = "";
    }
    if (req.body.title) {
      var title = req.body.title.replace(/\s+/g, "-").toLowerCase();
      var title = title.replace(",", "-").toLowerCase();
    }
    if (req.body.category === undefined) {
      res.json({
        status: "faild",
        message: "You must select category at least  One."
      });
      return false;
    }

    var id = req.body.editid;
    var len = req.body.category.length;
    var catdoc = [];
    var content = req.body.blogdetail;

    if (id) {
      if (image && image != "") {
        var document = {
          title: req.body.title,
          slug: title,
          meta_title: req.body.meta_title,
          detail: content,
          meta_description: req.body.meta_description,
          meta_keyword: req.body.meta_keyword,
          status: req.body.status,
          category: req.body.category,
          image: image
        };
      } else {
        var document = {
          title: req.body.title,
          slug: title,
          meta_title: req.body.meta_title,
          detail: content,
          meta_description: req.body.meta_description,
          meta_keyword: req.body.meta_keyword,
          status: req.body.status,
          category: req.body.category
        };
      }

      Blog.update({ _id: id }, document, function(err, raw) {
        if (err) {
          res.json({ status: "faild", message: err.message });
        } else {
          if (len > 1) {
            for (i = 0; i < len; i++) {
              var catid = req.body.category[i];
              catdoc.push({
                blog_id: id,
                category_id: catid
              });
            }
          } else {
            catdoc.push({
              blog_id: id,
              category_id: req.body.category
            });
          }

          Blogcategory.deleteMany({ blog_id: id }, function(err, doc) {
            if (err) throw err;
          });

          Blogcategory.insertMany(catdoc, function(err, doc) {
            if (err) throw err;
            res.json({
              type: "update",
              status: "success",
              message: "Congratulations blog updated  successfully."
            });
          });
        }
      });
    } else {
      var document = {
        title: req.body.title,
        slug: title,
        meta_title: req.body.meta_title,
        detail: req.body.blogdetail,
        meta_description: req.body.meta_description,
        meta_keyword: req.body.meta_keyword,
        status: req.body.status,
        category: req.body.category,
        image: image
      };

      Blog.create(document, function(err, doc) {
        if (err) {
          res.json({ status: "faild", message: err.message });
        } else {
          res.json({
            status: "success",
            message: "Congratulations blog created successfully."
          });
        }
      });
    }
  }
);

module.exports = router;
