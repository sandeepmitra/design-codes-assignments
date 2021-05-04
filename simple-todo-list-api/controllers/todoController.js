const Todo = require("../models/Todo.js");

exports.create = function (req, res) {
  let todo = new Todo(req.body, req.userId._id);
  todo
    .createTodo()
    .then(response => {
      res.status(200).send(response);
    })
    .catch(function (errors) {
      res.status(201).send(errors);
    });
};

exports.findByUserid = function (req, res) {
  Todo.getTodos(req.userId._id)
    .then(function (response) {
      res.status(200).send(response);
    })
    .catch(function (errors) {
      res.status(201).send(errors);
    });
};

exports.updateTodo = function (req, res) {
  let todoUpdate = new Todo(req.body, req.userId._id);
  todoUpdate
    .update()
    .then(response => {
      res.status(200).send(response.result);
    })
    .catch(function (errors) {
      res.status(201).send(errors);
    });
};

exports.deleteTodo = function (req, res) {
  let todo = new Todo(req.body, req.userId._id);
  todo
    .delete()
    .then(response => {
      res.status(200).send(response.result);
    })
    .catch(function (errors) {
      res.status(201).send(errors);
    });
};
