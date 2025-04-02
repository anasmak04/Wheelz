import { Validators } from '@angular/forms';

export class CategoryValidators {
  static namee = [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(100),
    Validators.pattern(/^[a-zA-Z0-9\s\-]+$/)
  ];

  static slug = [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(100),
    Validators.pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  ];

  static description = [
    Validators.maxLength(255)
  ];
}
