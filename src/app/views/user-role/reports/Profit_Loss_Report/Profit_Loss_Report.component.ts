import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { client } from '@modules/client';
import { product } from '@modules/product';
import { AuthService } from '@services/auth.service';
import { ChangeLanguageService } from '@services/changeLanguage.service';
import { HttpService } from '@services/http.service';
import { Dropdown } from 'primeng/dropdown';
import { Subscription } from 'rxjs';

const datePipe = new DatePipe('en-EG');

@Component({
  selector: 'app-Profit_Loss_Report',
  templateUrl: './Profit_Loss_Report.component.html',
  styleUrls: ['./Profit_Loss_Report.component.scss']
})
export class Profit_Loss_ReportComponent implements OnInit {

startDate!:any
endDate!:any
client_id:any
product_id:any
ReportData:any[] =[]
tax_value:number=0
total_taxable:number=0
total_with_taxes:number=0
clients!:client[];
products!:product[];

type:string=''
totalCredit=0
totalDebit=0
total=0

profitsData:any ;
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
  { nameAR: 'هذه السنة ', nameEN: 'This Year', value: 12 },
  { nameAR: 'طوال المدة', nameEN: 'All Time', value: 10 },
  { nameAR: 'اختر تاريخ محدد', nameEN: 'Select Specific Date', value: 11 }
]
currentDuration:number = 12

total_sales_without_tax: number = 0;
total_expenses: number = 0;
total_revenue: number = 0;
  constructor(private http:HttpService,private changeLang:ChangeLanguageService,
    private router:Router,private authService:AuthService) { }
language:any
  ngOnInit() {
    this.language=this.changeLang.local_lenguage

    this.getReport();
    // this.getAllClients()
    // this.getAllProducts()
  }
client:any
  getReport(){
    this.getDate(this.currentDuration)
    this.startDate=datePipe.transform( this.startDate, 'yyyy-MM-dd');
    this.endDate=datePipe.transform( this.endDate, 'yyyy-MM-dd');
    let params={
      'date_from':this.startDate,
      'date_to':this.endDate,
    }
    this.subs.add(this.http.getReq('api/dashboard/reports/profitsAndlosses',{params:params}).subscribe({
      next:res=>{
        this.total_sales_without_tax=res?.data.total_sales_without_tax;
        this.total_expenses=res?.data.total_expenses;
        this.total_revenue=res?.data.total_revenue;
       
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
    else if(duration_value==12){
      // Set the startDate to January 1st of the current year at 00:00:00.000
    this.startDate = new Date();
    this.startDate.setMonth(0); // January is month 0 in JavaScript Date
    this.startDate.setDate(1);
    this.startDate.setHours(0, 0, 0, 0);

    // Set the endDate to the current date and time
    this.endDate = new Date();
    }
  }

  // getAllClients(){
  //     this.subs.add(this.http.getReq('api/dashboard/ajax/clients/search').subscribe({ 
  //     next:res=>{
  //       this.clients=res.data
  //     }
  //   }))
  // }
  // getAllProducts(){
  //     this.subs.add(this.http.getReq('api/dashboard/ajax/products/search').subscribe({ 
  //     next:res=>{
  //       this.products=res.data
  //     }
  //   }))
  // }
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

  // generateCSV(data:any): string {
  //   let csvContent = 'type,invoice number,date,due date,description,debtor,creditor,total\n'; // CSV header
  
  //   data.forEach((item:any) => {
  //     if(item.status==0){
  //       csvContent += `non taxable${item.number},${item.date},${item.due_date},${item.desciption},${item.debtor},${item.creditor},${item.total}\n`; // Add each row
  //     }
  //     else{
  //       csvContent += `taxable,${item.number},${item.date},${item.due_date},${item.desciption},${item.debtor},${item.creditor},${item.total}\n`; // Add each row
  //     }
  //   });
  //   csvContent +=`total,,,,,${this.totalDebit},${this.totalCredit},${this.total}`
  //   return csvContent;
  // }

  // downloadCSV(): void {
  //   const data = this.generateCSV(this.ReportData);
  //   const blob = new Blob([data], { type: 'text/csv' });
  
  //   const url = URL.createObjectURL(blob);
  //   const link = document.createElement('a');
  //   link.href = url;
  //   link.download = 'monthly_data.csv';
  //   link.click();
  
  //   URL.revokeObjectURL(url);
  // }

}
