import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LooseObject } from '@models/LooseObject';
import { receipt } from '@models/receipt';
import { HttpService } from '@services/http.service';
import { BehaviorSubject, Subscription, debounceTime, switchMap } from 'rxjs';

import { ColumnValue, ControlItem, columnHeaders } from '@models/tableData';
import { Paginator } from 'primeng/paginator';


@Component({
  selector: 'app-user-receipt-voucher',
  templateUrl: './user-receipt-voucher.component.html',
  styleUrls: ['./user-receipt-voucher.component.scss']
})
export class UserReceiptVoucherComponent implements OnInit {
  uuid=''
  userReceiptVoucher:receipt[] = []
  searchWord:string = '';
  searchInput$ = new BehaviorSubject('');
  private subs = new Subscription();

  currentPage = 1
  totalPage = 0
  perPage = 0
  columnsArray:columnHeaders[]= [

    {
      nameAR:'رقم السند',
     nameEN:'Receipt id'
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
    },
    {
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
      name:'amount',
      type:'blue-no-Click'
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
    },

   ]
  
   controlArray:ControlItem[]=[
    {
      nameAR:'رؤية سند قبض',
      nameEN:'View Receipt',
      route:{
        path:'/user/invoices/receipt-voucher-details/',
        attribute:'uuid'
      },
      popUp:''
    },


   ]
   @ViewChild('paginator') paginator!: Paginator;
  constructor(private http:HttpService,private activeRoute:ActivatedRoute,private router: Router) {
    this.router.navigate([], { queryParams: {q:null}, queryParamsHandling: 'merge' }) 

   }

  ngOnInit() {
    this.uuid= String(this.activeRoute.snapshot.paramMap.get('uuid'))
    
    this.subs.add(this.activeRoute.queryParams.pipe(
      switchMap((param: any) => {
        if(param['page'] ){
          this.currentPage = Number(param['page']);
      }
        return this.getAllData(param,this.uuid);
      })
    ).subscribe({
      next:res=>{
        this.userReceiptVoucher=res.data
        this.perPage=res.meta.per_page
        this.totalPage=res.meta.total
        setTimeout(() => {
          this.paginator.changePage(this.currentPage -1 )
        }, 200);
      }
    }));
  }
  getAllData(filters : any,uuid:string){
    let x :LooseObject ={}; 
    for (const [key , value] of Object.entries(filters) ) {
      console.log( key ,  value);
      if(value)
        x[key] = value
    }
    // let getUrl = 'api/dashboard/receipts/index';

   return this.http.getReq(`api/dashboard/clients/${uuid}/receipts`,{params:x}); 
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
