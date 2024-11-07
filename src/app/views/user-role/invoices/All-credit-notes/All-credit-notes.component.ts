import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LooseObject } from '@models/LooseObject';
import { creditNotes } from '@models/credit-notes';
import { HttpService } from '@services/http.service';
import { BehaviorSubject, Subscription, debounceTime, switchMap } from 'rxjs';
import { ColumnValue, ControlItem, columnHeaders } from '@models/tableData';
import { Paginator } from 'primeng/paginator';

@Component({
  selector: 'app-All-credit-notes',
  templateUrl: './All-credit-notes.component.html',
  styleUrls: ['./All-credit-notes.component.scss']
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
      nameAR:  'العميل',
      nameEN:'Client'
    },
    {
      nameAR: 'تحميل',
      nameEN:'Download'
    },
    {
      nameAR: 'الاجمالي',
      nameEN:'Amount'
    },
    {
      nameAR:' هيئة الزكاة ',
      nameEN:'Zatca Status'
    }
   ]

   columnsNames:ColumnValue[]= [
    {
      name:'number',
      type:'normal'
    },
    {
      name:'client',
      type:'blueClientId'
    },
    {
      name:'',
      type:'download'
    },
    {
      name:'total',
      type:'normal'
    },
    {
      name:'zatca_send_status',
      type:'zatca_status'
    }
   ]
  
   controlArray:ControlItem[]=[
    {
      nameAR:'رؤية الاشعار الدائن ',
      nameEN:'View Credit Notice',
      route:{
        path:'/user/invoices/credit-note-details/details/',
        attribute:'uuid'
      },
      popUp:''
    }, {
      nameAR:'ارسل إلى هيئة الزكاة',
      nameEN:'Submit to Zatca',
      route:{
        path:'',
        attribute:'uuid'
      },
      popUp:'submitToZatcaCredit'
    }
   ]
   currentPage = 1
   totalPage = 0
   perPage = 0
   @ViewChild('paginator') paginator!: Paginator;
  constructor(private router: Router,private http:HttpService,private activatedRoute: ActivatedRoute) {
    // this.router.navigate([], { queryParams: {page: this.currentPage}, queryParamsHandling: 'merge' });
   }

  ngOnInit() {
    this.subs.add(this.activatedRoute.queryParams.pipe(
      switchMap((param: any) => {
        if(param['page'] ){
            this.currentPage = Number(param['page']);
            // this.paginator.updatePageLinks();
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
        }, 500);
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
    let getUrl = 'api/dashboard/credit_notes';
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
