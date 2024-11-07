import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LooseObject } from '@modules/LooseObject';
import { columnHeaders, ColumnValue, ControlItem } from '@modules/tableData';
import { AuthService } from '@services/auth.service';
import { ChangeLanguageService } from '@services/changeLanguage.service';
import { HttpService } from '@services/http.service';
import { Dropdown } from 'primeng/dropdown';
import { Paginator } from 'primeng/paginator';
import { Subscription } from 'rxjs';
const datePipe = new DatePipe('en-EG');

interface taxReport {
  sales: number,
  total_without_tax: number,
  total_tax: number,
  expenses: number,
  purchases:number,
  purchases_total_tax:number,
  total_purchases:number
}
@Component({
  selector: 'app-Tax',
  templateUrl: './Tax.component.html',
  styleUrls: ['./Tax.component.scss']
})
export class TaxComponent implements OnInit {

  
  startDate!:any
  endDate!:any
  usersData:taxReport = {} as taxReport;

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
  currentDuration = 1;
  language:any

  taxReports:any;
  columnsArray:columnHeaders[]= [
    // {
    //   nameAR: 'رقم التقرير ',
    //   nameEN:'Report id'
    // },
  
    {
      nameAR:'تاريخ الاصدار	',
      nameEN:'Release date'
    },
    {
     nameAR: 'الفترة',
     nameEN:'Duration'
    },
    {
      nameAR: ' الإطار الزمني ',
      nameEN:'Time frame'
     }, 
      {
        nameAR:'تحميل',
        nameEN:'Download'
      }
  
   ]
  
   columnsNames:ColumnValue[]= [
    {
      name:'date',
      type:'normal'
    },
    {
      name:'report_type',
      type:'tax_report_type'
    },
    {
      name:'month',
      type:'normal'
    },
    {
      name:'',
      type:'download'
    },
    
   ]

   controlArray:ControlItem[]=[
    {
      nameAR:'تحميل النقرير',
      nameEN:'Download report',
      route:{
        path:'',
        attribute:''
      },
      popUp:''
    },
    {
      nameAR:'رؤية التقرير',
      nameEN:'Report Details',
      route:{
        path:'/user/reports/add-tax-report/view/',
        attribute:'id'
      },
      popUp:''

    }
   ]

   @ViewChild('paginator') paginator!: Paginator;
   currentPage = 1;
   totalPage = 0;
   perPage = 0;
   

  
   reportType = [
     {
       val:'quarter',
       nameAr:'ربع سنوى',
       nameEn:'Quarterly',
     },
     {
       val:'monthly',
       nameAr:'شهرى ',
       nameEn:'Monthly',
     }
   ];
 
   quarters = [
     {
       val:1,
       nameAr:'ربع أول',
       nameEn:'First Quarter'
     },
     {
       val:2,
       nameAr:'ربع ثانى',
       nameEn:'Second Quarter'
     },
     {
       val:3,
       nameAr:'ربع ثالث',
       nameEn:'Third Quarter'
     },
     {
       val:4,
       nameAr:'ربع رابع',
       nameEn:'Fourth Quarter'
     },
   ]
   months = [
     { nameAr: "يناير", nameEn: "January", val: 1 },
     { nameAr: "فبراير", nameEn: "February", val: 2 },
     { nameAr: "مارس", nameEn: "March", val: 3 },
     { nameAr: "أبريل", nameEn: "April", val: 4 },
     { nameAr: "مايو", nameEn: "May", val: 5 },
     { nameAr: "يونيو", nameEn: "June", val: 6 },
     { nameAr: "يوليو", nameEn: "July", val: 7 },
     { nameAr: "أغسطس", nameEn: "August", val: 8 },
     { nameAr: "سبتمبر", nameEn: "September", val: 9 },
     { nameAr: "أكتوبر", nameEn: "October", val: 10 },
     { nameAr: "نوفمبر", nameEn: "November", val: 11 },
     { nameAr: "ديسمبر", nameEn: "December", val: 12 }
   ];
   years:any;
   currentreportType = null;
   currentquarter = null;
   currentmonth = null;
   currentyear = null;
  constructor(private http:HttpService,private changeLang:ChangeLanguageService,
    private route: ActivatedRoute,
    private router:Router,private authService:AuthService) {}

  ngOnInit() {
    this.language=this.changeLang.local_lenguage;
    const currentYear = new Date().getFullYear();
    // this.currentyear = currentYear;
    this.years = Array.from({ length: 6 }, (_, i) => currentYear - i);
    this.getReport();
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
  getReport(){
    
    let param :LooseObject ={}; 
    if(this.currentyear) param['year'] = this.currentyear;
    if(this.currentmonth) param['month'] = this.currentmonth;
    if(this.currentreportType) param['report_type'] = this.currentreportType;
    if(this.currentquarter) param['quarter'] = this.currentquarter;
    if(this.currentPage) param['page'] = this.currentPage;

    this.subs.add(this.http.getReq('api/dashboard/reports/tax-return/index',{params:param}).subscribe({
      next:res=>{
        this.taxReports=res?.data
        // this.currentPage = 1;
        this.perPage=res.meta.per_page
        this.totalPage=res.meta.total
      }
    })) 

  }


  onPageChange(e:any){
    let pageNum = e.page+1;
    if(pageNum != this.currentPage){
      this.currentPage = e.page + 1
      this.getReport()
    }
    // this.router.navigate([], { queryParams: {page: this.currentPage}, queryParamsHandling: 'merge' });
  }

  changeReportType(){
  this.currentmonth = null
  this.currentquarter = null
  this.currentyear = null
  }
}
