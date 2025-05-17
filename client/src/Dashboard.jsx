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
    fetch("http://localhost:5002/subject/list")
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Chyba při načítání předmětů! Status: ${response.status}`
          );
        }
        return response.json();
      })
      .then(async (subjectData) => {
        const subjectsFromServer = subjectData.subjectList || [];

        if (subjectsFromServer.length === 0) {
          actions.setSubjects([]);
          actions.setLoading(false);
          return;
        }

        const subjectsWithTasksPromises = subjectsFromServer.map(
          async (subject) => {
            try {
              const tasksResponse = await fetch(
                `http://localhost:5002/task/listBySubject/${subject.id}`
              );
              if (!tasksResponse.ok) {
                console.error(
                  `Chyba při načítání úkolů pro předmět ID ${subject.id}: ${tasksResponse.status}`
                );
                return { ...subject, tasks: [] };
              }
              const tasksData = await tasksResponse.json();
              return { ...subject, tasks: tasksData.tasks || [] };
            } catch (error) {
              console.error(
                `Chyba při fetchování úkolů pro předmět ID ${subject.id}:`,
                error
              );
              return { ...subject, tasks: [] };
            }
          }
        );

        const finalSubjectsWithTasks = await Promise.all(
          subjectsWithTasksPromises
        );

        actions.setSubjects(finalSubjectsWithTasks);
      })
      .catch((error) => {
        console.error("Celková chyba při načítání dat:", error);
        actions.setError(error.message || "Neznámá chyba při načítání dat.");
        actions.setSubjects([]);
      })
      .finally(() => {
        actions.setLoading(false);
      });
  }, [actions]);

  const handleShowSubjectForm = () => {
    setSubjectFormError("");
    setShowSubjectForm(true);
    setShowTaskForm(false);
  };

  const handleCloseSubjectForm = () => {
    setShowSubjectForm(false);
    setSubjectFormError("");
  };

  const handleAddSubject = async (newSubjectData) => {
    const existingSubjectFrontend = state.subjects.find(
      (subject) =>
        subject.name.toLowerCase() === newSubjectData.name.toLowerCase()
    );

    if (existingSubjectFrontend) {
      setSubjectFormError(
        `Předmět "${newSubjectData.name}" již existuje (kontrola na frontendu).`
      );
      return;
    }

    actions.setLoading(true);
    setSubjectFormError("");

    try {
      const response = await fetch("http://localhost:5002/subject/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newSubjectData.name }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.message || `HTTP error! status: ${response.status}`
        );
      }
      const createdSubjectWithTasks = {
        ...responseData,
        tasks: responseData.tasks || [],
      };
      actions.addSubject(createdSubjectWithTasks);
      handleCloseSubjectForm();
    } catch (error) {
      console.error("Chyba při přidávání předmětu:", error);
      setSubjectFormError(
        error.message || "Nepodařilo se přidat předmět. Zkuste to prosím znovu."
      );
      actions.setError(error.message || "Nepodařilo se přidat předmět.");
    } finally {
      actions.setLoading(false);
    }
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

  const handleAddTask = async (taskDataFromForm) => {
    actions.setLoading(true);
    setTaskFormError("");
    const payload = {
      title: taskDataFromForm.title,
      description: taskDataFromForm.description,
      dueDate: taskDataFromForm.dueDate,
      subjectId: currentSubjectIdForTask,
    };

    if (!payload.description) delete payload.description;
    if (!payload.dueDate) delete payload.dueDate;

    try {
      const response = await fetch("http://localhost:5002/task/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();

      if (!response.ok) {
        if (responseData.validationError) {
          const errorMessages = responseData.validationError
            .map(
              (err) => `${err.instancePath.slice(1) || "data"}: ${err.message}`
            )
            .join(", ");
          throw new Error(`Validation failed: ${errorMessages}`);
        }
        throw new Error(
          responseData.message || `HTTP error! status: ${response.status}`
        );
      }

      actions.addTask(currentSubjectIdForTask, responseData);
      handleCloseTaskForm();
    } catch (error) {
      console.error("Chyba při přidávání úkolu:", error);
      setTaskFormError(
        error.message || "Nepodařilo se přidat úkol. Zkuste to prosím znovu."
      );
      actions.setError(error.message || "Nepodařilo se přidat úkol.");
    } finally {
      actions.setLoading(false);
    }
  };

  const handleToggleTaskStatus = async (
    subjectId,
    taskId,
    newCompletedState
  ) => {
    if (newCompletedState === true) {
      actions.setLoading(true);

      try {
        const response = await fetch(
          `http://localhost:5002/task/markCompleted/${taskId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(
            responseData.message || `HTTP error! status: ${response.status}`
          );
        }

        actions.updateTask(subjectId, taskId, {
          completed: responseData.completed,
        });
      } catch (error) {
        console.error(
          `Chyba při označování úkolu ${taskId} jako dokončený:`,
          error
        );
        actions.updateTask(subjectId, taskId, {
          completed: !newCompletedState,
        });
        actions.setError(
          error.message || "Nepodařilo se aktualizovat stav úkolu."
        );
      } finally {
        actions.setLoading(false);
      }
    } else {
      console.warn(
        "Odznačení úkolu: Backend aktuálně nepodporuje vrácení stavu 'completed' na false přes tento endpoint."
      );
      actions.updateTask(subjectId, taskId, { completed: newCompletedState });
    }
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
