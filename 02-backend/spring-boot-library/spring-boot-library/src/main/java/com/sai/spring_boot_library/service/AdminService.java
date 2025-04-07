package com.sai.spring_boot_library.service;

import com.sai.spring_boot_library.dao.BookRepository;
import com.sai.spring_boot_library.dao.CheckoutRepository;
import com.sai.spring_boot_library.dao.ReviewRepository;
import com.sai.spring_boot_library.entity.Book;
import com.sai.spring_boot_library.requestmodels.AddBookRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

import java.util.Optional;

@Service
@Transactional
public class AdminService {

    @Autowired
    public BookRepository bookRepository;

    @Autowired
    public ReviewRepository reviewRepository;

    @Autowired
    public CheckoutRepository checkoutRepository;




    public void postBook(AddBookRequest addBookRequest) {
        Book book = new Book();
        book.setTitle(addBookRequest.getTitle());
        book.setCopiesAvailable(addBookRequest.getCopies());
        book.setAuthor(addBookRequest.getAuthor());
        book.setCategory(addBookRequest.getCategory());
        book.setDescription(addBookRequest.getDescription());
        book.setImg(addBookRequest.getImg());
        book.setCopies(addBookRequest.getCopies());

        bookRepository.save(book);
    }



    public void increaseBookQuantity(Long bookId) throws Exception{
        Optional<Book> book = bookRepository.findById(bookId);

        if(!book.isPresent()){
            throw new Exception("Book not found");
        }

        book.get().setCopiesAvailable(book.get().getCopiesAvailable()+1);
        book.get().setCopies(book.get().getCopies()+1);

        bookRepository.save(book.get());
    }

    public void decreaseBookQuantity(Long bookId) throws Exception{
        Optional<Book> book = bookRepository.findById(bookId);

        if(!book.isPresent() || book.get().getCopiesAvailable()<1 || book.get().getCopies()<1){
            throw new Exception("Book not found");
        }

        book.get().setCopiesAvailable(book.get().getCopiesAvailable()-1);
        book.get().setCopies(book.get().getCopies()-1);

        bookRepository.save(book.get());
    }


    public void deleteBook(Long bookId) throws Exception{
        Optional<Book> book = bookRepository.findById(bookId);

        if(!book.isPresent() || book.get().getCopiesAvailable()<1 || book.get().getCopies()<1){
            throw new Exception("Book not found");
        }

        bookRepository.deleteById(bookId);
        checkoutRepository.deleteAllByBookId(bookId);
        reviewRepository.deleteAllByBookId(bookId);
    }



}
