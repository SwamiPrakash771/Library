package com.sai.spring_boot_library.controller;

import com.sai.spring_boot_library.requestmodels.PaymentInfoRequest;
import com.sai.spring_boot_library.service.PaymentService;
import com.sai.spring_boot_library.utils.ExtractJWT;
import com.stripe.model.PaymentIntent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("https://localhost:3000")
@RequestMapping("api/payment/secure")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("payment-intent")
    public ResponseEntity<String> createPaymentIntent(@RequestBody PaymentInfoRequest paymentInfoRequest) throws Exception{

        PaymentIntent paymentIntent = paymentService.createPaymentIntent(paymentInfoRequest);
        String paymentStr = paymentIntent.toJson();

        return new ResponseEntity<>(paymentStr, HttpStatus.OK);
    }

    @PutMapping("payment-complete")
    public ResponseEntity<String> stripePaymentComplete(@RequestHeader(value = "Authorization") String token) throws Exception{
        String userEmail = ExtractJWT.payLoadJWTExtraction(token, "\"sub\"");
        if(userEmail==null){
            throw new Exception("User email is missing");
        }

        return paymentService.stripePayment(userEmail);

    }
}
