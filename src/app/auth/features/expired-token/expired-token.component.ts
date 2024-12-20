import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from '../../../shared/ui/notification/notification.component';
import { LoaderComponent } from "../../../shared/ui/loader/loader.component";

@Component({
  selector: 'app-expired-token',
  standalone: true,
  imports: [FormsModule, CommonModule, NotificationComponent, LoaderComponent],
  templateUrl: './expired-token.component.html',
  styleUrls: ['./expired-token.component.css']
})
export class ExpiredTokenComponent {
  email = '';
  emailSent = false;
  errorMessage = '';
  isLoading = false;
  isCompanyTokenRequest = false; // Variable para identificar el tipo de cuenta

  private apiUrl = 'https://malo-backend.onrender.com/api/Usuario/generar-nuevo-token';
  private apiUrlsEmpresa  = 'https://malo-backend-empresas.onrender.com/api/Empresa/generar-nuevo-token';

  constructor(private router: Router, private http: HttpClient) {}

  onResendToken(): void {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    this.isLoading = true;
    if (this.email && emailPattern.test(this.email)) {
      const apiUrl = this.isCompanyTokenRequest ? this.apiUrlsEmpresa : this.apiUrl;
      this.http.post(apiUrl, { email: this.email }).subscribe({
        next: () => {
          this.emailSent = true;
          this.isLoading = false;
          setTimeout(() => {
            this.router.navigate(['/auth/login']);
          }, 20000);
        },
        error: () => {
          this.isLoading = false;
          this.errorMessage = "Hubo un error al enviar el correo. Intenta más tarde.";
          this.clearMessages();
        }
      });
    } else {
      this.isLoading = false;
      this.errorMessage = "Por favor, ingresa un correo válido.";
      this.clearMessages();
    }
  }

  clearMessages() {
    setTimeout(() => {
      this.errorMessage = '';
    }, 5000);
  }
}
