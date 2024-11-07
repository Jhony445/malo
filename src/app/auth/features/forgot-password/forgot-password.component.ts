import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../../../shared/ui/loader/loader.component';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, LoaderComponent],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  passwordMatchError = false;
  successMessage = '';
  errorMessage = '';
  isPasswordChanged = false;
  isLoading = false;
  tokenFromUrl: string | null = null; // Nueva variable para almacenar el token de la URL

  fb = inject(FormBuilder);
  http = inject(HttpClient);
  router = inject(Router);
  route = inject(ActivatedRoute);

  constructor() {
    this.forgotPasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Captura el token de la URL
    this.tokenFromUrl = this.route.snapshot.queryParamMap.get('token');
    console.log('Token from URL:', this.tokenFromUrl);
  }

  onSubmit() {
    this.isLoading = true;
    if (this.forgotPasswordForm.valid && !this.passwordMatchError && this.tokenFromUrl) {
      const { newPassword } = this.forgotPasswordForm.value;
      const url = `https://malo-backend.onrender.com/api/Recuperacion/cambiar-contrasena/${this.tokenFromUrl}`;

      this.http.post(url, {
        token: this.tokenFromUrl, // Envía el token también en el cuerpo de la solicitud
        nuevaContrasena: newPassword
      }).subscribe(
        () => {
          this.successMessage = 'La contraseña se ha cambiado correctamente.';
          this.isPasswordChanged = true;
          this.isLoading = false;
          setTimeout(() => this.router.navigate(['/auth/login']), 10000);
        },
        (error) => {
          this.isLoading = false;
          this.errorMessage = 'Hubo un error al cambiar la contraseña. Inténtelo de nuevo más tarde.';
          console.log('Error al cambiar la contraseña:', error); // Registro del error en consola
        }
      );
    } else {
      this.isLoading = false;
      this.errorMessage = 'No se encontró un token válido en la URL.';
    }
  }

  checkPasswordMatch() {
    const newPassword = this.forgotPasswordForm.get('newPassword')?.value;
    const confirmPassword = this.forgotPasswordForm.get('confirmPassword')?.value;
    this.passwordMatchError = newPassword !== confirmPassword;
  }
}

