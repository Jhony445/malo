import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Importar FormsModule

@Component({
  selector: 'app-detalle-empleo-empresa',
  standalone: true,
  imports: [CommonModule, FormsModule],  // Agregar FormsModule aquí
  templateUrl: './detalle-empleo-empresa.component.html',
  styleUrls: ['./detalle-empleo-empresa.component.css']
})
export class DetalleEmpleoEmpresaComponent {
  @Input() empleo: any;

  modoEdicion: boolean = false;

  activarEdicion() {
    this.modoEdicion = true;
  }

  guardarCambios() {
    this.modoEdicion = false;
    // Aquí puedes agregar la lógica para guardar los cambios, como una llamada a un servicio o API
  }
}
