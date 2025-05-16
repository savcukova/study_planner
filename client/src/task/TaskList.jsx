import React from "react";
import TaskItem from "./TaskItem.jsx";

function TaskList({ tasks, subjectName, onToggleTaskComplete }) {
  if (!tasks || tasks.length === 0) {
    return (
      <div>
        <p>
          <em>(Žádné úkoly pro předmět {subjectName})</em>
        </p>
      </div>
    );
  }
  return (
    <ul>
      {tasks.map((task) => {
        return (
          <TaskItem
            key={task.id}
            task={task}
            onToggleComplete={onToggleTaskComplete}
          />
        );
      })}
    </ul>
  );
}

export default TaskList;
