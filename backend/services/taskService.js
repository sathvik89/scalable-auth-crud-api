const Task = require("../models/Task");
//crud 

async function createTask(data, userId) {
  const task = await Task.create({ ...data, user: userId });
  return task;  
}

async function getTasks(user) {
  if (user.role === "admin") {
    const tasks = await Task.find().populate("user", "email");
    return tasks;
  }
  const tasks = await Task.find({ user: user.id });
  return tasks;
}

async function updateTask(taskId, data, user) {
  const task = await Task.findById(taskId);

  if (!task){
    throw new Error("Task not found");
  }

  if (task.user.toString() !== user.id && user.role !== "admin") {
    throw new Error("Not authorized to update this task");
  }

  const updatedTask = await Task.findByIdAndUpdate(taskId, data, { returnDocument: "after" });
  return updatedTask;
};

async function deleteTask(taskId, user) {
  const task = await Task.findById(taskId);

  if (!task){
    throw new Error("Task not found");
  }

  if (task.user.toString() !== user.id && user.role !== "admin") {
    throw new Error("Not authorized to delete this task");
  }

  let deletedTask = await task.deleteOne();

  return { message: "Task deleted successfully" };
}

module.exports = { createTask, getTasks, updateTask, deleteTask };