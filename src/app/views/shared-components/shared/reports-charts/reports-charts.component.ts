import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { salesReport } from '@models/report';
import { ChartOptions } from 'app/core/shared/chart.interface';


import {ApexYAxis} from 'ng-apexcharts';

interface ReportItem {
  count: number,
  month: number,
  notes?: string,
  user?: any
}

@Component({
  selector: 'app-reports-charts',
  templateUrl: './reports-charts.component.html',
  styleUrls: ['./reports-charts.component.scss']
})
export class ReportsChartsComponent implements OnInit, OnChanges {
  public chartOptions!: Partial<ChartOptions> | undefined;
  public chartreceiptsOptions!: Partial<ChartOptions> | undefined;
  public yaxis!: ApexYAxis;
  @Input() Data:ReportItem[]=[]
  @Input() name!:string
  chartData:any
   Sales:number[] = []
   SalesMonths:number[]=[]  
  constructor() { }

  ngOnInit() {
    this.chartOptions = {
      series: [
        {
          name: '',
          data: [],
        }
      ],
      chart: {
        height: 350,
        type: 'line',
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
      },
      grid: {
        row: {
          colors: ['transparent', 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.5,

        },

      },
      xaxis: {
        categories: [],
      },
    };
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.Sales=[]
    this.SalesMonths=[]
   if(changes['Data']) {

    //  console.log(this.Data)
     this.Data.forEach((e)=>{
        this.Sales.push(e.count)
       this.SalesMonths.push(e.month)
     })

     setTimeout(() => {
      this.createChart()
     }, 500);
   }
  }

  createChart(){
    this.chartOptions = {
      series: [
        {
          name: this.name,
          data: this.Sales,
        }
      ],

      chart: {
        height: 350,
        type: 'line',
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
      },
      grid: {
        row: {
          colors: ['transparent', 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.5,

        }
      },
      xaxis: {
        categories: this.SalesMonths,

      },
    };
  }

  generateCSV(data:ReportItem[]): string {
    let csvContent = 'Month,Count\n'; // CSV header
  
    data.forEach(item => {
      csvContent += `${item.month},${item.count}\n`; // Add each row
    });
  
    return csvContent;
  }

  downloadCSV(): void {
    const data = this.generateCSV(this.Data);
    const blob = new Blob([data], { type: 'text/csv' });
  
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'monthly_data.csv';
    link.click();
  
    URL.revokeObjectURL(url);
  }

}
