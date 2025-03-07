package com.example.server.service;

import com.example.server.domain.dto.TagCreateDto;
import com.example.server.domain.dto.TagDto;

import java.util.List;

public interface TagService {
    TagDto createTag(TagCreateDto createDto);

    TagDto getTagById(Long id);

    TagDto getTagBySlug(String slug);

    List<TagDto> getAllTags();

    TagDto updateTag(Long id, TagCreateDto updateDto);

    void deleteTag(Long id);

    TagDto addPostToTag(Long tagId, Long postId);

    TagDto removePostFromTag(Long tagId, Long postId);
}