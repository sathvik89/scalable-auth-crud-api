const taskService = require("../services/taskService");

async function createTask(req, res) {
  try {
    const task = await taskService.createTask(req.body, req.user.id);
    res.status(201).json(task);
  } catch (err) {
    if (err.message === "Task not found") {
      return res.status(404).json({ message: err.message });
    }

    if (err.message.includes("Not authorized")) {
      return res.status(403).json({ message: err.message });
    }
    return res.status(400).json({ message: err.message });
  }
}

async function getTasks(req, res) {
  try {
    console.log(req.user);
    const tasks = await taskService.getTasks(req.user);
    res.status(200).json(tasks);
  } catch (err) {
    if (err.message === "Task not found") {
      return res.status(404).json({ message: err.message });
    }

    if (err.message.includes("Not authorized")) {
      return res.status(403).json({ message: err.message });
    }
    return res.status(400).json({ message: err.message });
  }
}

async function updateTask(req, res) {
  try {
    let taskId = req.params.id;
    const task = await taskService.updateTask(taskId, req.body, req.user);
    res.status(200).json(task);
  } catch (err) {
    if (err.message === "Task not found") {
      return res.status(404).json({ message: err.message });
    }

    if (err.message.includes("Not authorized")) {
      return res.status(403).json({ message: err.message });
    }
    return res.status(400).json({ message: err.message });
  }
}

async function deleteTask(req, res) {
  try {
    let taskId = req.params.id;
    const result = await taskService.deleteTask(taskId, req.user);
    res.status(200).json(result);
  } catch (err) {
    if (err.message === "Task not found") {
      return res.status(404).json({ message: err.message });
    }

    if (err.message.includes("Not authorized")) {
      return res.status(403).json({ message: err.message });
    }
    return res.status(400).json({ message: err.message });
  }
}

module.exports = { createTask, getTasks, updateTask, deleteTask };
