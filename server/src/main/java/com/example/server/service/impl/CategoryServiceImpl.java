package com.example.server.service.impl;

import com.example.server.domain.dto.CategoryCreateDto;
import com.example.server.domain.dto.CategoryDto;
import com.example.server.domain.entities.Category;
import com.example.server.domain.entities.Post;
import com.example.server.domain.mapper.CategoryMapper;
import com.example.server.repository.CategoryRepository;
import com.example.server.repository.PostRepository;
import com.example.server.service.CategoryService;
import com.github.slugify.Slugify;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final PostRepository postRepository;
    private final CategoryMapper categoryMapper;
    private final Slugify slugify;

    @Override
    @Transactional
    public CategoryDto createCategory(CategoryCreateDto createDto) {
        Category category = categoryMapper.toEntity(createDto);

        String baseSlug = slugify.slugify(createDto.getName());
        String slug = baseSlug;
        int count = 1;
        while (categoryRepository.existsBySlug(slug)) {
            slug = baseSlug + "-" + count;
            count++;
        }
        category.setSlug(slug);

        Category savedCategory = categoryRepository.save(category);
        return categoryMapper.toDto(savedCategory);
    }

    @Override
    @Transactional(readOnly = true)
    public CategoryDto getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Category not found with id: " + id));
        return categoryMapper.toDto(category);
    }

    @Override
    @Transactional(readOnly = true)
    public CategoryDto getCategoryBySlug(String slug) {
        Category category = categoryRepository.findBySlug(slug)
                .orElseThrow(() -> new EntityNotFoundException("Category not found with slug: " + slug));
        return categoryMapper.toDto(category);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryDto> getAllCategories() {
        List<Category> categories = categoryRepository.findAll();
        return categories.stream()
                .map(categoryMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CategoryDto updateCategory(Long id, CategoryCreateDto updateDto) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Category not found with id: " + id));

        if (!updateDto.getName().equals(category.getName())) {
            String baseSlug = slugify.slugify(updateDto.getName());
            String slug = baseSlug;
            int count = 1;
            while (categoryRepository.existsBySlug(slug) && !slug.equals(category.getSlug())) {
                slug = baseSlug + "-" + count;
                count++;
            }
            category.setSlug(slug);
        }

        category.setName(updateDto.getName());
        category.setDescription(updateDto.getDescription());

        Category updatedCategory = categoryRepository.save(category);
        return categoryMapper.toDto(updatedCategory);
    }

    @Override
    @Transactional
    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Category not found with id: " + id));
        categoryRepository.delete(category);
    }

    @Override
    @Transactional
    public CategoryDto addPostToCategory(Long categoryId, Long postId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new EntityNotFoundException("Category not found with id: " + categoryId));

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new EntityNotFoundException("Post not found with id: " + postId));

        post.getCategories().add(category);
        postRepository.save(post);

        return categoryMapper.toDto(category);
    }

    @Override
    @Transactional
    public CategoryDto removePostFromCategory(Long categoryId, Long postId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new EntityNotFoundException("Category not found with id: " + categoryId));

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new EntityNotFoundException("Post not found with id: " + postId));

        post.getCategories().remove(category);
        postRepository.save(post);

        return categoryMapper.toDto(category);
    }
}
