import React, { createContext, useContext, useReducer } from "react";

// Initial state
const initialState = {
  subjects: [],
  isLoading: false,
  error: null,
};

// Action types
const ACTIONS = {
  SET_SUBJECTS: "SET_SUBJECTS",
  ADD_SUBJECT: "ADD_SUBJECT",
  UPDATE_SUBJECT: "UPDATE_SUBJECT",
  DELETE_SUBJECT: "DELETE_SUBJECT",
  ADD_TASK: "ADD_TASK",
  UPDATE_TASK: "UPDATE_TASK",
  DELETE_TASK: "DELETE_TASK",
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
};

// Reducer function
function appReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_SUBJECTS:
      return { ...state, subjects: action.payload };

    case ACTIONS.ADD_SUBJECT:
      return { ...state, subjects: [action.payload, ...state.subjects] };

    case ACTIONS.UPDATE_SUBJECT:
      return {
        ...state,
        subjects: state.subjects.map((subject) =>
          subject.id === action.payload.id ? action.payload : subject
        ),
      };

    case ACTIONS.DELETE_SUBJECT:
      return {
        ...state,
        subjects: state.subjects.filter(
          (subject) => subject.id !== action.payload
        ),
      };

    case ACTIONS.ADD_TASK:
      return {
        ...state,
        subjects: state.subjects.map((subject) => {
          if (subject.id === action.payload.subjectId) {
            return {
              ...subject,
              tasks: [...subject.tasks, action.payload.task],
            };
          }
          return subject;
        }),
      };

    case ACTIONS.UPDATE_TASK:
      return {
        ...state,
        subjects: state.subjects.map((subject) => {
          if (subject.id === action.payload.subjectId) {
            return {
              ...subject,
              tasks: subject.tasks.map((task) =>
                task.id === action.payload.taskId
                  ? { ...task, ...action.payload.updates }
                  : task
              ),
            };
          }
          return subject;
        }),
      };

    case ACTIONS.DELETE_TASK:
      return {
        ...state,
        subjects: state.subjects.map((subject) => {
          if (subject.id === action.payload.subjectId) {
            return {
              ...subject,
              tasks: subject.tasks.filter(
                (task) => task.id !== action.payload.taskId
              ),
            };
          }
          return subject;
        }),
      };

    case ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };

    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload };

    default:
      return state;
  }
}

// Create context
const AppContext = createContext();

// Provider component
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Actions
  const actions = {
    setSubjects: (subjects) =>
      dispatch({ type: ACTIONS.SET_SUBJECTS, payload: subjects }),
    addSubject: (subject) =>
      dispatch({ type: ACTIONS.ADD_SUBJECT, payload: subject }),
    updateSubject: (subject) =>
      dispatch({ type: ACTIONS.UPDATE_SUBJECT, payload: subject }),
    deleteSubject: (subjectId) =>
      dispatch({ type: ACTIONS.DELETE_SUBJECT, payload: subjectId }),
    addTask: (subjectId, task) =>
      dispatch({ type: ACTIONS.ADD_TASK, payload: { subjectId, task } }),
    updateTask: (subjectId, taskId, updates) =>
      dispatch({
        type: ACTIONS.UPDATE_TASK,
        payload: { subjectId, taskId, updates },
      }),
    deleteTask: (subjectId, taskId) =>
      dispatch({ type: ACTIONS.DELETE_TASK, payload: { subjectId, taskId } }),
    setLoading: (isLoading) =>
      dispatch({ type: ACTIONS.SET_LOADING, payload: isLoading }),
    setError: (error) => dispatch({ type: ACTIONS.SET_ERROR, payload: error }),
  };

  return (
    <AppContext.Provider value={{ state, actions }}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook for using the context
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
