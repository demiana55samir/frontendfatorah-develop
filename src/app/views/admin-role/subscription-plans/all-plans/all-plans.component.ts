import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LooseObject } from '@models/LooseObject';
import { ColumnValue, ControlItem, columnHeaders } from '@models/tableData';
import { HttpService } from '@services/http.service';
import { Paginator } from 'primeng/paginator';
import { BehaviorSubject, Subscription, debounceTime, switchMap } from 'rxjs';



@Component({
  selector: 'app-all-plans',
  templateUrl: './all-plans.component.html',
  styleUrls: ['./all-plans.component.scss']
})
export class AllPlansComponent implements OnInit {

  selectedValue!:any
  searchWord:string = '';
  searchInput$ = new BehaviorSubject('');
  private subs = new Subscription();
  plans:any
  currentPage = 1
  totalPage = 0
  perPage = 0
  columnsArray:columnHeaders[]= [
    {
     nameAR: 'رقم الخطة',
     nameEN:'plan Id'

    },
    {
     nameAR: 'الوصف',
     nameEN:'Description'

    },
    {
     nameAR: ' سعر الاشتراك (فى الشهر)',
     nameEN:'Subscription Price (in month)'
      
    },
    // {
    //  nameAR: 'مميزات الخطة',
    //  nameEN:'Features'
      
    // },


   ]

   columnsNames:ColumnValue[]= [
    {
      name:'id',
      type:'normal'
    },
    {
      name:'description',
      type:'normal'
    },
    {
      name:'price',
      type:'normal'
    },
    // {
    //   name:'',
    //   type:'blue-plans-featurs'
    // },

   ]
  
   controlArray:ControlItem[]=[
    {
      nameAR:'عرض بيانات الخطة',
      nameEN:'View Plan Details',
      route:{
        path:'/admin/subscription-plans/General-plan-details/details/',
        attribute:'id'
      },
      popUp:''
    },
    {
      nameAR:'تعديل بيانات الخطة',
      nameEN:'Edit Plan Details',
      route:{
        path:'/admin/subscription-plans/plan-details/edit/',
        attribute:'id'
      },
      popUp:''
    },
    // {
    //   nameAR:'تعديل مدد الخطة',
    //   nameEN:'Edit Plan Durations',
    //   route:{
    //     path:'/admin/subscription-plans/General-plan-details/details/',
    //     attribute:'id'
    //   },
    //   popUp:''
    // },

    {
      nameAR:'حذف بيانات الخطة',
      nameEN:'Delete Plan',
      route:{
        path:'',
        attribute:'id'
      },
      popUp:'DeleteAdminPlan'
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
        this.plans=res.data
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
    let getUrl = 'api/admin/plans';
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
 