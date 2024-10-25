import { Component, OnInit } from '@angular/core';
import { CardEmpleosComponent } from '../../ui/card-empleos/card-empleos.component';
import { CommonModule } from '@angular/common';
import { DetalleEmpleoComponent } from '../../ui/detalle-empleo/detalle-empleo.component';
import { TituloComponent } from "../../../../shared/ui/titulo/titulo.component";
import { HttpClient } from '@angular/common/http';
import { LoaderComponent } from '../../../../shared/ui/loader/loader.component';

@Component({
  selector: 'app-lista-empleos',
  standalone: true,
  imports: [CommonModule, CardEmpleosComponent, DetalleEmpleoComponent, TituloComponent, LoaderComponent],
  templateUrl: './lista-empleos.component.html',
  styleUrls: ['./lista-empleos.component.css']
})
export class ListaEmpleosComponent implements OnInit {
  empleos: any[] = [];
  itemsPerPage: number = 5;
  currentPage: number = 1;
  totalPages: number = 1;
  selectedEmpleoIndex: number | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchEmpleos();
  }
  
  fetchEmpleos() {
    this.http.get<any[]>('https://malo-backend-empleos.onrender.com/api/Empleo/GetEmpleos')
      .subscribe(
        (data: any[]) => {
          this.empleos = data;
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
