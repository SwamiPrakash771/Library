package com.sai.spring_boot_library.entity;

//import com.fasterxml.jackson.annotation.JsonProperty;
//import jakarta.persistence.*;
//import lombok.Data;
//import lombok.Getter;
//import lombok.Setter;
//
//@Entity
//@Table(name = "messages")
//@Getter
//@Setter
//@Data
//public class Message {
//
//    public Message(){
//
//    }
//
//    public Message(String title, String question){
//        this.title=title;
//        this.question=question;
//    }
//    @Id
//    @Column(name = "id")
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    @Column(name = "user_email")
//    private String userEmail;
//
//    @Column(name = "title")
//    private String title;
//
//    @Column(name="question")
//    private String question;
//
//    @Column(name = "admin_email")
//    private String adminEmail;
//
//    @Column(name="response")
//    private String response;
//
//    @Column(name = "closed")
//    private boolean closed;
//
//}



import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "messages")
@Data
@Getter
@Setter

public class Message {

    public Message(){}

    public Message(String title, String question) {
        this.title = title;
        this.question = question;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    @JsonProperty("id")
    private Long id;

    @Column(name="user_email")
    private String userEmail;

    @Column(name="title")
    private String title;

    @Column(name="question")
    private String question;

    @Column(name="admin_email")
    private String adminEmail;

    @Column(name="response")
    private String response;

    @Column(name="closed")
    private boolean closed;

    public Long getId() {
        return id;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public String getTitle() {
        return title;
    }

    public String getQuestion() {
        return question;
    }

    public String getAdminEmail() {
        return adminEmail;
    }

    public String getResponse() {
        return response;
    }

    public boolean isClosed() {
        return closed;
    }
}
