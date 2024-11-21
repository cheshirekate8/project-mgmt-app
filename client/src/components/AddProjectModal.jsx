import { useState, useEffect, useRef } from "react";
import { FaList } from "react-icons/fa";
import { useMutation, useQuery } from "@apollo/client";
import { GET_PROJECTS } from "../queries/projectQueries";
import { GET_CLIENTS } from "../queries/clientQueries";
import { ADD_PROJECT } from "../mutations/projectMutations";

export default function AddProjectModal() {
  const [projectName, setProjectName] = useState("");
  const [hasInteractedName, setHasInteractedName] = useState(false);
  const [description, setDescription] = useState("");
  const [hasInteractedDescription, setHasInteractedDescription] =
    useState(false);
  const [clientId, setClientId] = useState("");
  const [hasInteractedClient, setHasInteractedClient] = useState(false);
  const [status, setStatus] = useState("new");
  const [doNotSubmit, setDoNotSumbit] = useState(true);

  const [addProject] = useMutation(ADD_PROJECT, {
    variables: {
      name: projectName,
      description,
      clientId,
      status,
    },
    update(cache, { data: { addProject } }) {
      const { projects } = cache.readQuery({ query: GET_PROJECTS });
      cache.writeQuery({
        query: GET_PROJECTS,
        data: { projects: [...projects, addProject] },
      });
    },
  });

  const nameInput = useRef(null);
  const descriptionInput = useRef(null);
  const clientIdInput = useRef(null);
  const closeBtnRef = useRef(null);

  // Get Clients for select
  const { loading, error, data } = useQuery(GET_CLIENTS);

  useEffect(() => {
    //Name Validations
    if (!hasInteractedName) return;
    if (
      (projectName && projectName.length < 2) ||
      (hasInteractedName && projectName === "")
    ) {
      nameInput?.current.classList.add("is-invalid");
      nameInput?.current.classList.remove("is-valid");
    } else if (projectName && projectName.length >= 2) {
      nameInput?.current.classList.add("is-valid");
      nameInput?.current.classList.remove("is-invalid");
    }
  }, [hasInteractedName, projectName]);

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
    //clientId Validation
    if (!hasInteractedClient) return;
    if (clientId === "") {
      clientIdInput?.current.classList.add("is-invalid");
      clientIdInput?.current.classList.remove("is-valid");
    } else {
      clientIdInput?.current.classList.add("is-valid");
      clientIdInput?.current.classList.remove("is-invalid");
    }
  }, [clientId, hasInteractedClient]);

  useEffect(() => {
    if (
      nameInput?.current?.classList.contains("is-valid") &&
      descriptionInput?.current?.classList.contains("is-valid") &&
      clientIdInput?.current?.classList.contains("is-valid")
    ) {
      setDoNotSumbit(false);
    } else {
      setDoNotSumbit(true);
    }
  }, [projectName, description, clientId]);

  const clearForm = () => {
    setProjectName("");
    setDescription("");
    setStatus("new");
    setClientId("");
    setHasInteractedName(false);
    setHasInteractedDescription(false);
    setHasInteractedClient(false);
    nameInput?.current.classList.remove("is-valid", "is-invalid");
    descriptionInput?.current.classList.remove("is-valid", "is-invalid");
    clientIdInput?.current.classList.remove("is-valid", "is-invalid");
    setDoNotSumbit(true);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (projectName === "" || description === "" || status === "") {
      return alert("Please fill in all fields");
    }
    addProject(projectName, description, clientId, status);
    clearForm();
    closeBtnRef.current.click();
  };

  if (loading) return null;
  if (error) return "Something went wrong!";

  return (
    <>
      {!loading && !error && (
        <>
          {/* <!-- Button trigger modal --> */}
          <button
            type="button"
            className="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#addProjectModal"
          >
            <div className="d-flex align-items-center">
              <FaList className="icon" />
              <div>New Project</div>
            </div>
          </button>

          {/* <!-- Modal --> */}
          <div
            className="modal fade"
            id="addProjectModal"
            aria-labelledby="addProjectModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="addProjectModalLabel">
                    New Project
                  </h1>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    ref={closeBtnRef}
                  ></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={onSubmit}>
                    <div className="mb-3">
                      <label className="form-label">Name</label>
                      <input
                        type="text"
                        className={`form-control client-input ${
                          hasInteractedName && projectName
                            ? projectName.length >= 2
                              ? "is-valid"
                              : "is-invalid"
                            : ""
                        }`}
                        id="projectName"
                        value={projectName}
                        onChange={(e) => {
                          if (!hasInteractedName && e.target.value.length >= 2)
                            setHasInteractedName(true);
                          setProjectName(e.target.value);
                        }}
                        onBlur={() => setHasInteractedName(true)}
                        ref={nameInput}
                        required
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
                          if (
                            !hasInteractedDescription &&
                            e.target.value.length >= 2
                          )
                            setHasInteractedDescription(true);
                          setDescription(e.target.value);
                        }}
                        onBlur={() => setHasInteractedDescription(true)}
                        ref={descriptionInput}
                        required
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
                        onChange={(e) => setStatus(e.target.value)}
                      >
                        <option value={"new"}>Not Started</option>
                        <option value={"progress"}>In Progress</option>
                        <option value={"completed"}>Completed</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Client</label>
                      <select
                        id="clientId"
                        className="form-select"
                        value={clientId}
                        onChange={(e) => {
                          setClientId(e.target.value);
                          setHasInteractedClient(true);
                        }}
                        onBlur={() => setHasInteractedClient(true)}
                        ref={clientIdInput}
                        required
                      >
                        <option value="" disabled>
                          Select Client
                        </option>
                        {data.clients.map((client) => {
                          return (
                            <option value={client.id} key={client.id}>
                              {client.name}
                            </option>
                          );
                        })}
                      </select>
                      <div className="valid-feedback">Looks good!</div>
                      <div className="invalid-feedback">
                        Must assign project to a client.
                      </div>
                    </div>
                    <div className="d-flex justify-content-between">
                      <button
                        type="submit"
                        className="btn btn-secondary mr-5"
                        disabled={doNotSubmit}
                      >
                        Submit
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={clearForm}
                      >
                        Clear
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
