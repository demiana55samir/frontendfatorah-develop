import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LooseObject } from '@models/LooseObject';
import { ColumnValue, ControlItem, columnHeaders } from '@models/tableData';
import { city } from '@modules/settings';
import { HttpService } from '@services/http.service';
import { Paginator } from 'primeng/paginator';
import { BehaviorSubject, Subscription, debounceTime, switchMap } from 'rxjs';

@Component({
  selector: 'app-all-cities',
  templateUrl: './all-cities.component.html',
  styleUrls: ['./all-cities.component.scss']
})
export class AllCitiesComponent implements OnInit {

  selectedValue!:any
  searchWord:string = '';
  searchInput$ = new BehaviorSubject('');
  private subs = new Subscription();
  cities:city[] = [];
  currentPage = 1
  totalPage = 0
  perPage = 0
  columnsArray:columnHeaders[]= [
    {
     nameAR: 'رقم المدينة',
     nameEN:'City Id'

    },
    {
     nameAR: 'الإسم',
     nameEN:'Name'

    },
    { 
      nameAR:'الإسم اللطيف	',
      nameEN:'Slug'

    },
    {
     nameAR: 'تاريخ إضافة المدينة	',
     nameEN:'Created At'
    },
    {
     nameAR: 'الحالة',
     nameEN:'Status'
      
    }

   ]

   columnsNames:ColumnValue[]= [
    {
      name:'id',
      type:'normal'
    },
    {
      name:'name',
      type:'normal'
    },
    {
      name:'slug',
      type:'normal'
    },
    {
      name:'created_at',
      type:'normal'
    },
    {
      name:'is_enable',
      type:'puple-status'
    }
   
   ]
  
   controlArray:ControlItem[]=[
    {
      nameAR:'عرض بيانات المدينة',
      nameEN:'View City Details',
      route:{
        path:'/admin/settings/cities/city-details/',
        attribute:'id'
      },
      popUp:''
    },
    {
      nameAR:'تعديل بيانات المدينة',
      nameEN:'Edit City Details',
      route:{
        path:'/admin/settings/cities/city-data/edit/',
        attribute:'id'
      },
      popUp:''
    },
    {
      nameAR:'حذف بيانات المدينة',
      nameEN:'Delete City',
      route:{
        path:'',
        attribute:'id'
      },
      popUp:'DeleteAdminCity'
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
        this.cities=res.data
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
      if(value)
        x[key] = value
    }
    let getUrl = 'api/admin/cities';
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
