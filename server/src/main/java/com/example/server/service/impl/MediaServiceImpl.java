// src/main/java/com/example/server/service/impl/MediaServiceImpl.java
package com.example.server.service.impl;

import com.example.server.domain.dto.MediaDto;
import com.example.server.domain.dto.MediaUploadResponseDto;
import com.example.server.domain.entities.Media;
import com.example.server.domain.entities.User;
import com.example.server.domain.mapper.MediaMapper;
import com.example.server.exception.FileNotFoundException;
import com.example.server.repository.MediaRepository;
import com.example.server.repository.UserRepository;
import com.example.server.service.FileStorageService;
import com.example.server.service.MediaService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.util.Objects;

@Service
@RequiredArgsConstructor
public class MediaServiceImpl implements MediaService {

    private final MediaRepository mediaRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;
    private final MediaMapper mediaMapper;

    @Override
    @Transactional
    public MediaUploadResponseDto uploadFile(MultipartFile file, Long uploaderId) {
        User uploader = userRepository.findById(uploaderId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + uploaderId));

        String fileName = fileStorageService.storeFile(file);
        String originalFileName = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));

        Media media = new Media();
        media.setFileName(fileName);
        media.setOriginalFileName(originalFileName);
        media.setFilePath(fileStorageService.getFileUrl(fileName));
        media.setFileType(file.getContentType());
        media.setFileSize(file.getSize());
        media.setUploader(uploader);

        mediaRepository.save(media);

        return new MediaUploadResponseDto(
                fileName,
                originalFileName,
                file.getContentType(),
                file.getSize(),
                fileStorageService.getFileUrl(fileName)
        );
    }

    @Override
    @Transactional(readOnly = true)
    public MediaDto getMediaById(Long id) {
        Media media = mediaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Media not found with id: " + id));

        MediaDto mediaDto = mediaMapper.toDto(media);
        mediaDto.setUrl(fileStorageService.getFileUrl(media.getFileName()));

        return mediaDto;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<MediaDto> getAllMedia(Pageable pageable) {
        Page<Media> mediaPage = mediaRepository.findAll(pageable);
        return mediaPage.map(media -> {
            MediaDto dto = mediaMapper.toDto(media);
            dto.setUrl(fileStorageService.getFileUrl(media.getFileName()));
            return dto;
        });
    }

    @Override
    @Transactional(readOnly = true)
    public Page<MediaDto> getMediaByUploader(Long uploaderId, Pageable pageable) {
        User uploader = userRepository.findById(uploaderId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + uploaderId));

        Page<Media> mediaPage = mediaRepository.findByUploader(uploader, pageable);
        return mediaPage.map(media -> {
            MediaDto dto = mediaMapper.toDto(media);
            dto.setUrl(fileStorageService.getFileUrl(media.getFileName()));
            return dto;
        });
    }

    @Override
    @Transactional
    public void updateMediaMetadata(Long id, String altText, String caption) {
        Media media = mediaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Media not found with id: " + id));

        media.setAltText(altText);
        media.setCaption(caption);

        mediaRepository.save(media);
    }

    @Override
    @Transactional
    public void deleteMedia(Long id) {
        Media media = mediaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Media not found with id: " + id));

        try {
            fileStorageService.deleteFile(media.getFileName());
        } catch (FileNotFoundException e) {
            // File might be already deleted, continue with database cleanup
        }

        mediaRepository.delete(media);
    }
}