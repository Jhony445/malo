import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LoaderComponent } from '../../../shared/ui/loader/loader.component';
import { NotificationComponent } from '../../../shared/ui/notification/notification.component';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, FormsModule, LoaderComponent, NotificationComponent],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent {
  currentStep = 1;

  nombre = '';
  apellidos = '';
  telefono = '';
  localidad = '';
  estado = '';
  municipio = '';
  fechaNacimiento = '';
  correo = '';
  contrasena = '';
  confirmPass = '';

  router = inject(Router);
  http = inject(HttpClient);
  isLoading: boolean = false;
  errorMessage: string = '';

  nextStep() {
    if (this.currentStep < 5) {
      this.currentStep++;
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  goToStep(step: number) {
    this.currentStep = step;
  }

  isForm1Valid(): boolean {
    return !!this.nombre && !!this.apellidos;
  }
  
  isForm2Valid(): boolean {
    return !!this.telefono && !!this.fechaNacimiento;
  }
  
  isForm3Valid(): boolean {
    return !!this.localidad && !!this.estado && !!this.municipio;
  }

  isForm4Valid(): boolean {
    return !!this.correo && !!this.contrasena && !!this.confirmPass;
  }
  
  finishRegister() {
    if(this.isForm1Valid() && this.isForm2Valid() && this.isForm3Valid() && this.isForm4Valid()){
      const userData ={
        nombre: this.nombre,
        apellido: this.apellidos,
        email: this.correo,
        contrasena: this.confirmPass,
        fecha_nacimiento: this.fechaNacimiento,
        telefono: this.telefono,
        estado_id: 1,
        municipio_id: 1,
        localidad_id: 1,
        habilidades: '',
        descripcion: '',
        imagen_perfil: '',
      };

      this.isLoading = true;
      // Hacer el POST directamente en el componente
      this.http.post('https://malo-backend.onrender.com/api/Usuario/InsertarUsuario', userData)
        .subscribe({
          next: (response) => {
            this.isLoading = false;
            console.log('Usuario registrado con éxito', response);
            this.currentStep++; // Avanzar al siguiente paso si el registro es exitoso
          },
          error: (error) => {
            this.isLoading = false;
            this.errorMessage = "Error al registrar usuario"
            console.error('Error al registrar la empresa', error);
            this.clearMessages();
          }
        });
    }else{
      this.currentStep = 1;
    }
  }

  clearMessages(){
    setTimeout(() => {
      this.errorMessage = '';
    }, 3000)
  }

  goToSignIn(){
    this.router.navigate(['/auth/login']);
  }
}
