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
        (res: any) => {
          this.isLoading = false;
          // Validar si el resultado es exitoso con "result: true"
          if (res.result) {
            // Si el resultado es true, almacenar el token y navegar a la vista del usuario
            localStorage.setItem('authToken', res.token);
            this.userService.setAuthenticationState(true);
            this.router.navigate(['/usuario']);
          } else {
            // Si result es false, mostrar mensaje de credenciales inválidas
            this.errorMessage = "Credenciales inválidas. Por favor, verifique su correo y contraseña.";
            this.clearMessages();
          }
        },
        (error: HttpErrorResponse) => {
          this.isLoading = false;
          // Manejo de errores en caso de error del servidor o de credenciales inválidas
          if (error.status === 401) {
            // Error de autenticación (credenciales inválidas)
            this.errorMessage = "ERROR: Credenciales inválidas.";
          } else if (error.status === 500) {
            // Error de servidor (500)
            this.errorMessage = "Error en el servidor. Por favor, inténtelo más tarde.";
          } else {
            // Otros errores que no sean 401 o 500
            this.errorMessage = "Error inesperado. Inténtelo más tarde.";
          }
          this.clearMessages();
        }
      );
    } else {
      // Si el formulario no es válido
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