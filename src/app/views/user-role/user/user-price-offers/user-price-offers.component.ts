import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LooseObject } from '@models/LooseObject';
import { quotations } from '@models/quotations';
import { HttpService } from '@services/http.service';
import { BehaviorSubject, Subscription, debounceTime, switchMap } from 'rxjs';
import { ColumnValue, ControlItem, columnHeaders } from '@models/tableData';
import { Paginator } from 'primeng/paginator';


@Component({
  selector: 'app-user-price-offers',
  templateUrl: './user-price-offers.component.html',
  styleUrls: ['./user-price-offers.component.scss']
})
export class UserPriceOffersComponent implements OnInit {
  uuid=''
  userQuotations:quotations[] = []
  searchWord:string = '';
  searchInput$ = new BehaviorSubject('');
  private subs = new Subscription();

  currentPage = 1
  totalPage = 0
  perPage = 0
  columnsArray:columnHeaders[]= [
{
  nameAR:'	رقم عرض السعر	',
  nameEN:'quotation id'
},
{
  nameAR: '	تحميل',
  nameEN:'Download'
},{
  nameAR: '	الفواتير',
  nameEN:'Invoices'
},
{
  nameAR: '	الإجمالي',
  nameEN:'Amount'
}



   ]

   columnsNames:ColumnValue[]= [
    {
      name:'number',
      type:'normal'
    },
    {
      name:'',
      type:'download'
    },
    {
      name:'invoices_number',
      type:'normal-add'
    },
    {
      name:'total',
      type:'normal'
    },



   ]
  
   controlArray:ControlItem[]=[
    {
      nameAR:'رؤية عرض سعر',
      nameEN:'View quotation',
      route:{
        path:'/user/prices/price-offers-details/',
        attribute:'uuid'
      },
      popUp:''
    },


   ]
   @ViewChild('paginator') paginator!: Paginator;
  constructor(private http:HttpService,private activeRoute:ActivatedRoute,private router: Router) {
    this.router.navigate([], { queryParams: {q:null}, queryParamsHandling: 'merge' }) 

   }
  ngOnInit() {
    this.uuid= String(this.activeRoute.snapshot.paramMap.get('uuid'))
    
    this.subs.add(this.activeRoute.queryParams.pipe(
      switchMap((param: any) => {
        if(param['page'] ){
          this.currentPage = Number(param['page']);
      }
        return this.getAllData(param,this.uuid);
      })
    ).subscribe({
      next:res=>{
        this.userQuotations=res.data
        this.perPage=res.meta.per_page
        this.totalPage=res.meta.total
        setTimeout(() => {
          this.paginator.changePage(this.currentPage -1 )
        }, 200);
      }
    }));
  }
  getAllData(filters : any,uuid:string){
    let x :LooseObject ={}; 
    for (const [key , value] of Object.entries(filters) ) {
      // console.log( key ,  value);
      if(value)
        x[key] = value
    }
    // let getUrl = 'api/dashboard/receipts/index';

   return this.http.getReq(`api/dashboard/clients/${uuid}/quotations`,{params:x}); 
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
