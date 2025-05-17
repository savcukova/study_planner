import React from "react";
import "./../styles/taskItem.css";

function TaskItem({ task, onToggleComplete }) {
  if (!task || !task.id || !task.title) {
    console.log("chybi task");
    return null;
  }

  const handleCheckboxChange = (e) => {
    if (onToggleComplete) {
      onToggleComplete(task.id, e.target.checked);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const [year, month, day] = dateString.split("-");
      if (day && month && year) {
        return `${day}.${month}.${year}`;
      }
      return dateString;
    } catch (error) {
      console.error("Chyba formátování data v TaskItem:", error);
      return dateString;
    }
  };

  return (
    <li className={`task-item ${task.completed ? "completed" : ""}`}>
      <div className="task-item-details">
        <span id={`task-title-${task.id}`} className="task-item-title">
          {task.title}
        </span>
        {task.description && (
          <span className="task-item-description">{task.description}</span>
        )}
        {task.dueDate && (
          <span className="task-item-duedate">{formatDate(task.dueDate)}</span>
        )}
      </div>

      <div className="task-item-checkbox-wrapper">
        <input
          type="checkbox"
          id={`task-checkbox-${task.id}`}
          className="task-item-checkbox"
          checked={task.completed || false}
          onChange={handleCheckboxChange}
          aria-labelledby={`task-title-${task.id}`}
        />
        <label
          htmlFor={`task-checkbox-${task.id}`}
          className="custom-checkbox-visual"
        ></label>
      </div>
    </li>
  );
}

export default TaskItem;
