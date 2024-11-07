import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LooseObject } from '@models/LooseObject';
import { ColumnValue, ControlItem, columnHeaders } from '@models/tableData';
import { HttpService } from '@services/http.service';
import { Paginator } from 'primeng/paginator';
import { BehaviorSubject, Subscription, debounceTime, switchMap } from 'rxjs';

@Component({
  selector: 'app-all-invoices',
  templateUrl: './all-invoices.component.html',
  styleUrls: ['./all-invoices.component.scss']
})
export class AllInvoicesComponent implements OnInit {

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
     nameAR: 'العميل',
     nameEN:'Client'
  
    },
    {
     nameAR: 'تحميل',
     nameEN:'Download'
  
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
      nameAR:'المبلغ المحصل',
      nameEN:'Amount'
      
    },
    { 
      nameAR:'الاجمالي',
      nameEN:'Total'
  
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
      name:'user',
      type:'normal'
    },
    {
      name:'',
      type:'download'
    },
    {
      name:'with_tax',
      type:'checkTax'
    },
    {
      name:'status',
      type:'checkStatus'
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
      let getUrl = 'api/admin/invoices';
     return this.http.getReq(getUrl,{params:x}); 
   }

  
  onPageChange(e:any){
  
    this.currentPage = e.page + 1
    this.router.navigate([], { queryParams: {page: this.currentPage}, queryParamsHandling: 'merge' });
  }
  
}
