import { useOktaAuth } from "@okta/okta-react";
import { useEffect, useState } from "react";
import BookModel from "../../models/BookModel";
import ReviewModel from "../../models/ReviewModel";
import ReviewRequestModel from "../../models/ReviewRequestModel";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { StarsReview } from "../Utils/StarsReview";
import { CheckoutAndReviewBox } from "./CheckoutAndReviewBox";
import { LatestReview } from "./LatestReview";

export const BookCheckoutPage: React.FC<{}> = (props) => {
  const { authState } = useOktaAuth();
  const [book, setBook] = useState<BookModel>();
  const [isLoadingBook, setIsLoadingBook] = useState(true);
  const [httpError, setHttpError] = useState(null);

  // Review
  const [reviews, setReview] = useState<ReviewModel[]>([]);
  const [totalStars, setTotalStars] = useState(0);
  const [isLoadingReview, setIsLoadingReview] = useState(true);

  // Loans Account Page
  const [currentLoansCount, setCurrentLoansCount] = useState(0);
  const [isLoadingCurrentLoansCount, setIsLoadingCurrentLoansAccount] =
    useState(true);

  //
  const [isReviewLeft, setIsReviewLeft] = useState(false);
  const [isLoadingUserReview, setIsLoadingUserReview] = useState(true);
  // is bookcheckedout
  const [isCheckedOut, setIsCheckedOut] = useState(false);
  const [isLoadingBookCheckedOut, setIsLoadingBookCheckedOut] = useState(true);

  // Payment
  const [displayError, setDisplayError] = useState(false);

  const bookId = window.location.pathname.split("/")[2];

  useEffect(() => {
    const fetchBooks = async () => {
      const url = `${process.env.REACT_APP_API}/books/${bookId}`;

      const response = await fetch(url);
      const responseJson = await response.json();

      console.log(responseJson);
      const loadedBook: BookModel = {
        id: responseJson.id,
        title: responseJson.title,
        author: responseJson.author,
        description: responseJson.description,
        copies: responseJson.copies,
        copiesAvailable: responseJson.copiesAvailable,
        category: responseJson.category,
        img: responseJson.img,
      };

      setBook(loadedBook);
      setIsLoadingBook(false);
    };

    fetchBooks().catch((error: any) => {
      setIsLoadingBook(false);
      setHttpError(error.message);
    });
  }, [isCheckedOut]);

  useEffect(() => {
    const fetchBookReviews = async () => {
      const url = `${process.env.REACT_APP_API}/reviews/search/findByBookId?bookId=${bookId}`;
      const response = await fetch(url);
      const responseJson = await response.json();
      const responseData = responseJson._embedded.reviews;

      const loadedReviews: ReviewModel[] = [];

      let weightedStarReview: number = 0;
      for (const key in responseData) {
        loadedReviews.push({
          id: responseData[key].id,
          userEmail: responseData[key].userEmail,
          date: responseData[key].date,
          rating: responseData[key].rating,
          book_id: responseData[key].book_id,
          reviewDescription: responseData[key].reviewDescription,
        });

        weightedStarReview += responseData[key].rating;
      }

      if (loadedReviews) {
        const round = (
          Math.round((weightedStarReview / loadedReviews.length) * 2) / 2
        ).toFixed(1);
        setTotalStars(Number(round));
      }

      setReview(loadedReviews);
      setIsLoadingReview(false);
    };

    fetchBookReviews().catch((error: any) => {
      setIsLoadingBook(false);
      setHttpError(error.message);
    });
  }, [isReviewLeft]);

  useEffect(() => {
    const fetchUserReviewBook = async () => {
      if (authState && authState.isAuthenticated) {
        const url = `${process.env.REACT_APP_API}/reviews/secure/user/book?bookId=${bookId}`;

        const requestOptions = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authState.accessToken?.accessToken}`,
            "Content-Type": "application/json",
          },
        };

        const userReview = await fetch(url, requestOptions);

        if (!userReview.ok) {
          throw new Error("Something went Wrong");
        }
        const userReviewResponseJson = await userReview.json();
        setIsReviewLeft(userReviewResponseJson);
      }
      setIsLoadingUserReview(false);
    };

    fetchUserReviewBook().catch((error: any) => {
      setIsLoadingUserReview(false);
      setHttpError(error.message);
    });
  }, [authState]);

  useEffect(() => {
    const fetchUserCurrentLoanCount = async () => {
      if (authState && authState.isAuthenticated) {
        const url = `${process.env.REACT_APP_API}/books/secure/currentloans/count`;

        const requestOptions = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authState.accessToken?.accessToken}`,
            "Content-Type": "application/json",
          },
        };
        // console.log();
        const currentLoansCountResponse = await fetch(url, requestOptions);
        if (!currentLoansCountResponse.ok) {
          throw new Error("something went wrong!");
        }
        const currentLoansCountResponseJson =
          await currentLoansCountResponse.json();
        setCurrentLoansCount(currentLoansCountResponseJson);

        setIsLoadingCurrentLoansAccount(false);
      }
    };
    fetchUserCurrentLoanCount().catch((error: any) => {
      setIsLoadingCurrentLoansAccount(false);
      setHttpError(error.message);
    });
  }, [authState, checkoutBook]);

  useEffect(() => {
    const fetchUserCheckedOutBook = async () => {
      if (authState && authState.accessToken) {
        const url = `${process.env.REACT_APP_API}/books/secure/ischeckedout/byuser?bookId=${bookId}`;

        const requestOptions = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authState.accessToken?.accessToken}`,
            "Content-Type": "application/json",
          },
        };

        const responseCheckedOut = await fetch(url, requestOptions);
        if (!responseCheckedOut.ok) {
          throw new Error("something went wrong!");
        }

        const responseCheckedOutJson = await responseCheckedOut.json();
        // setIsCheckedOut(responseCheckedOutJson);
        setIsCheckedOut(responseCheckedOutJson);
        // isCheckedOut, setIsCheckedOut;
      }

      console.log(isCheckedOut);
    };
    fetchUserCheckedOutBook().catch((error: any) => {
      setIsLoadingBookCheckedOut(false);
      setHttpError(error.message);
    });
  }, [authState]);

  if (isLoadingBook || isLoadingReview || isLoadingCurrentLoansCount) {
    return <SpinnerLoading />;
  }

  if (httpError) {
    return (
      <div className="container m-5">
        <p>{httpError}</p>
      </div>
    );
  }

  async function checkoutBook() {
    const url = `${process.env.REACT_APP_API}/books/secure/checkout?bookId=${book?.id}`;
    const requestOptions = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
        "Content-Type": "application/json",
      },
    };
    const checkoutResponse = await fetch(url, requestOptions);
    if (!checkoutResponse.ok) {
      setDisplayError(true);
      // throw new Error("Something went wrong");
      return;
    }
    setDisplayError(false);
    setIsCheckedOut(true);
  }

  async function submitReview(starInput: number, reviewDescription: string) {
    console.log("hello");
    let bookId: number = 0;
    if (book?.id) {
      bookId = book.id;
    }

    const reviewRequestModel = new ReviewRequestModel(
      starInput,
      bookId,
      reviewDescription
    );
    const url = `${process.env.REACT_APP_API}/reviews/secure`;
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reviewRequestModel),
    };

    const returnResponse = await fetch(url, requestOptions);
    if (!returnResponse.ok) {
      throw new Error("Something went wrong!");
    }
    setIsReviewLeft(true);
  }

  return (
    <div>
      <div className="container d-none d-lg-block">
        {displayError && (
          <div className="alert alert-danger mt-3 d-block" role="alert">
            Plese pay outstanding fees and/or return late book(s).
          </div>
        )}
        <div className="row mt-5">
          <div className="col-sm-2 col-md-2">
            {book?.img !== null ? (
              <img src={book?.img} height="200" width={130} />
            ) : (
              <img
                src={require("./../../Images/BooksImages/book-luv2code-1000.png")}
                height="200"
                width="130"
              />
            )}
          </div>
          <div className="col col-md-5">
            <div className="ml-2">
              <h4>{book?.title}</h4>
              <h5 className="text-primary">{book?.author}</h5>
              <p>{book?.description}</p>
              <StarsReview rating={totalStars} size={32} />
            </div>
          </div>
          <CheckoutAndReviewBox
            book={book}
            mobile={false}
            currentLoansCount={currentLoansCount}
            isAuthenticated={authState?.accessToken?.accessToken}
            isCheckedOut={isCheckedOut}
            isReviewLeft={isReviewLeft}
            submitReview={submitReview}
            checkoutBook={checkoutBook}
          />
        </div>
        <hr />

        <LatestReview
          reviews={reviews}
          mobile={false}
          bookId={book?.id}
        ></LatestReview>
      </div>
      <div className="container d-lg-none mt-5">
        {displayError && (
          <div className="alert alert-danger mt-3 d-block" role="alert">
            Plese pay outstanding fees and/or return late book(s).
          </div>
        )}
        <div className="d-flex justify-content-center align-items-center">
          {book?.img !== null ? (
            <img src={book?.img} height="200" width={130} />
          ) : (
            <img
              src={require("./../../Images/BooksImages/book-luv2code-1000.png")}
              height="200"
              width="130"
            />
          )}
        </div>
        <div className="mt-4">
          <div className="ml-2">
            <h4>{book?.title}</h4>
            <h5 className="text-primary">{book?.author}</h5>
            <p>{book?.description}</p>
            <StarsReview rating={totalStars} size={32} />
          </div>
        </div>
        <CheckoutAndReviewBox
          book={book}
          mobile={true}
          currentLoansCount={currentLoansCount}
          isAuthenticated={authState?.accessToken?.accessToken}
          isCheckedOut={isCheckedOut}
          isReviewLeft={isReviewLeft}
          submitReview={submitReview}
          checkoutBook={checkoutBook}
        />
        <hr />
        <LatestReview
          reviews={reviews}
          mobile={true}
          bookId={book?.id}
        ></LatestReview>
      </div>
    </div>
  );
};
