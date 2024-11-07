import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LooseObject } from '@modules/LooseObject';
import { columnHeaders, ColumnValue, ControlItem } from '@modules/tableData';
import { HttpService } from '@services/http.service';
import { Paginator } from 'primeng/paginator';
import { BehaviorSubject, Subscription, switchMap, debounceTime } from 'rxjs';

@Component({
  selector: 'app-durations-list',
  templateUrl: './durations-list.component.html',
  styleUrls: ['./durations-list.component.scss']
})
export class DurationsListComponent implements OnInit {


  selectedValue!:any
  searchWord:string = '';
  searchInput$ = new BehaviorSubject('');
  private subs = new Subscription();
  durations:any
  currentPage = 1
  totalPage = 0
  perPage = 0
  columnsArray:columnHeaders[]= [

    {
     nameAR: 'الإسم',
     nameEN:'Name'

    },
    {
     nameAR: ' الاسم اللطيف ',
     nameEN:' Slug '
    }
   ]

   columnsNames:ColumnValue[]= [

    {
      name:'name',
      type:'normal'
    },
    {
      name:'slug',
      type:'normal'
    }
   
   ]
  
   controlArray:ControlItem[]=[

    {
      nameAR:'تعديل بيانات المدة',
      nameEN:'Edit Duration Details',
      route:{
        path:'/admin/settings/categories/duration/edit/',
        attribute:'id'
      },
      popUp:''
    },
    {
      nameAR:'حذف المدة',
      nameEN:'Delete Duration',
      route:{
        path:'',
        attribute:'id'
      },
      popUp:'DeleteAdminDurations'
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
        this.durations=res.data
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
    // todo - change durations api
    let getUrl = 'api/admin/durations';
   return this.http.getReq(getUrl,{params:x}); 
 }
 search(){
  this.subs.add(this.searchInput$.pipe(
    debounceTime(2000),
  ).subscribe(
    {
      next:() => {
        return this.router.navigate([], { queryParams: {q: this.searchWord , page:1}, queryParamsHandling: 'merge' });
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
