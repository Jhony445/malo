import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../../../../shared/ui/loader/loader.component';
import { ChartService } from '../../../../core/services/chart.service';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../../../core/services/user.service';
import { Chart } from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(ChartDataLabels);

@Component({
  selector: 'app-estadisticas-empleos',
  standalone: true,
  imports: [CommonModule, LoaderComponent],
  templateUrl: './estadisticas-empleos.component.html',
  styleUrl: './estadisticas-empleos.component.css'
})
export class EstadisticasEmpleosComponent implements OnInit { 
  userService = inject(UserService);
  http = inject(HttpClient);
  chartService= inject(ChartService);
  isLoading = false;

  total = 0;
  totalEmpleos = 0;
  totalAplicaciones = 0;
  aplicacionesPorEmpleo: {titulo: string, totalAplicaciones: number}[] = [];
  pai2Chart: Chart<'pie'> | undefined;
  pieChart: Chart<'pie'> | undefined;
  lineChart: Chart<'line'> | undefined;

  lineChartData: {titulo: string; fechas: string[]; totales: number[]}[]=[];

  @ViewChild('pie2ChartCanvas') barChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('pieChartCanvas') pieChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('lineChartCanvas') lineChartCanvas!: ElementRef<HTMLCanvasElement>;

  ngOnInit(): void {
    this.getEmpleoById();
  }

  limitarTitulo(titulo: string, limite: number): string{
    return titulo.length > limite ? titulo.slice(0, limite) + '..' : titulo;
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
    this.isLoading = true;
    const empresaId = this.userService.getUserData().sub;

    this.http.get<any>('https://malo-backend-empleos.onrender.com/api/Empleo/GetEmpleos')
      .subscribe({
        next: (response: any[]) => {
          const empleosFiltrados = response.filter(empleo => empleo.empresa_id === empresaId);

          this.totalEmpleos = empleosFiltrados.length;

          empleosFiltrados.forEach(empleo=>{
            const body = { empleoID: empleo.empleoId };
            const titulo = this.limitarTitulo(empleo.titulo, 20)
            
            this.getAplicacionesPorEmpleo(body, titulo);
          })
          this.isLoading = false;
        },
        error: (error: any) => {
          console.error('Error al obtener empleos:', error);
        }
      });
  }
  
  getAplicacionesPorEmpleo(body: any, titulo: string): void {
    console.log(body);
    this.http.post<any>('https://malo-backend-empleos.onrender.com/api/Aplicacion/contar-aplicaciones-empleos-por-fecha', body)
    .subscribe({
      next: (response: any[]) => {
        const aplicacionesPorFecha: {fecha: string; totalAplicaciones: number}[] = response.map(item => ({
          fecha: item.fecha.split('T')[0],
          totalAplicaciones: item.totalAplicaciones
        }))

        const totalAplicaciones = aplicacionesPorFecha.reduce((sum, item) => sum +item.totalAplicaciones, 0);

        this.totalAplicaciones += totalAplicaciones;

        this.aplicacionesPorEmpleo.push({titulo, totalAplicaciones});

        console.log("Todas: ", this.total, " | solo empresa: ", this.totalAplicaciones);

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
    if (this.pai2Chart) this.pai2Chart.destroy();

    const labels = this.aplicacionesPorEmpleo.map((item) => item.titulo);
    const data = this.aplicacionesPorEmpleo.map((item) => item.totalAplicaciones);
    this.pai2Chart = this.chartService.createPie2Chart(this.barChartCanvas, labels, data, this.getRandomColor);
  }

  updatePieChart(): void{
    if(this.pieChart) this.pieChart.destroy();

    this.pieChart = this.chartService.createPieChart(
      this.pieChartCanvas,
      this.totalAplicaciones,
      this.total
    )
  }

  updateLineChart(titulo: string, aplicacionesPOrFecha: {fecha: string; totalAplicaciones:number}[]): void{
    const fechas = aplicacionesPOrFecha.map((item) => item.fecha);
    const totales = aplicacionesPOrFecha.map((item) => item.totalAplicaciones);
    this.lineChartData.push({titulo, fechas, totales});

    if(this.lineChart) this.lineChart.destroy();

    const fechasGloables = [...new Set(this.lineChartData.flatMap((item) => item.fechas))].sort();
    this.lineChart = this.chartService. createLineChart(
      this.lineChartCanvas,
      fechasGloables,
      this.lineChartData,
      this.mapFechasToTotales,
      this.getRandomColor
    )
  }
}