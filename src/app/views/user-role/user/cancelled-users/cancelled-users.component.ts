import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LooseObject } from '@models/LooseObject';
import { client } from '@models/client';
import { ChangeLanguageService } from '@services/changeLanguage.service';
import { HttpService } from '@services/http.service';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Subscription, debounceTime, switchMap } from 'rxjs';

import { ColumnValue, ControlItem, columnHeaders } from '@models/tableData';
import { Paginator } from 'primeng/paginator';

@Component({
  selector: 'app-cancelled-users',
  templateUrl: './cancelled-users.component.html',
  styleUrls: ['./cancelled-users.component.scss']
})
export class CancelledUsersComponent implements OnInit {
  searchWord:string = '';
  searchInput$ = new BehaviorSubject('');
  private subs = new Subscription();
  cancelledUsers:client[]=[]
  language:any
  currentPage = 1
  totalPage = 0
  perPage = 0
  columnsArray:columnHeaders[]= [
    {
      nameAR: 'رقم العميل	',
      nameEN:'Client Id'
    },
    {
      nameAR:'إسم العميل	',
      nameEN:'Client Name'
    },
    {
      nameAR: '	الايميل',
      nameEN:'Email'
    },
    {
      nameAR: 'رقم الهاتف	',
      nameEN:'Phone'
    }


   ]

   columnsNames:ColumnValue[]= [
    {
      name:'client_id',
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
      name:'mobile',
      type:'normal'
    },


   ]
  
   controlArray:ControlItem[]=[
    {
      nameAR:'اعادة العميل',
      nameEN:'Recover',
      route:{
        path:'',
        attribute:'uuid'
      },
      popUp:'restoreUser'
    },


   ]
   @ViewChild('paginator') paginator!: Paginator;
  constructor(private router: Router,private changeLang:ChangeLanguageService,private http:HttpService,private activatedRoute: ActivatedRoute,private toastr:ToastrService) { 
    this.router.navigate([], { queryParams: {q:null}, queryParamsHandling: 'merge' })  
   }

  ngOnInit() {
    this.language=this.changeLang.local_lenguage
    this.subs.add(this.activatedRoute.queryParams.pipe(
      switchMap((param: any) => {
        if(param['page'] ){
          this.currentPage = Number(param['page']);
      }
        return this.getAllData(param);
      })
    ).subscribe({
      next:res=>{
        this.cancelledUsers=res.data
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
    let getUrl = 'api/dashboard/deleted/clients';
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
restoreUser(uuid:string){
  this.subs.add(this.http.putReq(`api/dashboard/clients/${uuid}/restore`).subscribe({
    next:res=>{

    },complete:()=>{
      if(this.language=='en'){
        this.toastr.info('Client restored successfully')
      }else{
        this.toastr.info(' تم استعادته العميل بنجاح.')
      }
      const index=this.cancelledUsers.findIndex(c => c.uuid == uuid)
      if (index > -1) {
        this.cancelledUsers.splice(index, 1)
      }
    }
  }))
}

onPageChange(e:any){

  this.currentPage = e.page + 1
  this.router.navigate([], { queryParams: {page: this.currentPage}, queryParamsHandling: 'merge' });
}

ngOnDestroy() {
  this.subs.unsubscribe();
}
}
