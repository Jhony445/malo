import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoaderComponent } from '../../../shared/ui/loader/loader.component';
import { NotificationComponent } from '../../../shared/ui/notification/notification.component';
import { EmailService } from '../../services/email.service';
import emailjs from '@emailjs/browser'

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, FormsModule, LoaderComponent, NotificationComponent],
  templateUrl: './register-company.component.html',
  styleUrls: ['./register-company.component.css'],
})
export class RegisterCompany {
  currentStep = 1;
  //datos empresa
  nombre = '';
  industria = '';
  ubicacion = '';
  correo = '';
  contrasena = '';
  confirmPass = '';
  codigoInp= '';
  nombreTouched: boolean = false;
  industriaTouched: boolean = false;
  ubicacionTouched: boolean = false;
  emailTouched: boolean = false;
  contrasenaTouched: boolean = false;
  confirmPassTouched: boolean = false;
  codigoInpTouched: boolean = false;
  emailButtonClicked: boolean = false;
  //otros
  router = inject(Router);
  http = inject(HttpClient);
  isLoading: boolean = false;
  emailSent: boolean = false;
  verificationCode: string = '';
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
    return this.isEmailValid(this.correo) &&
           this.isCodigoValid(this.codigoInp, this.verificationCode)
  }

  isForm3Valid(): boolean{
    return this.isPasswordValid(this.contrasena) && 
           this.doPasswordsMatch(this.contrasena, this.confirmPass)
  }

  isEmailValid(correo: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(correo);
  }
  
  isPasswordValid(password: string): boolean {
    return password.length >= 5;
  }
  
  doPasswordsMatch(password: string, confirmPassword: string): boolean {
    return password === confirmPassword;
  }

  isCodigoValid(codigo: string,  verificationCode: string): boolean {
    return  codigo.length === 6  && codigo === verificationCode;
  }

  // Función para verificar si un campo no está vacío
  isNotEmpty(value: string): boolean {
    return value.trim().length > 0;
  }

  //Enviar correo
  constructor(private emailService: EmailService){}
  sendEmail(){
    this.verificationCode = this.emailService.generateRandomCode();
    this.isLoading = true;

    this.emailService.sendEmail(this.nombre, this.verificationCode, this.correo)
    .then(() => {
      this.isLoading = false;
      this.emailSent = true;
      this.emailButtonClicked = true;

      // Activar temporizador de 60s
      setTimeout(() => {
        this.verificationCode = ''; // Borra el código de verificación
        this.emailButtonClicked = false; // Reactiva el botón
      }, 40000);

      setTimeout(() => (this.emailSent = false), 3000); // Ocultar mensaje después de 3 segundos
    }).catch((error) => {
      this.isLoading = false;
      this.emailButtonClicked = false;
      console.error('Error al enviar el código:', error);
    });
  }

  //insertar empresa
  finishRegister() {
    if (this.isForm1Valid() && this.isForm2Valid() && this.isForm3Valid()) {
      const empresaData = {
        nombre: this.nombre,
        industria: this.industria,
        ubicacion: this.ubicacion,
        contrasena: this.contrasena,
        email: this.correo,
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
            this.errorMessage = "¡Ups, La empresa ya existe!"
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
