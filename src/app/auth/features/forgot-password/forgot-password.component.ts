import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule , ValidatorFn,AbstractControl,ValidationErrors} from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../../../shared/ui/loader/loader.component';
import { NotificationComponent } from '../../../shared/ui/notification/notification.component';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, LoaderComponent, NotificationComponent],
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
  tokenFromUrl: string | null = null;

  fb = inject(FormBuilder);
  http = inject(HttpClient);
  router = inject(Router);
  route = inject(ActivatedRoute);

  constructor() {
    this.forgotPasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(8), upperCaseValidator()]],
      confirmPassword: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.tokenFromUrl = this.route.snapshot.queryParamMap.get('token');
    console.log('Token from URL:', this.tokenFromUrl);
  }

  onSubmit() {
    this.isLoading = true;
    
    if (this.forgotPasswordForm.valid && !this.passwordMatchError && this.tokenFromUrl) {
        const { newPassword } = this.forgotPasswordForm.value;
        const userApiUrl = `https://malo-backend.onrender.com/api/Recuperacion/cambiar-contrasena/${this.tokenFromUrl}`;
        const companyApiUrl = `https://malo-backend-empresas.onrender.com/api/Recuperacion/cambiar-contrasena/${this.tokenFromUrl}`;

        const payload = {
            token: this.tokenFromUrl,
            nuevaContrasena: newPassword
        };

        // Intentar primero con la API de usuarios
        this.http.post(userApiUrl, payload).subscribe(
            () => {
                this.successMessage = 'La contraseña se ha cambiado correctamente (Cuenta de usuario).';
                this.isPasswordChanged = true;
                this.isLoading = false;
                setTimeout(() => this.router.navigate(['/auth/login']), 6000);
            },
            (userError: HttpErrorResponse) => {
                // Si falla con la API de usuarios, intentar con la API de empresas
                if (userError.status === 404 || userError.status === 400) {
                    this.http.post(companyApiUrl, payload).subscribe(
                        () => {
                            this.successMessage = 'La contraseña se ha cambiado correctamente (Cuenta de empresa).';
                            this.isPasswordChanged = true;
                            this.isLoading = false;
                            setTimeout(() => this.router.navigate(['/auth/login']), 6000);
                        },
                        (companyError: HttpErrorResponse) => {
                            // Si también falla con la API de empresas
                            this.isLoading = false;
                            if (companyError.status === 404 || companyError.status === 400) {
                                this.errorMessage = 'El token es inválido o no se encontró. Por favor, verifica el enlace e intenta de nuevo.';
                            } else {
                                this.errorMessage = 'Hubo un error al cambiar la contraseña. Inténtelo de nuevo más tarde.';
                            }
                            this.clearMessages();
                        }
                    );
                } else {
                    // Error en la llamada a la API de usuarios distinto de 404/400
                    this.isLoading = false;
                    this.errorMessage = 'Hubo un error al cambiar la contraseña. Inténtelo de nuevo más tarde.';
                    this.clearMessages();
                }
            }
        );
    } else {
        this.isLoading = false;
        this.errorMessage = 'No se encontró un token válido en la URL.';
        this.clearMessages();
    }
}

  checkPasswordMatch() {
    const newPassword = this.forgotPasswordForm.get('newPassword')?.value;
    const confirmPassword = this.forgotPasswordForm.get('confirmPassword')?.value;
    this.passwordMatchError = newPassword !== confirmPassword;
  }

  clearMessages() {
    setTimeout(() => {
      this.errorMessage = '';
      this.successMessage = '';
    }, 10000);
  }
}

function upperCaseValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const hasUpperCase = /[A-Z]/.test(control.value);
    return hasUpperCase ? null : { upperCase: true };
  };
}