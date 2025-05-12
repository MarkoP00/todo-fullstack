import express from "express";
import Todo from "../server/models/todoSchema.js";
import {
  getAllTodos,
  getSingleTodo,
  createTodo,
  updateTodo,
  deleteTodo,
} from "../controllers/todoController.js";
const todoRouter = express.Router();

// ROUTES
// GET - /api/todos - GET ALL TODOS
todoRouter.get("/", getAllTodos);

// GET - /todos/:id - GET SINGLE TODO
todoRouter.get("/:id", getSingleTodo);

// POST - /api/todos - CREATE NEW TODO
todoRouter.post("/", createTodo);

// PATCH - /todos/:id - UPDATE TODO
todoRouter.patch("/:id", updateTodo);

// DELETE - /todos/:id - DELETE TODO
todoRouter.delete("/:id", deleteTodo);
export default todoRouter;
