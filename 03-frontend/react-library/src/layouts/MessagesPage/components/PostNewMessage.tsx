import { useOktaAuth } from "@okta/okta-react";
import { useState } from "react";
import MessageModel from "../../../models/MessageModel";

export const PostNewMessage = () => {
  const { authState } = useOktaAuth();

  const [title, setTitle] = useState("");
  const [question, setQuestion] = useState("");
  const [displayWarning, setDisplayWarning] = useState(false);
  const [displaySuccess, setDisplaySuccess] = useState(false);

  async function submitNewQuestion() {
    const url = `${process.env.REACT_APP_API}/messages/secure/add/message`;
    console.log(url);
    if (
      authState &&
      authState.isAuthenticated &&
      title !== "" &&
      question !== ""
    ) {
      const messageRequestModel = new MessageModel(title, question);
      const requestOptions = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authState.accessToken?.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messageRequestModel),
      };

      const submitNewQuestionResponse = await fetch(url, requestOptions);
      console.log(submitNewQuestionResponse);

      if (!submitNewQuestionResponse.ok) {
        throw new Error("Something went wrong");
      }
      setTitle("");
      setQuestion("");
      setDisplaySuccess(true);
      setDisplayWarning(false);
    } else {
      setDisplaySuccess(false);
      setDisplayWarning(true);
    }
  }

  return (
    <div className="card mt-3">
      {displaySuccess && (
        <div className="alert alert-success" role="alert">
          Question added Successfully
        </div>
      )}
      <div className="card-header">Ask Question to Library Admin</div>
      <div className="card-body">
        <form method="POST" onSubmit={submitNewQuestion}>
          {displayWarning && (
            <div className="alert alert-danger">
              All fields must be filled out
            </div>
          )}
          <div className="mb-3">
            <label className="form-label">Title</label>
            <input
              className="form-control"
              type="text"
              id="exampleFormControlInput1"
              placeholder="Title"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
            ></input>
          </div>
          <div className="mb-3">
            <label className="form-label">Question</label>
            <textarea
              className="form-control"
              id="exampleFormControlTextArea1"
              rows={3}
              onChange={(e) => setQuestion(e.target.value)}
              value={question}
            ></textarea>
          </div>
          <div>
            <button
              className="btn btn-primary mt-3"
              onClick={(e) => {
                e.preventDefault();
                submitNewQuestion();
              }}
            >
              Submit Question
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
