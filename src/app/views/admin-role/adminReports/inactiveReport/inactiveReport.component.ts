import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { columnHeaders, ColumnValue } from '@modules/tableData';
import { AuthService } from '@services/auth.service';
import { ChangeLanguageService } from '@services/changeLanguage.service';
import { GeneralService } from '@services/general.service';
import { HttpService } from '@services/http.service';
import { Dropdown } from 'primeng/dropdown';
import { Paginator } from 'primeng/paginator';
import { Subscription, switchMap } from 'rxjs';
const datePipe = new DatePipe('en-EG');

@Component({
  selector: 'app-inactiveReport',
  templateUrl: './inactiveReport.component.html',
  styleUrls: ['./inactiveReport.component.scss']
})
export class InactiveReportComponent implements OnInit {

 
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
  userPermissions:any;

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
    // {
    //  nameAR: ' حالة الباقة ',
    //  nameEN:'Package status'
    // },
    {
      nameAR: ' رقم الجوال  ',
      nameEN:'Mobile number'
     },
     {
      nameAR: ' تاريخ التسجيل ',
      nameEN:'date of registration'
     },
     {
      nameAR: ' تاريخ انتهاء الباقة ',
      nameEN:'Package expiration date'
     },
     {
      nameAR: ' تاريخ اخر فاتورة ',
      nameEN:'Last invoice date'
     },
    //  {
    //   nameAR: ' عدد الفواتير',
    //   nameEN:'	Number of invoices '
    //  },
    //  {
    //   nameAR: ' عدد عروض الأسعار',
    //   nameEN:' Number of quotes '
    //  },
    //  {
    //   nameAR: ' عدد سندات القبض',
    //   nameEN:'	Number of arrest warrants '
    //  },
    //  {
    //   nameAR: ' المبالغ المحصلة',
    //   nameEN:'	Amounts collected '
    //  },
     {
      nameAR: '  اخر تسجيل دخول ',
      nameEN:'	last login '
     }
   ]

   columnsNames:ColumnValue[]= [
    {
      name:'id',
      type:'normal'
    },
    {
      name:'name',
      type:'normal'
    },
    {
      name:'plan',
      type:'normal'
    },
    // {
    //   name:'plan_status',
    //   type:'normal'
    // },
    {
      name:'phone',
      type:'whatsapp'
    },
    {
      name:'user_created_at',
      type:'normal'
    },
    {
      name:'plan_expiration',
      type:'normal'
    },
    {
      name:'last_invoice_date',
      type:'normal'
    },
    // {
    //   name:'invoices',
    //   type:'normal'
    // },
    // {
    //   name:'quotations',
    //   type:'normal'
    // },
    // {
    //   name:'receipts',
    //   type:'normal'
    // },
    // {
    //   name:'revenues',
    //   type:'normal'
    // },
    {
      name:'last_logged_in',
      type:'normal'
    }
   ]
   

   currentPage = 1
   totalPage = 0
   perPage = 0
   @ViewChild('paginator') paginator!: Paginator;
  constructor(private http:HttpService,private changeLang:ChangeLanguageService,
    private router:Router,private authService:AuthService,
    private generalService:GeneralService,
    private activatedRoute:ActivatedRoute) {
      this.changeDate()
   }

  ngOnInit() {
    this.language=this.changeLang.local_lenguage

    let user = this.authService.getUserObj();
    this.userPermissions = user.permissions;

    this.subs.add(this.activatedRoute.queryParams.pipe(
      switchMap((param: any) => {
        if(param['page'] && param['date_from'] && param['date_to']){
            this.currentPage = Number(param['page']);
            this.startDate = param['date_from'];
            this.endDate = param['date_to'];
        }
        return this.getUsersReport(param);
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


  getUsersReport(params:any){
    return this.http.getReq('api/admin/reports/inActiveUsers/users',{params:params})
   }

   changeDate(){
    // this.getDate(this.currentDuration)

    if(this.currentDuration >0 && this.currentDuration < 11){
      const { startDate, endDate } = this.generalService.getDate_admin(this.currentDuration);
      this.startDate = startDate;
      this.endDate = endDate;
    }

    // this.endDate = this.generalService.getDate_admin(this.currentDuration).endDate;

    this.startDate=datePipe.transform( this.startDate, 'yyyy-MM-dd');
    this.endDate=datePipe.transform( this.endDate, 'yyyy-MM-dd');

    this.router.navigate([], { queryParams: {page: 1 , date_from:this.startDate , date_to: this.endDate}, queryParamsHandling: 'merge' });
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
    let csvContent = '\uFEFF';
     csvContent += '"User number","User","Package type","Package status","Mobile number","date of registration","Package expiration date","Number of invoices","Number of quotes","Number of arrest warrants","Amounts collected","last login"\n'; // CSV header
  
    data.forEach((item:any) => {
      const row = [
          item.id,
          item.name,
          item.plan,
          item.plan_status,
          item.phone,
          item.created_at,
          item.plan_expiration,
          item.invoices,
          item.quotations,
          item.receipts,
          item.revenues,
          item.last_logged_in
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
          link.download = 'monthly_data.csv';
          link.click();
        
          URL.revokeObjectURL(url);

  }

  onPageChange(e:any){

    this.currentPage = e.page + 1
    this.router.navigate([], { queryParams: {page: this.currentPage}, queryParamsHandling: 'merge' });
  }
}
