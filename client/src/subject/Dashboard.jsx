import React, { useState, useEffect } from "react";

import SubjectItem from "./SubjectItem.jsx";
import SubjectForm from "./SubjectForm.jsx";
import TaskForm from "./../task/TaskForm.jsx";

function Dashboard() {
  const [subjects, setSubjects] = useState([]);
  const [isAddSubjectFormVisible, setIsAddSubjectFormVisible] = useState(false);
  const [formError, setFormError] = useState("");
  const [isAddTaskFormVisible, setIsAddTaskFormVisible] = useState(false);
  const [currentSubjectIdForTask, setCurrentSubjectIdForTask] = useState(null);

  useEffect(() => {
    const testSubjectsData = [
      {
        id: "subj1",
        name: "Matematika",
        tasks: [
          {
            id: "task1a",
            name: "Naučit se derivace",
            dueDate: "20.05.2025",
            completed: false,
          },
          {
            id: "task1b",
            name: "Procvičit integrály",
            dueDate: "25.05.2025",
            completed: true,
          },
        ],
      },
      {
        id: "subj2",
        name: "Počítačové vědy",
        tasks: [
          {
            id: "task2a",
            name: "Dokončit React projekt",
            dueDate: "30.05.2025",
          },
        ],
      },
      {
        id: "subj3",
        name: "Filozofie",
        tasks: [],
      },
      {
        id: "subj4",
        name: "Angličtina",
      },
    ];

    setSubjects(testSubjectsData);
  }, []);

  const handleShowAddSubjectForm = () => {
    setIsAddSubjectFormVisible(true);
    setIsAddTaskFormVisible(false);
    setFormError("");
  };

  const handleCloseSubjectForm = () => {
    setIsAddSubjectFormVisible(false);
    setFormError("");
  };

  const handleSubjectFormSubmit = (newSubjectName) => {
    if (!newSubjectName) {
      setFormError("Subject name cannot be empty");
      return;
    }

    if (
      subjects.some(
        (subject) => subject.name.toLowerCase() === newSubjectName.toLowerCase()
      )
    ) {
      setFormError("Subject name already exists");
      return;
    }

    const newSubject = {
      id: `subj-${Date.now()}`,
      name: newSubjectName,
      tasks: [],
    };

    setSubjects((prevSubjects) => [...prevSubjects, newSubject]);
    setIsAddSubjectFormVisible(false);
    setFormError("");
  };

  const handleAddTaskToSubject = (subjectId) => {
    console.log(
      `DashboardContent: Požadavek na přidání ÚKOLU k předmětu s ID: ${subjectId}`
    );

    setCurrentSubjectIdForTask(subjectId);
    setIsAddTaskFormVisible(true);
    setIsAddSubjectFormVisible(false);
    setFormError("");
  };

  const handleCloseTaskForm = () => {
    setIsAddTaskFormVisible(false);
    setCurrentSubjectIdForTask(null);
    setFormError("");
  };

  const handleTaskFormSubmit = (taskDataFromForm) => {
    if (!taskDataFromForm.title) {
      setFormError("Task name cannot be empty");
      return;
    }

    setSubjects((prevSubjects) =>
      prevSubjects.map((subject) => {
        if (subject.id === taskDataFromForm.subjectId) {
          const newTask = {
            id: `task-${Date.now()}`,
            name: taskDataFromForm.title,
            description: taskDataFromForm.description,
            dueDate: taskDataFromForm.dueDate,
            completed: false,
          };

          const updatedTasks = subject.tasks
            ? [newTask, ...subject.tasks]
            : [newTask];
          return { ...subject, tasks: updatedTasks };
        }
        return subject;
      })
    );

    setIsAddTaskFormVisible(false);
    setCurrentSubjectIdForTask(null);
    setFormError("");
  };

  const handleToggleTaskStatus = (
    subjectIdToUpdate,
    taskIdToUpdate,
    newCompletedState
  ) => {
    setSubjects((currentSubjects) =>
      currentSubjects.map((subject) => {
        if (subject.id === subjectIdToUpdate) {
          const updatedTasks = subject.tasks
            ? subject.tasks.map((task) => {
                if (task.id === taskIdToUpdate) {
                  return { ...task, completed: newCompletedState };
                }
                return task;
              })
            : [];

          return { ...subject, tasks: updatedTasks };
        }
        return subject;
      })
    );
  };

  return (
    <div>
      {isAddSubjectFormVisible ? (
        <SubjectForm
          onFormSubmit={handleSubjectFormSubmit}
          onCancel={handleCloseSubjectForm}
          errorMessage={formError}
          clearErrorMessage={() => setFormError("")}
        />
      ) : isAddTaskFormVisible && currentSubjectIdForTask ? (
        <TaskForm
          subjectId={currentSubjectIdForTask}
          onTaskFormSubmit={handleTaskFormSubmit}
          onCancelTaskForm={handleCloseTaskForm}
          errorMessage={formError}
          clearErrorMessage={() => setFormError("")}
        />
      ) : (
        <>
          {subjects.length === 0 ? (
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <p>There are no subjects available right now...</p>
            </div>
          ) : (
            subjects.map((subject) => (
              <SubjectItem
                key={subject.id}
                subject={subject}
                onAddTaskClick={handleAddTaskToSubject}
                onToggleTask={handleToggleTaskStatus}
              />
            ))
          )}
          <button type="button" onClick={handleShowAddSubjectForm}>
            Add a subject
          </button>
        </>
      )}
    </div>
  );
}

export default Dashboard;
