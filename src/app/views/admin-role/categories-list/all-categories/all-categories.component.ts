import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LooseObject } from '@modules/LooseObject';
import { category } from '@modules/settings';
import { columnHeaders, ColumnValue, ControlItem } from '@modules/tableData';
import { AuthService } from '@services/auth.service';
import { ChangeLanguageService } from '@services/changeLanguage.service';
import { HttpService } from '@services/http.service';
import { MenuItem } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { BehaviorSubject, Subscription, switchMap, debounceTime } from 'rxjs';

@Component({
  selector: 'app-all-categories',
  templateUrl: './all-categories.component.html',
  styleUrls: ['./all-categories.component.scss']
})
export class AllCategoriesComponent implements OnInit {

  selectedValue!:any
  searchWord:string = '';
  searchInput$ = new BehaviorSubject('');
  private subs = new Subscription();
  categories:category[] = [];
  currentPage = 1
  totalPage = 0
  perPage = 0
  columnsArray:columnHeaders[]= [
    {
      nameAR: 'رقم التصنيف',
     nameEN:'Category Id'
    },
    {
     nameAR: ' اسم التصنيف ',
     nameEN:'Category name'

    },
    { 
      nameAR:'نوع التصنيف',
      nameEN:'Category Type'

    },
    {
     nameAR: ' حالة التصنيف ',
     nameEN:'Category Status'
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
      name:'type',
      type:'expenseType'
    },
    {
      name:'taxable',
      type:'expenseTax'
    }
   ]
  
   controlArray:ControlItem[]=[
   
    {
      nameAR:'تعديل التصنيف',
      nameEN:'Edit Category',
      route:{
        path:'/admin/settings/categories/category/edit/',
        attribute:'id'
      },
      popUp:''
    },
    {
      nameAR:'حذف التصنيف',
      nameEN:'Delete Category',
      route:{
        path:'',
        attribute:'id'
      },
      popUp:'DeleteAdminCategory'
    }

   ]
   @ViewChild('paginator') paginator!: Paginator;

   userRole = 'admin';

   language = 'ar';
   tab=1;
   activeItem!: MenuItem;

   currentType = 'purchase'
   items=[{label:"المشتريات ",command: (event:any) => {
    this.activeItem=this.items[0]
    this.tab=1
    this.searchWord=''
    this.currentType = 'purchase'
    this.paginator.changePage(0)
    this.paginator.updatePageLinks();
   
    return this.router.navigate([], { queryParams: {q:null,page:1,type:this.currentType} , queryParamsHandling: 'merge' })
  }}
  ,{label:" المصروفات ",command: (event:any) => {
    this.activeItem=this.items[1]
    this.tab=2
    this.searchWord=''
    this.currentType = 'expense'

    this.paginator.changePage(0)
    this.paginator.updatePageLinks();
    return this.router.navigate([], { queryParams: {q:null,page:1,type: this.currentType} , queryParamsHandling: 'merge' })

  }}
]

  constructor(private router: Router,private http:HttpService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,private chageLanguageService:ChangeLanguageService) {
    this.router.navigate([], { queryParams: {q:null,page:1,type:'purchase'}, queryParamsHandling: 'merge' })  

   }

  ngOnInit() {
    let user = this.authService.getUserObj();
    this.userRole = user.role
    let userPermissions = user.permissions
    if(this.userRole!='admin' && !userPermissions['users.login_as'] && !userPermissions['all.manage']){
      this.columnsNames.splice(5, 1);
      this.columnsArray.splice(5, 1);
      // this.controlArray.splice(1,2);
    }

    if(this.userRole!='admin'  && !userPermissions['all.manage'] && !userPermissions['users.manage']){
      this.controlArray = [];
    }
    
    this.activeItem=this.items[0]
    this.language=this.chageLanguageService.local_lenguage
    if(this.language=='en'){
      this.items[0].label='Purchases'
      this.items[1].label='Expenses'
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
        this.categories=res.data
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
    let getUrl = 'api/admin/expenses';
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
