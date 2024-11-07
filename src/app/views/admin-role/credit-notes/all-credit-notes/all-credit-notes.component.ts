import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LooseObject } from '@models/LooseObject';
import { creditNotes } from '@models/credit-notes';
import { ColumnValue, ControlItem, columnHeaders } from '@models/tableData';
import { AuthService } from '@services/auth.service';
import { HttpService } from '@services/http.service';
import { Paginator } from 'primeng/paginator';
import { BehaviorSubject, Subscription, debounceTime, switchMap } from 'rxjs';



@Component({
  selector: 'app-all-credit-notes',
  templateUrl: './all-credit-notes.component.html',
  styleUrls: ['./all-credit-notes.component.scss']
})
export class AllCreditNotesComponent implements OnInit {
  searchWord:string = '';
  searchInput$ = new BehaviorSubject('');
  private subs = new Subscription();
  crediteNotes!:creditNotes[]

   columnsArray:columnHeaders[]= [
    {
      nameAR:'رقم الاشعار الدائن',
      nameEN:'Credit note id'
    },
    {
      nameAR:  'المستخدم',
      nameEN:'User'
    },
    {
      nameAR: 'تحميل',
      nameEN:'Download'
    },
    {
nameAR: 'الاجمالي',
nameEN:'Amount'
    }
   ]

   columnsNames:ColumnValue[]= [
    {
      name:'number',
      type:'normal'
    },
    {
      name:'user',
      type:'blueAdminUserId'
    },
    {
      name:'',
      type:'download'
    },
    {
      name:'total',
      type:'normal'
    },
   ]
  
   controlArray:ControlItem[]=[
    {
      nameAR:'رؤية الاشعار الدائن ',
      nameEN:'View Credit Note',
      route:{
        path:'/admin/credit-notes/credit-note-details/',
        attribute:'uuid'
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
        this.crediteNotes=res.data

        this.totalPage = res?.meta?.total
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

    let  getUrl='api/admin/credit_notes' 
    
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
