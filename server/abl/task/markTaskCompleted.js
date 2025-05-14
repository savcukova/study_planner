const taskDao = require("../../dao/taskDao.js");

async function markTaskCompleted(req, res) {
  try {
    const taskId = req.params.taskId;

    const taskToUpdate = taskDao.getTaskById(taskId);

    if (!taskToUpdate) {
      res.status(404).json({
        code: "taskNotFound",
        message: `Task with ID ${taskId} not found`,
      });

      return;
    }

    taskToUpdate.completed = true;

    const updatedtask = taskDao.updateTask(taskToUpdate);
    res.json(updatedtask);
  } catch (error) {
    res.status(500).json({
      code: "failedToUpdateTask",
      message: "Failed to update task",
      detail: error.message,
    });
  }
}

module.exports = markTaskCompleted;
