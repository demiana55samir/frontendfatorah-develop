import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { creditNotes } from '@modules/credit-notes';
import { LooseObject } from '@modules/LooseObject';
import { columnHeaders, ColumnValue, ControlItem } from '@modules/tableData';
import { HttpService } from '@services/http.service';
import { Paginator } from 'primeng/paginator';
import { BehaviorSubject, Subscription, switchMap, debounceTime } from 'rxjs';

@Component({
  selector: 'app-All-debit-notes',
  templateUrl: './All-debit-notes.component.html',
  styleUrls: ['./All-debit-notes.component.scss']
})
export class AllDebitNotesComponent implements OnInit {

  searchWord:string = '';
  searchInput$ = new BehaviorSubject('');
  private subs = new Subscription();
  debitNotes!:creditNotes[]

   columnsArray:columnHeaders[]= [
    {
      nameAR:'رقم الاشعار المدين',
      nameEN:'Debit note id'
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
      nameAR:'رؤية الاشعار المدين ',
      nameEN:'View Debit Notice',
      route:{
        path:'/user/invoices/debit-note-details/details/',
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
  constructor(private router: Router,
    private http:HttpService,
    private activatedRoute: ActivatedRoute) {}

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
        this.debitNotes=res.data

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
      if(value)
        x[key] = value
    }

    let getUrl = 'api/dashboard/debit_notes';
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
