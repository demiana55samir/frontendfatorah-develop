import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { salesReport } from '@models/report';
import { client } from '@modules/client';
import { LooseObject } from '@modules/LooseObject';
import { product } from '@modules/product';
import { ColumnValue, columnHeaders } from '@modules/tableData';
import { AuthService } from '@services/auth.service';
import { ChangeLanguageService } from '@services/changeLanguage.service';
import { HttpService } from '@services/http.service';
import { Dropdown } from 'primeng/dropdown';
import { Subscription } from 'rxjs';
const datePipe = new DatePipe('en-EG');


interface ReportItem {
  count: number,
  month: number,
  notes?: string,
  user?: any
}
interface reportProducts{
  date:string,
  number:number,
  client:string,
  description:string,
  tax_number:number,
  tax_percentage:number,
  taxable_amount:number,
  tax:number,
  tax_value:number,
  total:number
}

@Component({
  selector: 'app-sales-report',
  templateUrl: './sales-report.component.html',
  styleUrls: ['./sales-report.component.scss']
})
export class SalesReportComponent implements OnInit {
name='تقرير المبيعات'
startDate!:any
endDate!:any
salesData:any
totalPerMonth:any[]=[]
chartData:ReportItem[] = []
tax_value:number=0
reportsProduct:reportProducts[]=[]
total_taxable:number=0
totals:number=0

private subs= new Subscription()
duration=[
  { nameAR: 'اليوم', nameEN: 'Today', value: 1 },
  { nameAR: 'البارحة', nameEN: 'Yesterday', value: 2 },
  { nameAR: 'آخر أسبوع', nameEN: 'Last Week', value: 3 },
  { nameAR: 'اخر 30 يوم', nameEN: 'Last 30 Days', value: 4 },
  { nameAR: 'هذا الشهر', nameEN: 'This Month', value: 5 },
  { nameAR: 'آخر شهر', nameEN: 'Last Month', value: 6 },
  { nameAR: 'آخر 3 شهور', nameEN: 'Last 3 Months', value: 7 },
  { nameAR: 'آخر 6 شهور', nameEN: 'Last 6 Months', value: 8 },
  { nameAR: 'آخر سنة', nameEN: 'Last Year', value: 9 },
  { nameAR: 'طوال المدة', nameEN: 'All Time', value: 10 },
  { nameAR: 'اختر تاريخ محدد', nameEN: 'Select Specific Date', value: 11 }
]
currentDuration:any

 
client_id:any;
product_id:any;
clients!:client[];
products!:product[];
  constructor(private http:HttpService,private changeLang:ChangeLanguageService,private router:Router,private authService:AuthService) { }
  language:any
  ngOnInit() {
    this.language=this.changeLang.local_lenguage
    if(this.language=='en'){
      this.name='Sales Report'
    }

    this.getAllClients()
    this.getAllProducts()

  }

  getAllClients(){
      this.subs.add(this.http.getReq('api/dashboard/ajax/clients/search').subscribe({ 
      next:res=>{
        let client = res.data
        
        let TranslateName ;
        if(this.language == 'ar') TranslateName = 'الكل'
        else TranslateName = 'All'
        let AllItem = {
          id:null,
          name:TranslateName
        }

        this.clients = [AllItem, ...client];

      }
    }))
  }
  getAllProducts(){
      this.subs.add(this.http.getReq('api/dashboard/ajax/products/search').subscribe({ 
      next:res=>{
        let products = res.data;

        let TranslateName ;
        if(this.language == 'ar') TranslateName = 'الكل'
        else TranslateName = 'All'
        let AllItem = {
          id:null,
          name:TranslateName
        }

        this.products = [AllItem, ...products];
      }
    }))
  }

  dataReady = false
  getSalesReport(){
    this.getDate(this.currentDuration)
    this.startDate=datePipe.transform( this.startDate, 'yyyy-MM-dd');
    this.endDate=datePipe.transform( this.endDate, 'yyyy-MM-dd');

    let param :LooseObject ={}; 
    if(this.startDate) param['date_from'] = this.startDate
    if(this.endDate) param['date_to'] = this.endDate 
    if(this.client_id) param['client_id'] = this.client_id 
    if(this.product_id) param['product_uuid'] = this.product_id 
 

    this.subs.add(this.http.getReq('api/dashboard/reports/sales',{params:param}).subscribe({
      next:res=>{
        this.salesData=res.data.sales_report
        this.totalPerMonth=res.data.total_per_month
        this.tax_value=res.data.tax_value
        this.total_taxable=res.data.total_taxable
        this.totals=res.data.totals
      },complete:()=> {
        this.setChartData(this.totalPerMonth)
        this.getProducts(this.salesData)
      },
    })) 

  }


