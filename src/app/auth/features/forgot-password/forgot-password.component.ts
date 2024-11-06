import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router'; // Importa ActivatedRoute
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  passwordMatchError = false;
  successMessage = '';
  errorMessage = '';
  isPasswordChanged = false;

  fb = inject(FormBuilder);
  http = inject(HttpClient);
  router = inject(Router);
  route = inject(ActivatedRoute); // Inyecta ActivatedRoute

  constructor() {
    this.forgotPasswordForm = this.fb.group({
      token: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(5)]],
      confirmPassword: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Captura el parámetro 'token' de la URL
    const token = this.route.snapshot.queryParamMap.get('token');
    console.log('Token:', token); // Muestra el token en la consola
    this.forgotPasswordForm.patchValue({ token }); // Asigna el valor del token al formulario
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
        () => {
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
