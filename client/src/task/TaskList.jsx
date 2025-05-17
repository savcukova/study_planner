import React from "react";
import TaskItem from "./TaskItem.jsx";
import "./../styles/taskList.css";

function TaskList({ tasks, onToggleTaskInList }) {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="task-list-empty">
        <p>Žádné úkoly pro tento předmět.</p>
      </div>
    );
  }

  return (
    <ul className="task-list">
      {tasks.map((task, index) => (
        <TaskItem
          key={`${task.id}-${index}`}
          task={task}
          onToggleComplete={onToggleTaskInList}
        />
      ))}
    </ul>
  );
}

export default TaskList;
