import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthService } from '../../@core/services/auth/auth.service';
import { LoginValidators } from '../../@core/validators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string = '/';
  errorMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    if (this.authService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    const validators = LoginValidators.getValidators();

    this.loginForm = this.formBuilder.group({
      username: ['', validators.username],
      password: ['', validators.password]
    }, {
      validators: LoginValidators.validateLoginForm()
    });

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    const registered = this.route.snapshot.queryParams['registered'];
    if (registered === 'success') {
      this.errorMessage = 'Registration successful! Please log in.';
    }
  }

  get f() { return this.loginForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';

    // Stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authService.login({
      username: this.f['username'].value,
      password: this.f['password'].value
    })
      .pipe(first())
      .subscribe({
        next: () => {
          this.router.navigateByUrl(this.returnUrl);
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Login failed. Please check your credentials.';
          this.loading = false;
        }
      });
  }

  hasError(controlName: string, errorName: string): boolean {
    return this.submitted && this.loginForm.get(controlName)?.hasError(errorName) || false;
  }
}
