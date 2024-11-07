import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LooseObject } from '@models/LooseObject';
import { HttpService } from '@services/http.service';
import { BehaviorSubject, Subscription, debounceTime, switchMap } from 'rxjs';
import { ColumnValue, ControlItem, columnHeaders } from '@models/tableData';
import { Paginator } from 'primeng/paginator';



@Component({
  selector: 'app-All-administrative-users',
  templateUrl: './All-administrative-users.component.html',
  styleUrls: ['./All-administrative-users.component.scss']
})
export class AllAdministrativeUsersComponent implements OnInit {

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
      nameAR:'رقم العميل / الشركة',
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
     nameAR: 'دور',
     nameEN:'Role'
      
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
      type:'normal'
    },
    {
      name:'verified_at',
      type:'puple-verified'
    },
    {
      name:'role',
      type:'normal'
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
        // this.perPage=res.meta.per_page
        // this.totalPage=res.meta.total
        // setTimeout(() => {
          // this.paginator.changePage(this.currentPage -1 )
        // }, 200);
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
    let getUrl = 'api/admin/administrative-users';
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
