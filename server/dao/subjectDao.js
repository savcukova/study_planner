const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const subjectFolder = path.join(__dirname, "storage", "subjectList");

if (!fs.existsSync(subjectFolder)) {
  fs.mkdirSync(subjectFolder, { recursive: true });
}

function create(subject) {
  try {
    subject.id = crypto.randomBytes(16).toString("hex");

    const filePath = path.join(subjectFolder, `${subject.id}.json`);
    const fileData = JSON.stringify(subject);

    fs.writeFileSync(filePath, fileData, "utf-8");
    return subject;
  } catch (error) {
    throw {
      code: "failedToCreateSubject",
      message: "Failed to create subject",
      detail: error.message,
    };
  }
}

function list() {
  try {
    const files = fs.readdirSync(subjectFolder);
    const subjectList = files.map((file) => {
      const fileData = fs.readFileSync(path.join(subjectFolder, file), "utf-8");

      return JSON.parse(fileData);
    });

    return subjectList;
  } catch (error) {
    throw {
      code: "failedToListSubjects",
      message: "Failed to list subjects",
      detail: error.message,
    };
  }
}

function getByName(name) {
  try {
    const allSubjects = list();

    const foundSubject = allSubjects.find(
      (subject) => subject.name.toLowerCase() === name.toLowerCase()
    );

    return foundSubject;
  } catch (error) {
    throw {
      code: "failedToGetSubjectByName",
      message: "Failed to get subject by name",
      detail: error.message,
    };
  }
}

function getById(subjectId) {
  try {
    const allSubjects = list();
    const foundSubject = allSubjects.find(
      (subject) => subject.id === subjectId
    );

    return foundSubject;
  } catch (error) {
    throw {
      code: "failedToGetSubjectById",
      message: "Failed to get subject by id",
      detail: error.message,
    };
  }
}

module.exports = { create, list, getByName, getById };
