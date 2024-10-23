import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
      this.currentStep++;
    }else{
      this.currentStep = 1;
    }
  }

  goToSignIn(){
    this.router.navigate(['/auth/login']);
  }
}
