import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { client } from '@models/client';
import { ChangeLanguageService } from '@services/changeLanguage.service';
import { HttpService } from '@services/http.service';
import { ChartOptions } from 'app/core/shared/chart.interface';
import { ApexYAxis } from 'ng-apexcharts';





import { Subscription } from 'rxjs';

interface ReportItem {
  count: number,
  month: number,
  notes: string,
  user: any
}

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {
  public chartOptions!: Partial<ChartOptions> | undefined;

  public chartreceiptsOptions!: Partial<ChartOptions> | undefined;

  public yaxis!: ApexYAxis;
  uuid:any
  private subs= new Subscription()
  client:client= {} as client
  constructor(private http:HttpService,private activeRoute:ActivatedRoute,private changeLang:ChangeLanguageService) { }
language:any
  ngOnInit() {
    this.language=this.changeLang.local_lenguage
    this.uuid= String(this.activeRoute.snapshot.paramMap.get('uuid'))
    this.getClientData(this.uuid)
    this.getsales()
    this.chartOptions = {
      series: [
        {
          name: 'تقرير المبيعات',
          data: [],
        }
      ],
      chart: {
        height: 243,
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
  

  getClientData(uuid:string){
    this.subs.add(this.http.getReq(`api/dashboard/clients/${uuid}`).subscribe({
      next:res=>{
        this.client=res.data
      }
    }))
  }

  


  salesData:ReportItem[] =[]
  getsales(){
    this.subs.add(this.http.getReq(`api/dashboard/ajax/clients/${this.uuid}/sales/report`).subscribe({
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
        height: 243,
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
