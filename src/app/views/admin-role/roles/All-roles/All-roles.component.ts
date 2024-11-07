import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LooseObject } from '@models/LooseObject';
import { ColumnValue, ControlItem, columnHeaders } from '@models/tableData';
import { HttpService } from '@services/http.service';
import { Paginator } from 'primeng/paginator';
import { BehaviorSubject, Subscription, debounceTime, switchMap } from 'rxjs';


@Component({
  selector: 'app-All-roles',
  templateUrl: './All-roles.component.html',
  styleUrls: ['./All-roles.component.scss']
})

export class AllRolesComponent implements OnInit {
  selectedValue!:any
  searchWord:string = '';
  searchInput$ = new BehaviorSubject('');
  private subs = new Subscription();
  users:any
  currentPage = 1
  totalPage = 0
  perPage = 0
  columnsArray:columnHeaders[]= [
    {
     nameAR: 'رقم الدور',
     nameEN:'Role Id'

    },
    {
     nameAR: 'الاسم',
     nameEN:'Name'

    },
    {
     nameAR: 'تاريخ انشاء الدور',
     nameEN:'Created at'
      
    },


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
      name:'created_at',
      type:'normal'
    },

   ]
  
   controlArray:ControlItem[]=[
    {
      nameAR:'عرض بيانات الدور',
      nameEN:'View Role Details',
      route:{
        path:'/admin/roles/role-details/',
        attribute:'id'
      },
      popUp:''
    },
    {
      nameAR:'تعديل بيانات الدور',
      nameEN:'Edit Role Details',
      route:{
        path:'/admin/roles/role-data/edit/',
        attribute:'id'
      },
      popUp:''
    },
    {
      nameAR:'حذف بيانات الدور',
      nameEN:'Delete role',
      route:{
        path:'',
        attribute:'id'
      },
      popUp:'DeleteAdminRole'
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
        this.users=res.data
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
    let getUrl = 'api/admin/roles';
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
