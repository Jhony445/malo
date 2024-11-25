import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-empleos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-empleos.component.html',
  styleUrls: ['./card-empleos.component.css', './skeleton.css']
})
export class CardEmpleosComponent implements OnInit {
  @Input() empleo: any;
  @Input() selected = false;
  @Output() cardClick = new EventEmitter<string>(); // Emitir el empleoId
  @Input() isSkeleton = false;

  ngOnInit() {
    if (!this.empleo) {
      this.isSkeleton = true; // Activa skeleton si empleo está vacío
    }
  }


  onCardClick() {
    this.cardClick.emit(this.empleo.empleoId); // Emitir el empleoId al hacer clic en la tarjeta
  }
}