import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ColumnValue, columnHeaders } from '@modules/tableData';
import { AuthService } from '@services/auth.service';
import { ChangeLanguageService } from '@services/changeLanguage.service';
import { GeneralService } from '@services/general.service';
import { HttpService } from '@services/http.service';
import { Dropdown } from 'primeng/dropdown';
import { Paginator } from 'primeng/paginator';
import { Subscription, switchMap } from 'rxjs';


const datePipe = new DatePipe('en-EG');

@Component({
  selector: 'app-admin-users-report',
  templateUrl: './admin-users-report.component.html',
  styleUrls: ['./admin-users-report.component.scss']
})
export class AdminUsersReportComponent implements OnInit {


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
  currentDuration = 4;
  language:any


  columnsArray:columnHeaders[]= [
    {
     nameAR: 'رقم المستخدم',
     nameEN:'User Id'

    },
    {
     nameAR: 'الاسم',
     nameEN:'Name'
    },
    {
     nameAR: ' نوع الباقة ',
     nameEN:'Package type'
    },
    {
      nameAR: ' حالة الباقة ',
      nameEN:'Package status'
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
        nameAR: ' تاريخ التسجيل ',
        nameEN:'date of registration'
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
      nameAR: ' اجمالي قيمة أشتراكاته السابقة ',
      nameEN:'	The total value of his previous subscriptions '
     },
     {
      nameAR: ' عدد مرات تجديد الاشتراك ',
      nameEN:'	Number of times the subscription is renewed'
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
        nameAR: ' عدد سندات القبض',
        nameEN:'	Number of receipts '
      },
      // {
      //   nameAR: ' المبالغ المحصلة',
      //   nameEN:'	Amounts collected '
      // },
     {
      nameAR: ' تاريخ اخر فاتورة ',
      nameEN:'Last invoice date'
     },
     {
      nameAR: '  اخر تسجيل دخول ',
      nameEN:'	last login '
     },
     {
      nameAR: 'نوع المنصة',
      nameEN: 'Platform type'}
   ]

   columnsNames:ColumnValue[]= [
    {
      name:'id',
      type:'normal'
    },
    {
      name:'user_name',
      type:'blueAdminUserReport'
    },
    {
      name:'plan_name',
      type:'normal'
    },
    {
      name:'plan_status',
      type:'normal'
    },
    {
      name:'user_phone',
      type:'whatsapp'
    },
    {
      name:'user_email',
      type:'normal'
    },
    {
      name:'user_created_at',
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
      name:'revenues_from_subscriptions',
      type:'normal'
    },
    {
      name:'renewing_subscription',
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
      name:'receipts',
      type:'normal'
    },
    // {
    //   name:'revenues',
    //   type:'normal'
    // },
    {
      name:'last_invoice_date',
      type:'normal'
    },
    {
      name:'last_logged_in',
      type:'normal'
    },
    {
      name:'platform_type',
      type:'normal'
    },
   ]
   currentPage = 1
   totalPage = 0
   perPage = 0
   @ViewChild('paginator') paginator!: Paginator;
   userPermissions:any;


   tab=1;
   activeItem!: any;
   currentType = 'all'

