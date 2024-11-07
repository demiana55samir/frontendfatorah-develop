import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { product } from '@models/product';
import { ChangeLanguageService } from '@services/changeLanguage.service';
import { HttpService } from '@services/http.service';
import { ChartOptions } from 'app/core/shared/chart.interface';


import {
  ApexYAxis
} from 'ng-apexcharts';
import { Subscription } from 'rxjs';

interface ReportItem {
  count: number,
  month: number,
  notes: string,
  user: any
}
@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  public chartOptions!: Partial<ChartOptions> | undefined;

  public chartreceiptsOptions!: Partial<ChartOptions> | undefined;

  public yaxis!: ApexYAxis;
 
  productUuid=''

  product:product = {} as product

  subs=new Subscription()

  
  constructor(private http:HttpService ,private changelang:ChangeLanguageService, private activeRoute:ActivatedRoute) {
    this.productUuid= String(this.activeRoute.snapshot.paramMap.get('id'))
   }
language:any
  ngOnInit() {
   this.language=this.changelang.local_lenguage
    this.getProduct()
    this.getsales()

    this.chartOptions = {
      series: [
        {
          name: 'تقرير التحصيلات ',
          data: [],
        }
      ],
      chart: {
        
        height:  135,
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
      }
    };
     this.yaxis = {
      min: 0,
      max: 400,
      tickAmount: 2,
    };
  }

getProduct(){
  this.subs.add(this.http.getReq(`api/dashboard/products/${this.productUuid}`).subscribe({
    next:res=>{
      this.product = res?.data
    }
  }))
}


  salesData:ReportItem[] =[]
  getsales(){
    this.subs.add(this.http.getReq(`api/dashboard/ajax/products/${this.productUuid}/sales/report`).subscribe({
      next:res=>{
        this.salesData = res?.data
      },
      complete:()=>{
        this.fillSalesChart()
      }
    }))
  }

  fillSalesChart(){
    let Sales:number[] = []
    let SalesMonths:number[]=[]
    this.salesData.forEach(e=>{
      Sales.push(e.count)
      SalesMonths.push(e.month)
    })
    this.chartOptions = {
      series: [
        {
          name: 'تقرير المبيعات',
          data: Sales,
        }
      ],
      chart: {
        height: 135,
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
        categories: SalesMonths
      }
    };
    this.yaxis = {
      tickAmount: 2,
    };
  }
}
