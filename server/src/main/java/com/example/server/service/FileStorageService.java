package com.example.server.service;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.util.stream.Stream;

public interface FileStorageService {
    String storeFile(MultipartFile file);

    Resource loadFileAsResource(String fileName);

    void deleteFile(String fileName);

    Stream<Path> loadAll();

    String getFileUrl(String fileName);
}