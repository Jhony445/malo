import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from '../../../../shared/ui/notification/notification.component';
import { LoaderComponent } from '../../../../shared/ui/loader/loader.component';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../../../core/services/user.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-postulacion-empleos',
  standalone: true,
  imports: [CommonModule, NotificationComponent, LoaderComponent],
  templateUrl: './postulacion-empleos.component.html',
  styleUrls: ['./postulacion-empleos.component.css']
})
export class PostulacionEmpleosComponent implements OnInit {
  empleosFiltrados: any[] = [];
  currentPage = 1;
  itemsPerPage = 6;
  aplicacionesCount: Record<number, number> = {};
  isLoading = false;
  successMessage: Record<number, string> = {};
  errorMessage = '';
  empleoDocumentos: Record<number, any[]> = {}; // PDFs de cada empleo
  pdfIndices: Record<number, number> = {}; // Índices actuales de PDFs
  empleoVisibilidad: Record<number, boolean> = {}; // Visibilidad de cada empleo
  userService = inject(UserService);
  sanitizer = inject(DomSanitizer);

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.obtenerEmpleos();
  }

  obtenerEmpleos(): void {
    this.isLoading = true;
    const userData = this.userService.getUserData();
    const userId = userData?.sub;

    this.http.get<any>('https://malo-backend-empleos.onrender.com/api/Empleo/GetEmpleos').subscribe({
      next: (response) => {
        this.empleosFiltrados = response.filter((empleo: any) => empleo.empresa_id === userId);
        // Llamar a contarAplicacionesPorEmpleo para cada empleo filtrado
        this.empleosFiltrados.forEach((empleo: any) => {
          this.contarAplicacionesPorEmpleo(empleo.empleoId);
        });
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false
        console.error('Error al obtener empleos:', error)
        this.errorMessage = "Algo salio mal, intentalo más tarde";
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

  contarAplicacionesPorEmpleo(empleoId: number): void {
    console.log(empleoId);
    this.isLoading = true;
    const payload = { empleoId };
    
    this.http.post<number>('https://malo-backend-empleos.onrender.com/api/Aplicacion/contar-aplicaciones-por-empleo', payload).subscribe({
      next: (countResponse) => {
        this.aplicacionesCount[empleoId] = countResponse; // Almacena el conteo de aplicaciones
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al contar aplicaciones por empleo:', error);
        this.errorMessage = "Algo salió mal, inténtalo más tarde";
        this.clearMessagesAfterDelay();
        this.isLoading = false;
      }
    });
  }

  obtenerUsuariosPorEmpleo(empleoId: number): void {
    console.log(empleoId)
    this.isLoading = true;
    const payload = { empleoId };
    this.http.post<any>('https://malo-backend-empleos.onrender.com/api/Aplicacion/obtener-usuarios-por-empleo', payload).subscribe({
      next: (usuariosResponse) => {
        const usuarioIds = usuariosResponse.map((usuario: any) => usuario.usuario_id);
        
        if(usuarioIds !== 0){
          this.obtenerDocumentosPorUsuario(usuarioIds, empleoId);
        }else{
          this.successMessage[empleoId] = "No hay usuarios postulados a este empleo"
          return
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al obtener usuarios por empleo:', error)
        this.errorMessage = "Algo salio mal, intentalo más tarde";
        this.clearMessagesAfterDelay();
        this.isLoading = false;
      }
    });
  }

  obtenerDocumentosPorUsuario(usuarioIds: string, empleoId: number): void {
    this.isLoading = true;
    this.http.get<any>('https://malo-backend-documentos.onrender.com/api/Documento/GetDocumentos').subscribe({
      next: (documentosResponse) => {
        const pdfs = documentosResponse.filter((documento: any) =>
          usuarioIds.includes(documento.usuario_id)
        );

        if(pdfs.length === 0){
          this.successMessage[empleoId] = "No hay documentos para este usuario"
        }else{
          this.empleoDocumentos[empleoId] = pdfs.map((pdf: any) =>
            this.sanitizer.bypassSecurityTrustResourceUrl(pdf.contenido)
          );
          console.log(this.empleoDocumentos[empleoId].length)
          this.pdfIndices[empleoId] = 0; // Iniciar en el primer PDF
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error al obtener documentos:', error)
        this.errorMessage = "Algo salio mal, intentalo más tarde";
        this.clearMessagesAfterDelay();
      }
    });
  }

  // Navegar entre PDFs de un empleo específico
  navigatePdf(direction: 'left' | 'right', empleoId: number): void {
    this.isLoading = true;
    const totalPdfs = this.empleoDocumentos[empleoId].length;
    let currentIndex = this.pdfIndices[empleoId];

    if (direction === 'left') {
      currentIndex = (currentIndex - 1 + totalPdfs) % totalPdfs; // Navega a la izquierda, con bucle
    } else {
      currentIndex = (currentIndex + 1) % totalPdfs; // Navega a la derecha, con bucle
    }

    this.pdfIndices[empleoId] = currentIndex; // Actualiza el índice
    this.isLoading = false;
  }

  toggleEmpleoVisibilidad(empleoId: number): void {
    // Cambia el estado de visibilidad del empleo
    this.empleoVisibilidad[empleoId] = !this.empleoVisibilidad[empleoId];
  
    // Si el contenedor se vuelve visible, carga los usuarios y documentos
    if (this.empleoVisibilidad[empleoId]) {
      this.obtenerUsuariosPorEmpleo(empleoId);
    }
  }  

  clearMessagesAfterDelay() {
    setTimeout(() => {
      this.successMessage = '';
      this.errorMessage = '';
    }, 5000);
  }
}