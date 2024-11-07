import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LooseObject } from '@models/LooseObject';
import { userInvoice } from '@models/user-invoices';
import { AuthService } from '@services/auth.service';
import { ChangeLanguageService } from '@services/changeLanguage.service';
import { HttpService } from '@services/http.service';
import { InvoicesService } from '@services/invoices.service';
import { ToastrService } from 'ngx-toastr';
import { MenuItem } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { BehaviorSubject, Subscription, debounceTime, switchMap } from 'rxjs';
import { ColumnValue, ControlItem, columnHeaders } from '@models/tableData';


@Component({
  selector: 'app-All-invoices-page',
  templateUrl: './All-invoices-page.component.html',
  styleUrls: ['./All-invoices-page.component.scss']
})
export class AllInvoicesPageComponent implements OnInit  {
  options=[{}]
  selectedValue!:any
  searchWord:string = '';
  searchInput$ = new BehaviorSubject('');
  private subs = new Subscription();
  activeItem!: MenuItem;
  tab=1
  unpaid_count!:any
  paid_count!:any
  numberArray:any=[]
  currentPage = 1
  totalPage = 0
  perPage = 0
  resetCheckbox:any

  // {
  //   nameAR:'تحديد',
  //   nameEN:'select'

  // }
  columnsArray:columnHeaders[]= [
   {
      nameAR:'رقم الفاتورة',
      nameEN:'Invoice id'
    },
    {
     nameAR:'العميل',
     nameEN:'Client'
    },
    {
      nameAR: 'تحميل',
      nameEN: 'Download'
    },
    {
      nameAR: 'سندات القبض',
      nameEN: 'Receipts'
    },
   
    {
     nameAR:'المبلغ المحصل',
     nameEN:'Collected amount'
    },
    {
      nameAR: 'الاجمالي',
      nameEN:'Amount'
    },
    {
      nameAR: 'الإشعارات الدائنة',
      nameEN: 'Credit Notes'
    },
    // {
    //   nameAR: 'الإشعارات المدينة',
    //   nameEN: 'Debit Notes'
    // },
    {
      nameAR:'تاريخ انشاء الفاتورة',
      nameEN:'Invoice Created At'
    },
    {
      nameAR:'  هيئة الزكاة والضريبة والجمارك ',
      nameEN:'Zakat, Tax and Customs Authority '
    }

   ]

  //  {
  //   name:'select',
  //   type:'check'
  // },
   columnsNames:ColumnValue[]= [
   
    {
      name:'number',
      type:'normal'
    },
    {
      name:'client',
      type:'blueClientId'
    },
    {
      name:'',
      type:'download'
    },
    {
      name:'',
      type:'add_receipts'
    },
    {
      name:'paid',
      type:'normal'
    },
    {
      name:'total',
      type:'normal'
    },

    {
      name:'',
      type:'add_credit_notes'
    },
    // {
    //   name:'',
    //   type:'add_debit_notes'
    // },


    {
      name:'date',
      type:'normal'
    },
    {
      name:'zatca_send_status',
      type:'zatca_status'
    }
   ]
  

  //  {
  //   nameAR:'أنشاء رابط دفع',
  //   nameEN:'Add quotation',
  //   route:{
  //     path:'',
  //     attribute:''
  //   },
  //   popUp:'opencreatePaymentLinkModel'
  // },

