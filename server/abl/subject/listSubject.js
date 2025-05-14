const subjectDao = require("../../dao/subjectDao");

function listSubjects(req, res) {
  try {
    const subjectList = subjectDao.list();
    res.json({ subjectList });
  } catch (error) {
    res.status(500).json({
      code: "failedToListSubjects",
      message: "Failed to list subjects",
    });
  }
}

module.exports = listSubjects;
