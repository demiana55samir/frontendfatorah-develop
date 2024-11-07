import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LooseObject } from '@models/LooseObject';
import { quotations } from '@models/quotations';
import { ColumnValue, ControlItem, columnHeaders } from '@models/tableData';
import { HttpService } from '@services/http.service';
import { Paginator } from 'primeng/paginator';
import { BehaviorSubject, Subscription, debounceTime, switchMap } from 'rxjs';


@Component({
  selector: 'app-all-quotations',
  templateUrl: './all-quotations.component.html',
  styleUrls: ['./all-quotations.component.scss']
})
export class AllQuotationsComponent implements OnInit {
  searchWord:string = '';
  searchInput$ = new BehaviorSubject(''); 
  private subs = new Subscription();
  prices:quotations[]=[]

  currentPage = 1
  totalPage = 0
  perPage = 0
  columnsArray:columnHeaders[]= [
    {
      nameAR:'رقم عرض السعر',
      nameEN:'Quotation Number'
    },
    {
    nameAR: 'المستخدم',
    nameEN:'User'
    },
    {
    nameAR: 'العميل',
    nameEN:'Client'
    },
    {
      nameAR: 'تحميل',
      nameEN: 'Download'
    },
    {
      nameAR: 'الفواتير',
      nameEN:'Invoices'
    },
    {
      nameAR: 'الإجمالي',
      nameEN:'Amount'
    },
    {
      nameAR: 'تاريخ انشاء عرض السعر',
      nameEN:'created_at'
    }


   ]

   columnsNames:ColumnValue[]= [
    {
      name:'number',
      type:'normal'
    },
    {
      name:'user',
      type:'blueAdminUserId'
    },
    {
      name:'client',
      type:'normal'
    },
    {
      name:'',
      type:'download'
    },
    {
      name:'invoices_number',
      type:'invoiceCount'
    },
    {
      name:'total',
      type:'normal_with_currancy'
    },
    {
      name:'created_at',
      type:'normal'
    },

   ]
  
   controlArray:ControlItem[]=[
    {
      nameAR:'رؤية  عرض السعر',
nameEN:'View Quotation',
      route:{
        path:'/admin/quotations/quotation-datails/',
        attribute:'uuid'
      },
      popUp:''
    },

   ]
   invoiceColor:any
   default_template_id:any
   @ViewChild('paginator') paginator!: Paginator;
  constructor(private router: Router,private http:HttpService,private activatedRoute: ActivatedRoute) {
    this.router.navigate([], { queryParams: {q:null}, queryParamsHandling: 'merge' })  
   

   }

  ngOnInit() {
    this.invoiceColor=String(localStorage.getItem('invoiceColor'))
    this.default_template_id=Number(localStorage.getItem('default_template_id'))
    this.subs.add(this.activatedRoute.queryParams.pipe(
      switchMap((param: any) => {
        if(param['page'] ){
          this.currentPage = Number(param['page']);
      }
        return this.getAllData(param);
      })
    ).subscribe({
      next:res=>{
        this.prices=res.data
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
    let getUrl = 'api/admin/quotations';
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
