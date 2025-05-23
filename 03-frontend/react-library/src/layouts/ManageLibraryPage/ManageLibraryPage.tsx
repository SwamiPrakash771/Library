import { useOktaAuth } from "@okta/okta-react";
import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { HomePage } from "../HomePage/HomePage";
import { AddNewBook } from "./components/AddNewBook";
import { AdminMessages } from "./components/AdminMessages";
import { ChangeQuantityOfBooks } from "./components/ChangeQuantityOfBooks";

export const ManageLibraryPage = () => {
  const { authState } = useOktaAuth();

  const [changeQuantityOfBooksClick, setChangeQuantityOfBooksClick] =
    useState(false);
  const [messageClick, setMessageClick] = useState(false);

  function addBookClickFunction() {
    setChangeQuantityOfBooksClick(false);
    setMessageClick(false);
  }
  function changeQuantityOfBooksClickFunction() {
    setChangeQuantityOfBooksClick(true);
    setMessageClick(false);
  }
  function messagesClickFunction() {
    setChangeQuantityOfBooksClick(false);
    setMessageClick(true);
  }

  if (authState?.accessToken?.claims.userType === undefined) {
    return <Navigate to="/home" />;
  }

  return (
    <div className="container">
      <div className="mt-5">
        <h5>Manage Library:</h5>
        <nav>
          <div className="nav nav-tabs" id="nav-tab" role="tablist">
            <button
              onClick={addBookClickFunction}
              className="nav-link active"
              id="nav-add-book-tab"
              data-bs-toggle="tab"
              data-bs-target="#nav-add-book"
              type="button"
              role="tab"
              aria-controls="nav-add-book"
              aria-selected="false"
            >
              Add new book
            </button>
            <button
              onClick={changeQuantityOfBooksClickFunction}
              className="nav-link"
              id="nav-quantity-tab"
              data-bs-toggle="tab"
              data-bs-target="#nav-quantity"
              type="button"
              role="tab"
              aria-controls="nav-quantity"
              aria-selected="true"
            >
              Quantity
            </button>
            <button
              onClick={messagesClickFunction}
              className="nav-link"
              id="nav-message-tab"
              data-bs-toggle="tab"
              data-bs-target="#nav-message"
              type="button"
              role="tab"
              aria-controls="nav-message"
              aria-selected="false"
            >
              Messages
            </button>
          </div>
        </nav>
        <div className="tab-content" id="nav-tabContent">
          <div
            className="tab-pane fade show active"
            id="nav-add-book"
            role="tabpanel"
            aria-labelledby="nav-add-book-tab"
          >
            <AddNewBook />
          </div>
          <div
            className="tab-pane fade "
            id="nav-quantity"
            role="tabpanel"
            aria-labelledby="nav-quantity-tab"
          >
            {changeQuantityOfBooksClick ? (
              <div>
                <ChangeQuantityOfBooks />
              </div>
            ) : (
              <></>
            )}
          </div>
          <div
            className="tab-pane fade"
            id="nav-message"
            role="tabpanel"
            aria-labelledby="nav-messages-tab"
          >
            {messageClick ? (
              <div>
                <AdminMessages />
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
