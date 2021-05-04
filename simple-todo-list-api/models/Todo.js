const todoCollection = require("../db").db().collection("todolists");
const ObjectID = require("mongodb").ObjectId;
const User = require("./User");
const sanitizeHtml = require("sanitize-html");

let Todo = function (data, userid, requestedTodoId) {
  this.data = data;
  this.errors = [];
  this.userid = userid;
  this.requestedTodoId = requestedTodoId;
};

Todo.prototype.cleanUp = function () {
  if (typeof this.data.todoTitle != "string") {
    this.data.todoTitle = "";
  }
  if (typeof this.data.todoDesc != "string") {
    this.data.todoDesc = "";
  }
  if (this.data.postId) {
    this.postId = this.data.postId;
  } else {
    this.postId = "";
  }

  this.data = {
    title: sanitizeHtml(this.data.todoTitle.trim(), { allowedTags: [], allowedAttributes: {} }),
    body: sanitizeHtml(this.data.todoDesc.trim(), { allowedTags: [], allowedAttributes: {} }),
    CreatedDate: new Date(),
    author: ObjectID(this.userid),
    postId: this.postId.trim()
  };

  console.log("after clean: ", this.data);
};

Todo.prototype.validate = function () {
  if (this.data.todoTitle == "") {
    this.errors.push("The Title field can not be a empty field");
  }
  if (this.data.todoDesc == "") {
    this.errors.push("The Description can not be a empty field");
  }
};

Todo.prototype.createTodo = function () {
  return new Promise((resolve, reject) => {
    console.log("Insert Data before clean: ", this.data);
    this.cleanUp();
    this.validate();

    if (!this.errors.length) {
      todoCollection
        .insertOne(this.data)
        .then(info => {
          resolve(info.ops[0]._id);
        })
        .catch(() => {
          this.errors.push("There is an server error.. Please try again.");
          reject(this.errors);
        });
    } else {
      reject(this.errors);
    }
  });
};

Todo.prototype.update = function () {
  return new Promise((resolve, reject) => {
    this.cleanUp();
    this.validate();
    if (!this.errors.length) {
      todoCollection
        .updateOne({ _id: ObjectID(this.data.postId) }, { $set: { title: this.data.title, body: this.data.body } })
        .then(info => {
          //resolve(info.ops[0]._id);
          resolve(info);
        })
        .catch(() => {
          this.errors.push("There is an server error.. Please try again.");
          reject(this.errors);
        });
    } else {
      reject(this.errors);
    }
  });
};

Todo.prototype.delete = function () {
  return new Promise((resolve, reject) => {
    this.cleanUp();
    this.validate();
    if (!this.errors.length) {
      todoCollection
        .deleteOne({ _id: ObjectID(this.data.postId) })
        .then(info => {
          //resolve(info.ops[0]._id);
          resolve(info);
        })
        .catch(() => {
          this.errors.push("There is an server error.. Please try again.");
          reject(this.errors);
        });
    } else {
      reject(this.errors);
    }
  });
};

Todo.getTodos = function (userid) {
  return new Promise(async (resolve, reject) => {
    let lists = await todoCollection.find({ author: ObjectID(userid) });
    if (lists) {
      let todoArr = [];
      await lists.forEach(doc => todoArr.push(doc));
      resolve(todoArr);
    } else {
      reject();
    }
  });
};

module.exports = Todo;
