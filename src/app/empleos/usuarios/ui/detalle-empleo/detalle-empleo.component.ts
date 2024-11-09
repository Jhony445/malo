import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../../core/services/user.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

declare const confetti: any; // Declara confetti para TypeScript

@Component({
  selector: 'app-detalle-empleo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detalle-empleo.component.html',
  styleUrls: ['./detalle-empleo.component.css']
})
export class DetalleEmpleoComponent {
  @Input() empleo: any;
  isAuthenticated = false;
  isEmpresa = false;
  showConfirmDialog = false;
  isSubmitting = false;
  showSuccess = false;
  usuarioID: string = '';

  constructor(
    private userService: UserService,
    private router: Router,
    private http: HttpClient
  ) {
    // Subscribe a los cambios de autenticación y obtener el usuarioID
    this.userService.isAuthenticated$.subscribe(authState => {
      this.isAuthenticated = authState;
      const userData = this.userService.getUserData();
      if (userData) {
        this.usuarioID = userData.sub; // El usuarioID es el "sub" en el JWT
      }
      this.isEmpresa = userData?.rol === 'Empresa';
    });
  }

  onButtonClick() {
    if (!this.isAuthenticated) {
      this.router.navigate(['/auth/login']);
      return;
    }

    if (this.isEmpresa) {
      console.log('Las empresas no pueden postularse a empleos');
      return;
    }

    this.showConfirmDialog = true;
  }

  confirmApply() {
    this.isSubmitting = true;

    // Verifica que tenemos el usuarioID antes de enviar la solicitud
    if (!this.usuarioID) {
      console.error('No se pudo obtener el usuarioID');
      return;
    }

    // Datos a enviar a la API
    const postData = {
      usuarioID: this.usuarioID,  // Enviar el usuarioID usando userData.sub
      empleoID: this.empleo.empleoId
    };

    // Realiza la solicitud HTTP POST con responseType como 'text' para evitar el error de JSON
    this.http.post('https://malo-backend-empleos.onrender.com/api/Aplicacion/aplicar-empleo', postData, { responseType: 'text' })
      .subscribe({
        next: (response) => {
          console.log('Respuesta de la API:', response);
          this.isSubmitting = false;
          this.showSuccess = true;
          this.shootConfetti();  // Lanza la animación de confeti
        },
        error: (error) => {
          console.error('Error al enviar la postulación:', error);
          this.isSubmitting = false;
          alert('Hubo un problema al enviar la postulación. Inténtalo de nuevo.');
        }
      });
  }

  closeDialog() {
    this.showConfirmDialog = false;
    this.showSuccess = false;
    console.log('Postulación enviada correctamente');
  }

  cancelApply() {
    this.showConfirmDialog = false;
  }

  shootConfetti() {
    const defaults = {
      spread: 360,
      ticks: 50,
      gravity: 0,
      decay: 0.94,
      startVelocity: 30,
      shapes: ["star"],
      colors: ["FFE400", "FFBD00", "E89400", "FFCA6C", "FDFFB8"],
    };

    function shoot() {
      confetti({
        ...defaults,
        particleCount: 40,
        scalar: 1.2,
        shapes: ["star"],
      });

      confetti({
        ...defaults,
        particleCount: 10,
        scalar: 0.75,
        shapes: ["circle"],
      });
    }

    setTimeout(shoot, 0);
    setTimeout(shoot, 100);
    setTimeout(shoot, 200);
  }
}
