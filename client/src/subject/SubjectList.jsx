import React, { useState } from "react";
import SubjectItem from "./SubjectItem.jsx";
import "./../styles/subjectList.css";

function SubjectList({
  subjects,
  onAddTaskToSubject,
  onToggleTaskStatusInList,
}) {
  const [expandedSubjectId, setExpandedSubjectId] = useState(null);

  if (!subjects || subjects.length === 0) return null;

  const handleToggleExpand = (subjectId) => {
    setExpandedSubjectId((prevId) => (prevId === subjectId ? null : subjectId));
  };

  return (
    <div className="subject-list">
      {subjects.map((subject) => (
        <SubjectItem
          key={subject.id}
          subject={subject}
          onAddTask={onAddTaskToSubject}
          onToggleTaskStatusInList={onToggleTaskStatusInList}
          isExpanded={expandedSubjectId === subject.id}
          onToggleExpand={() => handleToggleExpand(subject.id)}
        />
      ))}
    </div>
  );
}

export default SubjectList;
