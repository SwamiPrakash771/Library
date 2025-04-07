package com.sai.spring_boot_library.controller;

import com.sai.spring_boot_library.entity.Message;
import com.sai.spring_boot_library.requestmodels.AdminQuestionRequest;
import com.sai.spring_boot_library.service.MessagesService;
import com.sai.spring_boot_library.utils.ExtractJWT;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("https://localhost:3000")
@RestController
@RequestMapping("/api/messages")
public class MessagesController {

    @Autowired
    private MessagesService messagesService;


    @PostMapping("secure/add/message")
    public void postMessage(@RequestHeader("Authorization") String token,@RequestBody Message messageRequest){
        String userEmail= ExtractJWT.payLoadJWTExtraction(token,"\"sub\"");
        
        messagesService.postMessage(messageRequest, userEmail);
    }

    @PutMapping("secure/admin/message")
    public void putMessage(@RequestHeader(value="Authorization") String token, @RequestBody AdminQuestionRequest adminQuestionRequest) throws Exception{
        String userEmail = ExtractJWT.payLoadJWTExtraction(token, "\"sub\"");
        String admin = ExtractJWT.payLoadJWTExtraction(token, "\"userType\"");

        if(admin==null || !admin.equals(admin)){
            throw new Exception("Administration page only");
        }

        messagesService.putMessage(adminQuestionRequest, userEmail);
    }


}
