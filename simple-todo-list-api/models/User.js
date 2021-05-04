const bcrypt = require("bcryptjs");
const usersCollection = require("../db").db().collection("users");
const validator = require("validator");
const md5 = require("md5");

let User = function (data) {
  this.data = data;
  this.errors = [];
};

User.prototype.cleanUp = function () {
  if (typeof this.data.fname != "string") {
    this.data.fname = "";
  }
  if (typeof this.data.lname != "string") {
    this.data.lname = "";
  }
  if (typeof this.data.email != "string") {
    this.data.email = "";
  }
  if (typeof this.data.password != "string") {
    this.data.password = "";
  }

  this.data = {
    fname: this.data.fname.trim(),
    lname: this.data.lname.trim(),
    email: this.data.email.trim().toLowerCase(),
    password: this.data.password
  };
};

User.prototype.validate = function () {
  return new Promise(async (resolve, reject) => {
    if (!validator.isEmail(this.data.email)) {
      this.errors.push("You must provide a valid email address.");
    }
    //Check for valid and uniqe email
    if (validator.isEmail(this.data.email)) {
      let emailExists = await usersCollection.findOne({ email: this.data.email });
      if (emailExists) {
        this.errors.push("Email is already in use");
        reject();
      }
    }

    resolve();
  });
};

User.prototype.register = function () {
  return new Promise(async (resolve, reject) => {
    this.cleanUp();

    try {
      await this.validate();
      console.log("Validation Working ...");
    } catch {
      console.log(this.errors);
    }

    if (!this.errors.length) {
      let salt = bcrypt.genSaltSync(10);
      this.data.password = bcrypt.hashSync(this.data.password, salt);
      await usersCollection.insertOne(this.data);
      resolve();
    } else {
      console.log("Rejecting ...");
      reject(this.errors);
    }
  });
};

User.prototype.login = function () {
  return new Promise((resolve, reject) => {
    this.cleanUp();
    usersCollection
      .findOne({ email: this.data.email })
      .then(attemptedUser => {
        if (attemptedUser && bcrypt.compareSync(this.data.password, attemptedUser.password)) {
          this.data = attemptedUser;
          resolve("Congrats!");
        } else {
          reject("Invalid username / password.");
        }
      })
      .catch(function () {
        reject("Please try again later.");
      });
  });
};

module.exports = User;
