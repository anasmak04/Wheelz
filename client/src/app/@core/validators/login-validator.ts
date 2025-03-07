
import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

export class LoginValidators {
  static getValidators() {
    return {
      username: [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)
      ],
      password: [
        Validators.required,
        Validators.minLength(6)
      ]
    };
  }

  static validateLoginForm(): ValidatorFn {
    return (form: AbstractControl): ValidationErrors | null => {
      const username = form.get('username')?.value;
      const password = form.get('password')?.value;

      if (!username && !password) {
        return { bothFieldsEmpty: true };
      }

      return null;
    };
  }
}
