import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import {AuthService} from "../../@core/services/auth/auth.service";
import {RegisterValidators} from "../../@core/validators";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  loading = false;
  submitted = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    if (this.authService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    const validators = RegisterValidators.getValidators();

    this.registerForm = this.formBuilder.group({
      username: ['', validators.username],
      email: ['', validators.email],
      password: ['', validators.password],
      confirmPassword: ['', Validators.required],
      firstName: ['', validators.firstName],
      lastName: ['', validators.lastName],
      agreeTerms: [false, Validators.requiredTrue]
    }, {
      validators: RegisterValidators.passwordsMatch()
    });


  }

  get f() { return this.registerForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    this.authService.register({
      username: this.f['username'].value,
      email: this.f['email'].value,
      password: this.f['password'].value,
      firstName: this.f['firstName'].value,
      lastName: this.f['lastName'].value
    })
      .pipe(first())
      .subscribe({
        next: () => {
          this.successMessage = 'Registration successful! Redirecting to login...';
          setTimeout(() => {
            this.router.navigate(['/login'], { queryParams: { registered: 'success' } });
          }, 2000);
        },
        error: (error: { error: { message: string; }; }) => {
          this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
          this.loading = false;
        }
      });
  }

  hasError(controlName: string, errorName: string): boolean {
    return this.submitted && this.registerForm.get(controlName)?.hasError(errorName) || false;
  }
}
