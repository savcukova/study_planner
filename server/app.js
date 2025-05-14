const express = require("express");
const app = express();

const port = 5002;
const subjectController = require("./controllers/subject.js");
const taskController = require("./controllers/task.js");

app.use(express.json());

app.use("/subject", subjectController);
app.use("/task", taskController);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
