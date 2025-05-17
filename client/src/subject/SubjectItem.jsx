import React, { useState } from "react";
import "./../styles/subjectItem.css";
import TaskList from "../task/TaskList";

function SubjectItem({ subject, onAddTask, onToggleTaskStatusInList }) {
  const [isExpanded, setIsExpdanded] = useState(false);

  const handleToggleExpand = () => {
    setIsExpdanded(!isExpanded);
  };

  const handleAddTaskClick = (e) => {
    e.stopPropagation();
    onAddTask(subject.id);
  };

  if (!subject) return null;

  return (
    <div className="subject-item">
      <div className="subject-item-header" onClick={handleToggleExpand}>
        <h3 className="subject-item-name">{subject.name}</h3>
        <button
          type="button"
          className="subject-item-add-task-btn"
          onClick={handleAddTaskClick}
          aria-label={`Add task to ${subject.name}`}
        >
          +
        </button>
      </div>
      {isExpanded && (
        <div className="subject-item-tasks">
          <TaskList
            tasks={subject.tasks}
            onToggleTaskInList={(taskId, completed) =>
              onToggleTaskStatusInList(subject.id, taskId, completed)
            }
          />
        </div>
      )}
    </div>
  );
}

export default SubjectItem;
