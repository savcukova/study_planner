const taskDao = require("../../dao/taskDao.js");
const subjectDao = require("../../dao/subjectDao.js");

async function listTasksBySubject(req, res) {
  try {
    const subjectId = req.params.subjectId;

    const subject = subjectDao.getById(subjectId);
    if (!subject) {
      res.status(404).json({
        code: "subjectNotFound",
        message: `Subject with ID ${subjectId} not found`,
      });
      return;
    }

    const tasks = taskDao.listBySubjectId(subjectId);

    res.json({
      subject: subject,
      tasks: tasks,
    });
  } catch (error) {
    res.status(500).json({
      code: "failedToListTasks",
      message: "Failed to list tasks",
      detail: error.message,
    });
  }
}

module.exports = listTasksBySubject;
