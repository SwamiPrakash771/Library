import { Link } from "react-router-dom";
import ReviewModel from "../../models/ReviewModel";
import { Review } from "../Utils/Review";

export const LatestReview: React.FC<{
  reviews: ReviewModel[];
  bookId: number | undefined;
  mobile: boolean;
}> = (props) => {
  return (
    <div className={props.mobile ? "mt-3" : "row mt-5"}>
      <div className={props.mobile ? "" : "col-sm-2 col-md-2"}>
        <h2>latest Reviews:</h2>
      </div>
      <div className="col-sm-10 col-md-10">
        {props.reviews.length > 0 ? (
          <>
            {props.reviews.slice(0, 3).map((eachReview: ReviewModel) => (
              <Review review={eachReview} key={eachReview.id} />
            ))}

            <hr />
            <div className="m-3">
              <Link
                type="button"
                to={`/reviewlist/${props.bookId}`}
                className="btn main-color btn-md text-white"
              >
                Reach all reviews
              </Link>
            </div>
          </>
        ) : (
          <div className="m-3">
            <p>Currently there are no reviews for this book</p>
          </div>
        )}
      </div>
    </div>
  );
};
