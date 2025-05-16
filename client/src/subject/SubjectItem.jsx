import React, { useState } from "react";

import TaskList from "../task/TaskList.jsx";

function SubjectItem({ subject, onAddTaskClick, onToggleTask }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggleExpand = () => {
    setIsExpanded((currentIsExpanded) => !currentIsExpanded);
  };

  const handlePlusButtonClick = (e) => {
    e.stopPropagation();
    onAddTaskClick(subject.id);
  };

  if (!subject || !subject.name || !subject.id) {
    return null;
  }

  const handleToggleTaskInSubjectItem = (taskId, newCompletedState) => {
    console.log(
      `SubjectItem (pro předmět '${subject.name}', ID: ${
        subject.id
      }): Úkol s ID '${taskId}' označen jako ${
        newCompletedState ? "splněný" : "nesplněný"
      }`
    );

    if (onToggleTask) {
      onToggleTask(subject.id, taskId, newCompletedState);
    }
  };

  return (
    <div>
      <div onClick={handleToggleExpand} style={{ cursor: "pointer" }}>
        <h3>{subject.name}</h3>
        <button
          type="button"
          onClick={handlePlusButtonClick}
          title={`Přidat úkol k ${subject.name}`}
        >
          +
        </button>
      </div>

      {isExpanded && (
        <TaskList
          tasks={subject.tasks}
          subjectName={subject.name}
          onToggleTaskComplete={handleToggleTaskInSubjectItem}
        />
      )}
    </div>
  );
}

export default SubjectItem;
