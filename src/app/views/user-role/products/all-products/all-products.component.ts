import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LooseObject } from '@models/LooseObject';
import { product } from '@models/product';
import { HttpService } from '@services/http.service';
import { BehaviorSubject, Subscription, debounceTime, switchMap } from 'rxjs';
import { ColumnValue, ControlItem, columnHeaders } from '@models/tableData';
import { Paginator } from 'primeng/paginator';


@Component({
  selector: 'app-all-products',
  templateUrl: './all-products.component.html',
  styleUrls: ['./all-products.component.scss']
})
export class AllProductsComponent implements OnInit {
  selectedValue!:any
  searchWord:string = '';
  searchInput$ = new BehaviorSubject('');
  private subs = new Subscription();
  products!:product[]

  currentPage = 1
  totalPage = 0
  perPage = 0
  columnsArray:columnHeaders[]= [
    {
     nameAR: 'رقم المنتج',
     nameEN:'Product ID'

    },
    {
     nameAR: 'الإسم',
     nameEN:'Name'

    },
    {
      nameAR:'السعر',
      nameEN:'Price'

    },
    {
     nameAR: 'النوع',
     nameEN:'Type'
    },
    {
     nameAR: 'اجمالي مبيعات المنتج',
     nameEN:'Total sales'
      
    }


   ]

   columnsNames:ColumnValue[]= [
    {
      name:'product_id',
      type:'normal'
    },
    {
      name:'name',
      type:'blueProduct'
    },
    {
      name:'price',
      type:'normal-number'
    },
    {
      name:'type',
      type:'normal'
    },
    {
      name:'sales',
      type:'normal-number'
    },

   ]
  
   controlArray:ControlItem[]=[
    {
      nameAR:'رؤية المنتج',
      nameEN:'View Product',
      route:{
        path:'/user/products/product-details/',
        attribute:'uuid'
      },
      popUp:''
    },
    {
      nameAR:'تعديل المنتج',
      nameEN:'Edit Product',
      route:{
        path:'/user/products/Add-products/edit/',
        attribute:'uuid'
      },
      popUp:''
    },
    {
      nameAR:'حذف المنتج',
      nameEN:'Delete Product',
      route:{
        path:'',
        attribute:'uuid'
      },
      popUp:'DeleteProduct'
    }

   ]
   firstTime=false
   @ViewChild('paginator') paginator!: Paginator;
  constructor(private router: Router,private http:HttpService,private activatedRoute: ActivatedRoute) { 
    // this.router.navigate([], { queryParams: {q:null}, queryParamsHandling: 'merge' })  
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
        this.products=res.data
        this.perPage=res.meta.per_page
        this.totalPage=res.meta.total
        setTimeout(() => {
          this.paginator.changePage(this.currentPage -1 )
        }, 200);
      }
    }));
  }
 

  // ngAfterViewInit() {
  //   this.subs.add(this.activatedRoute.queryParams.pipe(
  //     switchMap((param: any) => {
  //       if(param['page'] && !this.firstTime){
  //         this.firstTime=true
  //         setTimeout(() => {
  //           this.paginator.changePage(param['page']-1)
            
  //         }, 900);
  //           // this.paginator.updatePageLinks();
  //       }
        
  //       return this.getAllData(param);
  //     })
  //   ).subscribe({
  //     next:res=>{
  //       this.products=res.data
  //       this.perPage=res.meta.per_page
  //       this.totalPage=res.meta.total
  //     }
  //   }));
  // }
  getAllData(filters : any){
    let x :LooseObject ={}; 
    for (const [key , value] of Object.entries(filters) ) {
      // console.log( key ,  value);
      if(value)
        x[key] = value
    }
  
      // this.paginator.changePage(x['page']-1)
    
    // if(!x['page']){
    //   this.paginator.changePage(0)
    // }
    let getUrl = 'api/dashboard/products';
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
  this.scrollFunc('card')
  this.firstTime=true
  this.router.navigate([], { queryParams: {page: this.currentPage}, queryParamsHandling: 'merge' });

}

  
scrollFunc(sectionName: string) {
  var elem = document.getElementById(sectionName);
  elem?.scrollIntoView();
}


ngOnDestroy() {
  this.subs.unsubscribe();
}
}
