import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LooseObject } from '@models/LooseObject';
import { client } from '@models/client';
import { HttpService } from '@services/http.service';
import { BehaviorSubject, Subscription, debounceTime, switchMap } from 'rxjs';

import { ColumnValue, ControlItem, columnHeaders } from '@models/tableData';
import { Paginator } from 'primeng/paginator';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {
  users!:client[]
  searchWord:string = '';
  searchInput$ = new BehaviorSubject('');
  private subs = new Subscription();

  currentPage = 1
  totalPage = 0
  perPage = 0
  columnsArray:columnHeaders[]= [
    {
      nameAR: 'رقم العميل	',
      nameEN:'Client Id'
    },
    {
      nameAR:'إسم العميل	',
      nameEN:'Client Name'
    },
    {
      nameAR: 'عدد فواتير العميل	',
      nameEN:'Invoice number'
    },
    {
      nameAR:  'المبالغ المدفوعة	',
      nameEN:'Payed Amount'
    },
    {
nameAR:'المبالغ غير المدفوعة	',
nameEN:'Unpaid Amount'
    },
    {
      nameAR:'اجمالي المبيعات للعميل	',
      nameEN:'Total Sales for the Customer'
    }
   



   ]

   columnsNames:ColumnValue[]= [
    {
      name:'client_id',
      type:'normal'
    },
    {
      name:'name',
      type:'blueClient'
    },
    {
      name:'invoices_count',
      type:'normal-horizontal-add'
    },
    {
      name:'paid',
      type:'table-normal-number'
    },
    {
      name:'unpaid',
      type:'table-normal-number'
    },
    {
      name:'total',
      type:'table-normal-number'
    },

   ]
  
   controlArray:ControlItem[]=[
    {
      nameAR:'  عرض بيانات العميل ',
      nameEN:'View Client',
      route:{
        path:'/user/users/user-details/',
        attribute:'uuid'
      },
      popUp:''
    },
    {
      nameAR:'تعديل بيانات العميل ',
      nameEN:'Edit Client',
      route:{
        path:'/user/users/edit-user/',
        attribute:'uuid'
      },
      popUp:''
    },
    {
      nameAR:' حذف العميل ',
      nameEN:'Delete Client',
      route:{
        path:'',
        attribute:'uuid'
      },
      popUp:'deleteClinet'
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
        this.users=res.data
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
      console.log( key ,  value);
      if(value)
        x[key] = value
    }
    let getUrl = 'api/dashboard/clients';
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
// controlsBoolean:boolean[]=Array(this.users.length).fill(false)

//   openControls(index:number){
//     this.controlsBoolean.fill(false)
//    this.controlsBoolean[index]=true
//    console.log("cont",this.controlsBoolean)
//   }
}
