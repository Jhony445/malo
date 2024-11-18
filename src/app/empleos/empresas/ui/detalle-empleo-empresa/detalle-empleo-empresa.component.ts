import { Component, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { NotificationComponent } from '../../../../shared/ui/notification/notification.component';
import { ConfirmDeleteModalComponent } from '../confirm-delete-modal/confirm-delete-modal.component';
import { LoaderComponent } from '../../../../shared/ui/loader/loader.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-detalle-empleo-empresa',
  standalone: true,
  imports: [CommonModule, FormsModule, NotificationComponent, ConfirmDeleteModalComponent, LoaderComponent],
  templateUrl: './detalle-empleo-empresa.component.html',
  styleUrls: ['./detalle-empleo-empresa.component.css', 'detalle-empleo-empresa-styleDos.css']
})
export class DetalleEmpleoEmpresaComponent implements OnChanges {
  @Input() empleo: any;
  modoEdicion = false;
  @Output() empleoEliminado = new EventEmitter<string>();
  @Output() empleoActualizado = new EventEmitter<any>();

  errorMessage = '';
  successMessage = '';
  showConfirmDeleteModal = false;

  // Variables para controlar estado de botones
  isUpdating = false;
  isDeleting = false;

  isLoading = false;

  postulaciones = 0;

  constructor(private http: HttpClient, private router: Router) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['empleo'] && this.empleo) {
      this.obtenerPostulaciones(); 
      console.log('ID del empleo en detalle:', this.empleo.empleoId);
    }
  }

  onImageSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files[0]) {
      const file = fileInput.files[0];

      if (file.type.startsWith('image/')) {
        this.empleo.multimediaContenido = file;
        this.empleo.multimediaNombre = file.name;
      } else {
        this.errorMessage = 'Por favor, selecciona un archivo de imagen';
        this.clearMessagesAfterDelay();
      }
    }
  }

  activarEdicion() {
    this.modoEdicion = true;
  }

  guardarCambios() {
    this.isLoading = true;
    if (this.isUpdating) return; // Evitar múltiples envíos

    // Validar campos obligatorios
    if (!this.empleo.titulo || !this.empleo.descripcion || !this.empleo.ubicacion ||
      this.empleo.salario_minimo === null || this.empleo.salario_minimo < 0 ||
      !this.empleo.salario_maximo || !this.empleo.horario) {
      this.errorMessage = 'Por favor, completa todos los campos obligatorios';
      this.clearMessagesAfterDelay();
      this.isLoading = false;
      return;
    }

    this.isUpdating = true; // Bloquear actualizaciones múltiples

    // Actualizar datos principales
    const payload = {
      empleo_id: this.empleo.empleoId,
      titulo: this.empleo.titulo,
      descripcion: this.empleo.descripcion,
      ubicacion: this.empleo.ubicacion,
      salario_minimo: this.empleo.salario_minimo,
      salario_maximo: this.empleo.salario_maximo,
      horario: this.empleo.horario
    };

    this.http.post('https://malo-backend-empleos.onrender.com/api/Empleo/UpdateEmpleoById', payload, { responseType: 'text' })
      .subscribe({
        next: () => {
          // Si se seleccionó una nueva imagen, actualizarla
          if (this.empleo.multimediaContenido instanceof File) {
            this.actualizarImagen();
          } else {
            this.finalizarActualizacion('Empleo actualizado con éxito', false);
          }
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage = `Error al actualizar el empleo: ${error.error}`;
          this.clearMessagesAfterDelay();
          this.isUpdating = false;
          this.isLoading = false;
        }
      });
  }

  private actualizarImagen() {
    const formData = new FormData();
    formData.append('EmpleoId', this.empleo.empleoId);
    formData.append('archivo', this.empleo.multimediaContenido);

    this.http.post('https://malo-backend-empleos.onrender.com/api/Empleo/ActualizarMultimedia', formData, { responseType: 'text' })
      .subscribe({
        next: () => this.finalizarActualizacion('Empleo e imagen actualizados con éxito', true),
        error: (error: HttpErrorResponse) => {
          this.errorMessage = `Error al actualizar la imagen: ${error.error}`;
          this.clearMessagesAfterDelay();
          this.isUpdating = false;
          this.isLoading = false;
        }
      });
  }

  eliminarEmpleo() {
    if (this.isDeleting) return; // Evitar múltiples eliminaciones
    this.showConfirmDeleteModal = true;
  }

  realizarEliminacion() {
    this.isLoading = true;
    if (this.empleo && this.empleo.empleoId) {
      this.isDeleting = true; // Deshabilitar el botón de eliminar

      const payload = { empleoId: this.empleo.empleoId };
      this.http.post('https://malo-backend-empleos.onrender.com/api/Empleo/DeleteEmpleoById', payload, { responseType: 'text' })
        .subscribe({
          next: () => {
            this.isLoading = false;
            this.empleoEliminado.emit(this.empleo.empleoId);
            this.showConfirmDeleteModal = false;
          },
          error: (error) => console.error('Error al eliminar el empleo:', error),
          complete: () => this.isDeleting = false // Rehabilitar el botón después de completar la solicitud
        });
    } else {
      this.isLoading = false;
      console.warn('No hay empleo seleccionado para eliminar.');
    }
  }

  private clearMessagesAfterDelay() {
    setTimeout(() => {
      this.errorMessage = '';
      this.successMessage = '';
    }, 3000);
  }

  recargarEmpleo() {
    this.http.get(`https://malo-backend-empleos.onrender.com/api/Empleo/GetEmpleoById/${this.empleo.empleoId}`)
      .subscribe({
        next: (data) => {
          // Asignamos el empleo recibido y agregamos un timestamp a la URL de la imagen
          this.empleo = data;
          this.empleo.imagenUrl = `${this.empleo.imagenUrl}?t=${new Date().getTime()}`;
        },
        error: (error) => console.error('Error al recargar el empleo:', error)
      });
  }

  private finalizarActualizacion(mensaje: string, recargar: boolean) {
    this.successMessage = mensaje;
    this.modoEdicion = false;
    this.empleoActualizado.emit(this.empleo);
    this.clearMessagesAfterDelay();

    this.isUpdating = false;
    this.isLoading = false;

    if (recargar) {
      setTimeout(() => {
        window.location.reload();
      }, 4000);
    }
  }

  obtenerPostulaciones() {
    const payload = { empleoID: this.empleo.empleoId };
    this.http.post<number>('https://malo-backend-empleos.onrender.com/api/Aplicacion/contar-aplicaciones-por-empleo', payload)
      .subscribe({
        next: (cantidad) => {
          this.postulaciones = cantidad;
        },
        error: (error) => {
          console.error('Error al obtener postulaciones:', error);
          this.postulaciones = 0; // Fallback en caso de error
        }
      });
  }

  irAPostulaciones() {
    this.router.navigate(['/empresa/postulacion-empleos']);
  }

  convertirTextoHtml(texto: string): string {
    if (!texto) return '';
    return texto.replace(/\n/g, '<br>');
  }
}