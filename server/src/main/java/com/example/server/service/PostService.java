// src/main/java/com/example/server/service/PostService.java
package com.example.server.service;

import com.example.server.domain.dto.PostCreateDto;
import com.example.server.domain.dto.PostDto;
import com.example.server.domain.dto.PostUpdateDto;
import com.example.server.domain.dto.TagDto;
import com.example.server.domain.enums.PostStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Set;

public interface PostService {
    PostDto createPost(PostCreateDto createDto, Long authorId);

    PostDto getPostById(Long id);

    PostDto getPostBySlug(String slug);

    Page<PostDto> getAllPosts(Pageable pageable);

    Page<PostDto> getPublishedPosts(Pageable pageable);

    Page<PostDto> getPostsByAuthor(Long authorId, Pageable pageable);

    Page<PostDto> searchPosts(String keyword, Pageable pageable);

    PostDto updatePost(Long id, PostUpdateDto updateDto);

    PostDto updatePostStatus(Long id, PostStatus status);

    void deletePost(Long id);

    TagDto addTagToPost(Long postId, Long tagId);
    TagDto removeTagFromPost(Long postId, Long tagId);
    Set<TagDto> getPostTags(Long postId);

    void setFeaturedImage(Long postId, Long mediaId);

}