module.exports = {
  loggedIn: function(req, res, next) {
    //console.log(req.session);
    if (!req.session.passport) {
      req.session.redirectTo = "/admin";
      res.redirect("/admin");
    } else {
      next();
    }
  }
};
