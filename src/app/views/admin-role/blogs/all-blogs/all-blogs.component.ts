import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LooseObject } from '@models/LooseObject';
import { ColumnValue, ControlItem, columnHeaders } from '@models/tableData';
import { HttpService } from '@services/http.service';
import { Paginator } from 'primeng/paginator';
import { BehaviorSubject, Subscription, debounceTime, switchMap } from 'rxjs';

@Component({
  selector: 'app-all-blogs',
  templateUrl: './all-blogs.component.html',
  styleUrls: ['./all-blogs.component.scss']
})
export class AllBlogsComponent implements OnInit {


  selectedValue!:any
  searchWord:string = '';
  searchInput$ = new BehaviorSubject('');
  private subs = new Subscription();
  blogs:any
  currentPage = 1
  totalPage = 0
  perPage = 0
  columnsArray:columnHeaders[]= [
    {
     nameAR: 'رقم المقال',
     nameEN:'Article Id'

    },
    {
     nameAR: 'عنوان المقال',
     nameEN:'	Article Title'

    },
    {
     nameAR: 'عدد مشاهدات المقال',
     nameEN:'Article views number'
      
    },
    {
     nameAR: 'تاريخ اضافة المقال',
     nameEN:'Created At'
      
    },


   ]

   columnsNames:ColumnValue[]= [
    {
      name:'id',
      type:'normal'
    },
    {
      name:'title',
      type:'normal'
    },
    {
      name:'views_number',
      type:'normal'
    },
    {
      name:'created_at',
      type:'normal'
    },

   ]
  
   controlArray:ControlItem[]=[
    {
      nameAR:'عرض بيانات المقال',
      nameEN:'View Article Details',
      route:{
        path:'/admin/blogs/blog-details-view/',
        attribute:'id'
      },
      popUp:''
    },
    {
      nameAR:'تعديل بيانات المقال',
      nameEN:'Edit Article Details',
      route:{
        path:'/admin/blogs/blog-details/edit/',
        attribute:'id'
      },
      popUp:''
    },
    {
      nameAR:'حذف بيانات المقال',
      nameEN:'Delete Article',
      route:{
        path:'',
        attribute:'id'
      },
      popUp:'DeleteAdminArticle'
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
        this.blogs=res.data
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
    let getUrl = 'api/admin/blogs';
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
