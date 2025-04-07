package com.sai.spring_boot_library.dao;

import com.sai.spring_boot_library.entity.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;


public interface BookRepository extends JpaRepository<Book, Long> {
    Page<Book> findByTitleContaining(@RequestParam("title") String title, Pageable pageable);

    Page<Book> findByCategory(@RequestParam("category") String category, Pageable pageable);

    Page<Book> findById(@RequestParam("id") long id, Pageable pageable);

    @Query("select o from Book o where o.id in :bookIds")
    List<Book> findBooksByBookIds (@Param("bookIds") List<Long> bookIds);
}
