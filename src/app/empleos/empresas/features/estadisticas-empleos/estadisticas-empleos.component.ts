import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../../../core/services/user.service';
import { Chart } from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(ChartDataLabels);

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

  total = 0;
  totalEmpleos = 0;
  totalAplicaciones = 0;
  aplicacionesPorEmpleo: {titulo: string, totalAplicaciones: number}[] = [];
  barChart: Chart | undefined;
  pieChart: Chart<'pie'>| undefined;
  lineChart: Chart<'line'> | undefined;

  lineChartData: {titulo: string; fechas: string[]; totales: number[]}[]=[];

  @ViewChild('barChartCanvas') barChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('pieChartCanvas') pieChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('lineChartCanvas') lineChartCanvas!: ElementRef<HTMLCanvasElement>;

  ngOnInit(): void {
      this.getEmpleoById();
  }

  limitarTitulo(titulo: string, limite: number): string{
    return titulo.length > limite ? titulo.slice(0, limite) + '...' : titulo;
  }
  
  mapFechasToTotales(fechasGloables: string[], fechas: string[], totales: number[]): number[]{
    const fechaTotalMap = fechas.reduce((map, fecha, index) => {
      map[fecha] = totales[index];
      return map;
    }, {} as Record<string, number>);

    return fechasGloables.map(fecha => fechaTotalMap[fecha] || 0);
  }

  getRandomColor(): string {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);

    return `rgb(${r}, ${g}, ${b}, 1)`
  }

  getEmpleoById(): void {

    const empresaId = this.userService.getUserData().sub;

    this.http.get<any>('https://malo-backend-empleos.onrender.com/api/Empleo/GetEmpleos')
      .subscribe({
        next: (response: any[]) => {
          const empleosFiltrados = response.filter(empleo => empleo.empresa_id === empresaId);

          this.total = response.length;
          this.totalEmpleos = empleosFiltrados.length;

          empleosFiltrados.forEach(empleo=>{
            const body = { empleoID: empleo.empleoId };
            const titulo = this.limitarTitulo(empleo.titulo, 20)
            
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
        const aplicacionesPorFecha: {fecha: string; totalAplicaciones: number}[] = response.map(item => ({
          fecha: item.fecha.split('T')[0],
          totalAplicaciones: item.totalAplicaciones
        }))

        console.log(aplicacionesPorFecha);

        const totalAplicaciones = aplicacionesPorFecha.reduce((sum, item) => sum +item.totalAplicaciones, 0);

        this.totalAplicaciones += totalAplicaciones;

        this.aplicacionesPorEmpleo.push({titulo, totalAplicaciones});

        this.updateBarChart();
        this.updatePieChart();
        this.updateLineChart(titulo, aplicacionesPorFecha);
      },
      error: (error: any) => {
        console.error('Error al obtener aplicaciones:', error);
      }
    })
  }

  updateBarChart(): void{
    if(this.barChart){
      this.barChart.destroy();
    }

    const labels = this.aplicacionesPorEmpleo.map(item => item.titulo);
    const data = this.aplicacionesPorEmpleo.map(item => item.totalAplicaciones);

    this.barChart = new Chart(this.barChartCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Postulaciones',
            data,
            backgroundColor: 'rgba(9,12,155, 1)',
          }
        ]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        plugins:{
          legend: {
            display: true,
            position: 'bottom',
            labels:{
              font:{
                size: 16,
              },
            },
          },
        },
        scales: {
          x: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              font: {
                size: 16,
              }
            }
          },
          y: {
            beginAtZero: true,
            ticks: {
              autoSkip: false,
              font: {
                size: 16,
              }
            }
          }
        }
      }
    });
  }

  updatePieChart(): void{
    if(this.pieChart){
      this.pieChart.destroy();
    }

    const porcentajeAplicaciones = this.totalAplicaciones / this.total * 100;
    const porcentajeRestante = 100 - porcentajeAplicaciones;

    this.pieChart = new Chart(this.pieChartCanvas.nativeElement,{
      type: 'pie',
      data: {
        labels: ['Tus postulaciones','Otras postulaciones'],
        datasets: [
          {
            data: [porcentajeAplicaciones, porcentajeRestante],
            backgroundColor: ['rgba(9, 12, 155, 1)', 'rgba(60, 55, 68, 1)'],
          },
        ],
      },
      options:{
        responsive: true,
        plugins:{
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              font: {
                size: 16,
              },
            },
          },
          tooltip: {
            enabled: true,
            callbacks: {
              label: (context) => {
                const dataIndex = context.dataIndex;

                const values = [this.totalAplicaciones, (this.total - this.totalAplicaciones)];
                const value = values[dataIndex];

                return `  ${value}`
              }
            }
          },
          datalabels: {
            color: '#ffff',
            font: {
              size: 18,
              weight: 'bold',
            },
            formatter: (value: number) => `${value.toFixed(1)}%`,
          }
        },
      }
    });
  }

  updateLineChart(titulo: string, aplicacionesPOrFecha: {fecha: string; totalAplicaciones:number}[]): void{
    const fechas = aplicacionesPOrFecha.map(item => item.fecha);
    const totales = aplicacionesPOrFecha.map(item => item.totalAplicaciones);
    this.lineChartData.push({titulo, fechas, totales})
    
    if (this.lineChart) {
      this.lineChart.destroy();
    }

    const fechasGlobales = [...new Set(this.lineChartData.flatMap(item => item.fechas))].sort();
    
    this.lineChart = new Chart(this.lineChartCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: fechasGlobales,
        datasets: this.lineChartData.map((item) => {
          const color = this.getRandomColor();
          return {
            label: item.titulo,
            data: this.mapFechasToTotales(fechasGlobales, item.fechas, item.totales),
            borderColor: color,
            backgroundColor: 'rgba(0,0,0,0',
            borderWidth: 2,
            tension: 0.3,
            pointRadius: 6,
            pointHoverRadius: 8,
            pointBackgroundColor: color,
          }
        }),
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            labels:{
              font: {
                size: 16,
              },
              boxWidth: 30,
              usePointStyle: true,
              pointStyle: 'line',
            },
          },
          tooltip: {
            enabled: true,
            mode: 'nearest',
            callbacks: {
              label: (context) => {
                const empleo = context.dataset.label;
                const postulaciones = context.raw;
                return `${empleo}:  ${postulaciones}`
              },
            },
          },
          datalabels: {
            display: false,
          }
        },
        scales: {
          x: {
            ticks: {
              font: {
                size: 16,
              },
            },
            title: {
              display: true,
              text: 'Fechas',
              font: {
                size: 16,
              },
            },
          },
          y: {
            ticks: {
              stepSize: 1,
              font: {
                size: 16,
              },
            },
            title: {
              display: true,
              text: 'Cantidad de postulaciones',
              font: {
                size: 16,
              },
            },
          },
        },
      },
    });
  }
}