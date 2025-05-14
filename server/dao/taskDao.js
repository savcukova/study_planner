const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const taskFolder = path.join(__dirname, "storage", "taskList");

if (!fs.existsSync(taskFolder)) {
  fs.mkdirSync(taskFolder, { recursive: true });
}

function create(task) {
  try {
    task.id = crypto.randomBytes(16).toString("hex");

    const newTask = {
      id: task.id,
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      subjectId: task.subjectId,
      completed: false,
    };

    const filePath = path.join(taskFolder, `${newTask.id}.json`);
    const fileData = JSON.stringify(newTask);
    fs.writeFileSync(filePath, fileData, "utf-8");

    return newTask;
  } catch (error) {
    throw {
      code: "failedToCreateTask",
      message: "Failed to create task",
      detail: error.message,
    };
  }
}

function listTasks() {
  try {
    const files = fs.readdirSync(taskFolder);
    const taskList = files.map((file) => {
      const fileData = fs.readFileSync(path.join(taskFolder, file), "utf-8");
      return JSON.parse(fileData);
    });

    return taskList;
  } catch (error) {
    throw {
      code: "failedToListTasks",
      message: "Failed to list tasks",
      detail: error.message,
    };
  }
}

function listBySubjectId(subjectId) {
  try {
    const allTasks = listTasks();

    const tasksForSubject = allTasks.filter(
      (task) => task.subjectId === subjectId
    );

    return tasksForSubject;
  } catch (error) {
    throw {
      code: "failedToListTasksBySubject",
      message: `Failed to list tasks for subject with ID ${subjectId}`,
      detail: error.message,
    };
  }
}

function getTaskById(taskId) {
  try {
    const allTasks = listTasks();

    const foundTask = allTasks.find((task) => task.id === taskId);

    return foundTask;
  } catch (error) {
    throw {
      code: "failedToGetTaskById",
      message: `Failed to get task with ID ${taskId}`,
      detail: error.message,
    };
  }
}

function updateTask(task) {
  try {
    const filePath = path.join(taskFolder, `${task.id}.json`);
    const fileData = JSON.stringify(task);
    fs.writeFileSync(filePath, fileData, "utf-8");

    return task;
  } catch (error) {
    throw {
      code: "failedToUpdateTask",
      message: "Failed to update task",
      detail: error.message,
    };
  }
}

module.exports = {
  create,
  listTasks,
  listBySubjectId,
  getTaskById,
  updateTask,
};
