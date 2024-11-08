import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {
  @Output() filtersApplied = new EventEmitter<any>();

  searchKeyword = '';
  location = '';
  schedule = '';
  salary = '';

  isMobile = false;
  isFiltersOpen = false;
  hasFiltersApplied = false; // Nueva propiedad

  constructor(private route: ActivatedRoute) {
    this.checkIfMobile();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['search']) {
        this.searchKeyword = params['search'];
        this.applyFilters(true); // Aplica los filtros automáticamente
      }
    });
  }
  

  checkIfMobile(): void {
    this.isMobile = window.innerWidth <= 768;
  }

  toggleFilters(): void {
    this.isFiltersOpen = !this.isFiltersOpen;
  }

  applyFilters(autoApply = false): void {
    const filters = {
      searchKeyword: this.searchKeyword,
      location: this.location,
      schedule: this.schedule,
      salary: this.salary,
    };
    this.filtersApplied.emit(filters);

    // Verificar si hay algún filtro activo
    this.hasFiltersApplied = !!(
      this.searchKeyword ||
      this.location ||
      this.schedule ||
      this.salary
    );

    // Si es un filtrado automático, aplicar lógicamente sin requerir clic
    if (autoApply) {
      console.log("Filtrando automáticamente con búsqueda:", filters);
    }
  }

  clearFilters(): void {
    this.searchKeyword = '';
    this.location = '';
    this.schedule = '';
    this.salary = '';
    this.hasFiltersApplied = false; // Actualizar para ocultar el botón
    this.applyFilters();
  }
}
