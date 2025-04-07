package com.sai.spring_boot_library.controller;

import com.sai.spring_boot_library.requestmodels.ReviewRequest;
import com.sai.spring_boot_library.service.ReviewService;
import com.sai.spring_boot_library.utils.ExtractJWT;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin("https://localhost:3000")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @GetMapping("secure/user/book")
    public boolean reviewBookByUser(@RequestHeader("Authorization") String token, @RequestParam Long bookId) throws Exception {
        String userEmail = ExtractJWT.payLoadJWTExtraction(token,"\"sub\"");

        if(userEmail==null){
            throw new Exception("User email is missing");
        }

        return reviewService.userReviewListed(userEmail, bookId);
    }


        @PostMapping("secure")
    public void postReview(@RequestHeader("Authorization") String token, @RequestBody ReviewRequest reviewRequest) throws Exception {
        String userEmail = ExtractJWT.payLoadJWTExtraction(token,"\"sub\"");

        if(userEmail==null){
            throw new Exception("User email is missing");
        }
        reviewService.postReview(userEmail,reviewRequest);

    }
}
