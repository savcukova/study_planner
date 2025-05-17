import React, { useEffect, useState } from "react";
import "./styles/dashboard.css";
import SubjectList from "./subject/SubjectList";
import SubjectForm from "./subject/SubjectForm";
import TaskForm from "./task/TaskForm";
import { useApp } from "./context/AppContext";

function Dashboard() {
  const { state, actions } = useApp();
  const [showSubjectForm, setShowSubjectForm] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [currentSubjectIdForTask, setCurrentSubjectIdForTask] = useState(null);
  const [subjectFormError, setSubjectFormError] = useState("");
  const [taskFormError, setTaskFormError] = useState("");

  useEffect(() => {
    actions.setLoading(true);

    const testData = [
      {
        id: "1",
        name: "Mathematics",
        tasks: [
          {
            id: "t1",
            title: "do homework",
            description: "Complete exercises 1-10 from chapter 5",
            dueDate: "2025-05-16",
            completed: false,
          },
          {
            id: "t2",
            title: "do homework",
            description: "Solve the quadratic equations",
            dueDate: "2025-05-16",
            completed: false,
          },
          {
            id: "t3",
            title: "do homework",
            description: "Practice integration techniques",
            dueDate: "2025-05-16",
            completed: false,
          },
        ],
      },
      { id: "2", name: "Computer Science", tasks: [] },
      { id: "3", name: "Philosophy", tasks: [] },
    ];

    setTimeout(() => {
      actions.setSubjects(testData);
      actions.setLoading(false);
    }, 500);
  }, []);

  const handleShowSubjectForm = () => {
    setSubjectFormError("");
    setShowSubjectForm(true);
    setShowTaskForm(false);
  };

  const handleCloseSubjectForm = () => {
    setShowSubjectForm(false);
    setSubjectFormError("");
  };

  const handleAddSubject = (newSubjectData) => {
    const existingSubject = state.subjects.find(
      (subject) =>
        subject.name.toLowerCase() === newSubjectData.name.toLowerCase()
    );

    if (existingSubject) {
      setSubjectFormError(`Subject "${newSubjectData.name}" already exists.`);
      return;
    }

    const newSubject = {
      id: `subj-${Date.now()}`,
      name: newSubjectData.name,
      tasks: [],
    };
    actions.addSubject(newSubject);
    handleCloseSubjectForm();
  };

  const handleClearSubjectFormError = () => {
    setSubjectFormError("");
  };

  const handleShowTaskForm = (subjectId) => {
    setCurrentSubjectIdForTask(subjectId);
    setShowTaskForm(true);
    setShowSubjectForm(false);
  };

  const handleCloseTaskForm = () => {
    setShowTaskForm(false);
    setCurrentSubjectIdForTask(null);
  };

  const handleClearTaskFormError = () => {
    setTaskFormError("");
  };

  const handleAddTask = (taskData) => {
    const newTask = {
      id: `task-${Date.now()}`,
      title: taskData.title,
      dueDate: taskData.dueDate,
      description: taskData.description,
      completed: false,
    };
    actions.addTask(currentSubjectIdForTask, newTask);
    handleCloseTaskForm();
  };

  const handleToggleTaskStatus = (subjectId, taskId, newCompletedState) => {
    actions.updateTask(subjectId, taskId, { completed: newCompletedState });
  };

  return (
    <div className="dashboard-page">
      {showSubjectForm && (
        <SubjectForm
          onClose={handleCloseSubjectForm}
          onSubmitSubject={handleAddSubject}
          errorMessage={subjectFormError}
          clearErrorMessage={handleClearSubjectFormError}
        />
      )}

      {showTaskForm && currentSubjectIdForTask && (
        <TaskForm
          subjectId={currentSubjectIdForTask}
          onClose={handleCloseTaskForm}
          onSubmitTask={handleAddTask}
          errorMessage={taskFormError}
          clearErrorMessage={handleClearTaskFormError}
        />
      )}

      <div className="dashboard-content">
        {state.isLoading && (
          <p className="loading-message">Načítám předměty...</p>
        )}
        {!showSubjectForm && !showTaskForm && (
          <>
            {state.subjects.length === 0 && !state.isLoading && (
              <p className="no-subjects-message">
                There are no subjects available right now...
              </p>
            )}
            {state.subjects.length > 0 && !state.isLoading && (
              <SubjectList
                subjects={state.subjects}
                onAddTaskToSubject={handleShowTaskForm}
                onToggleTaskStatusInList={handleToggleTaskStatus}
              />
            )}
          </>
        )}
      </div>

      {!showSubjectForm && !showTaskForm && (
        <div className="dashboard-actions">
          <button className="btn-add-subject" onClick={handleShowSubjectForm}>
            Add a subject
          </button>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
