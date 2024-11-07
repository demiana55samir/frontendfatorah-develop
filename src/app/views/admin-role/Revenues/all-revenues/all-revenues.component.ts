import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LooseObject } from '@models/LooseObject';
import { ColumnValue, ControlItem, columnHeaders } from '@models/tableData';
import { AuthService } from '@services/auth.service';
import { ChangeLanguageService } from '@services/changeLanguage.service';
import { GeneralService } from '@services/general.service';
import { HttpService } from '@services/http.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Dropdown } from 'primeng/dropdown';
import { Paginator } from 'primeng/paginator';
import { BehaviorSubject, Subscription, debounceTime, switchMap } from 'rxjs';
const datePipe = new DatePipe('en-EG');
@Component({
  selector: 'app-all-revenues',
  templateUrl: './all-revenues.component.html',
  styleUrls: ['./all-revenues.component.scss']
})
export class AllRevenuesComponent implements OnInit {

  revenue:any
  selectedValue!:any
  searchWord:string = '';
  searchInput$ = new BehaviorSubject('');
  private subs = new Subscription();
  currentPage = 1
  totalPage = 0
  perPage = 0
  userUuid:string
  columnsArray:columnHeaders[]= [
    {
     nameAR: 'اسم المستخدم',
     nameEN:'User Name'
  
    },
    
    {
     nameAR: 'رقم الجوال',
     nameEN:'Phone Number'
  
    },
    {
     nameAR: 'قيمة التحويل',
     nameEN:'Amount'
  
    },
    {
     nameAR: 'باقة الاشتراك',
     nameEN:'Plan'
  
    },
    { 
      nameAR:'تاريخ التحويل',
      nameEN:'Transfer date'
  
    },
    { 
      nameAR:'اعادة مال',
      nameEN:'Refund'
      
    },
  
   ]
  
   columnsNames:ColumnValue[]= [
    {
      name:'user_name',
      type:'blueAdminUserId'
    },
    {
      name:'phone',
      type:'normal'
    },
    {
      name:'amount',
      type:'normal'
    },
    {
      name:'plan_name',
      type:'normal'
    },
    {
      name:'transfer_date',
      type:'normal'
    },
    {
      name:'refund',
      type:'normal'
    },

   ]
   @ViewChild('paginator') paginator!: Paginator;
   controlArray:ControlItem[]=[]

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
  currentDuration:number = 1
  startDate!:any
  endDate!:any
  language = 'ar';
    constructor(private router: Router,private http:HttpService,
      private authService:AuthService,private changeLang:ChangeLanguageService,
      private generalService:GeneralService,
      private activatedRoute: ActivatedRoute) {
      // this.router.navigate([], { queryParams: {q:null,page:1}, queryParamsHandling: 'merge' })  
      this.userUuid = String(this.activatedRoute.snapshot.paramMap.get('uuid'))
  
      this.changeDate()
      // this.subs.add(this.activatedRoute.queryParams.pipe(
      //   switchMap((param: any) => {
      //     if(param['page'] ){
      //       this.currentPage = Number(param['page']);
      //   }
      //     return this.getAllData(param);
      //   })
      // ).subscribe({
      //   next:res=>{
      //     this.revenue=res.data
      //     this.perPage=res.meta.per_page
      //     this.totalPage=res.meta.total
      //     setTimeout(() => {
      //       this.paginator.changePage(this.currentPage -1 )
      //     }, 200);
      //   }
      // }));
     }
  
    ngOnInit() {
      this.language=this.changeLang.local_lenguage
      this.subs.add(this.activatedRoute.queryParams.pipe(
        switchMap((param: any) => {
          if(param['page'] && param['date_from'] && param['date_to']){
              this.currentPage = Number(param['page']);
              this.startDate = param['date_from'];
              this.endDate = param['date_to'];
          }
          return this.getAllData(param);
        })
      ).subscribe({
        next:res=>{
          this.revenue=res.data
          this.perPage=res.meta.per_page
          this.totalPage=res.meta.total
          setTimeout(() => {
            this.paginator.changePage(this.currentPage -1 )
          }, 200);
        }
      }));


    }
  
    getAllData(filters : any){
      let x :LooseObject ={}; 
      for (const [key , value] of Object.entries(filters) ) {
        // console.log( key ,  value);
        if(value)
          x[key] = value
      }
      let getUrl = 'api/admin/revenues';
     return this.http.getReq(getUrl,{params:x}); 
   }

  
  onPageChange(e:any){
  
    this.currentPage = e.page + 1
    this.router.navigate([], { queryParams: {page: this.currentPage}, queryParamsHandling: 'merge' });
  }

  changeDate(){
    // this.getDate(this.currentDuration)

    if(this.currentDuration >0 && this.currentDuration < 11){
      const { startDate, endDate } = this.generalService.getDate_admin(this.currentDuration);
      this.startDate = startDate;
      this.endDate = endDate;
    }

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
    csvContent += '"User Name","Phone Number","Amount","Plan","Transfer date","Refund"\n'; // CSV header
 
    data.forEach((item:any) => {
      const row = [
          item.user_name,
          item.phone,
          item.amount,
          item.plan_name,
          item.transfer_date,
          item.refund
      ].map(field => `"${field?.toString() || ''}"`).join(',');

      csvContent += row + '\n'; // Add each row
    });
    return csvContent;
  }

  downloadCSV(): void {
    const data = this.generateCSV(this.revenue);

       // const blob = new Blob([data], { type: 'text/csv' });
      const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' });
      // const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'revenues.csv';
          link.click();
        
          URL.revokeObjectURL(url);

  }

  exportPDF() {
    const input = document.getElementById('reportTable');
    if (input) {
        // Adjusting the scale to ensure the entire table is captured
        const scale = 2; // You can adjust this scale factor as needed

        html2canvas(input, { scale: scale })
        .then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'landscape', // Change based on your table's aspect ratio
                unit: 'pt',
                format: [canvas.width, canvas.height]
            });

            // Add the image to the PDF
            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width , canvas.height);

            pdf.save("revenues.pdf");
        });
    }
}
}
