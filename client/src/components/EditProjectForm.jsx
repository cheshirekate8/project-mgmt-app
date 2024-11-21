import { useState, useEffect, useRef } from "react";
import { useMutation } from "@apollo/client";
import { GET_PROJECT } from "../queries/projectQueries";
import { UPDATE_PROJECT } from "../mutations/projectMutations";

const enumTranslator = (enumValue) => {
  switch (enumValue) {
    case "Not Started":
      return "new";
    case "In Progress":
      return "progress";
    case "Completed":
      return "completed";
    default:
      break;
  }
};
export default function EditProjectForm({ project }) {
  const [name, setName] = useState(project.name);
  const [hasInteractedName, setHasInteractedName] = useState(false);
  const [description, setDescription] = useState(project.description);
  const [hasInteractedDescription, setHasInteractedDescription] =
    useState(false);
  const [status, setStatus] = useState(enumTranslator(project.status));
  const [doNotSubmit, setDoNotSumbit] = useState(true);

  const [updateProject] = useMutation(UPDATE_PROJECT, {
    variables: {
      id: project.id,
      name,
      description,
      status,
    },
    refetchQueries: [{ query: GET_PROJECT, variables: { id: project.id } }],
  });

  const nameInput = useRef(null);
  const descriptionInput = useRef(null);

  useEffect(() => {
    //Name Validations
    if (!hasInteractedName) return;
    if ((name && name.length < 2) || (hasInteractedName && name === "")) {
      nameInput?.current.classList.add("is-invalid");
      nameInput?.current.classList.remove("is-valid");
    } else if (name && name.length >= 2) {
      nameInput?.current.classList.add("is-valid");
      nameInput?.current.classList.remove("is-invalid");
    }
  }, [hasInteractedName, name]);

  useEffect(() => {
    //Description Validations
    if (!hasInteractedDescription) return;
    if (
      (description && description.length < 20) ||
      (hasInteractedName && description === "")
    ) {
      descriptionInput?.current.classList.add("is-invalid");
      descriptionInput?.current.classList.remove("is-valid");
    } else if (description && description.length >= 20) {
      descriptionInput?.current.classList.add("is-valid");
      descriptionInput?.current.classList.remove("is-invalid");
    }
  }, [description, hasInteractedDescription, hasInteractedName]);

  useEffect(() => {
    if (
      (nameInput?.current.classList.contains("is-valid") &&
        descriptionInput?.current.classList.contains("is-valid")) ||
      (!hasInteractedName &&
        descriptionInput?.current.classList.contains("is-valid")) ||
      (nameInput?.current.classList.contains("is-valid") && !hasInteractedDescription)
    ) {
      setDoNotSumbit(false);
    } else {
      setDoNotSumbit(true);
    }
  }, [hasInteractedDescription, hasInteractedName]);

  const resetForm = (nameVar, descVar, statusVar) => {
    console.log("STATUS", project.status)
    console.log("TRANSLATED STATUS", enumTranslator(project.status))

    setName(nameVar);
    setDescription(descVar);
    setStatus(enumTranslator(statusVar));
    setHasInteractedName(false);
    setHasInteractedDescription(false);
    nameInput?.current.classList.remove("is-valid", "is-invalid");
    descriptionInput?.current.classList.remove("is-valid", "is-invalid");
    setDoNotSumbit(true);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!name || !description || !status) {
      return alert("Please fill out all fields");
    }

    updateProject(name, description, status);
    resetForm(name, description, status);
  };

  return (
    <div className="mt-5">
      <h3>Update Project Details</h3>
      <form onSubmit={onSubmit}>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            className={`form-control client-input ${
              hasInteractedName && name
                ? name.length >= 2
                  ? "is-valid"
                  : "is-invalid"
                : ""
            }`}
            id="name"
            value={name}
            onChange={(e) => {
              if (!hasInteractedName && e.target.value.length >= 2)
                setHasInteractedName(true);
              setName(e.target.value);
            }}
            onBlur={() => setHasInteractedName(true)}
            ref={nameInput}
          ></input>
          <div className="valid-feedback">Looks good!</div>
          <div className="invalid-feedback">
            Must be greater than 2 characters.
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className={`form-control client-input ${
              hasInteractedDescription && description
                ? description.length >= 20
                  ? "is-valid"
                  : "is-invalid"
                : ""
            }`}
            id="description"
            value={description}
            onChange={(e) => {
              if (!hasInteractedDescription && e.target.value.length >= 2)
                setHasInteractedDescription(true);
              setDescription(e.target.value);
            }}
            onBlur={() => setHasInteractedDescription(true)}
            ref={descriptionInput}
          ></textarea>
          <div className="valid-feedback">Looks good!</div>
          <div className="invalid-feedback">
            Must be greater than 20 characters.
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label">Status</label>
          <select
            className="form-select"
            id="status"
            value={status}
            onChange={(e) => {
              if (!hasInteractedName && !hasInteractedDescription) {
                setDoNotSumbit(false);
              }
              setStatus(e.target.value);
            }}
            onBlur={(e) => {
              if (!hasInteractedName && !hasInteractedDescription) {
                setDoNotSumbit(false);
              }
              setStatus(e.target.value);
            }}
          >
            <option value={"new"}>Not Started</option>
            <option value={"progress"}>In Progress</option>
            <option value={"completed"}>Completed</option>
          </select>
        </div>
        <div className="d-flex justify-content-between">
          <button
            type="submit"
            className="btn btn-secondary mr-5"
            disabled={doNotSubmit}
          >
            Submit
          </button>
          <button type="button" className="btn btn-primary" onClick={() => {resetForm(project.name, project.description, project.status)}}>
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}
