const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.get("Authorization");

  if (!token) {
    req.isAuth = false;
    return next();
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.isAuth = true;
    req.currentUser = decodedToken._id;

    next();
  } catch (error) {
    console.log({ jwtVerifyError: error });
    req.isAuth = false;

    next();
  }
};
