import { Injectable, ElementRef } from '@angular/core';
import { Chart } from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(ChartDataLabels);

@Injectable({
  providedIn: 'root',
})

export class ChartService {
  createPie2Chart(
    canvas: ElementRef<HTMLCanvasElement>,
    labels: string[],
    data: number[],
    getRandomColor: () => string,
    percentages: string[], // Recibir porcentajes como argumento
  ): Chart<'pie', number[], unknown> {
    const colors = labels.map(() => getRandomColor());
  
    return new Chart<'pie', number[], unknown>(canvas.nativeElement, {
      type: 'pie',
      data: {
        labels,
        datasets: [
          {
            data,
            backgroundColor: colors, // Asignar colores a cada sector
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              generateLabels: () => {
                return labels.map((label, index) => ({
                  text: `${label}`, // Mostrar el porcentaje en la leyenda
                  fillStyle: colors[index],
                  hidden: false,
                  lineWidth: 0,
                }));
              },
              font: { size: 14 },
            },
          },
          tooltip:{
            callbacks: {
              label: (item: any) => {
                const index = item.dataIndex;
                const sectorValue = data[index];
                return `Postulaciones: ${sectorValue}`
              }
            }
          },
          datalabels: {
            display: true,
            color: '#fff',
            formatter: (_: number, context: any) => {
              const index = context.dataIndex;
              return `${percentages[index]}%`;
            },
            font: {
              size: 16,
              weight: 'bold',
            },
          },
        },
      },
    });
  }  

  createPieChart(
    canvas: ElementRef<HTMLCanvasElement>,
    totalAplicaciones: number,
    total: number
  ): Chart<'pie'> {
    const porcentajeAplicaciones = (totalAplicaciones / total) * 100;
    const porcentajeRestante = 100 - porcentajeAplicaciones;

    return new Chart(canvas.nativeElement, {
      type: 'pie',
      data: {
        labels: ['Tus postulaciones', 'Otras postulaciones'],
        datasets: [
          {
            data: [porcentajeAplicaciones, porcentajeRestante],
            backgroundColor: ['rgba(9, 12, 155, 1)', 'rgba(60, 55, 68, 1)'],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: { font: { size: 16 } },
          },
          datalabels: {
            color: '#ffff',
            font: { size: 16, weight: 'bold' },
            formatter: (value: number) => `${value.toFixed(1)}%`,
          },
        },
      },
    });
  }

  createLineChart(
    canvas: ElementRef<HTMLCanvasElement>,
    fechasGlobales: string[],
    datasets: any[],
    mapFechasToTotales: (fechasGloables: string[], fechas: string[], totales: number[]) => number[],
    getRandomColor: () => string
  ): Chart<'line'> {
    return new Chart(canvas.nativeElement, {
      type: 'line',
      data: {
        labels: fechasGlobales,
        datasets: datasets.map((item) => {
          const color = getRandomColor();
          return {
            label: item.titulo,
            data: mapFechasToTotales(fechasGlobales, item.fechas, item.totales),
            borderColor: color,
            backgroundColor: 'rgba(0,0,0,0',
            borderWidth: 2,
            tension: 0.3,
            pointRadius: 6,
            pointHoverRadius: 8,
            pointBackgroundColor: color,
          };
        }),
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            labels: {
              font: { size: 16 },
              boxWidth: 30,
              usePointStyle: true,
              pointStyle: 'line',
            },
          },
          datalabels: { display: false },
        },
        scales: {
          x: {
            ticks: {
              font: {
                size: 16,
              }
            }
          },
          y: {
            beginAtZero: true,
            ticks: { stepSize: 1, font: { size: 16 } },
          },
        },
      },
    });
  }
}