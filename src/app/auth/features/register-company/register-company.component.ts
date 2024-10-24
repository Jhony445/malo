import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoaderComponent } from '../../../shared/ui/loader/loader.component';
import { NotificationComponent } from '../../../shared/ui/notification/notification.component';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, FormsModule, LoaderComponent, NotificationComponent],
  templateUrl: './register-company.component.html',
  styleUrls: ['./register-company.component.css'],
})
export class RegisterCompany {
  currentStep = 1;
  
  nombre = '';
  industria = '';
  ubicacion = '';
  email = '';
  contrasena = '';
  confirmarContrasena = '';

  router = inject(Router);
  http = inject(HttpClient); // Inyecta HttpClient directamente
  isLoading: boolean = false;

  errorMessage: string = '';

  nextStep() {
    if (this.currentStep < 3) {
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
    return !!this.nombre && !!this.industria && !!this.ubicacion;
  }

  isForm2Valid(): boolean {
    return !!this.email && !!this.contrasena && this.contrasena === this.confirmarContrasena;
  }

  finishRegister() {
    if (this.isForm1Valid() && this.isForm2Valid()) {
      const empresaData = {
        nombre: this.nombre,
        industria: this.industria,
        ubicacion: this.ubicacion,
        contrasena: this.contrasena,
        email: this.email,
      };

      this.isLoading = true;
      // Hacer el POST directamente en el componente
      this.http.post('https://malo-backend-empresas.onrender.com/api/Empresa/agregar-empresa', empresaData)
        .subscribe({
          next: (response) => {
            this.isLoading = false;
            console.log('Empresa registrada con éxito', response);
            this.currentStep++; // Avanzar al siguiente paso si el registro es exitoso
          },
          error: (error) => {
            this.isLoading = false;
            this.errorMessage = "La empresa ya existe"
            console.error('Error al registrar la empresa', error);
            this.clearMessages();
          }
        });
    } else {
      this.currentStep = 1;
    }
  }

  clearMessages() {
    setTimeout(() => {
      this.errorMessage = '';
    }, 3000);  // Los mensajes desaparecen después de 3 segundos
  }

  goToSignIn() {
    this.router.navigate(['/auth/login']);
  }
}
