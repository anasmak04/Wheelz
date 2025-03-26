import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CategoryResponse } from '../../../@core/types/category-response';
import { CategoryService } from '../../../@core/services/admin/category/category.service';
import { CategoryRequest } from '../../../@core/types/category-request';
import { CategoryValidators } from '../../../@core/validators/category-validator';

@Component({
  selector: 'app-manage-categories',
  templateUrl: './manage-categories.component.html',
  styleUrls: ['./manage-categories.component.scss']
})
export class ManageCategoriesComponent implements OnInit {
  categoryForm!: FormGroup;
  categories: CategoryResponse[] = [];
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCategories();
  }

  initForm(): void {
    this.categoryForm = this.fb.group({
      name: ['', CategoryValidators.namee],
      slug: ['', CategoryValidators.slug],
      description: ['', CategoryValidators.description]
    });
  }

  loadCategories(): void {
    this.isLoading = true;
    this.categoryService.getAllCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.categoryForm.invalid) return;

    const category: CategoryRequest = this.categoryForm.value;
    this.categoryService.createCategory(category).subscribe({
      next: (createdCategory) => {
        this.categories.push(createdCategory);
        this.categoryForm.reset();
      }
    });
  }
}
