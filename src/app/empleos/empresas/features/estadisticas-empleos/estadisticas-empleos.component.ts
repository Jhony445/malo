import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../../../core/services/user.service';

@Component({
  selector: 'app-estadisticas-empleos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './estadisticas-empleos.component.html',
  styleUrl: './estadisticas-empleos.component.css'
})
export class EstadisticasEmpleosComponent implements OnInit {
  userService = inject(UserService);
  http = inject(HttpClient);

  totalEmpleos = 0;
  totalAplicaciones = 0;

  ngOnInit(): void {
      this.getEmpleoById();
  }

  getEmpleoById(): void {
    const empresaId = this.userService.getUserData().sub;

    this.http.get<any>('https://malo-backend-empleos.onrender.com/api/Empleo/GetEmpleos')
      .subscribe({
        next: (response: any[]) => {
          const empleosFiltrados = response.filter(empleo => empleo.empresa_id === empresaId);

          console.log(empleosFiltrados);

          this.totalEmpleos = empleosFiltrados.length;
          this.totalAplicaciones = 0;

          empleosFiltrados.forEach(empleo=>{
            const body = { empleoID: empleo.empleoId };
            
            this.getAplicacionesPorEmpleo(body);
          })
        },
        error: (error: any) => {
          console.error('Error al obtener empleos:', error);
        }
      });
  }
  
  getAplicacionesPorEmpleo(body: any): void{
    this.http.post<any>('https://malo-backend-empleos.onrender.com/api/Aplicacion/contar-aplicaciones-empleos-por-fecha', body)
    .subscribe({
      next: (response: any[]) => {
        response.forEach(item =>{
          this.totalAplicaciones += item.totalAplicaciones;
        })
      },
      error: (error: any) => {
        console.error('Error al obtener aplicaciones:', error);
      }
    })
  }
}
