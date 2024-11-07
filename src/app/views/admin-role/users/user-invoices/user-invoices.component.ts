import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LooseObject } from '@models/LooseObject';
import { HttpService } from '@services/http.service';
import { BehaviorSubject, Subscription, debounceTime, switchMap } from 'rxjs';
import { ColumnValue, ControlItem, columnHeaders } from '@models/tableData';
import { Paginator } from 'primeng/paginator';


@Component({
  selector: 'app-user-invoices',
  templateUrl: './user-invoices.component.html',
  styleUrls: ['./user-invoices.component.scss']
})
export class UserInvoicesComponent implements OnInit {
invoices:any
selectedValue!:any
searchWord:string = '';
searchInput$ = new BehaviorSubject('');
private subs = new Subscription();
currentPage = 1
totalPage = 0
perPage = 0
userUuid:string
columnsArray:columnHeaders[]= [
  {
   nameAR: 'رقم الفاتورة',
   nameEN:'Invoice Number'

  },
  {
   nameAR: 'نوع الفاتورة',
   nameEN:'Invoice Type'

  },
  { 
    nameAR:'حالة الفاتورة',
    nameEN:'Status'

  },
  {
   nameAR: 'تحميل',
   nameEN:'Download'
  },
  {
   nameAR: 'تاريخ انشاء الفاتورة',
   nameEN:'Created At'
    
  }
 ]

 columnsNames:ColumnValue[]= [
  {
    name:'id',
    type:'normal'
  },
  {
    name:'title',
    type:'blueBG'
  },
  {
    name:'status',
    type:'blueBG'
  },
  {
    name:'',
    type:'download'
  },
  {
    name:'created_at',
    type:'normal'
  }
 ]

 controlArray:ControlItem[]=[
  {
    nameAR:'رؤية الفاتورة',
    nameEN:'Invoice Details',
    route:{
      path:'/admin/users/invoice-details/',
      attribute:'uuid'
    },
    popUp:''

  }

 ]
 @ViewChild('paginator') paginator!: Paginator;
  constructor(private router: Router,private http:HttpService,private activatedRoute: ActivatedRoute) {
    this.router.navigate([], { queryParams: {q:null,page:1}, queryParamsHandling: 'merge' })  
    this.userUuid = String(this.activatedRoute.snapshot.paramMap.get('uuid'))

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

  ngOnInit() {
  
  
  }

  getAllData(filters : any){
    let x :LooseObject ={}; 
    for (const [key , value] of Object.entries(filters) ) {
      // console.log( key ,  value);
      if(value)
        x[key] = value
    }
    let getUrl = `api/admin/users/${this.userUuid}/invoices`;
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

}