  getDate(duration_value:number){
    if(duration_value==1){
      this.startDate=new Date();
      this.startDate.setHours(0, 0, 0, 0);

      this.endDate=new Date();
      this.endDate.setHours(23, 59, 59, 999);

    }
    else if(duration_value==2){
      this.startDate = new Date();
      this.endDate = new Date();
      this.startDate.setDate(this.endDate.getDate() - 1);
      this.startDate.setHours(0, 0, 0, 0);

      this.endDate=new Date(this.startDate);
      this.endDate.setHours(23, 59, 59, 999);

    }
    else if(duration_value==3){
      this.startDate = new Date();
      this.endDate = new Date();
      this.startDate.setDate(this.startDate.getDate() - 7);
      this.startDate.setHours(0, 0, 0, 0);

      this.endDate=new Date();
      this.endDate.setHours(23, 59, 59, 999);

    }
    else if(duration_value==4){
      this.startDate = new Date();
      this.endDate = new Date();
      this.startDate.setDate(this.startDate.getDate() - 30);
      this.startDate.setHours(0, 0, 0, 0);

      this.endDate=new Date();
      this.endDate.setHours(23, 59, 59, 999);

    }
    else if(duration_value==5){
      this.startDate = new Date();
      this.startDate.setDate(this.startDate.getDate() - 30);
      this.endDate = new Date();
      this.startDate.setHours(0, 0, 0, 0);
      this.endDate=new Date(this.startDate);
      this.endDate.setHours(23, 59, 59, 999);

      const currentDate = new Date();
      this.startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
     const nextMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
     this.endDate = new Date(nextMonthStart.getTime() - 1);

    }
    else if(duration_value==6){
      this.startDate = new Date();
      this.startDate.setMonth(this.startDate.getMonth() - 1);
      this.startDate.setDate(1);
      this.startDate.setHours(0, 0, 0, 0);
      this.endDate = new Date(this.startDate);
      this.endDate.setMonth(this.endDate.getMonth() + 1);
      this.endDate.setDate(0);
      this.endDate.setHours(23, 59, 59, 999);

    }
    else if(duration_value==7){
      this.startDate = new Date();
      this.startDate.setMonth(this.startDate.getMonth() - 3);
      this.startDate.setDate(1);
      this.startDate.setHours(0, 0, 0, 0);
      this.endDate = new Date(this.startDate);
      this.endDate.setMonth( this.endDate.getMonth() + 3);
      this.endDate.setDate(0);
      this.endDate.setHours(23, 59, 59, 999);

    }
    else if(duration_value==8){
      this.startDate = new Date();
      this.startDate.setMonth(this.startDate.getMonth() - 6);
      this.startDate.setDate(1);
      this.startDate.setHours(0, 0, 0, 0);
      this.endDate = new Date(this.startDate);
      this.endDate.setMonth( this.endDate.getMonth() + 6);
      this.endDate.setDate(0);
      this.endDate.setHours(23, 59, 59, 999);

    }
    else if(duration_value==9){
      this.startDate = new Date();
      this.startDate.setFullYear(this.startDate.getFullYear() - 1);
      this.startDate.setMonth(0);
      this.startDate.setDate(1);
      this.startDate.setHours(0, 0, 0, 0);
      this.endDate= new Date(this.startDate);
      this.endDate.setFullYear(this.endDate.getFullYear() + 1);
      this.endDate.setMonth(0);
      this.endDate.setDate(0);
      this.endDate.setHours(23, 59, 59, 999);

    }
    else if(duration_value==10){
      let created_at=this.authService.getUserObj().created_at
      this.startDate = new Date(created_at);
      this.endDate= new Date();

    }
  }
@ViewChild('calendarModel') calendarModel!: ElementRef<HTMLElement>;

  openCalenderModel(){
    let el: HTMLElement = this.calendarModel.nativeElement;
    el.click();
  }
  @ViewChild('durationDropDown') private durationDropDown!: Dropdown;

  openModelCheck(){
    if (!this.durationDropDown.overlayVisible){
      if(this.currentDuration==11){
        this.openCalenderModel()
  
      }

    }
  }

  setChartData(monthesData:any){
    this.chartData = [];
    for (const month in monthesData) {
      if (monthesData.hasOwnProperty(month)) {
        this.chartData.push({
              month: parseInt(month),
              count: monthesData[month]
          });
      }
  }
  this.dataReady = true
  }

  getProducts(data:any){
   data.forEach((invoice:any) => {
    invoice?.products?.forEach((product:any) => {
      this.reportsProduct.push(
        {
          'date':invoice?.date,
          'number':invoice?.number,
          'client':invoice.client,
          'description':invoice?.description,
          'tax_number':invoice?.tax_number,
          'tax_percentage':product?.tax_percentage,
          'taxable_amount':product?.taxable_amount,
          'tax_value':product?.tax_value,
          'tax':product?.tax,
          'total':product?.total
        }
      )
     });
   
   });
  }
}
