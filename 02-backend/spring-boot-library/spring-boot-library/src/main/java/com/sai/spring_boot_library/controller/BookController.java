package com.sai.spring_boot_library.controller;

import com.sai.spring_boot_library.entity.Book;
import com.sai.spring_boot_library.responsemodels.ShelfCurrentLoansResponse;
import com.sai.spring_boot_library.service.BookService;
import com.sai.spring_boot_library.utils.ExtractJWT;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("https://localhost:3000")
@RequestMapping("/api/books")
public class BookController {
    @Autowired
    private BookService bookService;

//    private ExtractJWT extractJWT;


    @GetMapping("/secure/currentloans")
    public List<ShelfCurrentLoansResponse> currentLoans(@RequestHeader(value = "Authorization") String token) throws Exception {
        String userEmail = ExtractJWT.payLoadJWTExtraction(token, "\"sub\"");
        return bookService.currentLoans(userEmail);
    }


    @GetMapping("/secure/currentloans/count")
    public int currentLoansCount(@RequestHeader(value = "Authorization") String token){
//        String userEmail="ay.p.ztm.pcov.dz.ylq.kd@gmail.com";

        String userEmail = ExtractJWT.payLoadJWTExtraction(token,  "\"sub\"");
        return bookService.currentLoansCount(userEmail);
    }

    @GetMapping("/secure/ischeckedout/byuser")
    public boolean checkoutBookByUser(@RequestHeader(value = "Authorization") String token, @RequestParam Long bookId){
        String userEmail = ExtractJWT.payLoadJWTExtraction(token, "\"sub\"");

        return bookService.checkoutBookByUser(userEmail,bookId);
    }


    @PutMapping("/secure/checkout")
    public Book checkoutBook(@RequestHeader(value = "Authorization") String token, @RequestParam Long bookId) throws Exception{
        String userEmail = ExtractJWT.payLoadJWTExtraction(token, "\"sub\"");


        return bookService.checkoutBook(userEmail, bookId);
    }


    @PutMapping("/secure/return")
    public void returnBook(@RequestHeader(value = "Authorization") String token, @RequestParam long bookId) throws Exception{
        String userEmail = ExtractJWT.payLoadJWTExtraction(token, "\"sub\"");

        bookService.returnBook(userEmail, bookId);

    }

    @PutMapping("/secure/renew/loan")
    public void returnLoan(@RequestHeader(value = "Authorization") String token, @RequestParam long bookId) throws Exception{
        String userEmail = ExtractJWT.payLoadJWTExtraction(token, "\"sub\"");

        bookService.renewLoan(userEmail, bookId);

    }


}
