package com.sai.spring_boot_library.entity;

import jakarta.persistence.*;
import lombok.*;


@Entity
@Table(name = "book")

public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String author;
    private String description;
    private int copies;
    private int copiesAvailable;
    private String category;
    private String img;

    public void setId(Long id) {
        this.id = id;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setCopies(int copies) {
        this.copies = copies;
    }

    public void setCopiesAvailable(int copiesAvailable) {
        this.copiesAvailable = copiesAvailable;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public void setImg(String img) {
        this.img = img;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getAuthor() {
        return author;
    }

    public String getDescription() {
        return description;
    }

    public int getCopies() {
        return copies;
    }

    public int getCopiesAvailable() {
        return copiesAvailable;
    }

    public String getCategory() {
        return category;
    }

    public String getImg() {
        return img;
    }
}
