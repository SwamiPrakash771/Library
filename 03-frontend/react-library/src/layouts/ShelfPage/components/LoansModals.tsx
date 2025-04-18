import ShelfCurrentLoans from "../../../models/ShelfCurrentLoans";
import { ReturnBook } from "../../HomePage/components/ReturnBook";

export const LoansModal: React.FC<{
  shelfCurrentLoan: ShelfCurrentLoans;
  mobile: boolean;
  returnBook: any;
  renewLoan: any;
}> = (props) => {
  return (
    <div
      className="modal fade"
      id={
        props.mobile
          ? `mobilemodal${props.shelfCurrentLoan.book.id}`
          : `modal${props.shelfCurrentLoan.book.id}`
      }
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      aria-labelledby="statiBackdropLabel"
      aria-hidden="true"
      key={props.shelfCurrentLoan.book.id}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="staticBackDropLabel">
              Loan Options
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <div className="container">
              <div className="mt-3">
                <div className="row">
                  <div className="col-2">
                    {props.shelfCurrentLoan.book.img ? (
                      <img
                        src={props.shelfCurrentLoan.book.img}
                        width="40"
                        height="60"
                        alt="book"
                      ></img>
                    ) : (
                      <img
                        src={require("./../../../Images/BooksImages/book-luv2code-1000.png")}
                        width="40"
                        height="60"
                        alt="book"
                      />
                    )}
                  </div>
                  <div className="col-10">
                    <h6>{props.shelfCurrentLoan.book.author}</h6>
                    <h4>{props.shelfCurrentLoan.book.title}</h4>
                  </div>
                </div>
                <hr />
                {props.shelfCurrentLoan.daysLeft > 0 && (
                  <p className="text-secondary">
                    Due in {props.shelfCurrentLoan.daysLeft} days.
                  </p>
                )}
                {props.shelfCurrentLoan.daysLeft === 0 && (
                  <p className="text-success">Due Today</p>
                )}
                {props.shelfCurrentLoan.daysLeft < 0 && (
                  <p className="text-danger">
                    Past due by {props.shelfCurrentLoan.daysLeft} days.
                  </p>
                )}

                <div className="list-group mt-3">
                  <button
                    data-bs-dismiss="modal"
                    className="list-group-item list-group-action"
                    aria-current="true"
                    onClick={() =>
                      props.returnBook(props.shelfCurrentLoan.book.id)
                    }
                  >
                    Return Book
                  </button>
                  <button
                    onClick={
                      props.shelfCurrentLoan.daysLeft < 0
                        ? (event) => event?.preventDefault
                        : () => props.renewLoan(props.shelfCurrentLoan.book.id)
                    }
                    data-bs-dismiss="modal"
                    className={
                      props.shelfCurrentLoan.daysLeft < 0
                        ? "list-group-item list-group-action inactiveLink"
                        : "list-group-item list-group-action"
                    }
                  >
                    {props.shelfCurrentLoan.daysLeft < 0
                      ? "Late dues cannot be renewed"
                      : "Renew Loan for 7 days"}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              data-bs-dismiss="modal"
              className="btn btn-secondary"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
