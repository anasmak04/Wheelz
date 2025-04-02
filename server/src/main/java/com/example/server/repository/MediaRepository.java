package com.example.server.repository;

import com.example.server.domain.entities.Media;
import com.example.server.domain.entities.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MediaRepository extends JpaRepository<Media, Long> {
    Page<Media> findByUploader(User uploader, Pageable pageable);

    boolean existsByFileName(String fileName);
}