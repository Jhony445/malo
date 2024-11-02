import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
      this.requestPasswordRecovery();
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
    if (this.forgotPasswordMode) {
      this.loginForm.get('contrasena')?.disable();
    } else {
      this.loginForm.get('contrasena')?.enable();
    }
    this.errorMessage = '';
    this.successMessage = '';
  }

  requestPasswordRecovery() {
    this.isLoading = true;
    const recoveryApiUrl = "https://malo-backend.onrender.com/api/Recuperacion/solicitar-recuperacion";
    const email = this.loginForm.get('email')?.value;

    this.http.post(recoveryApiUrl, { email }).subscribe(
      (res: any) => {
        this.isLoading = false;
        this.successMessage = "Se ha enviado un correo de recuperación a su email.";
        
        // Guarda el mensaje de respuesta en consola
        const recoveryId = res;
        console.log("Recovery ID:", recoveryId);

        this.clearMessages();
      },
      (error: HttpErrorResponse) => {
        this.isLoading = false;
        this.errorMessage = "Error al enviar el correo de recuperación. Por favor, inténtelo de nuevo más tarde.";
        this.clearMessages();
      }
    );
  }

  private handleLoginError(error: HttpErrorResponse) {
    this.isLoading = false;
    if (error.status === 401) {
      this.errorMessage = error.error.message === "Debe confirmar su correo antes de iniciar sesión."
        ? "Debe confirmar su correo antes de iniciar sesión. Por favor, revise su bandeja de entrada para el enlace de confirmación."
        : "Credenciales inválidas. Por favor, verifique su correo y contraseña.";
    } else {
      this.errorMessage = "Credenciales inválidas. Por favor, verifique su correo y contraseña.";
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