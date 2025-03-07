package com.example.server.controller;

import com.example.server.domain.dto.TagCreateDto;
import com.example.server.domain.dto.TagDto;
import com.example.server.service.TagService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tags")
@RequiredArgsConstructor
public class TagController {

    private final TagService tagService;

    @PostMapping
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_AUTHOR')")
    public ResponseEntity<TagDto> createTag(@Valid @RequestBody TagCreateDto createDto) {
        TagDto tagDto = tagService.createTag(createDto);
        return new ResponseEntity<>(tagDto, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TagDto> getTagById(@PathVariable Long id) {
        TagDto tagDto = tagService.getTagById(id);
        return ResponseEntity.ok(tagDto);
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<TagDto> getTagBySlug(@PathVariable String slug) {
        TagDto tagDto = tagService.getTagBySlug(slug);
        return ResponseEntity.ok(tagDto);
    }

    @GetMapping
    public ResponseEntity<List<TagDto>> getAllTags() {
        List<TagDto> tags = tagService.getAllTags();
        return ResponseEntity.ok(tags);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_AUTHOR')")
    public ResponseEntity<TagDto> updateTag(@PathVariable Long id, @Valid @RequestBody TagCreateDto updateDto) {
        TagDto updatedTag = tagService.updateTag(id, updateDto);
        return ResponseEntity.ok(updatedTag);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Void> deleteTag(@PathVariable Long id) {
        tagService.deleteTag(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{tagId}/posts/{postId}")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_AUTHOR')")
    public ResponseEntity<TagDto> addPostToTag(@PathVariable Long tagId, @PathVariable Long postId) {
        TagDto tagDto = tagService.addPostToTag(tagId, postId);
        return ResponseEntity.ok(tagDto);
    }

    @DeleteMapping("/{tagId}/posts/{postId}")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_AUTHOR')")
    public ResponseEntity<TagDto> removePostFromTag(@PathVariable Long tagId, @PathVariable Long postId) {
        TagDto tagDto = tagService.removePostFromTag(tagId, postId);
        return ResponseEntity.ok(tagDto);
    }
}