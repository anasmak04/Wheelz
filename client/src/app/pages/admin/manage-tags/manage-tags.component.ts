import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {TagsResponse} from "../../../@core/types/tags-response";
import {TagsService} from "../../../@core/services/admin/tag/tags.service";
import {TagRequest} from "../../../@core/types/tag-request";


@Component({
  selector: 'app-manage-tags',
  templateUrl: './manage-tags.component.html',
  styleUrls: ['./manage-tags.component.scss']
})
export class ManageTagsComponent implements OnInit {
  tagForm!: FormGroup;
  tags: TagsResponse[] = [];
  isEditing = false;
  editingTagId: number | null = null;

  constructor(private fb: FormBuilder, private tagsService: TagsService) {}

  ngOnInit(): void {
    this.initForm();
    this.loadTags();
  }

  initForm(): void {
    this.tagForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  loadTags(): void {
    this.tagsService.getAllTags().subscribe({
      next: (data) => this.tags = data,
      error: (err) => console.error('Failed to load tags', err)
    });
  }

  submit(): void {
    if (this.tagForm.invalid) return;

    const tag: TagRequest = this.tagForm.value;

    if (this.isEditing && this.editingTagId !== null) {
      this.tagsService.updateTag(this.editingTagId, tag).subscribe({
        next: () => {
          this.resetForm();
          this.loadTags();
        },
        error: (err) => console.error('Update failed', err)
      });
    } else {
      this.tagsService.createTag(tag).subscribe({
        next: () => {
          this.resetForm();
          this.loadTags();
        },
        error: (err) => console.error('Create failed', err)
      });
    }
  }

  edit(tag: TagsResponse): void {
    this.isEditing = true;
    this.editingTagId = tag.id;
    this.tagForm.patchValue({ name: tag.name });
  }

  delete(id: number): void {
    if (confirm('Are you sure you want to delete this tag?')) {
      this.tagsService.deleteTag(id).subscribe({
        next: () => this.loadTags(),
        error: (err) => console.error('Delete failed', err)
      });
    }
  }

  resetForm(): void {
    this.isEditing = false;
    this.editingTagId = null;
    this.tagForm.reset();
  }
}
