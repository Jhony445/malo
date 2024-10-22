import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common'; 

@Component({
  standalone:true,
  imports:[CommonModule],
  selector: 'app-detalle-empleo',
  templateUrl: './detalle-empleo.component.html',
  styleUrls: ['./detalle-empleo.component.css']
})
export class DetalleEmpleoComponent {
  @Input() empleo: any;  // Recibe el empleo seleccionado
}
