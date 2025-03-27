import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CategoryResponse } from '../../../@core/types/category-response';
import { CategoryService } from '../../../@core/services/admin/category/category.service';
import { CategoryRequest } from '../../../@core/types/category-request';
import { CategoryValidators } from '../../../@core/validators/category-validator';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Table } from "primeng/table";

@Component({
  selector: 'app-manage-categories',
  templateUrl: './manage-categories.component.html',
  styleUrls: ['./manage-categories.component.scss']
})
export class ManageCategoriesComponent implements OnInit {
  categoryForm!: FormGroup;
  categories: CategoryResponse[] = [];
  isLoading = false;
  formVisible = false;
  @ViewChild('dt') dt: Table | undefined;
  editMode = false;
  selectedCategory: CategoryResponse | null = null;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCategories();
  }

  initForm(category?: CategoryResponse): void {
    this.categoryForm = this.fb.group({
      id: [category?.id || null],
      name: [category?.name || '', CategoryValidators.namee],
      slug: [category?.slug || '', CategoryValidators.slug],
      description: [category?.description || '', CategoryValidators.description]
    });
  }

  onSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.dt?.filterGlobal(target.value, 'contains');
  }

  loadCategories(): void {
    this.isLoading = true;
    this.categoryService.getAllCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading categories:', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load categories' });
        this.isLoading = false;
      }
    });
  }

  openNew(): void {
    this.editMode = false;
    this.selectedCategory = null;
    this.initForm();
    this.formVisible = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  editCategory(category: CategoryResponse): void {
    this.editMode = true;
    this.selectedCategory = { ...category };
    this.initForm(category);
    this.formVisible = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  deleteCategory(category: CategoryResponse): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete the category "${category.name}"?`,
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.categoryService.deleteCategory(category.id).subscribe({
          next: () => {
            this.categories = this.categories.filter(c => c.id !== category.id);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Category deleted' });
          },
          error: (err) => {
            console.error('Error deleting category:', err);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete category' });
          }
        });
      }
    });
  }

  cancelForm(): void {
    this.formVisible = false;
    this.editMode = false;
    this.selectedCategory = null;
  }

  saveCategory(): void {
    if (this.categoryForm.invalid) {
      // Mark all fields as touched to display validation errors
      Object.keys(this.categoryForm.controls).forEach(key => {
        this.categoryForm.get(key)?.markAsTouched();
      });
      return;
    }

    const categoryData: CategoryRequest = this.categoryForm.value;

    if (this.editMode && this.selectedCategory) {
      this.categoryService.updateCategory(this.selectedCategory.id, categoryData).subscribe({
        next: (updatedCategory) => {
          const index = this.categories.findIndex(c => c.id === updatedCategory.id);
          if (index !== -1) {
            this.categories[index] = updatedCategory;
          }
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Category updated' });
          this.formVisible = false;
          this.editMode = false;
          this.selectedCategory = null;
        },
        error: (err) => {
          console.error('Error updating category:', err);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update category' });
        }
      });
    } else {
      this.categoryService.createCategory(categoryData).subscribe({
        next: (createdCategory) => {
          this.categories.push(createdCategory);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Category created' });
          this.formVisible = false;
        },
        error: (err) => {
          console.error('Error creating category:', err);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create category' });
        }
      });
    }
  }

  getSeverity(category: CategoryResponse): string {
    return 'success';
  }
}
