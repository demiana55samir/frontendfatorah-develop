import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LooseObject } from '@models/LooseObject';
import { HttpService } from '@services/http.service';
import { BehaviorSubject, Subscription, debounceTime, switchMap } from 'rxjs';
import { ColumnValue, ControlItem, columnHeaders } from '@models/tableData';
import { Paginator } from 'primeng/paginator';
import { MenuItem } from 'primeng/api';
import { ChangeLanguageService } from '@services/changeLanguage.service';
import { AuthService } from '@services/auth.service';


@Component({
  selector: 'app-All-users',
  templateUrl: './All-users.component.html',
  styleUrls: ['./All-users.component.scss']
})
export class AllUsersComponent implements OnInit {
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
      nameAR: 'رقم العميل / الشركة',
     nameEN:'Client/Organization Id'
    },
    {
     nameAR: 'اسم العميل / الشركة',
     nameEN:'Client/Organization name'

    },
    { 
      nameAR:'الايميل',
      nameEN:'Email'

    },
    {
     nameAR: 'رقم الجوال',
     nameEN:'Phone Number'
    },
    {
     nameAR: 'حالة الحساب',
     nameEN:'Account Status'
      
    },
    {
     nameAR: 'الدخول لحساب المستخدم',
     nameEN:'Log in to the user account'
      
    },
    {
     nameAR: 'تاريخ انشاء الحساب',
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
      type:'blueAdminUser'
    },
    {
      name:'email',
      type:'normal'
    },
    {
      name:'phone',
      type:'whatsapp'
    },
    {
      name:'verified_at',
      type:'puple-verified'
    },
    {
      name:'uuid',
      type:'puple-login'
    },
    {
      name:'created_at',
      type:'normal'
    },

   ]
  
   controlArray:ControlItem[]=[
    {
      nameAR:'عرض بيانات المستخدم',
      nameEN:'View Use Details',
      route:{
        path:'/admin/user-details/',
        attribute:'uuid'
      },
      popUp:''
    },
    {
      nameAR:'تعديل بيانات المستخدم',
      nameEN:'Edit User Details',
      route:{
        path:'/admin/user-data/update/',
        attribute:'uuid'
      },
      popUp:''
    },
    {
      nameAR:'حذف بيانات المستخدم',
      nameEN:'Delete User',
      route:{
        path:'',
        attribute:'uuid'
      },
      popUp:'DeleteAdminUser'
    }

   ]
   @ViewChild('paginator') paginator!: Paginator;

   userRole = 'admin';

   language = 'ar';
   tab=1;
   activeItem!: MenuItem;
   items=[{label:"الكل",command: (event:any) => {
    this.activeItem=this.items[0]
    this.tab=1
    this.searchWord=''
    this.paginator.changePage(0)
    this.paginator.updatePageLinks();
   
    return this.router.navigate([], { queryParams: {active:null,q:null,page:1,expense:null} , queryParamsHandling: 'merge' })
  }}
  ,{label:" مفعل ",command: (event:any) => {
    this.activeItem=this.items[1]
    this.tab=2
    this.searchWord=''
   

    this.paginator.changePage(0)
    this.paginator.updatePageLinks();
    return this.router.navigate([], { queryParams: {active:1,q:null,page:1,expense:null} , queryParamsHandling: 'merge' })

  }}
  ,{label:" غير مفعل ",command: (event:any) => {
    this.activeItem=this.items[2]
    this.tab=3
    this.searchWord=''
   
    this.paginator.changePage(0)
    this.paginator.updatePageLinks();

    return this.router.navigate([], { queryParams: {active:0,q:null,page:1} , queryParamsHandling: 'merge' })

  }}

]

  constructor(private router: Router,private http:HttpService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,private chageLanguageService:ChangeLanguageService) {
    this.router.navigate([], { queryParams: {q:null,page:1,active:null}, queryParamsHandling: 'merge' })  

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
      this.items[0].label='All'
      this.items[1].label='Activated'
      this.items[2].label='Not Activated'
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
    let getUrl = 'api/admin/users';
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
