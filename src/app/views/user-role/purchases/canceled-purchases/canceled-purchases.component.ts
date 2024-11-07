import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LooseObject } from '@models/LooseObject';
import { HttpService } from '@services/http.service';
import { Paginator } from 'primeng/paginator';
import { BehaviorSubject, Subscription, debounceTime, switchMap } from 'rxjs';
interface columnHeaders{ 
  nameAR:String,
  nameEN:string
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
interface ColumnValue{
  name:string,
  type:string
}
@Component({
  selector: 'app-canceled-purchases',
  templateUrl: './canceled-purchases.component.html',
  styleUrls: ['./canceled-purchases.component.scss']
})
export class CanceledPurchasesComponent implements OnInit {
  selectedValue!:any
  searchWord:string = '';
  searchInput$ = new BehaviorSubject('');
  private subs = new Subscription();
  canceledPurchases=[
    {invoiceNum:'#1',client:'gejwella',invoiceType:'فاتورة غير ضريبية',payed:'1500',total:'1500'},
    {invoiceNum:'#1',client:'gejwella',invoiceType:'فاتورة غير ضريبية',payed:'1500',total:'1500'},
    {invoiceNum:'#1',client:'gejwella',invoiceType:'فاتورة غير ضريبية',payed:'1500',total:'1500'},
    {invoiceNum:'#1',client:'gejwella',invoiceType:'فاتورة غير ضريبية',payed:'1500',total:'1500'},
    {invoiceNum:'#1',client:'gejwella',invoiceType:'فاتورة غير ضريبية',payed:'1500',total:'1500'},
    {invoiceNum:'#1',client:'gejwella',invoiceType:'فاتورة غير ضريبية',payed:'1500',total:'1500'},
    {invoiceNum:'#1',client:'gejwella',invoiceType:'فاتورة غير ضريبية',payed:'1500',total:'1500'},
    {invoiceNum:'#1',client:'gejwella',invoiceType:'فاتورة غير ضريبية',payed:'1500',total:'1500'},
    {invoiceNum:'#1',client:'gejwella',invoiceType:'فاتورة غير ضريبية',payed:'1500',total:'1500'},
    {invoiceNum:'#1',client:'gejwella',invoiceType:'فاتورة غير ضريبية',payed:'1500',total:'1500'},
    {invoiceNum:'#1',client:'gejwella',invoiceType:'فاتورة غير ضريبية',payed:'1500',total:'1500'},
  ]
  currentPage = 1
  totalPage = 0
  perPage = 0
  columnsArray:columnHeaders[]= [
    {
      nameAR: 'رقم المشتري ',
      nameEN:'Purchasing id'
    },
    {
nameAR:'رقم الكود',
nameEN:'	Code number'

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
      type:'bluePurchaseCancelled'
    },
    {
      name:'',
      type:'download'
    },
    {
      name:'total',
      type:'normal'
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
      nameAR:'عرض تفاصيل مشتري',
      nameEN:'view Purchase',
      route:{
        path:'/user/purchases/purchases-details/cancelled/',
        attribute:'uuid'
      },
      popUp:''
    },

   ]

   @ViewChild('paginator') paginator!: Paginator;
  constructor(private router:Router,private http:HttpService,private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.subs.add(this.activatedRoute.queryParams.pipe(
      switchMap((param: any) => {
        if(param['page'] ){
          this.currentPage = Number(param['page']);
      }
        return this.getAllData(param);
      })
    ).subscribe({
      next:res=>{
        this.canceledPurchases=res.data
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
    let getUrl = 'api/dashboard/deleted/purchasings';

   return this.http.getReq(getUrl,{params:x}); 
 }
 search(){
  this.subs.add(this.searchInput$.pipe(
    debounceTime(2000),
  ).subscribe(
    {
      next:() => {
        return this.router.navigate([], { queryParams: { page:1 , q: this.searchWord}, queryParamsHandling: 'merge' });
      }
    }
  ));
  this.searchInput$.next(this.searchWord);
}
ngOnDestroy() {
  this.subs.unsubscribe();
}
onPageChange(e:any){

  this.currentPage = e.page + 1
  this.router.navigate([], { queryParams: {page: this.currentPage}, queryParamsHandling: 'merge' });
}
}
