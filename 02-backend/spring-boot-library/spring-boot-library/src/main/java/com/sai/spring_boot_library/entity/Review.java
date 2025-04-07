package com.sai.spring_boot_library.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.util.Date;

@Entity
@Getter
@Setter
@Table(name = "review")
public class Review {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_email")
    private String userEmail;

    @Column(name = "date")
    @CreationTimestamp
    private Date date;

    @Column(name = "rating")
    private double rating;

    @Column(name="book_id")
    private Long bookId;

    @Column(name = "review_Description")
    private String reviewDescription;

}
