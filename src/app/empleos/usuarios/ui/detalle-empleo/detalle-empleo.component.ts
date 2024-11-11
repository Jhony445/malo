import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../../core/services/user.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

declare const confetti: any;

@Component({
  selector: 'app-detalle-empleo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detalle-empleo.component.html',
  styleUrls: ['./detalle-empleo.component.css', './detalle-empleoPostular.component.css']
})
export class DetalleEmpleoComponent implements OnInit, OnChanges {
  @Input() empleo: any;
  isAuthenticated = false;
  isEmpresa = false;
  showConfirmDialog = false;
  showAppliedDialog = false;
  isSubmitting = false;
  showSuccess = false;
  usuarioID = '';
  appliedJobIDs = new Set<string>();
  applicationCount: number | null = null;

  constructor(
    private userService: UserService,
    private router: Router,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.subscribeToAuthState();
    this.fetchAppliedJobs();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["empleo"] && changes["empleo"].currentValue) {
      this.fetchApplicationCount();
      console.log('ID de empleo:', this["empleo"].empleoId);
    }
  }

  private subscribeToAuthState(): void {
    this.userService.isAuthenticated$.subscribe(authState => {
      this.isAuthenticated = authState;
      const userData = this.userService.getUserData();
      if (userData) {
        this.usuarioID = userData.sub;
        this.isEmpresa = userData.rol === 'Empresa';
      }
    });
  }

  private fetchAppliedJobs(): void {
    if (!this.usuarioID) return;
  
    const postData = { usuarioID: this.usuarioID };
    this.http.post<any[]>('https://malo-backend-empleos.onrender.com/api/Aplicacion/obtener-empleos-por-usuario', postData)
      .subscribe({
        next: (appliedJobs) => {
          this.appliedJobIDs = new Set(appliedJobs.map(job => job.empleoID));
        },
        error: (error) => console.error('Error fetching applied jobs:', error)
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
    this.checkIfAlreadyApplied();
  }

  checkIfAlreadyApplied() {
    if (this.appliedJobIDs.has(this.empleo.empleoId)) {
      this.showAppliedDialog = true;
    } else {
      this.showConfirmDialog = true;
    }
  }

  closeAppliedDialog() {
    this.showAppliedDialog = false;
  }

  confirmApply() {
    this.isSubmitting = true;

    const postData = {
      usuarioID: this.usuarioID,
      empleoID: this.empleo.empleoId
    };

    this.http.post('https://malo-backend-empleos.onrender.com/api/Aplicacion/aplicar-empleo', postData, { responseType: 'text' })
      .subscribe({
        next: () => {
          this.isSubmitting = false;
          this.showSuccess = true;
          this.shootConfetti();
          this.fetchAppliedJobs();
          this.fetchApplicationCount();  // Actualizar el conteo después de aplicar
        },
        error: (error) => {
          console.error('Error applying for job:', error);
          this.isSubmitting = false;
        }
      });
  }

  private fetchApplicationCount(): void {
    if (!this["empleo"] || !this["empleo"].empleoId) return;
  
    const postData = { empleoID: this["empleo"].empleoId };
    this.http.post<number>('https://malo-backend-empleos.onrender.com/api/Aplicacion/contar-aplicaciones-por-empleo', postData)
      .subscribe({
        next: (count) => {
          this.applicationCount = count;
        },
        error: (error) => console.error('Error fetching application count:', error)
      });
  }

  closeDialog() {
    this.showConfirmDialog = false;
    this.showSuccess = false;
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