   controlArray:ControlItem[]=[
    {
      nameAR:'تحميل الفاتورة',
      nameEN:'Download Invoice',
      route:{
        path:'',
        attribute:''
      },
      popUp:''
    },
    {
      nameAR:'رؤية الفاتورة',
      nameEN:'Invoice Details',
      route:{
        path:'/user/invoices/invoice-details/',
        attribute:'uuid'
      },
      popUp:''

    },
    {
      nameAR:'أضافة سند قبض',
      nameEN:'Add Receipt Voucher',
      route:{
        path:'/user/invoices/add-voucher/',
        attribute:'uuid'
      },
      popUp:'showReceiptVoucher'
    },
    
    {
      nameAR:'إضافة اشعار دائن',
      nameEN:'Add credit Notice',
      route:{
        path:'/user/invoices/credit-note-details/create/',
        attribute:'uuid'
      },
      popUp:'showCreditNotice'
    },
    // {
    //   nameAR:'إضافة اشعار مدين',
    //   nameEN:'Add debit Notice',
    //   route:{
    //     path:'/user/invoices/credit-note-details/create/',
    //     attribute:'uuid'
    //   },
    //   popUp:'showDebitNotice'
    // },
    {
      nameAR:'ارسل إلى هيئة الزكاة',
      nameEN:'Submit to Zatca',
      route:{
        path:'',
        attribute:'uuid'
      },
      popUp:'submitToZatca'
    },
    {
      nameAR:' حذف الفاتورة ',
      nameEN:'Delete Invoice',
      route:{
        path:'',
        attribute:'uuid'
      },
      popUp:'CancelInvoice'
    },
   ]

   @ViewChild('paginator') paginator!: Paginator;


  items=[{label:"الكل",command: (event:any) => {
    this.activeItem=this.items[0]
    this.tab=1
    this.searchWord=''
    this.paginator.changePage(0)
    this.paginator.updatePageLinks();
    this.resetCheckbox=true
    return this.router.navigate([], { queryParams: {paid:null,unpaid:null,q:null,page:1} , queryParamsHandling: 'merge' })
  }}
  ,{label:"غير محصل",command: (event:any) => {
    this.activeItem=this.items[1]
    this.tab=2
    this.searchWord=''
    this.resetCheckbox=true

    this.paginator.changePage(0)
    this.paginator.updatePageLinks();
    return this.router.navigate([], { queryParams: {unpaid:'unpaid',paid:null,q:null,page:1} , queryParamsHandling: 'merge' })

  }}
  ,{label:"محصل بالكامل",command: (event:any) => {
    this.activeItem=this.items[2]
    this.tab=3
    this.searchWord=''
    this.resetCheckbox=true
    this.paginator.changePage(0)
    this.paginator.updatePageLinks();

    return this.router.navigate([], { queryParams: {paid:'paid',unpaid:null,q:null,page:1} , queryParamsHandling: 'merge' })

  }}
  // ,{label:"جديد",command: (event:any) => {
  //   this.activeItem=this.items[3]
  //   this.tab=4
  //   return this.router.navigate([], { queryParams: {paid:this.tab} , queryParamsHandling: 'merge' })
  // }}
]
  invoices!:userInvoice[]
  constructor(private router: Router,private toastr:ToastrService,private http:HttpService,private activatedRoute: ActivatedRoute,private auth:AuthService,private invoiceService:InvoicesService,private chageLanguageService:ChangeLanguageService ) { 
    this.router.navigate([], { queryParams: {q:null,paid:null,unpaid:null}, queryParamsHandling: 'merge' })  

  }

  language:any
  ngOnInit() {

    this.language=this.chageLanguageService.local_lenguage
    if(this.language=='en'){
      this.items[0].label='All'
      this.items[1].label='Uncollected'
      this.items[2].label='collected'
    }
    // {name:"أنشاء رابط دفع",value:2}
    this.options=[{name:"أضافة سند قبض",value:1},{name:"إضافة اشعار دائن",value:1}]
    //this.getAllInvoices()
    this.activeItem=this.items[0]
    this.subs.add(this.activatedRoute.queryParams.pipe(
      switchMap((param: any) => {
        if(param['page'] ){
            this.currentPage = Number(param['page']);
            // this.paginator.updatePageLinks();
        }
        return this.getAllData(param);
      })
    ).subscribe({
      next:res=>{
        this.invoices=res.data
        this.perPage=res.meta.per_page
        this.totalPage=res.meta.total
        this.unpaid_count=res.unpaid_count
        this.paid_count=res.paid_count
        this.numberArray.push(res.unpaid_count+res.paid_count)
        this.numberArray.push(res.unpaid_count)
        this.numberArray.push(res.paid_count)

        setTimeout(() => {
          this.paginator.changePage(this.currentPage -1 )
        }, 200);
      }
    }));
  }

