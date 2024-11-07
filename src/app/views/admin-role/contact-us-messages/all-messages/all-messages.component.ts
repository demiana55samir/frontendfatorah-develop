import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LooseObject } from '@models/LooseObject';
import { ColumnValue, ControlItem, columnHeaders } from '@models/tableData';
import { AuthService } from '@services/auth.service';
import { HttpService } from '@services/http.service';
import { Paginator } from 'primeng/paginator';
import { BehaviorSubject, Subscription, switchMap } from 'rxjs';

@Component({
  selector: 'app-all-messages',
  templateUrl: './all-messages.component.html',
  styleUrls: ['./all-messages.component.scss']
})
export class AllMessagesComponent implements OnInit {

  searchWord:string = '';
  searchInput$ = new BehaviorSubject('');
  private subs = new Subscription();
  messages:any

   columnsArray:columnHeaders[]= [
    {
      nameAR:'رقم الرسالة',
      nameEN:'Message Id'
    },
    {
      nameAR:  'اسم المرسل',
      nameEN:"Sender Name"
    },
    {
      nameAR: 'الايميل',
      nameEN:'Email'
    },
    {
      nameAR: 'رقم الهاتف',
      nameEN:'phone'
    },
    {
nameAR: 'عنوان الرسالة',
nameEN:'Subject'
    },
    {
nameAR: 'تاريخ الرسالة',
nameEN:'Created At'
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
      name:'email',
      type:'normal'
    },
    {
      name:'phone',
      type:'normal'
    },
    {
      name:'subject',
      type:'normal'
    },
    {
      name:'created_at',
      type:'normal'
    },
   ]
  
   controlArray:ControlItem[]=[
    {
      nameAR:'رؤية الرسالة ',
      nameEN:'View Message',
      route:{
        path:'/admin/contact-us-messages/message-details/',
        attribute:'id'
      },
      popUp:''
    }
   ]
   currentPage = 1
   totalPage = 0
   perPage = 0
   @ViewChild('paginator') paginator!: Paginator;
  constructor(private router: Router,private http:HttpService,private activatedRoute: ActivatedRoute,private auth:AuthService) {
    this.router.navigate([], { queryParams: {page: this.currentPage}, queryParamsHandling: 'merge' });
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
        this.messages=res.data

        this.totalPage = res?.meta.total
        this.perPage = res?.meta?.per_page
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

    let  getUrl='api/admin/contact_us' 

   return this.http.getReq(getUrl,{params:x}); 
 }


  onPageChange(e:any){

    this.currentPage = e.page + 1
    this.router.navigate([], { queryParams: {page: this.currentPage}, queryParamsHandling: 'merge' });
  }
ngOnDestroy() {
  this.subs.unsubscribe();
}
}
