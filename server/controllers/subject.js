const express = require("express");
const router = express.Router();

const listSubject = require("../abl/subject/listSubject.js");
const createSubject = require("../abl/subject/createSubject.js");

router.get("/list", listSubject);
router.post("/create", createSubject);

module.exports = router;
