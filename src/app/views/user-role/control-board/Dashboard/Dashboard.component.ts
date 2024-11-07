import { Component, OnInit } from '@angular/core';
import { ChartComponent } from 'ng-apexcharts';
import { ChartOptions } from 'app/core/shared/chart.interface';


import {
  ApexYAxis
} from 'ng-apexcharts';
import { Subscription } from 'rxjs';
import { dashboard, top_clients, top_products } from '@models/dashboard';
import { HttpService } from '@services/http.service';
import { left } from '@popperjs/core';
import { GeneralService } from '@services/general.service';
import { ChangeLanguageService } from '@services/changeLanguage.service';
import { NumberFormatPipe } from 'app/core/pipes/NumberFormat.pipe';


interface ReportItem {
    count: number,
    month: number,
    notes: string,
    user: any
}
@Component({
  selector: 'app-Dashboard',
  templateUrl: './Dashboard.component.html',
  styleUrls: ['./Dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public chartOptions!:any;
  //  Partial<ChartOptions> | undefined;

  public chartreceiptsOptions!: any 
  // Partial<ChartOptions> | undefined;

  public yaxis!: ApexYAxis;
  subs=new Subscription()
  CardsData:dashboard = {} as dashboard
  top_clients:top_clients[]=[]
  top_products:top_products[]=[]
  user:any
  name:any

   sales_Reports =' تقرير المبيعات';
   revenues_Reports = 'تقرير التحصيلات';

   CurrencySAR:string = 'ريال سعودى'
  constructor(private http:HttpService, private generalService:GeneralService,
    private changelang:ChangeLanguageService,private numberFormatPipe: NumberFormatPipe) { }

  language:any ='ar'
  ngOnInit() {
    this.language=this.changelang.local_lenguage
    this.getGeneralData()
    this.getCardData()
    this.getreceiptsReport()
    this.getsales()
    if(this.language == 'en'){
      this.sales_Reports =' Sales report ';
      this.revenues_Reports = 'Revenues report';
      this.CurrencySAR = 'SAR'

    }

    this.chartOptions = {
      series: [
        {
          name: this.sales_Reports,
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
      yaxis: {
        // forceNiceScale: true,  
        min: -100000000000,
        max:  1000000000000
      }
    };

    this.chartreceiptsOptions = {
      series: [
        {
          name: this.revenues_Reports,
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
        categories: [ ],
      },
      yaxis: {
        // forceNiceScale: true,  
        min: -100000000000,
        max:  1000000000000
      }
    };

    // this.yaxis = {
    //   labels: {
    //     formatter: function(val=10) {
    //       return (val ).toFixed(0);
    //     }
    //   },
    // };
  }
  ngOnDestroy() {
    this.subs.unsubscribe();
  }
  getCardData(){
    this.subs.add(this.http.getReq('api/dashboard/index').subscribe({
      next:res=>{
       this.CardsData=res.data
       this.top_clients=res.data.top_clients
       this.top_products=res.data.top_products
      }
    }))
  }

  salesData:ReportItem[] =[]
  getsales(){
    this.subs.add(this.http.getReq('api/dashboard/ajax/sales/report').subscribe({
      next:res=>{
        this.salesData = res?.data
      },
      complete:()=>{
        this.fillSalesChart()
      }
    }))
  }

  chartOptionsReady = false;
  fillSalesChart(){
    let Sales:number[] = new Array(12).fill(0);
    let SalesMonthsNumbers:number[]=[];
    let SalesMonths:string[]=[];
    // let current_month =  this.salesData[this.salesData.length-1].month;
    const today = new Date();
    let current_month =  today.getMonth() + 1;
    let i = 0;
    let j = current_month;
    while(i < 12){
      if(j <= 0) {
          j = 12;
      }
        SalesMonthsNumbers.push(j);
        i++;
        j--;
    }
    this.salesData.forEach(e=>{
      Sales[(e.month - current_month + 11) % 12] = e.count
    })

    SalesMonthsNumbers.forEach(e=>{
      SalesMonths.push(this.getMonthName(e.toString(),this.language))
    })
    SalesMonths = SalesMonths.reverse();

    this.chartOptions = {
      series: [
        {
          name: this.sales_Reports,
          data: Sales,
        }
      ],

      chart: {
        height: 350,
        type: 'line',
        zoom: {
          enabled: false,
        },
      },
      responsive: [{
        breakpoint: 480, // width less than 480px
        options: {
          chart: {
            width: 300, // new width
            height: 200, // new height
          },
          legend: {
            position: 'bottom'
          }
        }
      }],
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
        categories: SalesMonths,

      },
      yaxis: {
        // forceNiceScale: true,  
        min: -100000000000,
        max:  1000000000000
      }
    };
        this.yaxis = {
        labels: {
        formatter: (sales) =>{
          return sales.toString();
          // return this.numberFormatPipe.transform(sales).toString();
          // return sales +' '+ this.CurrencySAR;
        },
      },
    };
    this.chartOptionsReady = true;
  }

  receiptsData:ReportItem[] =[]
  getreceiptsReport(){
    this.subs.add(this.http.getReq('api/dashboard/ajax/receipts/report').subscribe({
      next:res=>{
      this.receiptsData = res?.data
      },
      complete:()=>{
        this.fillreceiptsChart()
      }
    }))
  }

  chartreceiptsOptionsReady = false;
  fillreceiptsChart(){
    let receipts:number[] = new Array(12).fill(0);
    let receiptsMonthsNumbers:number[]=[];
    let receiptsMonths:string[]=[]
    // let current_month =  this.receiptsData[this.receiptsData.length-1].month;
    const today = new Date();
    let current_month =  today.getMonth() + 1;
    let i = 0;
    let j = current_month;
    while(i < 12){
      if(j <= 0) {
          j = 12;
      }
      receiptsMonthsNumbers.push(j);
        i++;
        j--;
    }

    this.receiptsData.forEach(e=>{
      receipts[(e.month - current_month + 11) % 12] = e.count
      // receipts.push(e.count)
      // receiptsMonths.push(this.getMonthName(e.month.toString(),this.language))
    })
    receiptsMonthsNumbers.forEach(e=>{
      receiptsMonths.push(this.getMonthName(e.toString(),this.language))
    })
    receiptsMonths = receiptsMonths.reverse();
    this.chartreceiptsOptions = {
      series: [
        {
          name: this.revenues_Reports,
          data: receipts,
        }
      ],
      chart: {
        height: 350,
        type: 'line',
        zoom: {
          enabled: false,
        },
      },
      responsive: [{
        breakpoint: 480, // width less than 480px
        options: {
          chart: {
            width: 300, // new width
            height: 200, // new height
          },
          legend: {
            position: 'bottom'
          }
        }
      }],
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
        categories: receiptsMonths
      },
      yaxis: {
        // forceNiceScale: true,  
        min: -100000000000,
        max:  1000000000000
      }
    };
    this.chartreceiptsOptionsReady = true; 
  }
  convertNumToMonth(monthAsNum:number){
    const date = new Date();
  date.setMonth(monthAsNum - 1);

  return date.toLocaleString('en-US', { month: 'long' });
  }

  getGeneralData(){
    let generalData =  localStorage.getItem('UserObj');
    if(generalData){
      let userData = JSON.parse(generalData);
      this.name = userData?.name
 
    }else{
      this.subs.add(this.generalService.getGeneralData().subscribe({
        next:(res)=>{
          this.name = res?.data?.name
          localStorage.setItem('UserObj',JSON.stringify(res?.user))
        }
      }));
    }
    
   }

   getMonthName(month:string, language:'ar'|'en') {
    let monthNumber = Number(month)
    const monthNames = {
        en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        ar: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']
    };

    // Check if the month number is valid
    if (monthNumber < 1 || monthNumber > 12) {
        return 'Invalid Month Number';
    }

    // Return the month name
    return monthNames[language][monthNumber - 1];
}
}
