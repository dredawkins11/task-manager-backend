const mongoose = require("mongoose");
const Joi = require("joi");

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    minlength: 3,
    maxlength: 255,
    required: true,
  },
  description: {
    type: String,
    maxlength: 1024,
    required: true,
  },
  userId: String,
  completed: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: String,
    required: true,
  },
});
const Task = mongoose.model("Tasks", taskSchema);

function validate(task) {
  const schema = Joi.object({
    title: Joi.string().min(3).max(255),
    description: Joi.string().max(1024),
    completed: Joi.boolean(),
    userId: Joi.string(),
    createdAt: Joi.string(),
  });
  console.log(Joi.validate(task, schema))
  return Joi.validate(task, schema);
}

exports.Task = Task;
exports.validate = validate;
