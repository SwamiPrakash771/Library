package com.sai.spring_boot_library.service;

import com.sai.spring_boot_library.dao.BookRepository;
import com.sai.spring_boot_library.dao.CheckoutRepository;
import com.sai.spring_boot_library.dao.HistoryRepository;
import com.sai.spring_boot_library.dao.PaymentRepository;
import com.sai.spring_boot_library.entity.Book;
import com.sai.spring_boot_library.entity.Checkout;
import com.sai.spring_boot_library.entity.History;
import com.sai.spring_boot_library.entity.Payment;
import com.sai.spring_boot_library.responsemodels.ShelfCurrentLoansResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

@Service
@Transactional
public class BookService {

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private CheckoutRepository checkoutRepository;

    @Autowired
    private HistoryRepository historyRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    public Book checkoutBook(String userEmail, Long bookId) throws Exception{

        Optional<Book> book = bookRepository.findById(bookId);

        Checkout validateCheckout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);

        if(!book.isPresent() || validateCheckout!=null || book.get().getCopiesAvailable()<=0){
            throw new Exception("Book doesn't exist or already checked out by user");
        }

        List<Checkout> currentBooksCheckedOut = checkoutRepository.findBooksByUserEmail(userEmail);
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        boolean bookNeedsReturned = false;

        for(Checkout checkout:currentBooksCheckedOut){
            Date d1 = sdf.parse(checkout.getReturnDate());
            Date d2 = sdf.parse(LocalDate.now().toString());

            TimeUnit time = TimeUnit.DAYS;

            double differenceTime = time.convert(d1.getTime()-d2.getTime(),TimeUnit.MILLISECONDS);

            if(differenceTime<0){
                bookNeedsReturned=true;
                break;
            }
        }

        Payment userPayment = paymentRepository.findByUserEmail(userEmail);
        if((userPayment!=null && userPayment.getAmount()>0) || (userPayment!=null && bookNeedsReturned)){
            throw new Exception("Outstanding fees");
        }

        if(userPayment==null){
            Payment payment =new Payment();
            payment.setAmount(00.00);
            payment.setUserEmail(userEmail);
            paymentRepository.save(payment);
        }
        book.get().setCopiesAvailable(book.get().getCopiesAvailable() - 1);
        bookRepository.save(book.get());

        Checkout checkout = new Checkout(userEmail, LocalDate.now().toString(),
                LocalDate.now().plusDays(7).toString(), book.get().getId());

        checkoutRepository.save(checkout);

        return book.get();


    }

    public int currentLoansCount(String userEmail){
        return checkoutRepository.findByUserEmail(userEmail).size();
    }


    public boolean checkoutBookByUser(String userEmail, Long bookId) {
        Checkout validateCheckout = checkoutRepository.findByUserEmailAndBookId(userEmail,bookId);

        return validateCheckout != null;
    }

    public List<ShelfCurrentLoansResponse> currentLoans(String userEmail) throws Exception{

        List<ShelfCurrentLoansResponse> shelfCurrentLoansResponses = new ArrayList<>();

        List<Checkout> checkoutList = checkoutRepository.findByUserEmail(userEmail);

        List<Long> bookIdList = new ArrayList<>();

        for(Checkout c:checkoutList){
            bookIdList.add(c.getBookId());
        }

        List<Book> books = bookRepository.findBooksByBookIds(bookIdList);

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

        for(Book book:books){
            Optional<Checkout> checkout = checkoutList.stream().filter(x -> x.getBookId()==book.getId()).findFirst();

            if(checkout.isPresent()){
                Date d1 = sdf.parse(checkout.get().getReturnDate());
                Date d2 = sdf.parse(LocalDate.now().toString());

                TimeUnit time = TimeUnit.DAYS;

                long difference_In_Time = time.convert(d1.getTime()-d2.getTime(), TimeUnit.MILLISECONDS);

                shelfCurrentLoansResponses.add(new ShelfCurrentLoansResponse(book, (int)difference_In_Time));
            }
        }

        return shelfCurrentLoansResponses;

    }

    public void returnBook(String userEmail, long bookId) throws Exception{
        Optional<Book> book = bookRepository.findById(bookId);

        Checkout validateCheckout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);

        if(!book.isPresent() || validateCheckout==null){
            throw new Exception("Book does not exist or not checked out by user");

        }

        book.get().setCopiesAvailable(book.get().getCopiesAvailable()+1);


        bookRepository.save(book.get());

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        Date d1 = sdf.parse(validateCheckout.getReturnDate());
        Date d2 = sdf.parse(LocalDate.now().toString());

        TimeUnit time = TimeUnit.DAYS;

        double differenceInTime = time.convert(d1.getTime()-d2.getTime(),TimeUnit.MILLISECONDS);

        if(differenceInTime<0){
            Payment payment = paymentRepository.findByUserEmail(userEmail);
            payment.setAmount(payment.getAmount()+ (differenceInTime * -1));
            paymentRepository.save(payment);
        }
        checkoutRepository.deleteById(validateCheckout.getId());

        String returnDate=LocalDate.now().toString();
        History history = new History(userEmail, validateCheckout.getCheckoutDate(), returnDate
                , book.get().getTitle(),book.get().getAuthor(), book.get().getDescription(), book.get().getImg());

        historyRepository.save(history);
    }

    public void renewLoan(String userEmail, Long bookId) throws Exception{
        Checkout validateCheckout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);

        if( validateCheckout==null){
            throw new Exception("Book does not exist or not checked out by user");
        }

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

        Date d1 =sdf.parse(validateCheckout.getReturnDate());
        Date d2 = sdf.parse(LocalDate.now().toString());

        if(d1.compareTo(d2)>=0){
            validateCheckout.setReturnDate(LocalDate.now().plusDays(7).toString());
            System.out.println(validateCheckout.getReturnDate());
            checkoutRepository.save(validateCheckout);
        }

    }
}
