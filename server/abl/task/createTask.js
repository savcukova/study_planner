const Ajv = require("ajv");
const ajv = new Ajv();

const taskDao = require("../../dao/taskDao.js");
const subjectDao = require("../../dao/subjectDao.js");

const schema = {
  type: "object",
  properties: {
    title: { type: "string", minLength: 3 },
    description: { type: "string", maxLength: 50 },
    dueDate: { type: "string", pattern: "^\\d{4}-\\d{2}-\\d{2}$" },
    subjectId: { type: "string", minLength: 1 },
  },
  required: ["title", "subjectId"],
  additionalProperties: false,
};

async function createTask(req, res) {
  try {
    const taskData = req.body;

    const valid = ajv.validate(schema, taskData);

    if (!valid) {
      res.status(400).json({
        code: "inputIsNotValid",
        message: "Input is not valid",
        validationError: ajv.errors,
      });
      return;
    }

    const dueDate = new Date(taskData.dueDate);
    const now = new Date();

    const dueDay = new Date(
      dueDate.getFullYear(),
      dueDate.getMonth(),
      dueDate.getDate()
    );
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (dueDay <= today) {
      res.status(400).json({
        code: "invalidDueDate",
        message: `Due date must be current day or a day in the future`,
      });
      return;
    }

    const subjectId = taskData.subjectId;
    const existingSubject = subjectDao.getById(subjectId);

    if (!existingSubject) {
      res.status(400).json({
        code: "subjectNotFound",
        message: `Subject with ID ${subjectId} was not found`,
      });

      return;
    }

    const createdTask = taskDao.create(taskData);

    res.status(201).json(createdTask);
  } catch (error) {
    res.status(500).json({
      code: "internalServerError",
      message: "Server error: Could not process the request.",
      detail: error.message,
    });
  }
}

module.exports = createTask;
