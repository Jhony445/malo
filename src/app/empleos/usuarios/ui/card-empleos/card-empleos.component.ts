import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-empleos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-empleos.component.html',
  styleUrls: ['./card-empleos.component.css']
})
export class CardEmpleosComponent implements OnInit {
  @Input() empleo: any;
  @Input() selected = false;
  @Output() cardClick = new EventEmitter<string>(); // Emitir el empleoId

  ngOnInit() {
    console.log(this.empleo);  // Verificar qué datos recibe el componente
  }

  onCardClick() {
    this.cardClick.emit(this.empleo.empleoId); // Emitir el empleoId al hacer clic en la tarjeta
  }
}