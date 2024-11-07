import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LooseObject } from '@models/LooseObject';
import { userInvoice } from '@models/user-invoices';
import { HttpService } from '@services/http.service';
import { BehaviorSubject, Subscription, debounceTime, switchMap } from 'rxjs';
import { ColumnValue, ControlItem, columnHeaders } from '@models/tableData';
import { Paginator } from 'primeng/paginator';

@Component({
  selector: 'app-user-invoices',
  templateUrl: './user-invoices.component.html',
  styleUrls: ['./user-invoices.component.scss']
})
export class UserInvoicesComponent implements OnInit ,OnChanges{
  userInvoices:userInvoice[]=[]
  @Input() uuid!:string
  userUuid=''
  searchWord:string = '';
  currentPage = 1
  totalPage = 0
  perPage = 0

  // {
  //   nameAR: '	حالة الفاتورة',
  //   nameEN:'status'
  //  },
  columnsArray:columnHeaders[]= [


    {
      nameAR:'رقم الفاتورة',
      nameEN:'Invoice id'
    },

    {
nameAR: '	تحميل',
nameEN:'Download'
    },
    
    {
      nameAR:'تاريخ انشاء الفاتورة',
      nameEN:'Invoice Created At'
    },
    {
     nameAR:'المبلغ المحصل',
     nameEN:'Collected amount'
    },
    {
      nameAR: 'الاجمالي',
      nameEN:'Amount'
    },

   ]

  //  {
  //   name:'status',
  //   type:'normal'
  // },
   columnsNames:ColumnValue[]= [
    {
      name:'number',
      type:'normal'
    },
    {
      name:'',
      type:'download'
    },
   
    {
      name:'created_at',
      type:'normal'
    },
    {
      name:'paid',
      type:'normal'
    },
    {
      name:'total',
      type:'normal'
    },


   ]
  
   controlArray:ControlItem[]=[
    {
      nameAR:'رؤية الفاتورة',
      nameEN:'View Invoice',
      route:{
        path:'/user/invoices/invoice-details/',
        attribute:'uuid'
      },
      popUp:''
    },


   ]
  searchInput$ = new BehaviorSubject('');
  private subs = new Subscription();
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
        this.userInvoices=res.data
        this.perPage=res.meta.per_page
        this.totalPage=res.meta.total
        setTimeout(() => {
          this.paginator.changePage(this.currentPage -1 )
        }, 200);
      }
    }));
    
    // this.getUserInvoices(this.uuid)

  }
  ngOnChanges(changes:SimpleChanges):void{

  }

  // getUserInvoices(uuid:string){
  //   this.subs.add(this.http.getReq(`api/dashboard/clients/${uuid}/invoices`).subscribe({
  //     next:res=>{
  //       this.userInvoices=res.data
  //     }
  //   }))
  // } 

  getAllData(filters : any,uuid:string){
    let x :LooseObject ={}; 
    for (const [key , value] of Object.entries(filters) ) {
      // console.log( key ,  value);
      if(value)
        x[key] = value
    }
    // let getUrl = 'api/dashboard/receipts/index';

   return this.http.getReq(`api/dashboard/clients/${uuid}/invoices`,{params:x}); 
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
