import mongoose from "mongoose";
const Schema = mongoose.Schema;

const TodoSchema = new Schema({
  title: {
    type: String,
    required: true,
    minlength: 3,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  finished: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model("Todo", TodoSchema);
