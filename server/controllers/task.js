const express = require("express");
const router = express.Router();

const createTask = require("../abl/task/createTask.js");
const markTaskCompleted = require("../abl/task/markTaskCompleted.js");
const listTasksBySubject = require("../abl/task/listTasksBySubject.js");

router.post("/create", createTask);
router.patch("/markCompleted/:taskId", markTaskCompleted);
router.get("/listBySubject/:subjectId", listTasksBySubject);

module.exports = router;
