import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-busqueda',
  standalone: true,
  imports: [],
  templateUrl: './busqueda.component.html',
  styleUrl: './busqueda.component.css'
})
export class BusquedaComponent {
  constructor(private router: Router) { }

  // Método para redirigir a otra vista
  buscarEmpleo() {
    this.router.navigate(['/usuario']); // Cambia la ruta a /usuario
  }
}
