package com.example.server.repository;

import com.example.server.domain.entities.Post;
import com.example.server.domain.entities.User;
import com.example.server.domain.enums.PostStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    Optional<Post> findBySlug(String slug);

    Page<Post> findByStatus(PostStatus status, Pageable pageable);

    Page<Post> findByAuthor(User author, Pageable pageable);

    Page<Post> findByAuthorAndStatus(User author, PostStatus status, Pageable pageable);

    @Query("SELECT p FROM Post p WHERE p.title LIKE %:keyword% OR p.content LIKE %:keyword%")
    Page<Post> searchByKeyword(String keyword, Pageable pageable);

    @Query("SELECT p FROM Post p WHERE (p.title LIKE %:keyword% OR p.content LIKE %:keyword%) AND p.status = :status")
    Page<Post> searchByKeywordAndStatus(String keyword, PostStatus status, Pageable pageable);

    boolean existsBySlug(String slug);
}