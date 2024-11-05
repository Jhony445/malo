import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  passwordMatchError = false;
  successMessage = '';
  errorMessage = '';
  isPasswordChanged = false;

  fb = inject(FormBuilder);
  http = inject(HttpClient);
  router = inject(Router);

  constructor() {
    this.forgotPasswordForm = this.fb.group({
      token: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(5)]],
      confirmPassword: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.forgotPasswordForm.valid && !this.passwordMatchError) {
      const { token, newPassword } = this.forgotPasswordForm.value;

      this.http.post('https://malo-backend.onrender.com/api/Recuperacion/cambiar-contrasena', {
        token,
        nuevaContrasena: newPassword
      }).subscribe(
        () => {
          this.successMessage = 'La contraseña se ha cambiado correctamente.';
          this.isPasswordChanged = true;
          setTimeout(() => this.router.navigate(['/auth/login']), 10000);
        },
        (error: HttpErrorResponse) => {
          this.errorMessage = 'Hubo un error al cambiar la contraseña. Inténtelo de nuevo más tarde.';
        }
      );
    }
  }

  checkPasswordMatch() {
    const newPassword = this.forgotPasswordForm.get('newPassword')?.value;
    const confirmPassword = this.forgotPasswordForm.get('confirmPassword')?.value;
    this.passwordMatchError = newPassword !== confirmPassword;
  }
}
