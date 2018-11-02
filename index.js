"use strict";
var config = require("./config/passport"),
  createError = require("http-errors"),
  express = require("express"),
  path = require("path"),
  cookieParser = require("cookie-parser"),
  logger = require("morgan"),
  mongoose = require("mongoose"),
  session = require("express-session"),
  passport = require("passport"),
  MongoDBStore = require("connect-mongodb-session")(session),
  LocalStrategy = require("passport-local").Strategy,
  expressValidator = require("express-validator");

//frontend controller
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

//backend  controller
let adminusersRouter = require("./routes/admin/users");
let adminblogRouter = require("./routes/admin/blog");
let adminauthRouter = require("./routes/admin/auth");
let admindashboardRouter = require("./routes/admin/dashboard");
let admincatRouter = require("./routes/admin/category");

var MongoClient = require("mongodb").MongoClient,
  assert = require("assert");

// Connection URL
const url = "mongodb://advohire:12345678911@cluster0-shard-00-00-1hcrp.mongodb.net:27017,cluster0-shard-00-01-1hcrp.mongodb.net:27017,cluster0-shard-00-02-1hcrp.mongodb.net:27017/advohire?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true";


// Use connect method to connect to the server
mongoose.Promise = global.Promise;
mongoose.connect(url,{ useNewUrlParser: true }, err => {
        if (err) throw err;
        console.log('Successfully connected to database.');
 });

var app = express();
app.config = config;

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(express.static(__dirname + "/node_modules/bootstrap/dist"));

/*var store = new MongoDBStore({
  uri: url,
  collection: "session"
});

store.on("connected", function() {
  store.client; // The underlying MongoClient object from the MongoDB driver
});

// Catch errors
store.on("error", function(error) {
  assert.ifError(error);
  assert.ok(false);
});


app.use(
  require("express-session")({
    secret: "roshansingh",
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    },
    store: store,
    resave: true,
    saveUninitialized: true
  })
);*/

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  if (req.session.userId) {
    res.locals.userId = req.session.userId;
    res.locals.usertype = req.session.usertype;
    res.locals.name = req.session.name;
    res.locals.isLoggedIn = req.session.isLoggedIn;
    res.locals.image = req.session.image;
    res.locals.datetime = req.session.datetime;
    res.locals.isActive = req.session.isActive;
  }
  next();
});

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/admin", adminauthRouter);
app.use("/admin/userLogin", adminusersRouter);
app.use("/admin/dashboard", admindashboardRouter);
app.use("/admin/category", admincatRouter);
app.use("/admin/category/addCategory ", admincatRouter);
app.use("/admin/category/getCategory", admincatRouter);
app.use("/admin/category/deleteCategory", admincatRouter);
app.use("/admin/category/getParentcategory", admincatRouter);
app.use("/admin/category/editCategory", admincatRouter);
app.use("/admin/category/updateCategory", admincatRouter);
app.use("/admin/category/searchCategory", admincatRouter);

app.use("/admin/blog", adminblogRouter);
app.use("/admin/blog/addblogs", adminblogRouter);
app.use("/admin/blog/getblogstatus", adminblogRouter);
app.use("/admin/blog/saveBlog", adminblogRouter);
app.use("/admin/blog/getBlog", adminblogRouter);
app.use("/admin/blog/deleteBlog", adminblogRouter);
app.use("/admin/blog/searchBlog", adminblogRouter);
app.use("/admin/blog/getEditdata", adminblogRouter);
app.use("/admin/register", adminauthRouter);
app.use("/admin/createUser", adminauthRouter);
app.use("/admin/logout", adminauthRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
