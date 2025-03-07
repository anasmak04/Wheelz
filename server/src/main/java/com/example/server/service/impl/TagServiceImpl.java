package com.example.server.service.impl;

import com.example.server.domain.dto.TagCreateDto;
import com.example.server.domain.dto.TagDto;
import com.example.server.domain.entities.Post;
import com.example.server.domain.entities.Tag;
import com.example.server.domain.mapper.TagMapper;
import com.example.server.repository.PostRepository;
import com.example.server.repository.TagRepository;
import com.example.server.service.TagService;
import com.github.slugify.Slugify;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TagServiceImpl implements TagService {

    private final TagRepository tagRepository;
    private final PostRepository postRepository;
    private final TagMapper tagMapper;
    private final Slugify slugify;

    @Override
    @Transactional
    public TagDto createTag(TagCreateDto createDto) {
        if (tagRepository.existsByName(createDto.getName())) {
            throw new IllegalArgumentException("Tag with name '" + createDto.getName() + "' already exists");
        }

        Tag tag = tagMapper.toEntity(createDto);

        String slug = slugify.slugify(createDto.getName());

        String baseSlug = slug;
        int count = 1;
        while (tagRepository.existsBySlug(slug)) {
            slug = baseSlug + "-" + count;
            count++;
        }

        tag.setSlug(slug);
        Tag savedTag = tagRepository.save(tag);
        return tagMapper.toDto(savedTag);
    }

    @Override
    @Transactional(readOnly = true)
    public TagDto getTagById(Long id) {
        Tag tag = tagRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Tag not found with id: " + id));
        return tagMapper.toDto(tag);
    }

    @Override
    @Transactional(readOnly = true)
    public TagDto getTagBySlug(String slug) {
        Tag tag = tagRepository.findBySlug(slug)
                .orElseThrow(() -> new EntityNotFoundException("Tag not found with slug: " + slug));
        return tagMapper.toDto(tag);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TagDto> getAllTags() {
        List<Tag> tags = tagRepository.findAll();
        return tags.stream()
                .map(tagMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public TagDto updateTag(Long id, TagCreateDto updateDto) {
        Tag tag = tagRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Tag not found with id: " + id));

        if (!tag.getName().equals(updateDto.getName()) && tagRepository.existsByName(updateDto.getName())) {
            throw new IllegalArgumentException("Tag with name '" + updateDto.getName() + "' already exists");
        }

        tag.setName(updateDto.getName());

        if (!tag.getName().equals(updateDto.getName())) {
            String slug = slugify.slugify(updateDto.getName());

            String baseSlug = slug;
            int count = 1;
            while (tagRepository.existsBySlug(slug) && !slug.equals(tag.getSlug())) {
                slug = baseSlug + "-" + count;
                count++;
            }

            tag.setSlug(slug);
        }

        Tag updatedTag = tagRepository.save(tag);
        return tagMapper.toDto(updatedTag);
    }

    @Override
    @Transactional
    public void deleteTag(Long id) {
        if (!tagRepository.existsById(id)) {
            throw new EntityNotFoundException("Tag not found with id: " + id);
        }
        tagRepository.deleteById(id);
    }

    @Override
    @Transactional
    public TagDto addPostToTag(Long tagId, Long postId) {
        Tag tag = tagRepository.findById(tagId)
                .orElseThrow(() -> new EntityNotFoundException("Tag not found with id: " + tagId));

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new EntityNotFoundException("Post not found with id: " + postId));

        post.getTags().add(tag);
        postRepository.save(post);

        return tagMapper.toDto(tag);
    }

    @Override
    @Transactional
    public TagDto removePostFromTag(Long tagId, Long postId) {
        Tag tag = tagRepository.findById(tagId)
                .orElseThrow(() -> new EntityNotFoundException("Tag not found with id: " + tagId));

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new EntityNotFoundException("Post not found with id: " + postId));

        post.getTags().remove(tag);
        postRepository.save(post);

        return tagMapper.toDto(tag);
    }
}