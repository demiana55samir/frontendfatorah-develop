import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LooseObject } from '@models/LooseObject';
import { ColumnValue, ControlItem, columnHeaders } from '@models/tableData';
import { HttpService } from '@services/http.service';
import { Paginator } from 'primeng/paginator';
import { BehaviorSubject, Subscription, debounceTime, switchMap } from 'rxjs';

@Component({
  selector: 'app-all-templates',
  templateUrl: './all-templates.component.html',
  styleUrls: ['./all-templates.component.scss']
})
export class AllTemplatesComponent implements OnInit {

  selectedValue!:any
  searchWord:string = '';
  searchInput$ = new BehaviorSubject('');
  private subs = new Subscription();
  templates:any
  currentPage = 1
  totalPage = 0
  perPage = 0
  columnsArray:columnHeaders[]= [
    {
     nameAR: 'اسم القالب',
     nameEN:'Template Name'

    },
    {
     nameAR: 'عدد المستخدمين',
     nameEN:'Users number'

    },
    {
     nameAR: 'حالة القالب',
     nameEN:'Template status'
      
    },
    {
     nameAR: 'تاريخ اضافة القالب',
     nameEN:'Created At'
      
    },


   ]

   columnsNames:ColumnValue[]= [
    {
      name:'name_ar',
      type:'normal'
    },
    {
      name:'users_count',
      type:'normal'
    },
    {
      name:'is_active',
      type:'puple-status'
    },
    {
      name:'created_at',
      type:'normal'
    },

   ]
  
   controlArray:ControlItem[]=[
    {
      nameAR:'تعديل بيانات  القالب',
      nameEN:'Edit Template Details',
      route:{
        path:'/admin/templates/template-data/edit/',
        attribute:'id'
      },
      popUp:''
    },
    {
      nameAR:'حذف بيانات  القالب',
      nameEN:'Delete Template',
      route:{
        path:'',
        attribute:'id'
      },
      popUp:'DeleteAdminTemplates'
    }

   ]
   @ViewChild('paginator') paginator!: Paginator;
   constructor(private router: Router,private http:HttpService,private activatedRoute: ActivatedRoute) {
    this.router.navigate([], { queryParams: {q:null,page:1}, queryParamsHandling: 'merge' })  

   }
   ngOnInit() {
    let lang = localStorage.getItem('currentLang')
    if(lang == 'en'){
      this.columnsNames= [
        {
          name:'name_en',
          type:'normal'
        },
        {
          name:'users_count',
          type:'normal'
        },
        {
          name:'is_active',
          type:'puple-status'
        },
        {
          name:'created_at',
          type:'normal'
        },
    
       ]
    }
    this.subs.add(this.activatedRoute.queryParams.pipe(
      switchMap((param: any) => {
        if(param['page'] ){
          this.currentPage = Number(param['page']);
      }
        return this.getAllData(param);
      })
    ).subscribe({
      next:res=>{
        this.templates=res.data
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
    let getUrl = 'api/admin/templates';
   return this.http.getReq(getUrl,{params:x}); 
 }


onPageChange(e:any){

  this.currentPage = e.page + 1
  this.router.navigate([], { queryParams: {page: this.currentPage}, queryParamsHandling: 'merge' });
}

}
