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
  itemsPerPage = 5;
  aplicacionesCount: Record<number, number> = {};
  isLoading = false;
  successMessage: Record<number, string> = {};
  errorMessage = '';
  empleoDocumentos: Record<number, any[]> = {}; // PDFs de cada empleo
  pdfIndices: Record<number, number> = {}; // Índices actuales de PDFs
  empleoVisibilidad: Record<number, boolean> = {}; // Visibilidad de cada empleo
  isPdfLoading: Record<number, boolean> = {}; // Para manejar el estado de carga del PDF de cada empleo
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
        this.empleosFiltrados = response
          .filter((empleo: any) => empleo.empresa_id === userId)
          .sort((a: any, b: any) => new Date(b.fecha_publicacion).getTime() - new Date(a.fecha_publicacion).getTime());
  
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

  obtenerUsuariosPorEmpleo(empleoId: number): void {
    console.log(empleoId)
    const payload = { empleoId };
    this.http.post<any>('https://malo-backend-empleos.onrender.com/api/Aplicacion/obtener-usuarios-por-empleo', payload).subscribe({
      next: (usuariosResponse) => {
        const usuarioIds = usuariosResponse.map((usuario: any) => usuario.usuario_id);
        
        if(usuarioIds !== 0){
          this.obtenerDocumentosPorUsuario(usuarioIds, empleoId);
        }else{
          this.successMessage[empleoId] = "No hay usuarios postulados a este empleo"
          this.isLoading = false;
        }
      },
      error: (error) => {
        console.error('Error al obtener usuarios por empleo:', error)
        this.errorMessage = "Algo salio mal, intentalo más tarde";
        this.isLoading = false;
        this.clearMessagesAfterDelay();
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
          this.successMessage[empleoId] = "No hay documentos que mostrar";
          this.isLoading = false;
        } else {
          this.empleoDocumentos[empleoId] = pdfs.map((pdf: any) =>
            this.sanitizer.bypassSecurityTrustResourceUrl(pdf.contenido)
          );
          console.log(this.empleoDocumentos[empleoId].length);
          this.pdfIndices[empleoId] = 0; // Iniciar en el primer PDF
          this.isLoading = false;
        }
      },
      error: (error) => {
        console.error('Error al obtener documentos:', error);
        this.errorMessage = "Algo salió mal, intentalo más tarde";
        this.isLoading = false;
        this.clearMessagesAfterDelay();
      }
    });
  }
  

  // Navegar entre PDFs de un empleo específico
  navigatePdf(direction: 'left' | 'right', empleoId: number): void {
    if (this.empleoDocumentos[empleoId]?.length <= 1) {
      return; // Si hay menos de 2 documentos, no hacemos nada
    }
    
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
  
    // Contador en consola para saber qué PDF se está viendo
    console.log(`PDF ${currentIndex + 1} de ${totalPdfs}`);
  }

  
  toggleEmpleoVisibilidad(empleoId: number): void {
    // Si el empleo ya está visible, lo ocultamos
    this.isLoading = true;
    if (this.empleoVisibilidad[empleoId]) {
      this.empleoVisibilidad[empleoId] = false;
      this.isLoading = false;
    } else {
      // Si el empleo no está visible, ocultamos todos los demás y mostramos solo este
      for (const id in this.empleoVisibilidad) {
        this.empleoVisibilidad[id] = false; // Ocultamos todos los empleos
      }
      this.empleoVisibilidad[empleoId] = true; // Mostramos el empleo seleccionado
      this.isLoading = false;
    }
  
    // Si el contenedor se vuelve visible, carga los usuarios y documentos
    if (this.empleoVisibilidad[empleoId]) {
      this.obtenerUsuariosPorEmpleo(empleoId);
      this.isLoading = false;
    }
  }
  

  clearMessagesAfterDelay() {
    setTimeout(() => {
      this.successMessage = '';
      this.errorMessage = '';
    }, 5000);
  }
}