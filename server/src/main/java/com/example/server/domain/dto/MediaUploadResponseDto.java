package com.example.server.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MediaUploadResponseDto {
    private String fileName;
    private String originalFileName;
    private String fileType;
    private long size;
    private String url;
}