  // confirmDeleteEvent(data:any){
  //   if(data.delete==true){
  //     this.cancelledInvoice()
  //   }
  //   else{
  //    this.closeModal()
  //   }
  // }

  resetCheckboxValue(data:any){
    this.resetCheckbox=data
  }


  navigate(router:string){
    this.router.navigate([router] )
  }
  // changeTapType(tab:number){
  //   this.tab=tab
  // }
  getAllData(filters : any){
    let x :LooseObject ={}; 
    for (const [key , value] of Object.entries(filters) ) {
      // console.log( key ,  value);
      if(value)
        x[key] = value
    }
    let getUrl = 'api/dashboard/invoices';
    // if(TabType == 1){
    //    getUrl = 'api/v2/news';
    // }else{
    //    getUrl = 'api/v2/news';
    //    x['type']='information'
    // }
   return this.http.getReq(getUrl,{params:x}); 
 }
 search(){
  this.subs.add(this.searchInput$.pipe(
    debounceTime(2000),
  ).subscribe(
    {
      next:() => {
         if(this.tab==2){
           return this.router.navigate([], { queryParams: {page:1,q:this.searchWord,paid:'paid'}, queryParamsHandling: 'merge' });
         }
         else if(this.tab==3){
           return this.router.navigate([], { queryParams: {page:1,q:this.searchWord,unpaid:'unpaid'}, queryParamsHandling: 'merge' });
         }
         return this.router.navigate([], { queryParams: {page:1,q:this.searchWord,paid:null,unpaid:null}, queryParamsHandling: 'merge' });

      }
    }
  ));
  this.searchInput$.next(this.searchWord);
}

onPageChange(e:any){
  this.currentPage = e.page + 1
  this.router.navigate([], { queryParams: {page: this.currentPage}, queryParamsHandling: 'merge' });
}
formDataPayLoad = new FormData();
@ViewChild('openDeleteModal') openDeleteModal!: ElementRef<HTMLElement>;
openModel(){
  let el: HTMLElement = this.openDeleteModal.nativeElement;
    el.click();
}
@ViewChild('closeDeleteModal') closeDeleteModal!: ElementRef<HTMLElement>;
closeModal(){
  let el: HTMLElement = this.closeDeleteModal.nativeElement;
    el.click();
  }



cancelledInvoice(event:any){
if(event.delete==true){
  let inv=this.invoiceService.getCancelledUuid()
  inv.forEach((element,index)=>{
    this.formDataPayLoad.append(`uuid[${index+1}]`,element.uuid)
  })
this.subs.add(this.http.postReq('api/dashboard/invoices/cancel',this.formDataPayLoad).subscribe({
  next:res=>{

  },complete:()=>{
    this.invoices = this.invoices.filter((el) => !this.invoiceService.getCancelledInvoices().includes(el));
    inv.forEach((element,index)=>{
      if(element.type==0){
        this.unpaid_count=this.unpaid_count-1
      }
      else{
        this.paid_count=this.paid_count-1
      }
      this.numberArray=[]
      this.numberArray.push(this.unpaid_count+this.paid_count)
      this.numberArray.push(this.unpaid_count)
      this.numberArray.push(this.paid_count)

    })
    if(this.language=='en'){
      this.toastr.info('Invoices Cancelled successfully')
    }
    else{
      this.toastr.info('تم إلغاء الفواتير بنجاح')
    }
  }
}))
}
else{
  this.closeModal()
}
}




ngOnDestroy() {
  this.subs.unsubscribe();
}

}
