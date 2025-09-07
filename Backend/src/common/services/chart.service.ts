import { Injectable } from '@nestjs/common';
import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import { ChartConfiguration } from 'chart.js';

@Injectable()
export class ChartService {
  private chartJSNodeCanvas: ChartJSNodeCanvas;

  constructor() {
    this.chartJSNodeCanvas = new ChartJSNodeCanvas({
      width: 800,
      height: 400,
      backgroundColour: 'white',
    });
  }

  async generateLineChart(
    data: any[],
    title: string,
    xAxisLabel: string = 'Bulan',
    yAxisLabel: string = 'Realisasi (Tabung)'
  ): Promise<Buffer> {
    // Handle different data formats
    let chartData: number[];
    let labels: string[];
    
    if (data.length > 0 && 'label' in data[0] && 'value' in data[0]) {
      // Format: {label: string, value: number}
      labels = data.map(item => item.label);
      chartData = data.map(item => item.value || 0);
    } else {
      // Legacy format: {bulan: number, totalRealisasi: number}
      const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
        'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
      ];
      
      chartData = months.map((month, index) => {
        const monthData = data.find(d => d.bulan === index + 1);
        return monthData ? monthData.totalRealisasi : 0;
      });
      labels = months;
    }

    const configuration: ChartConfiguration = {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Total Realisasi',
            data: chartData,
            borderColor: '#8884d8',
            backgroundColor: 'rgba(136, 132, 216, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#8884d8',
            pointBorderColor: '#8884d8',
            pointRadius: 6,
            pointHoverRadius: 8,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: title,
            font: {
              size: 18,
              weight: 'bold',
            },
            color: '#333',
            padding: 20,
          },
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              font: {
                size: 12,
              },
              color: '#666',
              padding: 15,
            },
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: xAxisLabel,
              font: {
                size: 14,
                weight: 'bold',
              },
              color: '#666',
            },
            grid: {
              color: '#f0f0f0',
              display: true,
            },
            ticks: {
              color: '#666',
              font: {
                size: 12,
              },
            },
          },
          y: {
            title: {
              display: true,
              text: yAxisLabel,
              font: {
                size: 14,
                weight: 'bold',
              },
              color: '#666',
            },
            grid: {
              color: '#f0f0f0',
              display: true,
            },
            ticks: {
              color: '#666',
              font: {
                size: 12,
              },
              callback: function(value) {
                return value.toLocaleString('id-ID');
              },
            },
            beginAtZero: true,
          },
        },
        elements: {
          point: {
            hoverBackgroundColor: '#8884d8',
            hoverBorderColor: '#fff',
            hoverBorderWidth: 2,
          },
        },
      },
    };

    return await this.chartJSNodeCanvas.renderToBuffer(configuration);
  }

  async generateBarChart(
    data: any[],
    title: string,
    xAxisLabel: string = 'Kategori',
    yAxisLabel: string = 'Nilai'
  ): Promise<Buffer> {
    const colors = [
      '#8884d8', '#82ca9d', '#ffc658', '#ff7c7c',
      '#8dd1e1', '#d084d0', '#ffb347', '#87ceeb'
    ];

    const chartData = data.map(item => item.value || item.totalRealisasi || 0);
    const labels = data.map(item => item.label || item.nama || item.bulan || 'Data');

    const configuration: ChartConfiguration = {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Nilai',
            data: chartData,
            backgroundColor: colors.slice(0, chartData.length),
            borderColor: colors.slice(0, chartData.length).map(color => color.replace('0.8', '1')),
            borderWidth: 2,
            borderRadius: 8,
            borderSkipped: false,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: title,
            font: {
              size: 18,
              weight: 'bold',
            },
            color: '#333',
            padding: 20,
          },
          legend: {
            display: false,
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: xAxisLabel,
              font: {
                size: 14,
                weight: 'bold',
              },
              color: '#666',
            },
            grid: {
              display: false,
            },
            ticks: {
              color: '#666',
              font: {
                size: 12,
              },
            },
          },
          y: {
            title: {
              display: true,
              text: yAxisLabel,
              font: {
                size: 14,
                weight: 'bold',
              },
              color: '#666',
            },
            grid: {
              color: '#f0f0f0',
              display: true,
            },
            ticks: {
              color: '#666',
              font: {
                size: 12,
              },
              callback: function(value) {
                return value.toLocaleString('id-ID');
              },
            },
            beginAtZero: true,
          },
        },
      },
    };

    return await this.chartJSNodeCanvas.renderToBuffer(configuration);
  }

  async generatePieChart(
    data: any[],
    title: string
  ): Promise<Buffer> {
    const colors = [
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
      '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
    ];

    const chartData = data.map(item => item.value || item.totalRealisasi || 0);
    const labels = data.map(item => item.label || item.nama || 'Data');

    const configuration: ChartConfiguration = {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [
          {
            data: chartData,
            backgroundColor: colors.slice(0, chartData.length),
            borderColor: '#fff',
            borderWidth: 3,
            hoverBorderWidth: 4,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: title,
            font: {
              size: 18,
              weight: 'bold',
            },
            color: '#333',
            padding: 20,
          },
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              font: {
                size: 12,
              },
              color: '#666',
              padding: 15,
              usePointStyle: true,
              pointStyle: 'circle',
            },
          },
        },
      },
    };

    return await this.chartJSNodeCanvas.renderToBuffer(configuration);
  }

  async generateYearlyComparisonChart(
    data: any[],
    title: string
  ): Promise<Buffer> {
    const years = [...new Set(data.map(item => item.tahun))].sort();
    const agents = [...new Set(data.map(item => item.namaAgen))];
    
    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'];
    
    const datasets = agents.map((agent, index) => {
      const agentData = years.map(year => {
        const yearData = data.find(item => item.tahun === year && item.namaAgen === agent);
        return yearData ? yearData.totalRealisasi : 0;
      });
      
      return {
        label: agent,
        data: agentData,
        backgroundColor: colors[index % colors.length],
        borderColor: colors[index % colors.length],
        borderWidth: 2,
        borderRadius: 6,
      };
    });

    const configuration: ChartConfiguration = {
      type: 'bar',
      data: {
        labels: years.map(year => year.toString()),
        datasets: datasets,
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: title,
            font: {
              size: 18,
              weight: 'bold',
            },
            color: '#333',
            padding: 20,
          },
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              font: {
                size: 12,
              },
              color: '#666',
              padding: 15,
            },
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Tahun',
              font: {
                size: 14,
                weight: 'bold',
              },
              color: '#666',
            },
            grid: {
              display: false,
            },
            ticks: {
              color: '#666',
              font: {
                size: 12,
              },
            },
          },
          y: {
            title: {
              display: true,
              text: 'Total Realisasi (Tabung)',
              font: {
                size: 14,
                weight: 'bold',
              },
              color: '#666',
            },
            grid: {
              color: '#f0f0f0',
              display: true,
            },
            ticks: {
              color: '#666',
              font: {
                size: 12,
              },
              callback: function(value) {
                return value.toLocaleString('id-ID');
              },
            },
            beginAtZero: true,
          },
        },
      },
    };

    return await this.chartJSNodeCanvas.renderToBuffer(configuration);
  }
}