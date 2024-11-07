import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { columnHeaders, ColumnValue } from '@modules/tableData';
import { AuthService } from '@services/auth.service';
import { ChangeLanguageService } from '@services/changeLanguage.service';
import { GeneralService } from '@services/general.service';
import { HttpService } from '@services/http.service';
import { MenuItem } from 'primeng/api';
import { Dropdown } from 'primeng/dropdown';
import { Paginator } from 'primeng/paginator';
import { Subscription, switchMap } from 'rxjs';

const datePipe = new DatePipe('en-EG');
@Component({
  selector: 'app-user-subscriptions-report',
  templateUrl: './user-subscriptions-report.component.html',
  styleUrls: ['./user-subscriptions-report.component.scss']
})
export class UserSubscriptionsReportComponent implements OnInit , OnDestroy {

  startDate!:any
  endDate!:any
  usersData:any

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


  columnsArray:columnHeaders[]= [
    {
     nameAR: 'رقم المستخدم',
     nameEN:'User Id'

    },
    {
     nameAR: 'المستخدم',
     nameEN:'User'
    },
    {
     nameAR: ' نوع الباقة ',
     nameEN:'Package type'
      
    },
    {
      nameAR: ' رقم الجوال  ',
      nameEN:'Mobile number'
     },
     {
      nameAR: 'البريد الالكتروني',
      nameEN:'Email'
     },
    {
     nameAR: '  أول اشتراك باقة ',
     nameEN:' First subscription package '
    },
    {
      nameAR: ' أخر اشتراك باقة ',
      nameEN: ' Last package subscription '
     },
    {
      nameAR: ' تاريخ انتهاء الباقة',
      nameEN:'Package expiration date '
     },
     {
      nameAR: ' عدد الفواتير',
      nameEN:'	Number of invoices '
     },
     {
      nameAR: ' عدد عروض الأسعار',
      nameEN:' Number of quotes '
     },

     {
      nameAR: ' اجمالي الفواتير ',
      nameEN:'Total Invoices '
     }
   ]

   columnsNames:ColumnValue[]= [
    {
      name:'id',
      type:'normal'
    },
    {
      name:'user_name',
      type:'normal'
    },
    {
      name:'plan_name',
      type:'normal'
    },
    // todo
    {
      name:'user_phone',
      type:'normal'
    },
    {
      name:'user_email',
      type:'normal'
    },

    {
      name:'first_subscription_date',
      type:'normal'
    },
    {
      name:'last_subscription_date',
      type:'normal'
    },
    {
      name:'subscription_end_date',
      type:'normal'
    },
    {
      name:'invoices',
      type:'normal'
    },
    {
      name:'quotations',
      type:'normal'
    },
    {
      name:'invoices_total',
      type:'normal'
    }
   ]
   currentPage = 1
   totalPage = 0
   perPage = 0
   @ViewChild('paginator') paginator!: Paginator;
   userPermissions:any;


   tab=1;
   activeItem!: any;
   currentType = 'active'
   items=[{type:'active', label:"فعالة",command: (event:any) => {
    this.activeItem=this.items[0]
    this.tab=1
    this.currentType = 'active'
    this.paginator.changePage(0)
    this.paginator.updatePageLinks();
    this.reportfilter = false;
    return this.router.navigate([], { queryParams: { type:'active',page:1,plan_id:null , duration:null,has_invoices:null} , queryParamsHandling: 'merge' })
  }}
  ,{type:'trial' ,label:" فترة مجانية ",command: (event:any) => {
    this.activeItem=this.items[1]
    this.tab=2
    this.currentType = 'trial'
    this.paginator.changePage(0)
    this.paginator.updatePageLinks();
    this.reportfilter = false;
    return this.router.navigate([], { queryParams: { type:'trial',page:1,plan_id:null , duration:null,has_invoices:null} , queryParamsHandling: 'merge' })

  }}
  ,{type:'expired_recently',label:" انتهت مؤخرا",command: (event:any) => {
    this.activeItem=this.items[2]
    this.tab=3
    this.currentType = 'expired_recently'
    this.paginator.changePage(0)
    this.paginator.updatePageLinks();
    this.reportfilter = false;
    return this.router.navigate([], { queryParams: { type:'expired_recently',page:1,plan_id:null , duration:null,has_invoices:null} , queryParamsHandling: 'merge' })

  }}
  ,{type:'expired',label:" منتهية ",command: (event:any) => {
    this.activeItem=this.items[3]
    this.tab=4
    this.currentType = 'expired'
    this.paginator.changePage(0)
    this.paginator.updatePageLinks();
    this.reportfilter = false;
    return this.router.navigate([], { queryParams: { type:'expired',page:1,plan_id:null , duration:null,has_invoices:null} , queryParamsHandling: 'merge' })

  }}

]

durations:any = [];
plans:any;
filteredPlans:any;
plan_id = -1;
  constructor(private http:HttpService,private changeLang:ChangeLanguageService,
    private activatedRoute:ActivatedRoute,
    private generalService:GeneralService,
    private router:Router,private authService:AuthService) {
      this.language=this.changeLang.local_lenguage
    this.activeItem=this.items[0];
    this.changeDate()
    this.getUserPlans()
    if(this.language=='en'){
      this.items[0].label='Active'
      this.items[1].label='Free trial'
      this.items[2].label='Recently expired'
      this.items[3].label='Expired'
    }
   }

