const express = require("express");
const router = express.Router();

const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

const { verifyToken } = require("../middleware/authMiddleware");
const { validateTask } = require("../middleware/taskValidation");

// routes protection
router.use(verifyToken);

router.post("/", validateTask, createTask);
router.get("/", getTasks);
router.put("/:id", validateTask, updateTask);
router.delete("/:id", deleteTask);

module.exports = router;