const Ajv = require("ajv");
const ajv = new Ajv();

const subjectDao = require("../../dao/subjectDao.js");

const schema = {
  type: "object",
  properties: {
    name: { type: "string", minLength: 3 },
  },
  required: ["name"],
  additionalProperties: false,
};

async function createSubject(req, res) {
  try {
    let subjectData = req.body;

    const valid = ajv.validate(schema, subjectData);

    if (!valid) {
      res.status(400).json({
        code: "inputIsNotValid",
        message: "Input is not valid",
        validationError: ajv.errors,
      });
      return;
    }

    const existingSubject = subjectDao.getByName(subjectData.name);

    if (existingSubject) {
      res.status(400).json({
        code: "subjectExists",
        message: "This subject already exists.",
      });
      return;
    }

    try {
      const createdSubject = subjectDao.create(subjectData);
      res.status(201).json(createdSubject);
    } catch (error) {
      res.status(500).json({
        code: "failedToCreateSubject",
        message: "Creating the subject failed",
        detail: error.message,
      });
    }
  } catch (error) {
    res.status(500).json({
      code: "ablError",
      message: "Server error: Could not process the request.",
      detail: error.message,
    });
  }
}

module.exports = createSubject;
