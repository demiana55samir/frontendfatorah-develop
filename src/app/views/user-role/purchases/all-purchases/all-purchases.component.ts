import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LooseObject } from '@models/LooseObject';
import { HttpService } from '@services/http.service';
import { BehaviorSubject, Subscription, debounceTime, switchMap } from 'rxjs';
import { purchase } from '@models/purchase';
import { Paginator } from 'primeng/paginator';
import { MenuItem } from 'primeng/api';
import { ChangeLanguageService } from '@services/changeLanguage.service';

interface ColumnValue{
  name:string,
  type:string
}
interface ControlItem{
  nameAR:string,
  nameEN:string,
  route:{
    path:string,
    attribute:string
  }
  popUp:string
}

interface columnHeaders{ 
  nameAR:String,
  nameEN:string
}

@Component({
  selector: 'app-all-purchases',
  templateUrl: './all-purchases.component.html',
  styleUrls: ['./all-purchases.component.scss']
})
export class AllPurchasesComponent implements OnInit ,OnDestroy{

  selectedValue!:any
  searchWord:string = '';
  searchInput$ = new BehaviorSubject('');
  private subs = new Subscription();
  Purchases!:purchase[]

  currentPage = 1
  totalPage = 0
  perPage = 0
  columnsArray:columnHeaders[]= [
    {
      nameAR: 'الرقم',
      nameEN:' id'
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
     nameAR: ' المبلغ الإجمالى',
     nameEN:'Total Amount'
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
      name:'tax_after_tax',
      type:'SAR-number'
    },
    {
      name:'remaining_amount',
      type:'SAR-number'
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
  
   controlArray:ControlItem[]=[
    {
      nameAR:'عرض تفاصيل مشتري / مصروف',
      nameEN:'View purchase / expense',
      route:{
        path:'/user/purchases/purchases-details/new/',
        attribute:'uuid'
      },
      popUp:''
    },
    {
      nameAR:' إضافة دفعة',
      nameEN:'Add Payment',
      route:{
        path:'',
        attribute:'uuid'
      },
      popUp:'addPayment'
    },
    // {
    //   nameAR:'تعديل المشتري',
    //   nameEN:'Edit purchase',
    //   route:{
    //     path:'/user/purchases/edit-purchases/',
    //     attribute:'uuid'
    //   },
    //   popUp:''
    // },
    {
      nameAR:'الغاء المشتري / المصروف',
      nameEN:'Cancel purchase / expense',
      route:{
        path:'',
        attribute:'uuid'
      },
      popUp:'deletePurchaseUser'
    },

   ]

   tab=1;
   activeItem!: MenuItem;
   
  //  unpaid_count!:any
  //  paid_count!:any

  // {
  //   id:1, 
  //   name:'وقود'
  // },
  // {
  //   id:2,
  //   name:'مرتبات'
  // }

  expenses = [];
  purchase = [];
  
  items=[{label:"الكل",command: (event:any) => {
    this.activeItem=this.items[0]
    this.tab=1
    this.searchWord=''
    this.paginator.changePage(0)
    this.paginator.updatePageLinks();
   
    return this.router.navigate([], { queryParams: {status:null,expenses_type:null,q:null,page:1,expense:null} , queryParamsHandling: 'merge' })
  }}
  ,{label:" مشترى بفاتورة  ",command: (event:any) => {
    this.activeItem=this.items[1]
    this.tab=2
    this.searchWord=''
   

    this.paginator.changePage(0)
    this.paginator.updatePageLinks();
    return this.router.navigate([], { queryParams: {status:1,q:null,page:1,expenses_type:null} , queryParamsHandling: 'merge' })

  }},
  {label:" مشتريات غير مقبولة",command: (event:any) => {
    this.activeItem=this.items[2]
    this.tab=3
    this.searchWord=''
   

    this.paginator.changePage(0)
    this.paginator.updatePageLinks();
    return this.router.navigate([], { queryParams: {status:2,q:null,page:1,expenses_type:null} , queryParamsHandling: 'merge' })

  }}
  ,{label:" مصروفات ",command: (event:any) => {
    this.activeItem=this.items[3]
    this.tab=4
    this.searchWord=''
   
    this.paginator.changePage(0)
    this.paginator.updatePageLinks();

    return this.router.navigate([], { queryParams: {status:0,expenses_type:null,q:null,page:1} , queryParamsHandling: 'merge' })

  }}
  // ,{label:"جديد",command: (event:any) => {
  //   this.activeItem=this.items[3]
  //   this.tab=4
  //   return this.router.navigate([], { queryParams: {paid:this.tab} , queryParamsHandling: 'merge' })
  // }}
  ]

language = 'ar';
expenses_type = 0;
  @ViewChild('paginator') paginator!: Paginator;
constructor(private router:Router,private http:HttpService,
  private chageLanguageService:ChangeLanguageService,
  private activatedRoute: ActivatedRoute) { 
  // this.router.navigate([], { queryParams: {q:''}, queryParamsHandling: 'merge' });
  this.router.navigate([], { queryParams: {q:null,status:null,expenses_type:null}, queryParamsHandling: 'merge' })  
} 

  ngOnInit() {

    this.activeItem=this.items[0]
    this.language=this.chageLanguageService.local_lenguage
    if(this.language=='en'){
      this.items[0].label='All'
      this.items[1].label='Purchase with invoice'
      this.items[2].label='Unacceptable Purchases'
      this.items[3].label='expenses'
    }

    this.getExpensesType()
    this.subs.add(this.activatedRoute.queryParams.pipe(
      switchMap((param: any) => {
        if(param['page'] ){
            this.currentPage = Number(param['page']);
        }
        return this.getAllData(param);
      })
    ).subscribe({
      next:res=>{
        this.Purchases=res.data
        this.perPage=res.meta.per_page
        this.totalPage=res.meta.total
        setTimeout(() => {
          this.paginator.changePage(this.currentPage -1 )
        }, 200);
      }
    }));
  }

  navigate(router:string){
    this.router.navigate([router] )
  }

  getAllData(filters : any){
    let x :LooseObject ={}; 
    for (const [key , value] of Object.entries(filters) ) {
      // console.log( key ,  value);
      if(value)
        x[key] = value
    }
    let getUrl = 'api/dashboard/purchasings';
    // if(TabType == 1){
    //    getUrl = 'api/v2/news';
    // }else{
    //    getUrl = 'api/v2/news';
    //    x['type']='information'
    // }
   return this.http.getReq(getUrl,{params:x}); 
 }

 getExpensesType(){
  this.http.getReq('api/dashboard/expenses_types_with_trashed').subscribe({
    next:(res)=>{
      this.expenses = res.data.expense;
      this.purchase = res.data.purchase;
    }
  });
 }
 chooseExpenseType(){
  return this.router.navigate([], { queryParams: {page:1,expenses_type:this.expenses_type}, queryParamsHandling: 'merge' });
 }

 search(){
  this.subs.add(this.searchInput$.pipe(
    debounceTime(2000),
  ).subscribe(
    {
      next:() => {
        if(this.tab==2){
          return this.router.navigate([], { queryParams: {page:1,q:this.searchWord,status:'1'}, queryParamsHandling: 'merge' });
        }
        else if(this.tab==3){
          return this.router.navigate([], { queryParams: {page:1,q:this.searchWord,status:'0'}, queryParamsHandling: 'merge' });
        }
        return this.router.navigate([], { queryParams: {page:1,q:this.searchWord,status:null}, queryParamsHandling: 'merge' });

        // return this.router.navigate([], { queryParams: { page:1 , q: this.searchWord}, queryParamsHandling: 'merge' });
      }
    }
  ));
  this.searchInput$.next(this.searchWord);
}

onPageChange(e:any){

  this.currentPage = e.page + 1
  this.router.navigate([], { queryParams: {page: this.currentPage}, queryParamsHandling: 'merge' });
}

ngOnDestroy() {
  this.subs.unsubscribe();
}
}
