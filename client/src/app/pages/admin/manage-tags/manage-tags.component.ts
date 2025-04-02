import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TagsResponse } from "../../../@core/types/tags-response";
import { TagsService } from "../../../@core/services/admin/tag/tags.service";
import { TagRequest } from "../../../@core/types/tag-request";
import { MessageService, ConfirmationService } from 'primeng/api';
import { Table } from "primeng/table";

@Component({
  selector: 'app-manage-tags',
  templateUrl: './manage-tags.component.html',
  styleUrls: ['./manage-tags.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class ManageTagsComponent implements OnInit {
  tagForm!: FormGroup;
  tags: TagsResponse[] = [];
  isLoading = false;
  formVisible = false;
  @ViewChild('dt') dt: Table | undefined;
  editMode = false;
  selectedTag: TagsResponse | null = null;

  constructor(
    private fb: FormBuilder,
    private tagsService: TagsService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadTags();
  }

  initForm(tag?: TagsResponse): void {
    this.tagForm = this.fb.group({
      id: [tag?.id || null],
      name: [tag?.name || '', Validators.required]
    });
  }

  onSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.dt?.filterGlobal(target.value, 'contains');
  }

  loadTags(): void {
    this.isLoading = true;
    this.tagsService.getAllTags().subscribe({
      next: (data) => {
        this.tags = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading tags:', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load tags' });
        this.isLoading = false;
      }
    });
  }

  openNew(): void {
    this.editMode = false;
    this.selectedTag = null;
    this.initForm();
    this.formVisible = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  editTag(tag: TagsResponse): void {
    this.editMode = true;
    this.selectedTag = { ...tag };
    this.initForm(tag);
    this.formVisible = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  deleteTag(tag: TagsResponse): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete the tag "${tag.name}"?`,
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.tagsService.deleteTag(tag.id).subscribe({
          next: () => {
            this.tags = this.tags.filter(t => t.id !== tag.id);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Tag deleted' });
          },
          error: (err) => {
            console.error('Error deleting tag:', err);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete tag' });
          }
        });
      }
    });
  }

  cancelForm(): void {
    this.formVisible = false;
    this.editMode = false;
    this.selectedTag = null;
  }

  saveTag(): void {
    if (this.tagForm.invalid) {
      // Mark all fields as touched to display validation errors
      Object.keys(this.tagForm.controls).forEach(key => {
        this.tagForm.get(key)?.markAsTouched();
      });
      return;
    }

    const tagData: TagRequest = this.tagForm.value;

    if (this.editMode && this.selectedTag) {
      this.tagsService.updateTag(this.selectedTag.id, tagData).subscribe({
        next: (updatedTag) => {
          const index = this.tags.findIndex(t => t.id === updatedTag.id);
          if (index !== -1) {
            this.tags[index] = updatedTag;
          }
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Tag updated' });
          this.formVisible = false;
          this.editMode = false;
          this.selectedTag = null;
        },
        error: (err) => {
          console.error('Error updating tag:', err);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update tag' });
        }
      });
    } else {
      this.tagsService.createTag(tagData).subscribe({
        next: (createdTag) => {
          this.tags.push(createdTag);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Tag created' });
          this.formVisible = false;
        },
        error: (err) => {
          console.error('Error creating tag:', err);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create tag' });
        }
      });
    }
  }

  getTagColor(tag: TagsResponse): string {
    // Generate a consistent color based on the tag name
    const hash = tag.name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const colors = ['success', 'info', 'warning', 'danger', 'primary', 'secondary'];
    return colors[hash % colors.length];
  }
}
