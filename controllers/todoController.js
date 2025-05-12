import callError from "../express-services/callError.js";
import Todo from "../server/models/todoSchema.js";

// GET - /api/todos - GET ALL TODOS
export const getAllTodos = async (req, res, next) => {
  const todos = await Todo.find();

  if (!todos || todos.length === 0) {
    return next(
      callError("Something went wrong... Please try again later", 404, null)
    );
  }
  res.status(200).json({ message: "Todos fetched successfully", data: todos });
};

// GET - /todos/:id - GET SINGLE TODO
export const getSingleTodo = async (req, res, next) => {
  const { id } = req.params;

  try {
    const todo = await Todo.findById(id);

    if (!todo) {
      return next(callError("Task not found", 404, null));
    }
    res.status(200).json({ message: "Todo found.", data: todo });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// POST - /api/todos - CREATE NEW TODO
export const createTodo = async (req, res, next) => {
  const { title } = req.body;

  if (!title || title.length < 3) {
    return next(callError("Title must be at least 3 chars long", 400, null));
  }

  try {
    const newTodo = new Todo({ title });
    const taskSaved = await newTodo.save();

    if (!taskSaved) {
      return next(callError("Something went wrong...", 400, null));
    }
    res.status(201).json({
      message: "Todo created successfully",
      data: taskSaved,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// PATCH - /todos/:id - UPDATE TODO

export const updateTodo = async (req, res, next) => {
  const { id } = req.params;

  if (!req.body || typeof req.body !== "object") {
    return next(callError("Request body is missing or invalid", 400, null));
  }

  const { title, finished } = req.body;

  const updateData = {
    updatedAt: Date.now(),
  };

  if (typeof title !== "string" || typeof finished !== "boolean") {
    return next(callError("Request body is invalid", 400, null));
  }

  updateData.title = title;
  updateData.finished = finished;

  try {
    const updatedTodo = await Todo.findByIdAndUpdate(id, updateData, {
      new: true, //returning updated document
      runValidators: true, //run mongoose schema validators
    });

    if (!updatedTodo) {
      return next(callError("Todo not found!", 404, null));
    }
    res.status(200).json({
      message: "Task updated successfully",
      data: updatedTodo,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      //validationerror is thrown when mongoose schema validation fails
      return next(
        callError("Invalid data. Please check input fields", 400, null)
      );
    }

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// DELETE - /todos/:id - DELETE TODO
export const deleteTodo = async (req, res, next) => {
  const { id } = req.params;

  try {
    const deleteTodo = await Todo.findByIdAndDelete(id);
    if (!deleteTodo) {
      return next(callError("Todo not fouund", 404, null));
    }
    res.status(200).json({
      message: "Todo deleted successfully",
      data: deleteTodo,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Mongo commands
/*
  find() - get all document
  findById(id) - find single document
  new Todo({title}).save() - create new document
  .findByIdAndDelete(id)
  .findByIdAndDelete(id)
*/

/*
Informational responses (100 – 199)
Successful responses (200 – 299)
Redirection messages (300 – 399)
Client error responses (400 – 499)
Server error responses (500 – 599)
 */
