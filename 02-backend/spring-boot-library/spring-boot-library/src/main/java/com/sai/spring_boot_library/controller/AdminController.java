package com.sai.spring_boot_library.controller;

import com.sai.spring_boot_library.requestmodels.AddBookRequest;
import com.sai.spring_boot_library.service.AdminService;
import com.sai.spring_boot_library.utils.ExtractJWT;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("https://localhost:3000")
@RestController
@RequestMapping("api/admin")
public class AdminController {

    @Autowired
    public AdminService adminService;

    @PostMapping("secure/add/book")
    public void postBook(@RequestHeader(value = "Authorization") String token, @RequestBody AddBookRequest addBookRequest) throws Exception{
        String admin = ExtractJWT.payLoadJWTExtraction(token, "\"userType\"");

        if(admin==null || !admin.equals("admin")){
            throw new Exception("Administration Page only");
        }

        adminService.postBook(addBookRequest);
    }

    @PutMapping("secure/increase/book/quantity")
    public void increaseBookQuantity(@RequestHeader(value="Authorization") String token, @RequestParam Long bookId) throws Exception{
        String admin= ExtractJWT.payLoadJWTExtraction(token,"\"userType\"");

        if(admin==null || !admin.equals("admin")){
            throw new Exception("Administration Page only");
        }

        adminService.increaseBookQuantity(bookId);
    }

    @PutMapping("secure/decrease/book/quantity")
    public void decreaseBookQuantity(@RequestHeader(value="Authorization") String token,@RequestParam Long bookId) throws Exception{
        String admin= ExtractJWT.payLoadJWTExtraction(token,"\"userType\"");

        if(admin==null || !admin.equals("admin")){
            throw new Exception("Administration Page only");
        }

        adminService.decreaseBookQuantity(bookId);
    }


    @DeleteMapping("secure/delete/book")
    public void deleteBook(@RequestHeader(value="Authorization") String token,@RequestParam Long bookId) throws Exception{
        String admin= ExtractJWT.payLoadJWTExtraction(token,"\"userType\"");

        if(admin==null || !admin.equals("admin")){
            throw new Exception("Administration Page only");
        }

        adminService.deleteBook(bookId);
    }




}
