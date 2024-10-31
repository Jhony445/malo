import { Component, OnInit } from '@angular/core';
import { CardEmpleosComponent } from '../../ui/card-empleos/card-empleos.component';
import { CommonModule } from '@angular/common';
import { DetalleEmpleoComponent } from '../../ui/detalle-empleo/detalle-empleo.component';
import { TituloComponent } from "../../../../shared/ui/titulo/titulo.component";
import { HttpClient } from '@angular/common/http';
import { LoaderComponent } from '../../../../shared/ui/loader/loader.component';
import { SearchBarComponent } from "../../ui/search-bar/search-bar.component";

@Component({
  selector: 'app-lista-empleos',
  standalone: true,
  imports: [CommonModule, CardEmpleosComponent, DetalleEmpleoComponent, TituloComponent, LoaderComponent, SearchBarComponent],
  templateUrl: './lista-empleos.component.html',
  styleUrls: ['./lista-empleos.component.css']
})
export class ListaEmpleosComponent implements OnInit {
  empleos: any[] = [];
  empresas: any[] = []; // Array para almacenar las empresas
  itemsPerPage: number = 5;
  currentPage: number = 1;
  totalPages: number = 1;
  selectedEmpleoIndex: number | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchEmpresas();
  }

  fetchEmpresas() {
    // Primero obtenemos las empresas
    this.http.get<any[]>('https://malo-backend-empresas.onrender.com/api/Empresa/GetEmpresa')
      .subscribe(
        (data: any[]) => {
          this.empresas = data;
          this.fetchEmpleos(); // Luego obtenemos los empleos
        },
        error => console.error('Error al cargar empresas:', error)
      );
  }

  fetchEmpleos() {
    this.http.get<any[]>('https://malo-backend-empleos.onrender.com/api/Empleo/GetEmpleos')
      .subscribe(
        (data: any[]) => {
          // Asignar el nombre de la empresa a cada empleo
          this.empleos = data.map(empleo => {
            const empresa = this.empresas.find(e => e.id === empleo.empresa_id);
            return {
              ...empleo,
              empresaNombre: empresa ? empresa.nombre : 'Empresa desconocida'
            };
          });
          this.updateTotalPages();
        },
        error => console.error('Error al cargar empleos:', error)
      );
  }

  updateTotalPages() {
    this.totalPages = Math.ceil(this.empleos.length / this.itemsPerPage);
  }

  get paginatedEmpleos() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.empleos.slice(startIndex, startIndex + this.itemsPerPage);
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
  }
}
