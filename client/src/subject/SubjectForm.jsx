import React, { useState } from "react";
import "./../styles/subjectForm.css";

function SubjectForm({
  onClose,
  onSubmitSubject,
  errorMessage,
  clearErrorMessage,
}) {
  const [subjectName, setSubjectName] = useState("");
  const [inputError, setInputError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!subjectName.trim()) {
      setInputError("Subject name cannot be empty");
      if (clearErrorMessage) clearErrorMessage();
      return;
    }

    setInputError("");
    if (clearErrorMessage) clearErrorMessage();

    onSubmitSubject({ name: subjectName.trim() });
  };
  const handleCancel = () => {
    if (clearErrorMessage) clearErrorMessage();
    setInputError("");
    onClose();
  };

  const handleInputChange = (e) => {
    setSubjectName(e.target.value);
    if (inputError) setInputError("");
    if (errorMessage && clearErrorMessage) clearErrorMessage();
  };

  return (
    <div className="subject-form-overlay">
      {" "}
      <div className="subject-form-container">
        <h3>New Subject</h3>
        <form onSubmit={handleSubmit} noValidate>
          {errorMessage && (
            <div className="form-error-message global-error">
              {errorMessage}
              <button
                type="button"
                onClick={clearErrorMessage}
                className="close-error-btn"
                aria-label="Close error"
              >
                ✕
              </button>
            </div>
          )}
          {inputError && (
            <div className="form-error-message local-error">{inputError}</div>
          )}
          <div className="form-group">
            <label htmlFor="subjectNameInput">Subject name</label>
            <input
              type="text"
              id="subjectNameInput"
              value={subjectName}
              onChange={handleInputChange}
              placeholder="Enter subject name (e.g., Mathematics)"
              className={inputError || errorMessage ? "input-error" : ""}
            />
          </div>
          <div className="form-actions">
            <button type="button" onClick={handleCancel} className="btn-cancel">
              Cancel
            </button>
            <button type="submit" className="btn-add">
              Add a subject
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SubjectForm;
