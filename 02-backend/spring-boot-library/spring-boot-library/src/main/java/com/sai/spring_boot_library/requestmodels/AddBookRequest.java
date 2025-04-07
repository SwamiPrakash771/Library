package com.sai.spring_boot_library.requestmodels;

import lombok.Data;

@Data
public class AddBookRequest {
    private String title;
    private int copies;
    private String author;
    private String description;
    private String category;
    private String img;
}
