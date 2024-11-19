import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../../../core/services/user.service';
import { Chart } from 'chart.js/auto';

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
  aplicacionesPorEmpleo: {titulo: string, totalAplicaciones: number}[] = [];
  chart: Chart | undefined;

  @ViewChild('barChartCanvas') barChartCanvas!: ElementRef<HTMLCanvasElement>;

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
            const titulo = this.limitarTitulo(empleo.titulo, 25)
            
            this.getAplicacionesPorEmpleo(body, titulo);
          })
        },
        error: (error: any) => {
          console.error('Error al obtener empleos:', error);
        }
      });
  }
  
  getAplicacionesPorEmpleo(body: any, titulo: string): void {

    this.http.post<any>('https://malo-backend-empleos.onrender.com/api/Aplicacion/contar-aplicaciones-empleos-por-fecha', body)
    .subscribe({
      next: (response: any[]) => {
        const totalAplicaciones = response.reduce((sum, item) => sum +item.totalAplicaciones, 0);

        this.totalAplicaciones += totalAplicaciones;

        this.aplicacionesPorEmpleo.push({titulo, totalAplicaciones});

        console.log(this.aplicacionesPorEmpleo);
        this.updateBarChart();
      },
      error: (error: any) => {
        console.error('Error al obtener aplicaciones:', error);
      }
    })
  }

  updateBarChart(): void{
    if(this.chart){
      this.chart.destroy();
    }

    const labels = this.aplicacionesPorEmpleo.map(item => item.titulo);
    const data = this.aplicacionesPorEmpleo.map(item => item.totalAplicaciones);

    this.chart = new Chart(this.barChartCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Postulaciones',
            data,
            backgroundColor: 'rgba(180, 197, 228, 1)',
            borderColor: 'rgba(9, 12, 155, 1)',
            borderWidth: 1
          }
        ]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        plugins:{
          legend: {
            display: true
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          },
          y: {
            beginAtZero: true,
            ticks: {
              autoSkip: false,
            }
          }
        }
      }
    });
  }

  limitarTitulo(titulo: string, limite: number): string{
    return titulo.length > limite ? titulo.slice(0, limite) + '...' : titulo;
  }
}
