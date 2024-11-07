import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LooseObject } from '@models/LooseObject';
import { receipt } from '@models/receipt';
import { HttpService } from '@services/http.service';
import { Paginator } from 'primeng/paginator';
import { BehaviorSubject, Subscription, debounceTime, switchMap } from 'rxjs';

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
  selector: 'app-cancelled-receipt-vouchers',
  templateUrl: './cancelled-receipt-vouchers.component.html',
  styleUrls: ['./cancelled-receipt-vouchers.component.scss']
})
export class CancelledReceiptVouchersComponent implements OnInit {


  searchWord:string = '';
  searchInput$ = new BehaviorSubject('');
  private subs = new Subscription();
  ReceiptVoucher:receipt[]=[]


  currentPage = 1
  totalPage = 0
  perPage = 0
  columnsArray:columnHeaders[]= [
    {
      nameAR:'رقم السند',
     nameEN:'Receipt id'
    },
    {
     nameAR: 'رقم الفاتورة',
     nameEN:'Invoice id',
    },
    {
     nameAR: 'المبلغ',
nameEN:'Amount'
    },
    {
     nameAR: 'تحميل',
     nameEN:'download'

    },
    {
     nameAR: 'تاريخ الإستلام',
     nameEN:'Received at'
    },{
     nameAR: 'طريقة الدفع',
nameEN:'Payment method'
    }

  ]
   columnsNames:ColumnValue[]= [
    {
      name:'number',
      type:'normal'
    },
    {
      name:'invoice_number',
      type:'normal'
    },
    {
      name:'amount',
      type:'normal'
    },
    {
      name:'',
      type:'download'
    },
    {
      name:'received_at',
      type:'normal'
    },
    {
      name:'payment_method',
      type:'normal'
    }
   ]
  
   controlArray:ControlItem[]=[
    {
      nameAR:'رؤية  سند القبض',
      nameEN:'View Receipt',
      route:{
        path:'/admin/receipt-vouchers/receipt-voucher-details/',
        attribute:'uuid'
      },
      popUp:''
    },

   ]

   @ViewChild('paginator') paginator!: Paginator;
  constructor(private router: Router,private http:HttpService,private activatedRoute: ActivatedRoute) {
    this.router.navigate([], { queryParams: {q:null}, queryParamsHandling: 'merge' })  

   }
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
        this.ReceiptVoucher=res.data
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
    let getUrl = 'api/admin/deleted/receipts';
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
        return this.router.navigate([], { queryParams: { page:1 , q: this.searchWord}, queryParamsHandling: 'merge' });
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