   usersType = [
    {
      nameAR:'الكل',
      nameEN:'All',
      value:'all'
    },
    {
      nameAR:'فعالة',
      nameEN:'active',
      value:'active'
    },
    {
      nameAR:'منتهية',
      nameEN:'expired',
      value:'expired'
    },
   ]
   invoiceCreation = [
    {
      nameAR:'الكل',
      nameEN:'All',
      value:'all'
    },
    {
      nameAR:'تم الإصدار من قبل',
      nameEN:'Released',
      value:'has_invoices'
    },
    {
      nameAR:'لم يتم الإصدار من قبل',
      nameEN:'Not released before',
      value:'has_no_invoices'
    },
   ]

durations:any = [];
plans:any;
filteredPlans:any;
plan_id = -1;

has_invoicesType = 'all';
constructor(private http:HttpService,private changeLang:ChangeLanguageService,
  private activatedRoute:ActivatedRoute,
  private generalService:GeneralService,
  private router:Router,private authService:AuthService) {
    this.language=this.changeLang.local_lenguage

  // this.changeDate()
  this.getUserPlans()

  this.applyFilters();
 }
 ngOnInit() {

  let user = this.authService.getUserObj();
this.userPermissions = user.permissions

this.subs.add(this.activatedRoute.queryParams.pipe(
  switchMap((param: any) => {
    if (param['page']) {
      this.currentPage = Number(param['page']);
    }
    if (param['date_from'] && param['date_to']) {
      this.startDate = param['date_from'];
      this.endDate = param['date_to'];
    }
    if (param['plan_id']) {
      this.Current_plan_id = Number(param['plan_id']);
    }
    if (param['type']) {
      this.currentType = param['type'];
    }
    if (param['invoices']) {
      this.has_invoicesType = param['invoices'];
    }
    return this.getReport(param);
  })
).subscribe({
  next:res=>{
    this.usersData=res.data
    this.perPage=res.meta.per_page
    this.totalPage=res.meta.total
    setTimeout(() => {
      this.paginator.changePage(this.currentPage -1);
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
    if(this.plans){
 // this.filteredPlans = this.plans.filter((item:any) => item.price > 0);
  let AllName = this.language =='ar' ? 'الكل' :'All'
 let staticItem = {
  id: null,
  name: AllName
};

this.filteredPlans = [staticItem, ...this.plans];
// this.filteredPlans = this.plans;
    }
   
},
}))
}

Current_duration = null;
SetDuration(event:any){
this.Current_duration = event.value;
}
Current_plan_id:any = null;
fillDuration(event:any){
this.Current_plan_id = event.value;
// let index = this.filteredPlans.findIndex((plan:any) => plan.id == event.value)
// if(index > -1){
//   this.durations = this.filteredPlans[index].durations;
// }
}

getReport(param:any){

return  this.http.getReq('api/admin/reports/expired/subscriptions',{params:param})
}

// durationFilter(){
// this.router.navigate([], { queryParams: {page: 1 , plan_id:this.Current_plan_id , duration:this.Current_duration}, queryParamsHandling: 'merge' });
// }


applyFilters(){
this.changeDate();
  this.currentPage = 1;
this.router.navigate([], 
  { queryParams: {
     page: 1 ,
     plan_id:this.Current_plan_id ,
     date_from:this.startDate ,
     date_to: this.endDate,
     type:this.currentType,
     invoices: this.has_invoicesType

    },
     queryParamsHandling: 'merge' });
}

reportfilter = false
// reportFilter(){
// this.reportfilter = !this.reportfilter;

// if(this.reportfilter){
//   this.router.navigate([], { queryParams: {page: 1 , has_invoices:'1'}, queryParamsHandling: 'merge' });
// }else{
//   this.router.navigate([], { queryParams: {page: 1 , has_invoices:null}, queryParamsHandling: 'merge' });
// }
// }

changeDate(){
let subscriptionsData =localStorage.getItem('subscriptionsReport');
if(subscriptionsData){
  let subscriptionsReportData =JSON.parse(subscriptionsData);
  this.currentDuration = subscriptionsReportData.currentDuration;
  this.currentType = subscriptionsReportData.type;


  if(this.currentDuration >0 && this.currentDuration < 11){
    const { startDate, endDate } = this.generalService.getDate_admin(this.currentDuration);
    this.startDate = startDate;
    this.endDate = endDate;
  }

  this.startDate=datePipe.transform( this.startDate, 'yyyy-MM-dd');
  this.endDate=datePipe.transform( this.endDate, 'yyyy-MM-dd');

  localStorage.removeItem('subscriptionsReport')
}else{

  if(this.currentDuration >0 && this.currentDuration < 11){
    const { startDate, endDate } = this.generalService.getDate_admin(this.currentDuration);
    this.startDate = startDate;
    this.endDate = endDate;
  }

  this.startDate=datePipe.transform( this.startDate, 'yyyy-MM-dd');
  this.endDate=datePipe.transform( this.endDate, 'yyyy-MM-dd');
  // let currentreportfilter = this.reportfilter ? this.reportfilter : null
// this.router.navigate([], { queryParams: {page: 1 , date_from:this.startDate , date_to: this.endDate , type:this.currentType,has_invoices:currentreportfilter}, queryParamsHandling: 'merge' });
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
 csvContent += '"User Id","Name","Package type","Package status","Mobile number","Email","date of registration","First subscription package","Package expiration date","The total value of his previous subscriptions" ,"Number of times the subscription is renewed","Number of invoices","Number of quotes","Number of receipts","Last invoice date","last login","Platform type"\n'; // CSV header

data.forEach((item:any) => {
  const row = [
      item.id,
      item.user_name,
      item.plan_name,
      item.plan_status,
      item.user_phone,
      item.user_email,

      item.user_created_at,
      item.first_subscription_date,
      item.last_subscription_date,
      item.revenues_from_subscriptions,
      item.renewing_subscription,
      item.invoices,
      item.quotations,
      item.receipts,
      item.last_invoice_date,
      item.last_logged_in,
      item.platform_type
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








// ==============old report ==================================
  // startDate!:any
  // endDate!:any
  // usersData:any

  // private subs= new Subscription()
  // duration=[
  //   { nameAR: 'اليوم', nameEN: 'Today', value: 1 },
  //   { nameAR: 'البارحة', nameEN: 'Yesterday', value: 2 },
  //   { nameAR: 'آخر أسبوع', nameEN: 'Last Week', value: 3 },
  //   { nameAR: 'اخر 30 يوم', nameEN: 'Last 30 Days', value: 4 },
  //   { nameAR: 'هذا الشهر', nameEN: 'This Month', value: 5 },
  //   { nameAR: 'آخر شهر', nameEN: 'Last Month', value: 6 },
  //   { nameAR: 'آخر 3 شهور', nameEN: 'Last 3 Months', value: 7 },
  //   { nameAR: 'آخر 6 شهور', nameEN: 'Last 6 Months', value: 8 },
  //   { nameAR: 'آخر سنة', nameEN: 'Last Year', value: 9 },
  //   { nameAR: 'طوال المدة', nameEN: 'All Time', value: 10 },
  //   { nameAR: 'اختر تاريخ محدد', nameEN: 'Select Specific Date', value: 11 }
  // ]
  // currentDuration = 1;
  // language:any
  // userPermissions:any;

  // columnsArray:columnHeaders[]= [
  //   {
  //    nameAR: 'رقم المستخدم',
  //    nameEN:'User Id'

  //   },
  //   {
  //    nameAR: 'المستخدم',
  //    nameEN:'User'
  //   },
  //   {
  //    nameAR: ' نوع الباقة ',
  //    nameEN:'Package type'
      
  //   },
  //   {
  //    nameAR: ' حالة الباقة ',
  //    nameEN:'Package status'
  //   },
  //   {
  //     nameAR: ' رقم الجوال  ',
  //     nameEN:'Mobile number'
  //    },
  //    {
  //     nameAR: ' تاريخ التسجيل ',
  //     nameEN:'date of registration'
  //    },
  //    {
  //     nameAR: ' تاريخ انتهاء الباقة ',
  //     nameEN:'Package expiration date'
  //    },
  //    {
  //     nameAR: ' عدد الفواتير',
  //     nameEN:'	Number of invoices '
  //    },
  //    {
  //     nameAR: ' عدد عروض الأسعار',
  //     nameEN:' Number of quotes '
  //    },
  //    {
  //     nameAR: ' عدد سندات القبض',
  //     nameEN:'	Number of arrest warrants '
  //    },
  //    {
  //     nameAR: ' المبالغ المحصلة',
  //     nameEN:'	Amounts collected '
  //    },
  //    {
  //     nameAR: '  اخر تسجيل دخول ',
  //     nameEN:'	last login '
  //    }
  //  ]

  //  columnsNames:ColumnValue[]= [
  //   {
  //     name:'id',
  //     type:'normal'
  //   },
  //   {
  //     name:'name',
  //     type:'normal'
  //   },
  //   {
  //     name:'plan',
  //     type:'normal'
  //   },
  //   {
  //     name:'plan_status',
  //     type:'normal'
  //   },
  //   {
  //     name:'phone',
  //     type:'normal'
  //   },
  //   {
  //     name:'created_at',
  //     type:'normal'
  //   },
  //   {
  //     name:'plan_expiration',
  //     type:'normal'
  //   },
  //   {
  //     name:'invoices',
  //     type:'normal'
  //   },
  //   {
  //     name:'quotations',
  //     type:'normal'
  //   },
  //   {
  //     name:'receipts',
  //     type:'normal'
  //   },
  //   {
  //     name:'revenues',
  //     type:'normal'
  //   },
  //   {
  //     name:'last_logged_in',
  //     type:'normal'
  //   }
  //  ]
   

  //  currentPage = 1
  //  totalPage = 0
  //  perPage = 0
  //  @ViewChild('paginator') paginator!: Paginator;
  // constructor(private http:HttpService,private changeLang:ChangeLanguageService,
  //   private router:Router,private authService:AuthService,
  //   private generalService:GeneralService,
  //   private activatedRoute:ActivatedRoute) {
  //     this.changeDate()
  //  }

  // ngOnInit() {
  //   this.language=this.changeLang.local_lenguage

  //   let user = this.authService.getUserObj();
  //   this.userPermissions = user.permissions;

  //   this.subs.add(this.activatedRoute.queryParams.pipe(
  //     switchMap((param: any) => {
  //       if(param['page'] && param['date_from'] && param['date_to']){
  //           this.currentPage = Number(param['page']);
  //           this.startDate = param['date_from'];
  //           this.endDate = param['date_to'];
  //       }
  //       return this.getUsersReport(param);
  //     })
  //   ).subscribe({
  //     next:res=>{
  //       this.usersData=res.data
  //       this.perPage=res.meta.per_page
  //       this.totalPage=res.meta.total
  //       setTimeout(() => {
  //         this.paginator.changePage(this.currentPage -1 )
  //       }, 200);
  //     }
  //   }));
  
  // }


  // getUsersReport(params:any){
  //   return this.http.getReq('api/admin/reports/users',{params:params})
  //  }

  //  changeDate(){

  //   if(this.currentDuration >0 && this.currentDuration < 11){
  //     const { startDate, endDate } = this.generalService.getDate_admin(this.currentDuration);
  //     this.startDate = startDate;
  //     this.endDate = endDate;
  //   }

  //   this.startDate=datePipe.transform( this.startDate, 'yyyy-MM-dd');
  //   this.endDate=datePipe.transform( this.endDate, 'yyyy-MM-dd');

  //   this.router.navigate([], { queryParams: {page: 1 , date_from:this.startDate , date_to: this.endDate}, queryParamsHandling: 'merge' });
  // }


  // @ViewChild('calendarModel') calendarModel!: ElementRef<HTMLElement>;

  // openCalenderModel(){
  //   let el: HTMLElement = this.calendarModel.nativeElement;
  //   el.click();
  // }
  // @ViewChild('durationDropDown') private durationDropDown!: Dropdown;

  // openModelCheck(){
  //   if (!this.durationDropDown.overlayVisible){
  //     if(this.currentDuration==11){
  //       this.openCalenderModel()
  
  //     }

  //   }
  // }

  
  // generateCSV(data:any): string {
  //   let csvContent = '\uFEFF';
  //    csvContent += '"User number","User","Package type","Package status","Mobile number","date of registration","Package expiration date","Number of invoices","Number of quotes","Number of arrest warrants","Amounts collected","last login"\n'; // CSV header
  
  //   data.forEach((item:any) => {
  //     const row = [
  //         item.id,
  //         item.name,
  //         item.plan,
  //         item.plan_status,
  //         item.phone,
  //         item.created_at,
  //         item.plan_expiration,
  //         item.invoices,
  //         item.quotations,
  //         item.receipts,
  //         item.revenues,
  //         item.last_logged_in
  //     ].map(field => `"${field?.toString() || ''}"`).join(',');

  //     csvContent += row + '\n'; // Add each row
  //   });
  //   return csvContent;
  // }

  // downloadCSV(): void {
  //   const data = this.generateCSV(this.usersData);
  //     const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' });
  //         const url = URL.createObjectURL(blob);
  //         const link = document.createElement('a');
  //         link.href = url;
  //         link.download = 'monthly_data.csv';
  //         link.click();
  //         URL.revokeObjectURL(url);
  // }

  // onPageChange(e:any){

  //   this.currentPage = e.page + 1
  //   this.router.navigate([], { queryParams: {page: this.currentPage}, queryParamsHandling: 'merge' });
  // }
}
