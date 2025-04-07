import { useOktaAuth } from "@okta/okta-react";
import { useState } from "react";
import AddBookRequest from "../../../models/AddBookRequest";

export const AddNewBook = () => {
  const { authState } = useOktaAuth();

  //Book
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [copies, setCopies] = useState(0);
  const [category, setCategory] = useState("Category");
  const [selectedImage, setSelectedImage] = useState<any>(null);

  //display warning
  const [displayWarning, setDisplayWarning] = useState(false);
  const [displaySuccess, setDisplaySuccess] = useState(false);

  function categoryField(value: any) {
    setCategory(value);
  }

  async function base64ConversionForImages(e: any) {
    if (e.target.files[0]) {
      getBase64(e.target.files[0]);
    }
  }

  function getBase64(file: any) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      setSelectedImage(reader.result);
      console.log(reader.result);
    };
    reader.onerror = function (error) {
      console.log("Error", error);
    };
  }

  async function submitNewBook() {
    const url = `${process.env.REACT_APP_API}/admin/secure/add/book`;
    if (
      authState &&
      authState.isAuthenticated &&
      title !== "" &&
      author !== "" &&
      description !== "" &&
      copies >= 0 &&
      category !== "Category"
    ) {
      const book: AddBookRequest = new AddBookRequest(
        title,
        copies,
        author,
        description,
        category,
        selectedImage
      );
      const requestOptions = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authState.accessToken?.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(book),
      };

      const submitNewBookResponse = await fetch(url, requestOptions);
      if (!submitNewBookResponse.ok) {
        throw new Error("Something went wrong");
      }
      setTitle("");
      setAuthor("");
      setCategory("Category");
      setCopies(0);
      setSelectedImage(null);
      setDescription("");
      setDisplaySuccess(true);
      setDisplayWarning(false);
    } else {
      setDisplaySuccess(false);
      setDisplayWarning(true);
    }
  }

  return (
    <div className="container mt-5 mb-5">
      {displaySuccess && (
        <div className="alert alert-success" role="alert">
          Book added successfully
        </div>
      )}
      {displayWarning && (
        <div className="alert alert-danger" role="alert">
          All fields must be filled out
        </div>
      )}
      <div className="card">
        <div className="card-header">Add new book:</div>
        <div className="card-body">
          <form method="POST">
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Title</label>
                <input
                  className="form-control"
                  type="text"
                  name="title"
                  required
                  onChange={(e) => setTitle(e.target.value)}
                  value={title}
                ></input>
              </div>
              <div className="col-md-3 mb-3">
                <label className="form-label">Author</label>
                <input
                  className="form-control"
                  type="text"
                  name="author"
                  required
                  onChange={(e) => setAuthor(e.target.value)}
                  value={author}
                ></input>
              </div>
              <div className="col-md-3 mb-3">
                <label className="form-label">Category</label>
                <button
                  className="form-control btn btn-secondary dropdown-toggle"
                  type="button"
                  id="dropdownMenuButton1"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {category}
                </button>
                <ul
                  id="addNewBookId"
                  className="dropdown-menu"
                  aria-labelledby="dropdownMenuButton1"
                >
                  <li>
                    <a
                      onClick={() => categoryField("FE")}
                      className="dropdown-item"
                    >
                      Front End
                    </a>
                  </li>
                  <li>
                    <a
                      onClick={() => categoryField("BE")}
                      className="dropdown-item"
                    >
                      Back End
                    </a>
                  </li>
                  <li>
                    <a
                      onClick={() => categoryField("Data")}
                      className="dropdown-item"
                    >
                      Data
                    </a>
                  </li>
                  <li>
                    <a
                      onClick={() => categoryField("DevOps")}
                      className="dropdown-item"
                    >
                      DevOps
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-md-12 mb-3">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                id="exampleFormControlTextarea1"
                rows={3}
                onChange={(e) => setDescription(e.target.value)}
                value={description}
              ></textarea>
            </div>
            <div className="col-md-3 mb-3">
              <label className="form-label">Copies</label>
              <input
                type="number"
                className="form-control"
                name="Copies"
                onChange={(e) => setCopies(Number(e.target.value))}
                value={copies}
                required
              ></input>
            </div>
            <input
              type="file"
              onChange={(e) => base64ConversionForImages(e)}
            ></input>
            <div>
              <button
                type="button"
                className="btn btn-primary mt-3"
                onClick={submitNewBook}
              >
                Add Book
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
