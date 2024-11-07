import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LooseObject } from '@models/LooseObject';
import { ColumnValue, ControlItem, columnHeaders } from '@models/tableData';
import { HttpService } from '@services/http.service';
import { Paginator } from 'primeng/paginator';
import { BehaviorSubject, Subscription, debounceTime, switchMap } from 'rxjs';


@Component({
  selector: 'app-All-coupons',
  templateUrl: './All-coupons.component.html',
  styleUrls: ['./All-coupons.component.scss']
})
export class AllCouponsComponent implements OnInit {
  selectedValue!:any
  searchWord:string = '';
  searchInput$ = new BehaviorSubject('');
  private subs = new Subscription();
  coupons:any
  currentPage = 1
  totalPage = 0
  perPage = 0
  columnsArray:columnHeaders[]= [
    {
     nameAR: ' رقم الكود ',
     nameEN:'Code Id'

    },
    {
     nameAR: 'كود الخصم',
     nameEN:'Discount Code'

    },
    { 
      nameAR:'مقدار الخصم',
      nameEN:'Discount'

    },
    {
     nameAR: 'تاريخ بداية الكوبون',
     nameEN:'Started at'
    },
    {
     nameAR: 'تاريخ انتهاء الكوبون',
     nameEN:'Expired at'
      
    },
    {
     nameAR: 'حالة الحساب',
     nameEN:'Status'
      
    }

   ]

   columnsNames:ColumnValue[]= [
    {
      name:'id',
      type:'normal'
    },
    {
      name:'code',
      type:'normal'
    },
    {
      name:'discount',
      type:'normal'
    },
    {
      name:'starts_at',
      type:'normal'
    },
    {
      name:'expires_at',
      type:'normal'
    },
    {
      name:'is_active',
      type:'puple-status'
    },
   
   ]
  
   controlArray:ControlItem[]=[
    {
      nameAR:'عرض بيانات الكوبون',
      nameEN:'View Coupon Details',
      route:{
        path:'/admin/coupons/coupon-details/',
        attribute:'id'
      },
      popUp:''
    },
    {
      nameAR:'تعديل بيانات الكوبون',
      nameEN:'Edit Coupon Details',
      route:{
        path:'/admin/coupons/coupon-details/edit/',
        attribute:'id'
      },
      popUp:''
    },
    {
      nameAR:'حذف بيانات الكوبون',
      nameEN:'Delete Coupon',
      route:{
        path:'',
        attribute:'id'
      },
      popUp:'DeleteAdminCoupon'
    }

   ]
   @ViewChild('paginator') paginator!: Paginator;
   constructor(private router: Router,private http:HttpService,private activatedRoute: ActivatedRoute) {
    this.router.navigate([], { queryParams: {q:null,page:1}, queryParamsHandling: 'merge' })  

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
        this.coupons=res.data
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
    let getUrl = 'api/admin/vouchers';
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
