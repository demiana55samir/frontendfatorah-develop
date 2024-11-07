import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LooseObject } from '@modules/LooseObject';
import { client } from '@modules/client';
import { columnHeaders, ColumnValue, ControlItem } from '@modules/tableData';
import { HttpService } from '@services/http.service';
import { Paginator } from 'primeng/paginator';
import { BehaviorSubject, Subscription, debounceTime, switchMap } from 'rxjs';

@Component({
  selector: 'app-suppliers-list',
  templateUrl: './suppliers-list.component.html',
  styleUrls: ['./suppliers-list.component.scss']
})
export class SuppliersListComponent implements OnInit {

  users!:client[]
  searchWord:string = '';
  searchInput$ = new BehaviorSubject('');
  private subs = new Subscription();

  currentPage = 1
  totalPage = 0
  perPage = 0
  columnsArray:columnHeaders[]= [
    {
      nameAR: 'رقم المورد	',
      nameEN:'Supplier Id'
    },
    {
      nameAR:'إسم المورد',
      nameEN:'Supplier Name'
    },
    {
      nameAR: 'الرقم الضريبي',
      nameEN:'Tax Number'
    }

   ]

   columnsNames:ColumnValue[]= [
    {
      name:'supplier_id',
      type:'normal'
    },
    {
      name:'name',
      type:'normal'
    },
    {
      name:'tax_number',
      type:'normal'
    }
   ]
  
   controlArray:ControlItem[]=[
    {
      nameAR:'  عرض بيانات المورد ',
      nameEN:'View Supplier details',
      route:{
        path:'/user/suppliers-details/',
        attribute:'uuid'
      },
      popUp:''
    },
    {
      nameAR:'تعديل بيانات المورد',
      nameEN:'Edit Supplier',
      route:{
        path:'/user/Add-supplier/edit/',
        attribute:'uuid'
      },
      popUp:''
    },
    {
      nameAR:' حذف المورد ',
      nameEN:'Delete Supplier',
      route:{
        path:'',
        attribute:'uuid'
      },
      popUp:'deleteSupplier'
    },
   ]

   @ViewChild('paginator') paginator!: Paginator;
   
   constructor(private router: Router,private http:HttpService,private activatedRoute: ActivatedRoute) {
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
      console.log( key ,  value);
      if(value)
        x[key] = value
    }
    let getUrl = 'api/dashboard/suppliers';
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
