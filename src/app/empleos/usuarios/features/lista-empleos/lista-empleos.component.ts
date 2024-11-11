import { Component, OnInit , Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

import { CardEmpleosComponent } from '../../ui/card-empleos/card-empleos.component';
import { DetalleEmpleoComponent } from '../../ui/detalle-empleo/detalle-empleo.component';
import { TituloComponent } from "../../../../shared/ui/titulo/titulo.component";
import { SearchBarComponent } from '../../ui/search-bar/search-bar.component';

@Component({
  selector: 'app-lista-empleos',
  standalone: true,
  imports: [CommonModule, CardEmpleosComponent, DetalleEmpleoComponent, TituloComponent, SearchBarComponent],
  templateUrl: './lista-empleos.component.html',
  styleUrls: ['./lista-empleos.component.css']
})
export class ListaEmpleosComponent implements OnInit {
  empleos: any[] = [];
  filteredEmpleos: any[] = [];
  empresas: any[] = [];
  itemsPerPage = 5;
  currentPage = 1;
  totalPages = 1;
  selectedEmpleoIndex: number | null = null;
  empleoSeleccionado: any = null;
  isDetalleVisibleMobile = false; 
  initialFilters: any = {}; // Para almacenar filtros iniciales de la URL
  isLoading = true; // Para manejar el estado de carga

  @Output() empleoSeleccionadoEvent = new EventEmitter<number>();

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.initialFilters = {
        searchKeyword: params['search'] || '',
        location: params['location'] || '',
        schedule: params['schedule'] || '',
        salary: params['salary'] || ''
      };
    });

    this.fetchEmpresas();
  }

  fetchEmpresas() {
    this.http.get<any[]>('https://malo-backend-empresas.onrender.com/api/Empresa/GetEmpresa')
      .subscribe(
        (data: any[]) => {
          this.empresas = data;
          this.fetchEmpleos();
        },
        error => console.error('Error al cargar empresas:', error)
      );
  }

  fetchEmpleos() {
    this.isLoading = true;
    this.http.get<any[]>('https://malo-backend-empleos.onrender.com/api/Empleo/GetEmpleos')
      .subscribe(
        (data: any[]) => {
          this.empleos = data.map(empleo => {
            const empresa = this.empresas.find(e => e.id === empleo.empresa_id);
            return {
              ...empleo,
              empresaNombre: empresa ? empresa.nombre : 'Empresa desconocida'
            };
          });
  
          this.empleos.sort((a, b) => new Date(b.fecha_publicacion).getTime() - new Date(a.fecha_publicacion).getTime());
  
          this.filteredEmpleos = this.empleos;
          this.applyInitialFilters();
          this.updateTotalPages();
          this.isLoading = false;
        },
        error => {
          console.error('Error al cargar empleos:', error);
          this.isLoading = false;
        }
      );
  }

  applyInitialFilters() {
    if (Object.values(this.initialFilters).some(filter => filter)) {
      this.onFiltersApplied(this.initialFilters);
    }
  }

  onFiltersApplied(filters: any) {
    this.filteredEmpleos = this.empleos.filter(empleo => {
      return (
        (!filters.searchKeyword || empleo.titulo.toLowerCase().includes(filters.searchKeyword.toLowerCase())) &&
        (!filters.location || empleo.ubicacion.toLowerCase().includes(filters.location.toLowerCase())) &&
        (!filters.schedule || empleo.horario.toLowerCase() === filters.schedule.toLowerCase()) &&
        (!filters.salary || this.isSalaryMatch(empleo.salario_maximo, filters.salary))
      );
    });
  
    this.updateTotalPages();
    this.currentPage = 1;
  }

  isSalaryMatch(salario: number | undefined | null, salaryFilter: string): boolean {
    if (!salaryFilter) return true;

    const [minSalary, maxSalary] = salaryFilter.split('-').map(s => parseInt(s.replace(/[^\d]/g, ''), 10) * 1000);
    return salario !== undefined && salario !== null && salario >= minSalary && salario <= maxSalary;
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
    this.empleoSeleccionado = this.empleos[index];

    // Emitir el empleoId del empleo seleccionado usando empleoSeleccionadoEvent
    this.empleoSeleccionado?.empleoId && this.empleoSeleccionadoEvent.emit(this.empleoSeleccionado.empleoId);

    if (window.innerWidth <= 768) {
      this.isDetalleVisibleMobile = true;
    }
  }

  closeDetalleMobile() {
    this.isDetalleVisibleMobile = false;
  }
}