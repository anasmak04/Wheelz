import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

export class RegisterValidators {
  static getValidators() {
    return {
      username: [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        Validators.pattern(/^\S*$/)
      ],
      email: [
        Validators.required,
        Validators.email,
        Validators.maxLength(100)
      ],
      password: [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/)
      ],
      firstName: [
        Validators.maxLength(50)
      ],
      lastName: [
        Validators.maxLength(50)
      ]
    };
  }

  static passwordsMatch(passwordKey: string = 'password', confirmPasswordKey: string = 'confirmPassword'): ValidatorFn {
    return (form: AbstractControl): ValidationErrors | null => {
      const password = form.get(passwordKey)?.value;
      const confirmPassword = form.get(confirmPasswordKey)?.value;

      if (password !== confirmPassword) {
        const confirmControl = form.get(confirmPasswordKey);
        if (confirmControl) {
          confirmControl.setErrors({ ...confirmControl.errors, passwordsNotMatch: true });
        }
        return { passwordsNotMatch: true };
      }

      const confirmControl = form.get(confirmPasswordKey);
      if (confirmControl?.errors) {
        const { passwordsNotMatch, ...otherErrors } = confirmControl.errors;
        if (Object.keys(otherErrors).length === 0) {
          confirmControl.setErrors(null);
        } else {
          confirmControl.setErrors(otherErrors);
        }
      }

      return null;
    };
  }

  static emailAvailableAsync(authService: any): ValidatorFn {
    return (control: AbstractControl): Promise<ValidationErrors | null> => {
      return new Promise(resolve => {
        if (!control.value) {
          resolve(null);
          return;
        }

        setTimeout(() => {
          authService.checkEmailAvailability(control.value)
            .subscribe(
              (isAvailable: boolean) => {
                if (isAvailable) {
                  resolve(null);
                } else {
                  resolve({ emailTaken: true });
                }
              },
              () => {
                resolve(null);
              }
            );
        }, 300);
      });
    };
  }
}
