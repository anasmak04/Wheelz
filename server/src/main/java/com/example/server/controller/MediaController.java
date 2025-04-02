package com.example.server.controller;

import com.example.server.domain.dto.MediaDto;
import com.example.server.domain.dto.MediaUploadResponseDto;
import com.example.server.service.MediaService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/media")
@RequiredArgsConstructor
public class MediaController {

    private final MediaService mediaService;

    @PostMapping("/upload")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<MediaUploadResponseDto> uploadFile(
            @RequestParam("file") MultipartFile file) {
        // In a real application, you would get the uploader ID from authenticated user
        MediaUploadResponseDto response = mediaService.uploadFile(file, 1L);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MediaDto> getMediaById(@PathVariable Long id) {
        MediaDto mediaDto = mediaService.getMediaById(id);
        return ResponseEntity.ok(mediaDto);
    }

    @GetMapping
    public ResponseEntity<Page<MediaDto>> getAllMedia(Pageable pageable) {
        Page<MediaDto> mediaPage = mediaService.getAllMedia(pageable);
        return ResponseEntity.ok(mediaPage);
    }

    @GetMapping("/user/{uploaderId}")
    public ResponseEntity<Page<MediaDto>> getMediaByUploader(
            @PathVariable Long uploaderId,
            Pageable pageable) {
        Page<MediaDto> mediaPage = mediaService.getMediaByUploader(uploaderId, pageable);
        return ResponseEntity.ok(mediaPage);
    }

    @PatchMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> updateMediaMetadata(
            @PathVariable Long id,
            @RequestParam(required = false) String altText,
            @RequestParam(required = false) String caption) {
        mediaService.updateMediaMetadata(id, altText, caption);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Void> deleteMedia(@PathVariable Long id) {
        mediaService.deleteMedia(id);
        return ResponseEntity.noContent().build();
    }
}