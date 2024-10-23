import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register-company.component.html',
  styleUrls: ['./register-company.component.css'],
})
export class RegisterCompany {
  currentStep = 1;

  // Actualización de las propiedades
  nombre = '';
  industria = '';
  ubicacion = '';
  email = '';
  contrasena = '';
  confirmarContrasena = '';
  router = inject(Router);

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

  // Validación del Formulario 1
  isForm1Valid(): boolean {
    return !!this.nombre && !!this.industria && !!this.ubicacion;
  }

  // Validación del Formulario 2
  isForm2Valid(): boolean {
    return !!this.email && !!this.contrasena && this.contrasena === this.confirmarContrasena;
  }

  finishRegister() {
    if(this.isForm1Valid() && this.isForm2Valid()){
      this.currentStep++;
    }else{
      this.currentStep = 1;
    }
  }

  goToSignIn(){
    this.router.navigate(['/auth/login']);
  }
}