  ngOnInit() {

      let user = this.authService.getUserObj();
    this.userPermissions = user.permissions

    this.subs.add(this.activatedRoute.queryParams.pipe(
      switchMap((param: any) => {
        if(param['page'] && param['date_from'] && param['date_to']){
            this.currentPage = Number(param['page']);
            this.startDate = param['date_from'];
            this.endDate = param['date_to'];
            
        }
        return this.getReport(param);
      })
    ).subscribe({
      next:res=>{
        this.usersData=res.data
        this.perPage=res.meta.per_page
        this.totalPage=res.meta.total
        setTimeout(() => {
          this.paginator.changePage(this.currentPage -1 )
        }, 200);
      }
    }));
  }


  getUserPlans(){
    let param = {
      duration:true
    }
    this.subs.add(this.http.getReq(`api/admin/plans`,{params:param}).subscribe({
      next:res=>{
        this.plans = res.data;
        if(this.plans)
        // this.filteredPlans = this.plans.filter((item:any) => item.price > 0);
        this.filteredPlans = this.plans;
    },
  }))
  }

  Current_duration = null;
  SetDuration(event:any){
    this.Current_duration = event.value;
  }
  Current_plan_id = null;
  fillDuration(event:any){
    this.Current_plan_id = event.value;
    let index = this.filteredPlans.findIndex((plan:any) => plan.id == event.value)
    if(index > -1){
      this.durations = this.filteredPlans[index].durations;
    }
  }

  getReport(param:any){
    return  this.http.getReq('api/admin/reports/expired/subscriptions',{params:param})
  }

  durationFilter(){
    this.router.navigate([], { queryParams: {page: 1 , plan_id:this.Current_plan_id , duration:this.Current_duration}, queryParamsHandling: 'merge' });
  }

  reportfilter = false
  reportFilter(){
    this.reportfilter = !this.reportfilter;

    if(this.reportfilter){
      this.router.navigate([], { queryParams: {page: 1 , has_invoices:'1'}, queryParamsHandling: 'merge' });
    }else{
      this.router.navigate([], { queryParams: {page: 1 , has_invoices:null}, queryParamsHandling: 'merge' });
    }
  }

  changeDate(){
    let subscriptionsData =localStorage.getItem('subscriptionsReport');
    if(subscriptionsData){
      let subscriptionsReportData =JSON.parse(subscriptionsData);
      this.currentDuration = subscriptionsReportData.currentDuration;
      this.currentType = subscriptionsReportData.type;

      let index = this.items.findIndex(item=> item.type == this.currentType)
      if(index > -1)this.activeItem = this.items[index]

      // this.getDate(this.currentDuration)
      if(this.currentDuration >0 && this.currentDuration < 11){
        const { startDate, endDate } = this.generalService.getDate_admin(this.currentDuration);
        this.startDate = startDate;
        this.endDate = endDate;
      }

      this.startDate=datePipe.transform( this.startDate, 'yyyy-MM-dd');
      this.endDate=datePipe.transform( this.endDate, 'yyyy-MM-dd');

      localStorage.removeItem('subscriptionsReport')
    }else{
      // this.activeItem=this.items[0];
      // this.getDate(this.currentDuration)
      if(this.currentDuration >0 && this.currentDuration < 11){
        const { startDate, endDate } = this.generalService.getDate_admin(this.currentDuration);
        this.startDate = startDate;
        this.endDate = endDate;
      }

      this.startDate=datePipe.transform( this.startDate, 'yyyy-MM-dd');
      this.endDate=datePipe.transform( this.endDate, 'yyyy-MM-dd');
        // todo - check type when change date
      let currentreportfilter = this.reportfilter ? this.reportfilter : null
    this.router.navigate([], { queryParams: {page: 1 , date_from:this.startDate , date_to: this.endDate , type:this.currentType,has_invoices:currentreportfilter}, queryParamsHandling: 'merge' });
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

  onPageChange(e:any){

    this.currentPage = e.page + 1
    this.router.navigate([], { queryParams: {page: this.currentPage}, queryParamsHandling: 'merge' });
  }

  ngOnDestroy(): void {
    localStorage.removeItem('subscriptionsReport');
  }

  generateCSV(data:any): string {
    let csvContent = '\uFEFF';
     csvContent += '"User Id","User","Package type","Mobile number","Email","First subscription package","Package expiration date","Number of invoices","Number of quotes","Total Invoices"\n'; // CSV header
  
    data.forEach((item:any) => {
      const row = [
          item.id,
          item.user_name,
          item.plan_name,
          // todo
          item.user_phone,
          item.user_email,

          item.first_subscription_date,
          item.last_subscription_date,
          item.invoices,
          item.quotations,
          item.invoices_total
      ].map(field => `"${field?.toString() || ''}"`).join(',');

      csvContent += row + '\n'; // Add each row
    });
    return csvContent;
  }
  downloadCSV(): void {
    const data = this.generateCSV(this.usersData);

       // const blob = new Blob([data], { type: 'text/csv' });
      const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' });
      // const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'user_subscritptions.csv';
          link.click();
        
          URL.revokeObjectURL(url);

  }
}
