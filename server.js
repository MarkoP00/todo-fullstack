import express from "express";
import cors from "cors";
import connectDB from "./server/config/database.js";
import dotenv from "dotenv";
import todoRouter from "./routes/todoRoutes.js";
import logger from "./middleware/logger.js";
import errorHandler from "./middleware/error.js";
import notFound from "./middleware/notFound.js";

dotenv.config();
connectDB();

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: false,
    methods: ["GET", "POST", "PATCH", "DELETE"],
  })
);
const PORT = process.env.PORT || 5050;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

app.use("/api/todos", todoRouter);
app.use(errorHandler);
app.use(notFound);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
