import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from '../../../../shared/ui/notification/notification.component';
import { LoaderComponent } from '../../../../shared/ui/loader/loader.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserService } from '../../../../core/services/user.service';

@Component({
  selector: 'app-postulacion-empleos',
  standalone: true,
  imports: [CommonModule, NotificationComponent, LoaderComponent],
  templateUrl: './mi-postulaciones.component.html',
  styleUrls: ['./mi-postulaciones.component.css']
})
export class MiPostulacionesComponent implements OnInit {
  empleosFiltrados: any[] = [];
  currentPage = 1;
  itemsPerPage = 4;
  isLoading = false;
  successMessage: Record<number, string> = {};
  empresaNombre = '';
  errorMessage = '';
  empleoVisibilidad: Record<number, boolean> = {}; // Visibilidad de cada empleo
  empleoDetalles: Record<number, any> = {};
  userService = inject(UserService);

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.obtenerEmpleos();
  }

  obtenerEmpleos(): void {
    this.isLoading = true;
    
    // Obtener el userId desde el servicio de usuario
    const userData = this.userService.getUserData();
    const usuarioID = userData?.sub; 

    // Crear el cuerpo de la solicitud con el formato correcto
    const body = { usuarioID }; // Cambié "userId" por "usuarioID"
    console.log('UsuarioID:', usuarioID);
  
    // Realizar la solicitud HTTP POST
    this.http.post<any>('https://malo-backend-empleos.onrender.com/api/Aplicacion/obtener-empleos-por-usuario', body)
      .subscribe({
        next: (response) => {
          console.log(response);
          // Procesar los empleos recibidos
          this.empleosFiltrados = response
            // Ordenar los empleos por fecha de publicación (más nuevo primero)
            .sort((a: any, b: any) => new Date(b.fecha_aplicacion).getTime() - new Date(a.fecha_aplicacion).getTime());
  
          this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error al obtener empleos:', error);
          this.errorMessage = "Algo salió mal, intentalo más tarde";
          this.clearMessagesAfterDelay();
        }
      });
  }
  

  onPageChange(page: number): void {
    this.currentPage = page;
  }

  get paginatedEmpleos(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.empleosFiltrados.slice(startIndex, endIndex);
  }

  get totalPages(): number {
    return Math.ceil(this.empleosFiltrados.length / this.itemsPerPage);
  }

  toggleEmpleoVisibilidad(empleoId: number): void {
    // Si el empleo está visible, lo ocultamos
    if (this.empleoVisibilidad[empleoId]) {
      this.empleoVisibilidad[empleoId] = false;
    } else {
      // Si el empleo no está visible, ocultamos todos los demás y mostramos este
      for (const id in this.empleoVisibilidad) {
        this.empleoVisibilidad[id] = false; // Ocultamos todos los empleos
      }
      this.empleoVisibilidad[empleoId] = true; // Mostramos el empleo seleccionado
    }
  
    // Si el contenedor se vuelve visible, obtiene los detalles del empleo
    if (this.empleoVisibilidad[empleoId]) {
      this.obtenerEmpleoPorId(empleoId);
    }
  }
  

  obtenerEmpleoPorId(empleoId: number): void {
    this.isLoading = true; // Inicia el estado de carga

    const body = { empleoId }; // Cuerpo de la solicitud con el empleoId

    this.http.post<any>('https://malo-backend-empleos.onrender.com/api/Empleo/GetEmpleoById', body)
        .subscribe({
            next: (response) => {
                console.log('Respuesta del empleo:', response);
                this.empleoDetalles[empleoId] = response; // Guarda los datos del empleo
                this.obtenerEmpresaPorId(response.empresa_id)
                this.isLoading = false; // Finaliza el estado de carga
            },
            error: (error) => {
                this.isLoading = false; // Finaliza el estado de carga en caso de error
                console.error('Error al obtener información del empleo:', error);
                this.errorMessage = "Algo salió mal, intentalo más tarde";
                this.clearMessagesAfterDelay();
            }
        });
  }

  obtenerEmpresaPorId(empresaId: string): void {
    this.isLoading = true; // Inicia el estado de carga
  
    const body = JSON.stringify(empresaId); // Convierte el ID directamente en una cadena JSON
    ; // Envía directamente el ID como cadena de texto
    
    this.http.post<any>('https://malo-backend-empresas.onrender.com/api/Empresa/GetEmpresaPorId', body , {
      headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'accept': 'application/json'
      })
    })
      .subscribe({
        next: (response) => {
          console.log('Respuesta de la empresa:', response);
          this.empresaNombre = response.nombre; // Guarda el nombre de la empresa
          this.isLoading = false; // Finaliza el estado de carga
        },
        error: (error) => {
          this.isLoading = false; // Finaliza el estado de carga en caso de error
          console.error('Error al obtener información de la empresa:', error);
          this.errorMessage = "Algo salió mal, intentalo más tarde";
          this.clearMessagesAfterDelay();
        }
      });
  }

  eliminarPostulacion(empleoId: number): void {
    const userData = this.userService.getUserData();
    const usuarioID = userData?.sub; // Obtenemos el ID del usuario desde el servicio
  
    if (usuarioID) {
      const body = {
        usuarioID: usuarioID, // Usuario que realiza la acción
        empleoID: empleoId      // ID del empleo cuya postulación se eliminará
      };
      
      // Realizamos la solicitud HTTP POST para eliminar la postulación
      this.http.post<any>('https://malo-backend-empleos.onrender.com/api/Aplicacion/eliminar-postulacion', body)
        .subscribe({
          next: (response) => {
            this.obtenerEmpleos();
            console.log('Postulación eliminada:', response);
            // Aquí puedes agregar lógica para actualizar la UI después de eliminar la postulación (por ejemplo, eliminar el empleo de la lista)
          },
          error: (error) => {
            console.error('Error al eliminar la postulación:', error);
            this.errorMessage = "No se pudo eliminar la postulación. Intenta más tarde.";
            this.clearMessagesAfterDelay();
          }
        });
    } else {
      console.error('Usuario no autenticado');
    }
  }  
  
  clearMessagesAfterDelay() {
    setTimeout(() => {
      this.successMessage = {};
      this.errorMessage = '';
    }, 5000);
  }
}