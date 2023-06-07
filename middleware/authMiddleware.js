const jwt = require("jsonwebtoken");
const User = require("../models/User");

// functionality to check authentication to see if the user is logged in
const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  // check json web token exists & if verified
  if (token) {
    jwt.verify(token, "mario secret", (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect("/login");
      } else {
        console.log("this is the decoded token: ", decodedToken);
        next();
      }
    }); //this secret text must be the same as createToken in authControl.js and this "verifiy" if it exists
  } else {
    res.redirect("/login");
  }

  next();
};

// check current user
const checkUser = (req, res, next) => {
  // 1. get the cookies first
  const token = req.cookies.jwt;

  // 2. check if there's a token
  if (token) {
    // 3. verify the token
    jwt.verify(token, "mario secret", async (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.locals.user = null;
        next();
      } else {
        console.log("this is the decoded token: ", decodedToken);
        let user = await User.findById(decodedToken.id);
        res.locals.user = user; //this makes the user available in that page, you can access its properties
        next();
      }
    }); //this secret text must be the same as createToken in authControl.js and this "verifiy" if it exists
  } else {
    res.locals.user = null;
    next();
  }
};

module.exports = { requireAuth, checkUser };
