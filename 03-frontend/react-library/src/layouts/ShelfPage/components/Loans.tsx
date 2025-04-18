import { useOktaAuth } from "@okta/okta-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ShelfCurrentLoans from "../../../models/ShelfCurrentLoans";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { LoansModal } from "./LoansModals";

export const Loans = () => {
  const { authState } = useOktaAuth();

  const [httpError, setHttpError] = useState(null);

  const [shelfCurrentLoans, setShelfCurrentLoans] = useState<
    ShelfCurrentLoans[]
  >([]);
  const [isLoadingUserLoans, setIsLoadingUserLoans] = useState(true);
  const [checkout, setChekout] = useState(false);

  useEffect(() => {
    const fetchUserCurrentLoans = async () => {
      if (authState && authState?.isAuthenticated) {
        const url = `${process.env.REACT_APP_API}/books/secure/currentloans`;

        const requestOptions = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authState.accessToken?.accessToken}`,
            "Content-Type": "application/json",
          },
        };

        const shelfCurrentLoansResponse = await fetch(url, requestOptions);

        if (!shelfCurrentLoansResponse.ok) {
          throw new Error("Something went wrong!");
        }

        const shelfCurrentLoansResponseJson =
          await shelfCurrentLoansResponse.json();
        setShelfCurrentLoans(shelfCurrentLoansResponseJson);
      }

      setIsLoadingUserLoans(false);
    };
    fetchUserCurrentLoans().catch((error: any) => {
      console.log(error);
      setIsLoadingUserLoans(false);
      setHttpError(error);
    });
    window.scrollTo(0, 0);
  }, [authState, checkout]);

  if (isLoadingUserLoans) {
    return <SpinnerLoading />;
  }
  if (httpError) {
    return (
      <div className="container m-5">
        <p>{httpError}</p>
      </div>
    );
  }

  async function returnBook(bookId: number) {
    const url = `${process.env.REACT_APP_API}/books/secure/return?bookId=${bookId}`;

    const requestOptions = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
        "Content-Type": "application/json",
      },
    };

    const returnResponse = await fetch(url, requestOptions);

    if (!returnResponse.ok) {
      throw new Error("Something went wrong");
    }

    setChekout(!checkout);
  }

  async function renewLoan(bookId: number) {
    const url = `${process.env.REACT_APP_API}/books/secure/renew/loan?bookId=${bookId}`;

    const requestOptions = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
        "Content-Type": "application/json",
      },
    };

    const returnResponse = await fetch(url, requestOptions);

    if (!returnResponse.ok) {
      throw new Error("Something went wrong");
    }

    setChekout(!checkout);
  }
  return (
    <div>
      {/* Desktop */}
      <div className="d-none d-lg-block mt-2">
        {shelfCurrentLoans.length > 0 ? (
          <>
            <h5>Current Loans:</h5>
            {shelfCurrentLoans.map((shelfCurrentLoan) => (
              <div key={shelfCurrentLoan.book.id}>
                <div className="row mt-3 mb-3">
                  <div className="col-4 col-md-4 container">
                    {shelfCurrentLoan.book.img ? (
                      <img
                        src={shelfCurrentLoan.book.img}
                        width="160"
                        height="240"
                        alt="book"
                      ></img>
                    ) : (
                      <img
                        src={require("./../../../Images/BooksImages/book-luv2code-1000.png")}
                        width="160"
                        height="240"
                        alt="book"
                      />
                    )}
                  </div>
                  <div className="card col-3 col-md-3 container d-flex">
                    <div className="card-body">
                      <div className="mt-3">
                        <h4>Loan Options:</h4>
                        {shelfCurrentLoan.daysLeft > 0 && (
                          <p className="text-secondary">
                            Due in {shelfCurrentLoan.daysLeft} days.
                          </p>
                        )}
                        {shelfCurrentLoan.daysLeft === 0 && (
                          <p className="text-success">Due Today</p>
                        )}
                        {shelfCurrentLoan.daysLeft < 0 && (
                          <p className="text-danger">
                            Past due by {shelfCurrentLoan.daysLeft} days.
                          </p>
                        )}

                        <div className="list-group mt-3">
                          <button
                            className="list-group-item list-group-item-action"
                            aria-current="true"
                            data-bs-toggle="modal"
                            data-bs-target={`#modal${shelfCurrentLoan.book.id}`}
                          >
                            Manage Loan
                          </button>
                          <Link
                            to={"/search"}
                            className="list-group-item list-group-item-action"
                          >
                            Search more books?
                          </Link>
                        </div>
                      </div>

                      <hr />
                      <p className="mt-3">
                        Help other find their adventure by reviewing your loan.
                      </p>
                      <Link
                        className="btn btn-primary"
                        to={`/checkout/${shelfCurrentLoan.book.id}`}
                      >
                        Leave a review
                      </Link>
                    </div>
                  </div>
                </div>
                <hr />
                <LoansModal
                  shelfCurrentLoan={shelfCurrentLoan}
                  mobile={false}
                  returnBook={returnBook}
                  renewLoan={renewLoan}
                />
              </div>
            ))}
          </>
        ) : (
          <>
            <h3 className="mt-3">Currently no Loans</h3>
            <Link to={`search`} className="btn btn-primary">
              Search for a new book
            </Link>
          </>
        )}
      </div>

      {/* Mobile */}

      <div className="container d-lg-none mt-2">
        {shelfCurrentLoans.length > 0 ? (
          <>
            <h5 className="mb-3">Current Loans:</h5>
            {shelfCurrentLoans.map((shelfCurrentLoan) => (
              <div key={shelfCurrentLoan.book.id}>
                <div className="d-flex justify-content-center align-items-center">
                  {shelfCurrentLoan.book.img ? (
                    <img
                      src={shelfCurrentLoan.book.img}
                      width="160"
                      height="240"
                      alt="book"
                    ></img>
                  ) : (
                    <img
                      src={require("./../../../Images/BooksImages/book-luv2code-1000.png")}
                      width="160"
                      height="240"
                      alt="book"
                    />
                  )}
                </div>
                <div className="card d-flex mt-5 mb-3">
                  <div className="card-body">
                    <div className="mt-3">
                      <h4>Loan Options:</h4>
                      {shelfCurrentLoan.daysLeft > 0 && (
                        <p className="text-secondary">
                          Due in {shelfCurrentLoan.daysLeft} days.
                        </p>
                      )}
                      {shelfCurrentLoan.daysLeft === 0 && (
                        <p className="text-success">Due Today</p>
                      )}
                      {shelfCurrentLoan.daysLeft < 0 && (
                        <p className="text-danger">
                          Past due by {shelfCurrentLoan.daysLeft} days.
                        </p>
                      )}

                      <div className="list-group mt-3">
                        <button
                          className="list-group-item list-group-item-action"
                          aria-current="true"
                          data-bs-toggle="modal"
                          data-bs-target={`#mobilemodal${shelfCurrentLoan.book.id}`}
                        >
                          Manage Loan
                        </button>
                        <Link
                          to={"/search"}
                          className="list-group-item list-group-item-action"
                        >
                          Search more books?
                        </Link>
                      </div>
                    </div>

                    <hr />
                    <p className="mt-3">
                      Help other find their adventure by reviewing your loan.
                    </p>
                    <Link
                      className="btn btn-primary"
                      to={`/checkout/${shelfCurrentLoan.book.id}`}
                    >
                      Leave a review
                    </Link>
                  </div>
                </div>
                <hr />

                <LoansModal
                  shelfCurrentLoan={shelfCurrentLoan}
                  mobile={true}
                  returnBook={returnBook}
                  renewLoan={renewLoan}
                />
              </div>
            ))}
          </>
        ) : (
          <>
            <h3 className="mt-3">Currently no Loans</h3>
            <Link to={`search`} className="btn btn-primary">
              Search for a new book
            </Link>
          </>
        )}
      </div>
    </div>
  );
};
