const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.mustBeLoggedIn = function (req, res, next) {
  try {
    req.userId = jwt.verify(req.body.token, process.env.JWTSECRET);
    next();
  } catch {
    console.log("Login fail ...");
    res.status(401).json("You are not athorized to add todo lists ...");
  }
};

exports.register = function (req, res) {
  let user = new User(req.body);
  user
    .register()
    .then(response => {
      res.status(200).send("New User Added ...");
    })
    .catch(regErrors => {
      res.status(201).send(regErrors);
    });
};

exports.login = function (req, res) {
  let user = new User(req.body);

  user
    .login()
    .then(function (result) {
      res.json({ token: jwt.sign({ _id: user.data._id }, process.env.JWTSECRET, { expiresIn: "7d" }), msg: "Login Success", username: user.data.fname });
    })
    .catch(function (e) {
      res.status(201).send(e);
    });
};
