const passport = require("passport");
const msg = require("../utils/jsonMessages");

module.exports = function(req, res, next) {
  passport.authenticate("jwt", function(err, user) {
    if (err || !user) {
      res.status(msg.user.insufficientPermissions.status).send({
        success: msg.user.insufficientPermissions.success,
        msg: msg.user.insufficientPermissions.message
      });
    } else {
      req.user = user;
      next();
    }
  })(req, res, next);
};
