import { Link } from "react-router-dom";
import BookModel from "../../models/BookModel";

export const SearchBook: React.FC<{ book: BookModel }> = (props) => {
  return (
    <div className="card my-3 shadow p-3 bg-body rounded">
      <div className="row ">
        <div className="d-none d-lg-block col-lg-2">
          {props.book.img ? (
            <img src={props.book.img} width="123" height="196" alt="book" />
          ) : (
            <img
              src={require("./../../Images/BooksImages/book-luv2code-1000.png")}
              width="151"
              height="233"
              alt="book"
            />
          )}
        </div>

        <div className="d-lg-none d-flex justify-content-center align-items-center">
          {props.book.img ? (
            <img src={props.book.img} width="123" height="196" alt="book" />
          ) : (
            <img
              src={require("./../../Images/BooksImages/book-luv2code-1000.png")}
              width="151"
              height="233"
              alt="book"
            />
          )}
        </div>

        <div className="col-md-6">
          <div className="card-body">
            <h4 className="card-title">{props.book.author}</h4>
            <h3>{props.book.title}</h3>
            <p className="cart-text">{props.book.description}</p>
          </div>
        </div>

        <div className="col-md-3  d-flex justify-content-center align-items-center">
          <Link
            to={`/checkout/${props.book.id}`}
            className="btn btn-primary"
            type="button"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};
