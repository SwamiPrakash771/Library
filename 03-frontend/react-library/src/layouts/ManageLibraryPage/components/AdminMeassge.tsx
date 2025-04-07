import { useState } from "react";
import MessageModel from "../../../models/MessageModel";

export const AdminMessage: React.FC<{
  message: MessageModel;
  submitResponseToQuestion: any;
  key: any;
}> = (props) => {
  const [displayWarning, setDisplayWarning] = useState(false);
  const [response, setResponse] = useState("");

  function submitBtn() {
    if (props.message.id !== null && response !== "") {
      props.submitResponseToQuestion(props.message.id, response);
      setDisplayWarning(false);
    } else {
      setDisplayWarning(true);
    }
  }

  return (
    <div key={props.message.id}>
      <div className="card shadow mt-2 p-3 bg-body rounded">
        <h5>
          Case #{props.message.id}:{props.message.title}
        </h5>
        <h6>{props.message.userEmail}</h6>
        <p>{props.message.question}</p>
        <hr />
        <div>
          <h5>Response: </h5>
          <form action="PUT">
            {displayWarning && (
              <div className="aler alert-danger p-3 rounded" role="alert">
                <div>All fields must be filled out.</div>
              </div>
            )}
            <div className="col-md-12 mb-3">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                id="exampleFormCOntrolTextarea1"
                rows={3}
                onChange={(e) => setResponse(e.target.value)}
              ></textarea>
            </div>
            <div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={submitBtn}
              >
                Submit Response
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
