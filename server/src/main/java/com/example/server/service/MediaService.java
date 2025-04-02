package com.example.server.service;

import com.example.server.domain.dto.MediaDto;
import com.example.server.domain.dto.MediaUploadResponseDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

public interface MediaService {
    MediaUploadResponseDto uploadFile(MultipartFile file, Long uploaderId);

    MediaDto getMediaById(Long id);

    Page<MediaDto> getAllMedia(Pageable pageable);

    Page<MediaDto> getMediaByUploader(Long uploaderId, Pageable pageable);

    void updateMediaMetadata(Long id, String altText, String caption);

    void deleteMedia(Long id);
}