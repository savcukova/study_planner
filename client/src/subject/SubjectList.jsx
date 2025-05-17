import React from "react";
import SubjectItem from "./SubjectItem.jsx";
import "./../styles/subjectList.css";

function SubjectList({
  subjects,
  onAddTaskToSubject,
  onToggleTaskStatusInList,
}) {
  if (!subjects || subjects.length === 0) return null;

  return (
    <div className="subject-list">
      {subjects.map((subject) => (
        <SubjectItem
          key={subject.id}
          subject={subject}
          onAddTask={onAddTaskToSubject}
          onToggleTaskStatusInList={onToggleTaskStatusInList}
        />
      ))}
    </div>
  );
}

export default SubjectList;
