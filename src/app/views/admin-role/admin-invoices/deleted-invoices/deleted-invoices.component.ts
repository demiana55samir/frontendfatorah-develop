import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LooseObject } from '@models/LooseObject';
import { ColumnValue, ControlItem, columnHeaders } from '@models/tableData';
import { userCanceledInvoice } from '@models/user-canceled-invoices';
import { HttpService } from '@services/http.service';
import { Paginator } from 'primeng/paginator';
import { BehaviorSubject, Subscription, debounceTime, switchMap } from 'rxjs';

@Component({
  selector: 'app-deleted-invoices',
  templateUrl: './deleted-invoices.component.html',
  styleUrls: ['./deleted-invoices.component.scss']
})
export class DeletedInvoicesComponent implements OnInit {

  searchWord:string = '';
  searchInput$ = new BehaviorSubject('');
  private subs = new Subscription();

  currentPage = 1
  totalPage = 0
  perPage = 0
  columnsArray:columnHeaders[]=[
    {
      nameAR:'رقم الفاتورة',
      nameEN:'Invoice id'
    },
    {
      nameAR:'العنوان',
       nameEN:'Title'
    },
    {
      nameAR:'المستخدم',
       nameEN:'User'
    },
    {
      nameAR: 'تحميل',
      nameEN: 'Download'
    },
    {
      nameAR:'التاريخ',
      nameEN:'Created_at'

    },
   

   ]

   columnsNames:ColumnValue[]= [
    {
      name:'number',
      type:'normal'
    },
    {
      name:'with_tax',
      type:'check_tax_noBg'
    },
    {
      name:'user',
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
   ]
  
   controlArray:ControlItem[]=[
    {
      nameAR:'اعادة الفاتورة',
      nameEN:'Recover Invoice',
      route:{
        path:'',
        attribute:'uuid'
      },
      popUp:'restoreInvoice'
    },


   ]

invoices!:userCanceledInvoice[]
@ViewChild('paginator') paginator!: Paginator;
  constructor(private router: Router,private http:HttpService,private activatedRoute: ActivatedRoute,) {
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
        // console.log(res)
        this.invoices=res.data
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
    let getUrl = 'api/admin/deleted/invoices';
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
