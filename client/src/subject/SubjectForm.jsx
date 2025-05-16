import React, { useState } from "react";

function SubjectForm({
  onFormSubmit,
  onCancel,
  errorMessage,
  clearErrorMessage,
}) {
  const [subjectName, setSubjectName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    onFormSubmit(subjectName.trim());
  };

  return (
    <div>
      <h3>Nový Předmět</h3>

      {errorMessage && (
        <div>
          <span style={{ color: "red" }}>{errorMessage}</span>
          <button
            type="button"
            onClick={clearErrorMessage}
            title="Zavřít chybu"
          >
            X
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="subjectNameInput">Název předmětu:</label>
          <input
            type="text"
            id="subjectNameInput"
            value={subjectName}
            onChange={(e) => setSubjectName(e.target.value)}
            placeholder="Value"
          />
        </div>
        <div>
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit">Add a subject</button>
        </div>
      </form>
      <hr />
    </div>
  );
}

export default SubjectForm;
