import { useEffect, useState, useMemo } from "react";
import { FaUser } from "react-icons/fa";
import { useMutation } from "@apollo/client";
import { ADD_CLIENT } from "../mutations/clientMutations";
import { GET_CLIENTS } from "../queries/clientQueries";

export default function AddClientModal() {
  const [name, setName] = useState("");
  const [hasInteractedName, setHasInteractedName] = useState(false);
  const [email, setEmail] = useState("");
  const [hasInteractedEmail, setHasInteractedEmail] = useState(false);
  const [phone, setPhone] = useState("");
  const [hasInteractedPhone, setHasInteractedPhone] = useState(false);
  const [doNotSubmit, setDoNotSumbit] = useState(true);
  const phoneRegex = useMemo(
    () => /^\+?[1-9]\d{0,2}[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/,
    [],
  );
  const emailRegex = useMemo(
    () => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    [],
  );

  const [addClient] = useMutation(ADD_CLIENT, {
    variables: { name, email, phone },
    update(cache, { data: { addClient } }) {
      const { clients } = cache.readQuery({ query: GET_CLIENTS });

      cache.writeQuery({
        query: GET_CLIENTS,
        data: { clients: [...clients, addClient] },
      });
    },
  });

  const nameInput = document.getElementById("name");
  const phoneInput = document.getElementById("phone");
  const emailInput = document.getElementById("email");

  useEffect(() => {
    if (!hasInteractedName) return;

    const isValid = name && name.length >= 2;

    nameInput?.classList.toggle("is-valid", isValid);
    nameInput?.classList.toggle("is-invalid", !isValid);
  }, [hasInteractedName, name, nameInput]);

  useEffect(() => {
    if (!hasInteractedEmail || !emailInput) return;

    const isValidEmail = emailRegex.test(email);

    emailInput.classList.toggle("is-valid", email && isValidEmail);
    emailInput.classList.toggle("is-invalid", email && !isValidEmail);
  }, [email, emailInput, emailRegex, hasInteractedEmail]);

  useEffect(() => {
    if (!hasInteractedPhone) return;

    const isValidPhone = phoneRegex.test(phone) && phone.length >= 10;

    if (isValidPhone) {
      phoneInput?.classList.add("is-valid");
      phoneInput?.classList.remove("is-invalid");
    } else {
      phoneInput?.classList.add("is-invalid");
      phoneInput?.classList.remove("is-valid");
    }
  }, [hasInteractedPhone, phone, phoneInput?.classList, phoneRegex]);

  useEffect(() => {
    //Submit Button Validation
    if (
      nameInput?.classList.contains("is-valid") &&
      emailInput?.classList.contains("is-valid") &&
      phoneInput?.classList.contains("is-valid")
    ) {
      setDoNotSumbit(false);
    } else {
      setDoNotSumbit(true);
    }
  }, [
    doNotSubmit,
    name,
    email,
    phone,
    nameInput?.classList,
    emailInput?.classList,
    phoneInput?.classList,
  ]);

  const clearForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setHasInteractedEmail(false);
    setHasInteractedName(false);
    setHasInteractedPhone(false);
    nameInput?.classList.remove("is-valid", "is-invalid");
    emailInput?.classList.remove("is-valid", "is-invalid");
    phoneInput?.classList.remove("is-valid", "is-invalid");
    setDoNotSumbit(true);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (name === "" || email === "" || phone === "") {
      return;
    }

    addClient(name, email, phone);
    clearForm();

    const closeBtn = document.getElementById("btn-close");
    closeBtn.click();
  };

  return (
    <>
      {/* <!-- Button trigger modal --> */}
      <button
        type="button"
        className="btn btn-secondary"
        data-bs-toggle="modal"
        data-bs-target="#addClientModal"
      >
        <div className="d-flex align-items-center">
          <FaUser className="icon" />
          <div>Add Client</div>
        </div>
      </button>

      {/* <!-- Modal --> */}
      <div
        className="modal fade"
        id="addClientModal"
        aria-labelledby="addClientModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="addClientModalLabel">
                Add Client
              </h1>
              <button
                type="button"
                className="btn-close"
                id="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
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
                    required
                  ></input>
                  <div className="valid-feedback">Looks good!</div>
                  <div className="invalid-feedback">
                    Must be greater than 2 characters.
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className={`form-control client-input ${
                      hasInteractedEmail && email
                        ? emailRegex.test(email)
                          ? "is-valid"
                          : "is-invalid"
                        : ""
                    }`}
                    id="email"
                    value={email}
                    onChange={(e) => {
                      if (!hasInteractedEmail && e.target.value.length >= 8)
                        setHasInteractedEmail(true);
                      setEmail(e.target.value);
                    }}
                    onBlur={(e) => setHasInteractedEmail(true)}
                    required
                  ></input>
                  <div className="valid-feedback">Looks good!</div>
                  <div className="invalid-feedback">
                    Must enter valid email.
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Phone</label>
                  <input
                    type="text"
                    className={`form-control client-input ${
                      hasInteractedPhone && phone
                        ? phoneRegex.test(phone)
                          ? "is-valid"
                          : "is-invalid"
                        : ""
                    }`}
                    id="phone"
                    value={phone}
                    onChange={(e) => {
                      if (!hasInteractedPhone && e.target.value.length >= 10)
                        setHasInteractedPhone(true);
                      setPhone(e.target.value);
                    }}
                    onBlur={(e) => setHasInteractedPhone(true)}
                    required
                  ></input>
                  <div className="valid-feedback">Looks good!</div>
                  <div className="invalid-feedback">
                    Must enter valid phone number.
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
  );
}
