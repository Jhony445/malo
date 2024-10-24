import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from '../../../shared/ui/notification/notification.component';
import { LoaderComponent } from '../../../shared/ui/loader/loader.component';

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [FormsModule, CommonModule, NotificationComponent, LoaderComponent],
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent {

  loginObj: any = {
    email: '',
    contrasena: ''
  };

  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;
  isCompanyLogin: boolean = false;

  http = inject(HttpClient);
  router = inject(Router);
  userService = inject(UserService);

  // Método de inicio de sesión

  onLogin(loginForm: NgForm) {
    if (loginForm.valid) {
      this.isLoading = true;
      const loginApiUrl = this.isCompanyLogin
        ? "https://malo-backend-empresas.onrender.com/api/Auth/login"  // API para empresas
        : "https://malo-backend.onrender.com/api/auth/login";  // API para usuarios

      this.http.post(loginApiUrl, this.loginObj).subscribe(
        (res: any) => {
          this.isLoading = false;
          if (res.result) {
            localStorage.setItem('authToken', res.token);
            this.userService.setAuthenticationState(true);
            // Redirecciona según el rol
            const decodedToken = this.userService.getUserData();
            if (decodedToken.rol === 'Empresa') {
              this.router.navigate(['/empresa']);
            } else {
              this.router.navigate(['/usuario']);
            }
          } else {
            this.errorMessage = "Credenciales inválidas. Por favor, verifique su correo y contraseña.";
            this.clearMessages();
          }
        },
        (error: HttpErrorResponse) => {
          this.isLoading = false;
          if (error.status === 401 || error.status === 500) {
            this.errorMessage = "Error de autenticación o del servidor.";
          } else {
            this.errorMessage = "Error inesperado. Inténtelo más tarde.";
          }
        }
      );
    } else {
      this.errorMessage = "Por favor, completa el formulario correctamente.";
      this.clearMessages();
    }
  }

  // Función para limpiar mensajes después de 3 segundos
  clearMessages() {
    setTimeout(() => {
      this.errorMessage = '';
      this.successMessage = '';
    }, 3000);  // Los mensajes desaparecen después de 3 segundos
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