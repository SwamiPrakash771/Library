class AddBookRequest {
  // private String title;
  // private int copies;
  // private String author;
  // private String description;
  // private String category;
  // private String img;

  title: string;
  copies: number;
  author: string;
  description: string;
  category: string;
  img: string;

  constructor(
    title: string,
    copies: number,
    author: string,
    description: string,
    category: string,
    img: string
  ) {
    this.author = author;
    this.copies = copies;
    this.title = title;
    this.description = description;
    this.category = category;
    this.img = img;
  }
}

export default AddBookRequest;
