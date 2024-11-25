import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-card-empleos-empresa',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-empleos-empresa.component.html',
  styleUrls: ['./card-empleos-empresa.component.css', './skeleton-empresas.css']
})
export class CardEmpleosEmpresaComponent implements OnInit {
  @Input() empleo: any;
  @Input() selected = false; // Nuevo input para indicar si la tarjeta está seleccionada
  @Output() cardClick = new EventEmitter<void>();
  @Input() isSkeleton = false; 

  ngOnInit() {
    if (!this.empleo) {
      this.isSkeleton = true; // Activa skeleton si empleo está vacío
    } else {
      this.empleo.fecha_publicacion = this.empleo.fecha_publicacion || ''; // Valor por defecto
    }
  }

  onCardClick() {
    this.cardClick.emit(); // Emitir el evento cuando se hace clic en la tarjeta
  }
}
