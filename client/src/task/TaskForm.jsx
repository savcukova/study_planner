import React, { useState } from "react";

function TaskForm({
  subjectId,
  onTaskFormSubmit,
  onCancelTaskForm,
  errorMessage,
  clearErrorMessage,
}) {
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!taskName.trim()) {
      alert("Název úkolu nesmí být prázdný!");
      return;
    }
    const taskData = {
      title: taskName.trim(),
      description: description.trim(),
      dueDate: dueDate,
      subjectId: subjectId,
    };
    console.log("Nový úkol k vytvoření:", taskData);
    onTaskFormSubmit(taskData);
  };

  return (
    <div>
      {errorMessage && (
        <div>
          <span style={{ color: "red" }}>{errorMessage}</span>
          <button type="button" onClick={clearErrorMessage} title="Close error">
            X
          </button>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="taskNameInput">Task name</label>
          <input
            type="text"
            id="taskNameInput"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            placeholder="Read a book"
            required
          />
        </div>

        <div>
          <label htmlFor="taskDueDateInput">Due date</label>
          <input
            type="date"
            id="taskDueDateInput"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="taskDescriptionInput">Description</label>
          <textarea
            id="taskDescriptionInput"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional"
          />
        </div>
        <div>
          <button type="button" onClick={onCancelTaskForm}>
            Cancel
          </button>
          <button type="submit">Add a task</button>
        </div>
      </form>
      <hr />
    </div>
  );
}

export default TaskForm;
