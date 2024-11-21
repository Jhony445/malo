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

  titulo = '';
  total = 0;
  totalEmpleos = 0;
  totalAplicaciones = 0;
  aplicacionesPorFecha: {fecha: string, totalAplicaciones: number}[] = [];
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

  getTotalAplicaciones(): any {
    this.http.post<any>('https://malo-backend-empleos.onrender.com/api/Aplicacion/total-aplicaciones', null)
    .subscribe({
      next: (response: number) =>{
        this.total = response;
      },
      error: (error: any) => {
        console.error('Error al obtener aplicaciones:', error);
      }
    })
  }

  async getEmpleoById(): Promise<void> {
    this.isLoading = true;
    const empresaId = this.userService.getUserData().sub;
  
    try {
      const response = await this.http.get<any[]>('https://malo-backend-empleos.onrender.com/api/Empleo/GetEmpleos').toPromise();
      
      if (!response) {
        throw new Error('No se obtuvo respuesta de la API');
      }
      const empleosFiltrados = response.filter(empleo => empleo.empresa_id === empresaId);
      this.totalEmpleos = empleosFiltrados.length;
  
      for (const empleo of empleosFiltrados) {
        const body = { empleoID: empleo.empleoId };
        this.titulo = this.limitarTitulo(empleo.titulo, 20);
        
        await this.getAplicacionesPorEmpleo(body, this.titulo);  // Suponiendo que `getAplicacionesPorEmpleo` es una función asincrónica
      }
    } catch (error) {
      console.error('Error al obtener empleos:', error);
    } finally {
      this.isLoading = false;
    }
  }
  
  
  async getAplicacionesPorEmpleo(body: any, titulo: string): Promise<void> {
    try {
      const response = await this.http
        .post<any[]>('https://malo-backend-empleos.onrender.com/api/Aplicacion/contar-aplicaciones-empleos-por-fecha', body)
        .toPromise();

      if (!response) {
        throw new Error('No se obtuvo respuesta de la API');
      }
  
      this.aplicacionesPorFecha = response.map(item => ({
        fecha: item.fecha.split('T')[0],
        totalAplicaciones: item.totalAplicaciones
      }));
  
      const totalAplicaciones = this.aplicacionesPorFecha.reduce((sum, item) => sum + item.totalAplicaciones, 0);
  
      this.totalAplicaciones += totalAplicaciones;
  
      this.aplicacionesPorEmpleo.push({ titulo, totalAplicaciones });

      this.updateLineChart();
      this.updatePie2Chart();
      this.updatePieChart();
    } catch (error) {
      console.error('Error al obtener aplicaciones:', error);
    }
  }
  

  updatePie2Chart(): void {
    this.isLoading = true;

    if (this.pai2Chart) this.pai2Chart.destroy();
  
    const labels = this.aplicacionesPorEmpleo.map((item) => item.titulo);
    const data = this.aplicacionesPorEmpleo.map((item) => item.totalAplicaciones);
    const totalAplicaciones = data.reduce((sum, val) => sum + val, 0);
    const percentages = data.map((value) => ((value / totalAplicaciones) * 100).toFixed(1));
  
    // Pasar datos y porcentajes al servicio
    this.pai2Chart = this.chartService.createPie2Chart(
      this.barChartCanvas,
      labels,
      data,
      this.getRandomColor,
      percentages // Pasar porcentajes al servicio
    );
  
    this.isLoading = false;
  }
  

  updatePieChart(): void{
    this.isLoading = true;
    if(this.pieChart) this.pieChart.destroy();

    this.http.post<any>('https://malo-backend-empleos.onrender.com/api/Aplicacion/total-aplicaciones', null)
    .subscribe({
      next: (response: number) =>{
        this.total = response;

        this.pieChart = this.chartService.createPieChart(
          this.pieChartCanvas,
          this.totalAplicaciones,
          this.total
        )
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error al obtener aplicaciones:', error);
      this.isLoading = false;
      }
    })
  }

  updateLineChart(): void{
    this.isLoading = true;
    const fechas = this.aplicacionesPorFecha.map((item) => item.fecha);
    const totales = this.aplicacionesPorFecha.map((item) => item.totalAplicaciones);
    this.lineChartData.push({titulo: this.titulo, fechas, totales});

    if(this.lineChart) this.lineChart.destroy();
    
    const fechasGloables = [...new Set(this.lineChartData.flatMap((item) => item.fechas))].sort();
    this.lineChart = this.chartService. createLineChart(
      this.lineChartCanvas,
      fechasGloables,
      this.lineChartData,
      this.mapFechasToTotales,
      this.getRandomColor
    )
    this.isLoading = false;
  }
}