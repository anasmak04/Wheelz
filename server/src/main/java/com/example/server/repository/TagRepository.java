package com.example.server.repository;

import com.example.server.domain.entities.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TagRepository extends JpaRepository<Tag, Long> {
    Optional<Tag> findByName(String name);

    Optional<Tag> findBySlug(String slug);

    boolean existsByName(String name);

    boolean existsBySlug(String slug);
}