module.exports = async (req, res, next) => {
  try {
    const user = req.user;
    if ([1].indexOf(user.userType) > -1) {
      // If user type is admin
      return next();
    }
    return res
      .status(403)
      .send({ success: false, message: "You don't have admin permisions" });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};
