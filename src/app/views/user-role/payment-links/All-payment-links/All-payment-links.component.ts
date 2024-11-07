import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LooseObject } from '@models/LooseObject';
import { paymentLinks } from '@models/payment-link';
import { HttpService } from '@services/http.service';
import { ToastrService } from 'ngx-toastr';
import { Paginator } from 'primeng/paginator';
import { BehaviorSubject, Subscription, debounceTime, switchMap } from 'rxjs';


interface ColumnValue{
  name:string,
  type:string
}
interface ControlItem{
  nameAR:string,
  nameEN:string,
  route:{
    path:string,
    attribute:string
  }
  popUp:string
}

interface columnHeaders{ 
  nameAR:String,
  nameEN:string
}


@Component({
  selector: 'app-All-payment-links',
  templateUrl: './All-payment-links.component.html',
  styleUrls: ['./All-payment-links.component.scss']
})
export class AllPaymentLinksComponent implements OnInit {

  searchWord:string = '';
  searchInput$ = new BehaviorSubject('');
  private subs = new Subscription();
  paymentLinks:paymentLinks[]=[]

  currentPage = 1
  totalPage = 0
  perPage = 0
  columnsArray:columnHeaders[]= [
    {
      nameAR: 'فاتورة',
      nameEN:'Invoice'
    },
{
  nameAR: 'الدفع لفائدة',
  nameEN:'Payment for	'
},
{
  nameAR: 'الايميل',
  nameEN:'Email'
},{
  nameAR:'المبلغ',
  nameEN:'Amount'

},{
  nameAR:'المبلغ المدفوع',
nameEN:'Paid amount	'
},{
  nameAR:'المبلغ المستحق',
  nameEN:'Received amount	'

},
{
  nameAR:'حالة الربط',
  nameEN:'State'
},{
nameAR:'تاريخ الانشاء',
nameEN:'Generated at	'
},
{
  nameAR:'صالح إلي',
nameEN:'Active untill	'
}

   ]

   columnsNames:ColumnValue[]= [
    {
      name:'inoice_number',
      type:'normal'
    },
    {
      name:'user',
      type:'normal'
    },
    {
      name:'email',
      type:'normal'
    },
    {
      name:'amount',
      type:'normal'
    },
    {
      name:'paid_amount',
      type:'normal'
    },
    {
      name:'received_amount',
      type:'normal'
    },
    {
      name:'state',
      type:'normal'
    },
    {
      name:'generated_at',
      type:'normal'
    },
    {
      name:'active_until',
      type:'normal'
    }
   ]
  
   controlArray:ControlItem[]=[
    {
      nameAR:'عرض تفاصيل رابط الدفع',
      nameEN:'View Payment Link',
      route:{
        path:'/user/payment-links/payment-link-details/',
        attribute:'uuid'
      },
      popUp:''
    },

   ]

   @ViewChild('paginator') paginator!: Paginator;
  constructor(private router: Router,private http:HttpService,private activatedRoute: ActivatedRoute,private toastr:ToastrService) { 
    this.router.navigate([], { queryParams: {q:null}, queryParamsHandling: 'merge' })  
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
        this.paymentLinks=res.data
        // this.perPage=res.meta.
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
    let getUrl = 'api/dashboard/payment_links/index';
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

}
