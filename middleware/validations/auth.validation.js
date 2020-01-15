const {
  check,
  header,
  validationResult,
  body,
  sanitizeBody
} = require("express-validator");

exports.signUpValidationRules = () => {
  return [
    // email must be an email, duh
    body("email").isEmail(),
    body("name").optional()
    // body("confirmPassword").isString(),
    // // password must be at least 6 chars long
    // body("password")
    //   .isLength({ min: 6 })
    //   .isString()
    //   .custom((value, { req, loc, path }) => {
    //     if (value !== req.body.confirmPassword) {
    //       // trow error if passwords do not match
    //       throw new Error("Passwords do not match");
    //     } else {
    //       return value;
    //     }
    //   })
  ];
};

exports.loginValidationRules = () => {
  return [
    // email must be an email, duh
    body("email").isEmail(),
    // password must be at least 6 chars long
    body("password")
      .isLength({ min: 6 })
      .isString()
  ];
};

exports.jwtValidationRules = () => {
  return [header("Bearer Token").isJWT()];
};

// ********************
// May use only one validation function if not using json messages, this is,
// abstract the validation
// ********************

exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }));

  return res.status(400).json({
    success: false,
    msg: "Invalid field types submited",
    errors: extractedErrors
  });
};
