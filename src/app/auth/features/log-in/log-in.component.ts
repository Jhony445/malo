import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from '../../../shared/ui/notification/notification.component';
import { LoaderComponent } from '../../../shared/ui/loader/loader.component';

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, NotificationComponent, LoaderComponent],
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent {
  loginForm: FormGroup;
  errorMessage = '';
  successMessage = '';
  isLoading = false;
  isCompanyLogin = false;
  forgotPasswordMode = false;
  updatePasswordMode = false;
  recoveryToken: string | null = null;

  http = inject(HttpClient);
  router = inject(Router);
  userService = inject(UserService);
  fb = inject(FormBuilder);

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      contrasena: ['', Validators.required]
    });
  }

  onLogin() {
    if (this.forgotPasswordMode) {
      if (this.updatePasswordMode) {
        this.changePassword();
      } else {
        this.requestPasswordRecovery();
      }
    } else if (this.loginForm.valid) {
      this.isLoading = true;
      const loginApiUrl = this.isCompanyLogin
        ? "https://malo-backend-empresas.onrender.com/api/Auth/login"
        : "https://malo-backend.onrender.com/api/auth/login";

      this.http.post(loginApiUrl, this.loginForm.value).subscribe(
        (res: any) => {
          this.isLoading = false;
          if (res.result) {
            localStorage.setItem('authToken', res.token);
            this.userService.setAuthenticationState(true);
            const decodedToken = this.userService.getUserData();
            this.router.navigate([decodedToken.rol === 'Empresa' ? '/empresa' : '/usuario']);
          } else {
            this.errorMessage = "Credenciales inválidas. Por favor, verifique su correo y contraseña.";
            this.clearMessages();
          }
        },
        (error: HttpErrorResponse) => this.handleLoginError(error)
      );
    } else {
      this.errorMessage = "Por favor, completa el formulario correctamente.";
      this.clearMessages();
    }
  }

  toggleForgotPassword() {
    this.forgotPasswordMode = !this.forgotPasswordMode;
    this.updatePasswordMode = false;
    this.recoveryToken = null;
    this.loginForm.reset();
    this.errorMessage = '';
    this.successMessage = '';

    if (this.forgotPasswordMode) {
      this.loginForm.get('contrasena')?.disable();
      this.loginForm.addControl('newPassword', this.fb.control('', [Validators.required, Validators.minLength(6)]));
      this.loginForm.addControl('confirmPassword', this.fb.control('', Validators.required));
      this.loginForm.setValidators(this.passwordsMatchValidator());
    } else {
      this.loginForm.get('contrasena')?.enable();
      this.loginForm.removeControl('newPassword');
      this.loginForm.removeControl('confirmPassword');
      this.loginForm.clearValidators();
    }
    this.loginForm.updateValueAndValidity();
  }

  requestPasswordRecovery() {
    if (this.loginForm.get('email')?.invalid) {
      this.errorMessage = "Por favor, ingresa un correo válido.";
      this.clearMessages();
      return;
    }

    this.isLoading = true;
    const recoveryApiUrl = "https://malo-backend.onrender.com/api/Recuperacion/solicitar-recuperacion";
    const email = this.loginForm.get('email')?.value;

    this.http.post(recoveryApiUrl, { email }).subscribe(
      (res: any) => {
        this.isLoading = false;
        this.recoveryToken = res;
        console.log("Recovery Token:", this.recoveryToken);
        this.successMessage = "Se ha enviado un correo de recuperación a su email.";
        this.updatePasswordMode = true;
        this.clearMessages();
      },
      (error: HttpErrorResponse) => {
        this.isLoading = false;
        this.errorMessage = "Error al enviar el correo de recuperación. Por favor, inténtelo de nuevo más tarde.";
        this.clearMessages();
      }
    );
  }

  changePassword() {
    if (this.loginForm.invalid || this.loginForm.hasError('passwordsMismatch')) {
      this.errorMessage = "Por favor, asegúrate de que las contraseñas coincidan.";
      this.clearMessages();
      return;
    }

    this.isLoading = true;
    const changePasswordApiUrl = "https://malo-backend.onrender.com/api/Recuperacion/cambiar-contrasena";
    const newPassword = this.loginForm.get('newPassword')?.value;

    this.http.post(changePasswordApiUrl, { token: this.recoveryToken, nuevaContrasena: newPassword }).subscribe(
      (res: any) => {
        this.isLoading = false;
        if (res.result) {
          this.successMessage = "Contraseña cambiada correctamente";
          this.toggleForgotPassword();
        } else {
          this.errorMessage = "No se pudo cambiar la contraseña. Intente de nuevo.";
        }
        this.clearMessages();
      },
      (error: HttpErrorResponse) => {
        this.isLoading = false;
        this.errorMessage = "Error al cambiar la contraseña. Intente de nuevo más tarde.";
        this.clearMessages();
      }
    );
  }

  passwordsMatchValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const newPassword = control.get('newPassword')?.value;
      const confirmPassword = control.get('confirmPassword')?.value;
      return newPassword === confirmPassword ? null : { passwordsMismatch: true };
    };
  }

  private handleLoginError(error: HttpErrorResponse) {
    this.isLoading = false;
    if (error.status === 401) {
      // Verificar si el mensaje de la respuesta coincide con el mensaje de confirmación de correo
      const errorMessage = error.error?.message;
      if (errorMessage === "Debe confirmar su correo antes de iniciar sesión.") {
        this.errorMessage = errorMessage;
      } else {
        this.errorMessage = "Credenciales inválidas. Por favor, verifique su correo y contraseña.";
      }
    } else {
      this.errorMessage = "Hubo un error. Intente de nuevo más tarde.";
    }
    this.clearMessages();
  }

  clearMessages() {
    setTimeout(() => {
      this.errorMessage = '';
      this.successMessage = '';
    }, 4500);
  }
}

/*
  onLogin(){
    debugger;
    this.http.post("https://malo-backend.onrender.com/api/auth/login", this.loginObj).subscribe((res:any)=>{
      debugger;
      if(res.result){
        alert("Login success")
      }else{
        alert("error en contrase;a o usuario")
      }
    })
  }
*/