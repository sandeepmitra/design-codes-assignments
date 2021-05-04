const express = require("express");
const cors = require("cors");
const router = express.Router();
const userController = require("./controllers/userController");
const todoController = require("./controllers/todoController");

router.use(cors());

router.get("/", function (req, res) {
  res.send("Simple To Do List API Backend Running ...");
});

router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/add-todo", userController.mustBeLoggedIn, todoController.create);
router.post("/get-todo", userController.mustBeLoggedIn, todoController.findByUserid);
router.post("/update-todo", userController.mustBeLoggedIn, todoController.updateTodo);
router.post("/delete-todo", userController.mustBeLoggedIn, todoController.deleteTodo);

module.exports = router;
