import React from "react";

function TaskItem({ task, onToggleComplete }) {
  if (!task || !task.id || !task.name) {
    console.warn("TaskItem: Chybí data pro úkol.", task);
    return null;
  }

  const handleCheckboxChange = (e) => {
    const newCompletedState = e.target.checked;
    console.log(
      `Úkol "${task.name}" (ID: ${task.id}) byl označen jako: ${
        newCompletedState ? "splněný" : "nesplněný"
      }`
    );

    if (onToggleComplete) {
      onToggleComplete(task.id, newCompletedState);
    }
  };

  return (
    <li>
      <input
        type="checkbox"
        checked={task.completed || false}
        onChange={handleCheckboxChange}
      />
      {task.name}
      {task.dueDate && <span> (do: {task.dueDate})</span>}
    </li>
  );
}

export default TaskItem;
