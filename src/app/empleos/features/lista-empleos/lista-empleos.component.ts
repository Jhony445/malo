import { Component } from '@angular/core';
import { CardEmpleosComponent } from "../../ui/card-empleos/card-empleos.component";
import { CommonModule } from '@angular/common';  // Importar 
import { DetalleEmpleoComponent } from '../../ui/detalle-empleo/detalle-empleo.component';

@Component({
  selector: 'app-lista-empleos',
  standalone: true,
  imports: [CommonModule,CardEmpleosComponent, DetalleEmpleoComponent],
  templateUrl: './lista-empleos.component.html',
  styleUrl: './lista-empleos.component.css'
})
export class ListaEmpleosComponent {
  empleos: any[] = [
    {
      titulo: 'Desarrollador Frontend',
      empresa: 'Empresa A',
      descripcion: 'Trabaja con Angular',
      ubicacion: 'Ciudad de México',
      salario: '$30,000',
      tipoTrabajo: 'Remoto'
    },
    {
      titulo: 'Diseñador UX/UI',
      empresa: 'Empresa B',
      descripcion: 'Diseña experiencias',
      ubicacion: 'Monterrey',
      salario: '$25,000',
      tipoTrabajo: 'Presencial'
    },
    {
      titulo: 'Desarrollador Frontend',
      empresa: 'Empresa A',
      descripcion: 'Trabaja con Angular',
      ubicacion: 'Ciudad de México',
      salario: '$30,000',
      tipoTrabajo: 'Remoto'
    },
    {
      titulo: 'Desarrollador Frontend',
      empresa: 'Empresa A',
      descripcion: 'Trabaja con Angular',
      ubicacion: 'Ciudad de México',
      salario: '$30,000',
      tipoTrabajo: 'Remoto'
    },
    {
      titulo: 'Desarrollador Frontend',
      empresa: 'Empresa A',
      descripcion: 'Trabaja con Angular',
      ubicacion: 'Ciudad de México',
      salario: '$30,000',
      tipoTrabajo: 'Remoto'
    },
    {
      titulo: 'Desarrollador Frontend',
      empresa: 'Empresa A',
      descripcion: 'Trabaja con Angular',
      ubicacion: 'Ciudad de México',
      salario: '$30,000',
      tipoTrabajo: 'Remoto'
    },
  ];

  itemsPerPage: number = 5; // Número de empleos por página
  currentPage: number = 1; // Página actual
  selectedEmpleoIndex: number | null = null;

  get paginatedEmpleos() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.empleos.slice(startIndex, startIndex + this.itemsPerPage);
  }

  nextPage() {
    if (this.currentPage * this.itemsPerPage < this.empleos.length) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  onCardClick(index: number) {
    this.selectedEmpleoIndex = index; // Actualiza el índice de la tarjeta seleccionada
  }
}

