package com.example.server.service.impl;

import com.example.server.domain.dto.PostCreateDto;
import com.example.server.domain.dto.PostDto;
import com.example.server.domain.dto.PostUpdateDto;
import com.example.server.domain.dto.TagDto;
import com.example.server.domain.entities.Media;
import com.example.server.domain.entities.Post;
import com.example.server.domain.entities.Tag;
import com.example.server.domain.entities.User;
import com.example.server.domain.enums.PostStatus;
import com.example.server.domain.mapper.PostMapper;
import com.example.server.domain.mapper.TagMapper;
import com.example.server.repository.MediaRepository;
import com.example.server.repository.PostRepository;
import com.example.server.repository.TagRepository;
import com.example.server.repository.UserRepository;
import com.example.server.service.PostService;
import com.example.server.service.TagService;
import com.github.slugify.Slugify;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostServiceImpl implements PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final PostMapper postMapper;
    private final TagRepository tagRepository;
    private final TagMapper tagMapper;
    private final MediaRepository mediaRepository;
    private final Slugify slugify;

    @Override
    @Transactional
    public PostDto createPost(PostCreateDto createDto, Long authorId) {
        User author = userRepository.findById(authorId)
                .orElseThrow(() -> new EntityNotFoundException("Author not found with id: " + authorId));

        Post post = postMapper.toEntity(createDto, author);

        String baseSlug = slugify.slugify(createDto.getTitle());
        String slug = baseSlug;

        int count = 1;
        while (postRepository.existsBySlug(slug)) {
            slug = baseSlug + "-" + count;
            count++;
        }

        post.setSlug(slug);

        Post savedPost = postRepository.save(post);
        return postMapper.toDto(savedPost);
    }

    @Override
    @Transactional(readOnly = true)
    public PostDto getPostById(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Post not found with id: " + id));
        return postMapper.toDto(post);
    }

    @Override
    @Transactional(readOnly = true)
    public PostDto getPostBySlug(String slug) {
        Post post = postRepository.findBySlug(slug)
                .orElseThrow(() -> new EntityNotFoundException("Post not found with slug: " + slug));
        return postMapper.toDto(post);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PostDto> getAllPosts(Pageable pageable) {
        Page<Post> posts = postRepository.findAll(pageable);
        return posts.map(postMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PostDto> getPublishedPosts(Pageable pageable) {
        Page<Post> posts = postRepository.findByStatus(PostStatus.PUBLISHED, pageable);
        return posts.map(postMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PostDto> getPostsByAuthor(Long authorId, Pageable pageable) {
        User author = userRepository.findById(authorId)
                .orElseThrow(() -> new EntityNotFoundException("Author not found with id: " + authorId));

        Page<Post> posts = postRepository.findByAuthor(author, pageable);
        return posts.map(postMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PostDto> searchPosts(String keyword, Pageable pageable) {
        Page<Post> posts = postRepository.searchByKeyword(keyword, pageable);
        return posts.map(postMapper::toDto);
    }

    @Override
    @Transactional
    public PostDto updatePost(Long id, PostUpdateDto updateDto) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Post not found with id: " + id));

        if (updateDto.getTitle() != null && !updateDto.getTitle().equals(post.getTitle())) {
            String baseSlug = slugify.slugify(updateDto.getTitle());
            String slug = baseSlug;

            int count = 1;
            while (postRepository.existsBySlug(slug) && !slug.equals(post.getSlug())) {
                slug = baseSlug + "-" + count;
                count++;
            }

            post.setSlug(slug);
        }

        postMapper.updatePostFromDto(updateDto, post);
        Post updatedPost = postRepository.save(post);
        return postMapper.toDto(updatedPost);
    }

    @Override
    @Transactional
    public PostDto updatePostStatus(Long id, PostStatus status) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Post not found with id: " + id));

        post.setStatus(status);

        if (status == PostStatus.PUBLISHED && post.getPublishedAt() == null) {
            post.setPublishedAt(java.time.LocalDateTime.now());
        }

        Post updatedPost = postRepository.save(post);
        return postMapper.toDto(updatedPost);
    }

    @Override
    @Transactional
    public void deletePost(Long id) {
        if (!postRepository.existsById(id)) {
            throw new EntityNotFoundException("Post not found with id: " + id);
        }
        postRepository.deleteById(id);
    }



    @Override
    @Transactional
    public TagDto addTagToPost(Long postId, Long tagId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new EntityNotFoundException("Post not found with id: " + postId));

        Tag tag = tagRepository.findById(tagId)
                .orElseThrow(() -> new EntityNotFoundException("Tag not found with id: " + tagId));

        post.getTags().add(tag);
        postRepository.save(post);

        return tagMapper.toDto(tag);
    }

    @Override
    @Transactional
    public TagDto removeTagFromPost(Long postId, Long tagId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new EntityNotFoundException("Post not found with id: " + postId));

        Tag tag = tagRepository.findById(tagId)
                .orElseThrow(() -> new EntityNotFoundException("Tag not found with id: " + tagId));

        post.getTags().remove(tag);
        postRepository.save(post);

        return tagMapper.toDto(tag);
    }

    @Override
    @Transactional(readOnly = true)
    public Set<TagDto> getPostTags(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new EntityNotFoundException("Post not found with id: " + postId));

        return post.getTags().stream()
                .map(tagMapper::toDto)
                .collect(Collectors.toSet());
    }

    @Override
    @Transactional
    public void setFeaturedImage(Long postId, Long mediaId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new EntityNotFoundException("Post not found with id: " + postId));

        Media media = mediaRepository.findById(mediaId)
                .orElseThrow(() -> new EntityNotFoundException("Media not found with id: " + mediaId));

        post.setFeaturedImage(media.getFilePath());
        postRepository.save(post);
    }
}