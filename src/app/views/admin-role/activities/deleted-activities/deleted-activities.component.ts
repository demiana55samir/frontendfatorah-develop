import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LooseObject } from '@models/LooseObject';
import { ColumnValue, ControlItem, columnHeaders } from '@models/tableData';
import { activity } from '@modules/settings';
import { HttpService } from '@services/http.service';
import { Paginator } from 'primeng/paginator';
import { BehaviorSubject, Subscription, debounceTime, switchMap } from 'rxjs';

@Component({
  selector: 'app-deleted-activities',
  templateUrl: './deleted-activities.component.html',
  styleUrls: ['./deleted-activities.component.scss']
})
export class DeletedActivitiesComponent implements OnInit {


  selectedValue!:any
  searchWord:string = '';
  searchInput$ = new BehaviorSubject('');
  private subs = new Subscription();
  activities:activity[] = [];
  currentPage = 1
  totalPage = 0
  perPage = 0
  columnsArray:columnHeaders[]= [
    {
     nameAR: 'المعرف',
     nameEN:'ID'

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
     nameAR: 'تاريخ إضافة النشاط	',
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
      nameAR:'عرض بيانات النشاط',
      nameEN:'View Activity Details',
      route:{
        path:'/admin/settings/activities/activity-details/',
        attribute:'id'
      },
      popUp:''
    },


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
        this.activities=res.data
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
    let getUrl = 'api/admin/business_types/deleted';
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
