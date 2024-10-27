import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardEmpleosEmpresaComponent } from '../../ui/card-empleos-empresa/card-empleos-empresa.component';
import { DetalleEmpleoEmpresaComponent } from '../../ui/detalle-empleo-empresa/detalle-empleo-empresa.component';
import { TituloComponent } from '../../../../shared/ui/titulo/titulo.component';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../../../core/services/user.service';

@Component({
  selector: 'app-tablon-empresas',
  standalone: true,
  imports: [CommonModule, CardEmpleosEmpresaComponent, DetalleEmpleoEmpresaComponent, TituloComponent],
  templateUrl: './tablon-empresas.component.html',
  styleUrls: ['./tablon-empresas.component.css']
})
export class TablonEmpresasComponent implements OnInit {
  empleos: any[] = [];
  filteredEmpleos: any[] = [];
  itemsPerPage: number = 5;
  currentPage: number = 1;
  totalPages: number = 1;
  selectedEmpleoIndex: number | null = null;
  empleoSeleccionado: any = null; // Agregar esta propiedad para gestionar el empleo seleccionado
  isLoading: boolean = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit() {
    const empresaId = this.userService.getUserData()?.sub;
    if (empresaId) {
      this.fetchEmpleos(empresaId);
    } else {
      console.error('No se encontró el ID de la empresa autenticada.');
    }
  }

  fetchEmpleos(empresaId: string) {
    this.http.get<any[]>('https://malo-backend-empleos.onrender.com/api/Empleo/GetEmpleos')
      .subscribe(
        (data: any[]) => {
          this.empleos = data.filter(empleo => empleo.empresa_id === empresaId);
          this.filteredEmpleos = this.empleos;
          this.updateTotalPages();
        },
        error => console.error('Error al cargar empleos:', error)
      );
  }

  updateTotalPages() {
    this.totalPages = Math.ceil(this.filteredEmpleos.length / this.itemsPerPage);
  }

  get paginatedEmpleos() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredEmpleos.slice(startIndex, startIndex + this.itemsPerPage);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  onCardClick(index: number) {
    this.selectedEmpleoIndex = index;
    this.empleoSeleccionado = this.empleos[index]; // Asignar el empleo seleccionado
    console.log("ID del empleo seleccionado:", this.empleoSeleccionado.empleoId);
  }

  onPublicarEmpleo() {
    this.router.navigate(['empresa/crear']);
  }

  actualizarListaEmpleos(empleoId: string) {
    this.empleos = this.empleos.filter(empleo => empleo.empleoId !== empleoId);
    this.filteredEmpleos = this.empleos; // Actualizar la lista filtrada también
    this.updateTotalPages(); // Recalcular el número de páginas
    this.selectedEmpleoIndex = null; // Limpiar la selección
  }
  actualizarEmpleo(empleoActualizado: any) {
    const index = this.empleos.findIndex(empleo => empleo.empleoId === empleoActualizado.empleoId);
    if (index !== -1) {
      this.empleos[index] = empleoActualizado;
      this.filteredEmpleos = this.empleos;
    }
  }

}
