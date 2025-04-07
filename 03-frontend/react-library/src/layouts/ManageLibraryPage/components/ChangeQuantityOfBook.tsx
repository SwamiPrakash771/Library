import { useOktaAuth } from "@okta/okta-react";
import { useEffect, useState } from "react";
import BookModel from "../../../models/BookModel";

export const ChangeQuantityOfBook: React.FC<{
  book: BookModel;
  deleteBook: any;
}> = (props) => {
  const { authState } = useOktaAuth();
  const [quantity, setQuantity] = useState(0);
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    const fetchBookInState = async () => {
      props.book.copies ? setQuantity(props.book.copies) : setQuantity(0);
      props.book.copiesAvailable
        ? setRemaining(props.book.copiesAvailable)
        : setRemaining(0);
    };

    fetchBookInState();
  }, [props.book]);

  async function increaseQuantity() {
    const url = `${process.env.REACT_APP_API}/admin/secure/increase/book/quantity?bookId=${props?.book.id}`;

    const requestOptions = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
        "Content-Type": "application/json",
      },
    };

    const quantityUpdateResponse = await fetch(url, requestOptions);

    if (!quantityUpdateResponse.ok) {
      throw new Error("Something went wrong");
    }

    setQuantity(quantity + 1);
    setRemaining(remaining + 1);
  }

  async function decreaseQuantity() {
    const url = `${process.env.REACT_APP_API}/admin/secure/decrease/book/quantity?bookId=${props?.book.id}`;

    const requestOptions = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
        "Content-Type": "application/json",
      },
    };

    const quantityUpdateResponse = await fetch(url, requestOptions);

    if (!quantityUpdateResponse.ok) {
      throw new Error("Something went wrong");
    }

    setQuantity(quantity - 1);
    setRemaining(remaining - 1);
  }

  async function deleteBook() {
    const url = `${process.env.REACT_APP_API}/admin/secure/delete/book?bookId=${props?.book.id}`;

    const requestOptions = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
        "Content-Type": "application/json",
      },
    };

    const deleteResponse = await fetch(url, requestOptions);

    if (!deleteResponse.ok) {
      throw new Error("Something went wrong");
    }

    props.deleteBook();
  }
  return (
    <div className="card mt-3 shadow p-3 mb-3 bg-body rounded">
      <div className="row g-0">
        <div className="col-md-2">
          <div className="d-none d-lg-block">
            {props.book.img ? (
              <img src={props.book.img} width="90" height="135" alt="Book" />
            ) : (
              <img
                src={require("./../../../Images/BooksImages/book-luv2code-1000.png")}
                width="90"
                height="135"
                alt="Book"
              ></img>
            )}
          </div>
          <div className="d-lg-none d-flex justify-content-center align-items-center">
            {props.book.img ? (
              <img src={props.book.img} width="90" height="135" alt="Book" />
            ) : (
              <img
                src={require("./../../../Images/BooksImages/book-luv2code-1000.png")}
                width="90"
                height="135"
                alt="Book"
              ></img>
            )}
          </div>
        </div>
        <div className="col-md-6">
          <div className="card-body">
            <div className="card-title">
              <h5>{props.book.author}</h5>
              <h4>{props.book.title}</h4>
              <p>{props.book.description}</p>
            </div>
          </div>
        </div>

        <div className="mt-3 col-md-4">
          <div className="d-flex justify-content-center align-items-center">
            <p>
              Total Qauntity: <b>{quantity}</b>
            </p>
          </div>
          <div className="d-flex justify-content-center align-items-center">
            <p>
              Books Remaining: <b>{remaining}</b>
            </p>
          </div>
        </div>
        <div className="mt-3 col-md-1">
          <div className="d-flex justify-content-start">
            <button className="m-1 btn btn-md btn-danger" onClick={deleteBook}>
              Delete
            </button>
          </div>
        </div>

        <button
          className="m-1 btn btn-md main-color text-white"
          onClick={() => increaseQuantity()}
        >
          Add Quantity
        </button>
        <button
          className="m-1 btn btn-md btn-warning"
          onClick={decreaseQuantity}
        >
          Decrease Quantity
        </button>
      </div>
    </div>
  );
};
