import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule, NgForm  } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { CommonModule } from '@angular/common'; // Importar CommonModule
import { NotificationComponent } from '../../../shared/ui/notification/notification.component';
import { LoaderComponent } from '../../../shared/ui/loader/loader.component';

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [FormsModule, CommonModule, NotificationComponent, LoaderComponent], // Agregar CommonModule aquí
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent {

  loginObj: any = {
    email: '',
    contrasena: ''
  };

  errorMessage: string = '';  // Almacenará el mensaje de error
  successMessage: string = '';  // Almacenará el mensaje de éxito (opcional)
  isLoading: boolean = false;

  http = inject(HttpClient);
  router = inject(Router);
  userService = inject(UserService);

  // Método de inicio de sesión
  onLogin(loginForm: NgForm) {
    if (loginForm.valid) {
      this.isLoading = true; 
      // Llamar a la API de inicio de sesión
      this.http.post("https://malo-backend.onrender.com/api/auth/login", this.loginObj).subscribe(
         //this.http.post("/api/auth/login", this.loginObj).subscribe(
         //http://localhost:5271/api/Auth/login
         //https://malo-backend.onrender.com/api/auth/login
        (res: any) => {
          this.isLoading = false;
          if (res.result/**token result */) {
            localStorage.setItem('authToken', res.token);
            this.userService.setAuthenticationState(true);
            this.router.navigate(['/usuario']);
          } else {
            this.errorMessage = "Credenciales inválidas. Por favor, verifique su correo y contraseña.";
            this.clearMessages();
          }
        },
        (error: HttpErrorResponse) => {
          this.isLoading = false;
          if (error.status === 500 || error.status === 401) {
            this.errorMessage = "ERROR: Credenciales inválidas o error en el servidor.";
          } else {
            this.errorMessage = "Error en el servidor. Por favor, inténtelo más tarde.";
          }
        }
      );
    } else {
      this.errorMessage = "Por favor, completa el formulario correctamente.";
      this.clearMessages();
    }
  }
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