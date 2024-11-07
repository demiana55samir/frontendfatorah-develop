import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { client } from '@modules/client';
import { LooseObject } from '@modules/LooseObject';
import { purchase } from '@modules/purchase';
import { columnHeaders, ColumnValue, ControlItem } from '@modules/tableData';
import { AuthService } from '@services/auth.service';
import { ChangeLanguageService } from '@services/changeLanguage.service';
import { HttpService } from '@services/http.service';
import { Dropdown } from 'primeng/dropdown';
import { Paginator } from 'primeng/paginator';
import { Observable, Subscription } from 'rxjs';

const datePipe = new DatePipe('en-EG');
@Component({
  selector: 'app-purchaseReport',
  templateUrl: './purchaseReport.component.html',
  styleUrls: ['./purchaseReport.component.scss']
})
export class PurchaseReportComponent implements OnInit {

  name='تقرير التحصيلات'
  values=[
    {
    time:'27 - 11 - 2022',
    num1:'001-1649',
    num2:'15',
    num3:'100.00',

  }
  ]
startDate!:any
endDate!:any
supplier_id:any
ReportData:any[] =[]
tax_value:number=0
total_taxable:number=0
total_with_taxes:number=0
suppliers!:client[]
type:string=''
totalCredit=0
totalDebit=0
total=0

expenses = [];
purchase = [];

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
currentDuration:number = 1;

columnsArray:columnHeaders[]= [
  {
    nameAR: 'رقم المشتري ',
    nameEN:'Purchasing id'
  },
  {
    nameAR:'رقم الفاتورة',
    nameEN:'	Invoice number'

  },
  {
    nameAR:'تحميل',
    nameEN:'Download'
  },
  {
   nameAR: 'المبلغ',
   nameEN:'Amount'
  },
  {
    nameAR: 'المبلغ المتبقى',
    nameEN:'Remaining Amount'
   },
  {
   nameAR:'اسم المستلم	',
   nameEN:'Recipient name'

  },
  {
    nameAR:'تاريخ الشراء	',
    nameEN:'Purchasing date'
  }


 ]

 columnsNames:ColumnValue[]= [
  {
    name:'number',
    type:'normal'
  },
  {
    name:'code_number',
    type:'bluePurchaseNew'
  },
  {
    name:'',
    type:'download'
  },
  {
    name:'total_amount',
    type:'normal-number'
  },
  {
    name:'remaining_amount',
    type:'normal-number'
  },
  {
    name:'recipient',
    type:'normal'
  },
  {
    name:'date',
    type:'normal'
  },

 ]

 controlArray:ControlItem[]=[];

 Purchases!:purchase[]

 currentPage = 1;
 totalPage = 0;
 perPage = 0;
 @ViewChild('paginator') paginator!: Paginator;

 expenses_type = null;
 currentStatus = null;
 purchaseTypes = [
  {
    status:null,
    nameAr:'الكل',
    nameEn:'All'
  },
  {
    status:1,
    nameAr:'مشتريات',
    nameEn:'purchases'
  },
  {
    status:2,
    nameAr:'مشتريات غير مقبولة',
    nameEn:'Unacceptable Purchases'
  },
  {
    status:0,
    nameAr:'مصروفات',
    nameEn:'expenses'
  }
 ]

  constructor(private http:HttpService,private changeLang:ChangeLanguageService,
    private router:Router,private authService:AuthService,
    private httpClient: HttpClient) { }
language:any
  ngOnInit() {
    this.language=this.changeLang.local_lenguage;
    this.getAllSuppliers();
    this.getExpensesType();
  }

