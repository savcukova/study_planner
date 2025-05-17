import React, { useState } from "react";
import "./../styles/taskForm.css";

function TaskForm({
  subjectId,
  onClose,
  onSubmitTask,
  errorMessage,
  clearErrorMessage,
}) {
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    dueDate: "",
  });

  const [validationErrors, setValidationErrors] = useState({
    title: "",
    description: "",
    dueDate: "",
  });

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    // Validace názvu
    if (!taskData.title.trim()) {
      errors.title = "Task name is required";
      isValid = false;
    } else if (taskData.title.trim().length < 3) {
      errors.title = "Task name must be at least 3 characters long";
      isValid = false;
    }

    // Validace popisu
    if (taskData.description && taskData.description.length > 200) {
      errors.description = "Description must be at most 200 characters long";
      isValid = false;
    }

    // Validace data
    if (taskData.dueDate) {
      const selectedDate = new Date(taskData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        errors.dueDate = "Due date must be in the future";
        isValid = false;
      }
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (clearErrorMessage) clearErrorMessage();

    if (validateForm()) {
      onSubmitTask({
        subjectId: subjectId,
        title: taskData.title.trim(),
        dueDate: taskData.dueDate,
        description: taskData.description.trim(),
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Vyčištění chyby při změně hodnoty
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    if (errorMessage && clearErrorMessage) {
      clearErrorMessage();
    }
  };

  const getTodayDateString = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="task-form-overlay">
      <div className="task-form-container">
        <form onSubmit={handleSubmit} noValidate>
          {errorMessage && (
            <div className="form-error-message global-error">
              {errorMessage}
              <button
                type="button"
                onClick={clearErrorMessage}
                className="close-error-btn"
                aria-label="Close error"
              >
                ✕
              </button>
            </div>
          )}

          {validationErrors.title && (
            <div className="form-error-message global-error">
              {validationErrors.title}
              <button
                type="button"
                onClick={() =>
                  setValidationErrors((prev) => ({ ...prev, title: "" }))
                }
                className="close-error-btn"
                aria-label="Close error"
              >
                ✕
              </button>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="titleInput">Task name</label>
            <input
              type="text"
              id="titleInput"
              name="title"
              value={taskData.title}
              onChange={handleInputChange}
              placeholder="Task name"
              className={validationErrors.title ? "input-error" : ""}
            />
          </div>

          <div className="form-group">
            <label htmlFor="descriptionInput">Description</label>
            <textarea
              id="descriptionInput"
              name="description"
              value={taskData.description}
              onChange={handleInputChange}
              placeholder="Description (optional)"
              className={validationErrors.description ? "input-error" : ""}
              rows="3"
            />
            {validationErrors.description && (
              <div className="form-error-message local-error">
                {validationErrors.description}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="dueDateInput">Due date</label>
            <input
              type="date"
              id="dueDateInput"
              name="dueDate"
              value={taskData.dueDate}
              onChange={handleInputChange}
              className={validationErrors.dueDate ? "input-error" : ""}
            />
            {validationErrors.dueDate && (
              <div className="form-error-message local-error">
                {validationErrors.dueDate}
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancel
            </button>
            <button type="submit" className="btn-add">
              Add task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskForm;
