import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-busqueda',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './busqueda.component.html',
  styleUrls: ['./busqueda.component.css']
})
export class BusquedaComponent implements OnInit {
  @Output() queryChanged = new EventEmitter<string>(); // Evento para emitir cambios de query

  query = '';
  suggestions: string[] = [];
  empleos: string[] = [];

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<{ titulo: string }[]>('https://malo-backend-empleos.onrender.com/api/Empleo/GetEmpleos')
      .subscribe(data => {
        this.empleos = data.map(emp => emp.titulo);  // Cambiado a 'titulo'
        console.log('Empleos disponibles para sugerencias:', this.empleos);
      });
  }

  onInputChange() {
    this.queryChanged.emit(this.query); // Emitir el valor actual de query
    this.suggestions = this.empleos
      .filter(emp => emp && emp.toLowerCase().includes(this.query.toLowerCase()))
      .slice(0, 5);  // Limitar a 5 sugerencias
  }

  buscarEmpleo() {
    this.router.navigate(['/usuario'], { queryParams: { search: this.query } });
  }
}