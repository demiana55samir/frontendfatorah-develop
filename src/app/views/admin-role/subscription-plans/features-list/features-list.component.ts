import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LooseObject } from '@models/LooseObject';
import { ColumnValue, ControlItem, columnHeaders } from '@models/tableData';
import { HttpService } from '@services/http.service';
import { Paginator } from 'primeng/paginator';
import { Subscription, switchMap } from 'rxjs';



@Component({
  selector: 'app-features-list',
  templateUrl: './features-list.component.html',
  styleUrls: ['./features-list.component.scss']
})
export class FeaturesListComponent implements OnInit {

  private subs = new Subscription();
  features:any
  planId:any
  currentPage = 1
  totalPage = 0
  perPage = 0
  columnsArray:columnHeaders[]= [
    {
     nameAR: 'ترتيب الفرز',
     nameEN:'Sort order'

    },
    {
     nameAR: 'اسم الميزة',
     nameEN:'Feature name'

    },

   ]

   columnsNames:ColumnValue[]= [
    {
      name:'sort_order',
      type:'normal'
    },
    {
      name:'name',
      type:'normal'
    },


   ]
  
   controlArray:ControlItem[]=[]
   @ViewChild('paginator') paginator!: Paginator;
   constructor(private router: Router,private http:HttpService,private activatedRoute: ActivatedRoute) {
    this.router.navigate([], { queryParams: {q:null,page:1}, queryParamsHandling: 'merge' })  

   }
   ngOnInit() {
    this.planId = String(this.activatedRoute.snapshot.paramMap.get('id'))

    this.subs.add(this.activatedRoute.queryParams.pipe(
      switchMap((param: any) => {
        if(param['page'] ){
          this.currentPage = Number(param['page']);
      }
        return this.getAllData(param);
      })
    ).subscribe({
      next:res=>{
        this.features=res.data
        this.perPage=res.meta.per_page
        this.totalPage=res.meta.total
        setTimeout(() => {
          this.paginator.changePage(this.currentPage -1 )
        }, 200);
      }
    }));
    this.controlArray=[
      {
        nameAR:'عرض بيانات الميزة',
        nameEN:'View Feature Details',
        route:{
          path:`/admin/subscription-plans/feature-details/view/${this.planId}/`,
          attribute:'id'
        },
        popUp:''
      },
      {
        nameAR:'تعديل بيانات الميزة',
        nameEN:'Edit Feature Details',
        route:{
          path:`/admin/subscription-plans/feature-details/edit/${this.planId}/`,
          attribute:'id'
        },
        popUp:''
      },
      {
        nameAR:'حذف بيانات الميزة',
        nameEN:'Delete Feature',
        route:{
          path:'',
          attribute:'id'
        },
        popUp:'DeleteAdminFeature'
      }
  
     ]
  }
  getAllData(filters : any){
    let x :LooseObject ={}; 
    for (const [key , value] of Object.entries(filters) ) {
      // console.log( key ,  value);
      if(value)
        x[key] = value
    }
    let getUrl = `api/admin/plans/${this.planId}/features`;
   return this.http.getReq(getUrl,{params:x}); 
 }


onPageChange(e:any){

  this.currentPage = e.page + 1
  this.router.navigate([], { queryParams: {page: this.currentPage}, queryParamsHandling: 'merge' });
}

}
