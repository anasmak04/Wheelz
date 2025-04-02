package com.example.server.domain.dto;

import com.example.server.domain.enums.PostStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PostUpdateDto {
    private String title;
    private String content;
    private String excerpt;
    private String featuredImage;
    private PostStatus status;
}