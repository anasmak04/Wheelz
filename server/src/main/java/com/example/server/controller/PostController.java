package com.example.server.controller;

import com.example.server.domain.dto.PostCreateDto;
import com.example.server.domain.dto.PostDto;
import com.example.server.domain.dto.PostUpdateDto;
import com.example.server.domain.dto.TagDto;
import com.example.server.domain.enums.PostStatus;
import com.example.server.service.PostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @PostMapping
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_AUTHOR')")
    public ResponseEntity<PostDto> createPost(@Valid @RequestBody PostCreateDto createDto) {
        PostDto postDto = postService.createPost(createDto, 1L);
        return new ResponseEntity<>(postDto, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostDto> getPostById(@PathVariable Long id) {
        PostDto postDto = postService.getPostById(id);
        return ResponseEntity.ok(postDto);
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<PostDto> getPostBySlug(@PathVariable String slug) {
        PostDto postDto = postService.getPostBySlug(slug);
        return ResponseEntity.ok(postDto);
    }

    @GetMapping
    public ResponseEntity<Page<PostDto>> getAllPosts(Pageable pageable) {
        Page<PostDto> posts = postService.getAllPosts(pageable);
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/published")
    public ResponseEntity<Page<PostDto>> getPublishedPosts(Pageable pageable) {
        Page<PostDto> posts = postService.getPublishedPosts(pageable);
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/author/{authorId}")
    public ResponseEntity<Page<PostDto>> getPostsByAuthor(@PathVariable Long authorId, Pageable pageable) {
        Page<PostDto> posts = postService.getPostsByAuthor(authorId, pageable);
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/search")
    public ResponseEntity<Page<PostDto>> searchPosts(@RequestParam String keyword, Pageable pageable) {
        Page<PostDto> posts = postService.searchPosts(keyword, pageable);
        return ResponseEntity.ok(posts);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_AUTHOR')")
    public ResponseEntity<PostDto> updatePost(@PathVariable Long id, @Valid @RequestBody PostUpdateDto updateDto) {
        PostDto updatedPost = postService.updatePost(id, updateDto);
        return ResponseEntity.ok(updatedPost);
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_AUTHOR')")
    public ResponseEntity<PostDto> updatePostStatus(@PathVariable Long id, @RequestParam PostStatus status) {
        PostDto updatedPost = postService.updatePostStatus(id, status);
        return ResponseEntity.ok(updatedPost);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_AUTHOR')")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        postService.deletePost(id);
        return ResponseEntity.noContent().build();
    }


    @GetMapping("/{postId}/tags")
    public ResponseEntity<Set<TagDto>> getPostTags(@PathVariable Long postId) {
        Set<TagDto> tags = postService.getPostTags(postId);
        return ResponseEntity.ok(tags);
    }

    @PutMapping("/{postId}/tags/{tagId}")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_AUTHOR')")
    public ResponseEntity<TagDto> addTagToPost(@PathVariable Long postId, @PathVariable Long tagId) {
        TagDto tagDto = postService.addTagToPost(postId, tagId);
        return ResponseEntity.ok(tagDto);
    }

    @DeleteMapping("/{postId}/tags/{tagId}")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_AUTHOR')")
    public ResponseEntity<TagDto> removeTagFromPost(@PathVariable Long postId, @PathVariable Long tagId) {
        TagDto tagDto = postService.removeTagFromPost(postId, tagId);
        return ResponseEntity.ok(tagDto);
    }

    @PatchMapping("/{postId}/featured-image/{mediaId}")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_AUTHOR')")
    public ResponseEntity<Void> setFeaturedImage(
            @PathVariable Long postId,
            @PathVariable Long mediaId) {
        postService.setFeaturedImage(postId, mediaId);
        return ResponseEntity.ok().build();
    }
}