import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LooseObject } from '@models/LooseObject';
import { userInvoice } from '@models/user-invoices';
import { HttpService } from '@services/http.service';
import { BehaviorSubject, Subscription, debounceTime, switchMap } from 'rxjs';

import { ColumnValue, ControlItem, columnHeaders } from '@models/tableData';
import { Paginator } from 'primeng/paginator';


@Component({
  selector: 'app-products-invoices',
  templateUrl: './products-invoices.component.html',
  styleUrls: ['./products-invoices.component.scss']
})
export class ProductsInvoicesComponent implements OnInit {
  options=[{}]
  selectedValue!:any
  searchWord:string = '';
  searchInput$ = new BehaviorSubject('');
  private subs = new Subscription();
  currentPage = 1
  totalPage = 0
  perPage = 0
  uuid:any
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
     nameAR:'المبلغ المحصل',
     nameEN:'Collected amount'
    },
    {
      nameAR: 'الاجمالي',
      nameEN:'Amount'
    },
    {
      nameAR:'تاريخ انشاء الفاتورة',
      nameEN:'Invoice Created At'
    }

   ]

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
      name:'paid',
      type:'normal'
    }, 
    {
      name:'total',
      type:'normal'
    },
    {
      name:'created_at',
      type:'normal'
    }
   ]
  
   controlArray:ControlItem[]=[
    {
      nameAR:'تحميل الفاتورة',
      nameEN:'Download invoice',
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
      popUp:''
    },
    {
      nameAR:'أنشاء رابط دفع',
      nameEN:'Add quotation',
      route:{
        path:'',
        attribute:''
      },
      popUp:'opencreatePaymentLinkModel'
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
    // todo : add debit note
    // {
    //   nameAR:'إضافة اشعار مدين',
    //   nameEN:'Add debit Notice',
    //   route:{
    //     path:'/user/invoices/debit-note-details/create/',
    //     attribute:'uuid'
    //   },
    //   popUp:''
    // }
   ]
   invoices!:userInvoice[]
   @ViewChild('paginator') paginator!: Paginator;
  constructor(private activatedRoute:ActivatedRoute,private router:Router,private http:HttpService) { }

  ngOnInit() {
    this.uuid= String(this.activatedRoute.snapshot.paramMap.get('id'))
    this.subs.add(this.activatedRoute.queryParams.pipe(
      switchMap((param: any) => {
        if(param['page'] ){
          this.currentPage = Number(param['page']);
      }
        return this.getAllData(param);
      })
    ).subscribe({
      next:res=>{
        this.invoices=res.data
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
    let getUrl = `api/dashboard/products/${this.uuid}/invoices`;
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
         return this.router.navigate([], { queryParams: {q:this.searchWord}, queryParamsHandling: 'merge' });

      }
    }
  ));
  this.searchInput$.next(this.searchWord);
}

onPageChange(e:any){

  this.currentPage = e.page + 1
  this.router.navigate([], { queryParams: {page: this.currentPage}, queryParamsHandling: 'merge' });
}

}
