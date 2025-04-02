package com.example.server.service;

import com.example.server.domain.dto.CategoryCreateDto;
import com.example.server.domain.dto.CategoryDto;
import java.util.List;

public interface CategoryService {
    CategoryDto createCategory(CategoryCreateDto createDto);
    CategoryDto getCategoryById(Long id);
    CategoryDto getCategoryBySlug(String slug);
    List<CategoryDto> getAllCategories();
    CategoryDto updateCategory(Long id, CategoryCreateDto updateDto);
    void deleteCategory(Long id);
    CategoryDto addPostToCategory(Long categoryId, Long postId);
    CategoryDto removePostFromCategory(Long categoryId, Long postId);
}
