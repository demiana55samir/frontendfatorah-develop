import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LooseObject } from '@models/LooseObject';
import { HttpService } from '@services/http.service';
import { Subscription, switchMap } from 'rxjs';

import { ColumnValue, ControlItem, columnHeaders } from '@models/tableData';
import { Paginator } from 'primeng/paginator';


@Component({
  selector: 'app-bank-accounts',
  templateUrl: './bank-accounts.component.html',
  styleUrls: ['./bank-accounts.component.scss']
})
export class BankAccountsComponent implements OnInit {
  private subs = new Subscription();
  currentPage = 1
  totalPage = 0
  perPage = 0
  columnsArray:columnHeaders[]= [
    {
      nameAR:  'إسم البنك',
      nameEN:'Bank name'
    },
    {
      nameAR:'الإسم كامل',
      nameEN:'Full Name'
    },
    {
      nameAR: 'رقم الأيبان',
      nameEN:'IBAN number'
    }

  
   
   ]
   columnsNames:ColumnValue[]= [
    {
      name:'name',
      type:'normal'
    },
    {
      name:'full_name',
      type:'blueClient'
    },
    {
      name:'number',
      type:'normal'
    },

   ]
  
   controlArray:ControlItem[]=[

    {
      nameAR:'تعديل البنك',
      nameEN:'Edit Bank',
      route:{
        path:'/user/settings/bank-accounts/add-bank-account/edit/',
        attribute:'uuid'
      },
      popUp:''

    },
    {
      nameAR:'حذف البنك',
      nameEN:'Delete Bank',
      route:{
        path:'',
        attribute:'uuid'
      },
      popUp:'deleteBank'

    },

   ]
   bankAccount=[]
  @ViewChild('paginator') paginator!: Paginator;
  constructor(private router: Router,private http:HttpService,private activatedRoute: ActivatedRoute) { 
  this.router.navigate([], { queryParams: {page: this.currentPage}, queryParamsHandling: 'merge' });

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
        this.bankAccount=res.data

        this.totalPage = res?.meta?.total
        this.perPage = res?.meta?.per_page
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
    let getUrl = 'api/dashboard/settings/banks';
   return this.http.getReq(getUrl,{params:x}); 
 }

 onPageChange(e:any){

  this.currentPage = e.page + 1
  this.router.navigate([], { queryParams: {page: this.currentPage}, queryParamsHandling: 'merge' });
}
ngOnDestroy() {
this.subs.unsubscribe();
}
}