  getExpensesType(){
    this.http.getReq('api/dashboard/expenses_types').subscribe({
      next:(res)=>{
        this.expenses = res.data.expense;
        this.purchase = res.data.purchase;
      }
    });
   }

client:any
  downloadExcel(){
    this.getDate(this.currentDuration)
    this.startDate=datePipe.transform( this.startDate, 'yyyy-MM-dd');
    this.endDate=datePipe.transform( this.endDate, 'yyyy-MM-dd');
    let paramList:LooseObject = {};
    if(this.startDate && this.endDate){
      paramList['date_from'] = this.startDate;
      paramList['date_to'] = this.endDate;
    }
    if(this.supplier_id){
      paramList['supplier_id'] = this.supplier_id;
    }
    if(this.currentStatus){
      paramList['status'] = this.currentStatus;
    }
    // let paramList={
    //   'date_from':this.startDate,
    //   'date_to':this.endDate,
    //   'supplier_id':this.supplier_id,
    //   'status':this.currentStatus
    // }

    this.subs.add(this.http.getReq('api/dashboard/purchasing/export/excel',{params:paramList}).subscribe({
      next:res=>{
      //  console.log(res);

      //  const data = res;
      //  const blob = new Blob([data], { type: 'text/csv' });
     
      //  const url = URL.createObjectURL(blob);
      //  const link = document.createElement('a');
      //  link.href = url;
      //  link.download = 'purchases_Report.csv';
      //  link.click();
     
      //  URL.revokeObjectURL(url);


      //  this.download(res).subscribe(blob => {
      //   const downloadURL = window.URL.createObjectURL(blob);
      //   const link = document.createElement('a');
      //   link.href = downloadURL;
      //   link.download = 'purchases_Report.csv'; // Set your file name
      //   link.click();
      //   window.URL.revokeObjectURL(downloadURL);
      //   });

       
      },error:(err)=>{
        console.log('erorrrr:' , err.text);
         
      }
    }))

  }
  downloadFile(url: string): Observable<Blob> {
    return this.httpClient.get(url, { responseType: 'blob' });
  }
 
  
  getReport(){
    this.getDate(this.currentDuration)
    this.startDate=datePipe.transform( this.startDate, 'yyyy-MM-dd');
    this.endDate=datePipe.transform( this.endDate, 'yyyy-MM-dd');
    let paramList:LooseObject = {};
    if(this.startDate && this.endDate){
      paramList['date_from'] = this.startDate;
      paramList['date_to'] = this.endDate;
    }
    if(this.supplier_id){
      paramList['supplier_id'] = this.supplier_id;
    }
    if(this.currentStatus){
      paramList['status'] = this.currentStatus;
    }
    if(this.expenses_type){
      paramList['expenses_type'] = this.expenses_type;
    }
    if(this.currentPage){
      paramList['page'] = this.currentPage;
    }
    // {
    //   'date_from':this.startDate,
    //   'date_to':this.endDate,
    //   'supplier_id':this.supplier_id,
    //   'status':this.currentStatus
    // }

    this.subs.add(this.http.getReq('api/dashboard/reports/purchasing',{params:paramList}).subscribe({
      next:res=>{
        this.Purchases=res.data
        this.perPage=res.meta.per_page
        this.totalPage=res.meta.total
        setTimeout(() => {
          this.paginator.changePage(this.currentPage -1 )
        }, 200);
       
      }
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

  getAllSuppliers(){
      this.subs.add(this.http.getReq('api/dashboard/suppliers/all').subscribe({ 
      next:res=>{
        this.suppliers=res.data
      }
    }))
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

  generateCSV(data:any): string {
    let csvContent = 'Purchasing id,invoice number,Amount,Remaining Amount,Recipient name,Purchasing date\n'; // CSV header
  
    data.forEach((item:any) => {
      // if(item.status==0){
        csvContent += `${item.number},${item.code_number},${item.total_amount},${item.remaining_amount},${item.recipient},${item.date}\n`; // Add each row
      // }
      // else{
      //   csvContent += `taxable,${item.number},${item.code_number},${item.total_amount},${item.remaining_amount},${item.recipient},${item.date}\n`; // Add each row
      // }
    });
    // csvContent +=`total,,,,,${this.totalDebit},${this.totalCredit},${this.total}`
    return csvContent;
  }

  downloadCSV(): void {
    const data = this.generateCSV(this.Purchases);
    const blob = new Blob([data], { type: 'text/csv' });
  
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'purchase_report.csv';
    link.click();
  
    URL.revokeObjectURL(url);
  }

  onPageChange(e:any){
    let pageNum = e.page+1;
    if(pageNum != this.currentPage){
      this.currentPage = e.page + 1
      this.getReport()

    }
    // this.currentPage = e.page + 1
    // this.router.navigate([], { queryParams: {page: this.currentPage}, queryParamsHandling: 'merge' });
  }
}
