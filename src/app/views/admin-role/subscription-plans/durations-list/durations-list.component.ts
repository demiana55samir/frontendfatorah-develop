import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LooseObject } from '@modules/LooseObject';
import { duration } from '@modules/subscription-plans';
import { ColumnValue, ControlItem, columnHeaders } from '@modules/tableData';
import { HttpService } from '@services/http.service';
import { Paginator } from 'primeng/paginator';
import { Subscription, switchMap } from 'rxjs';

@Component({
  selector: 'app-durations-list',
  templateUrl: './durations-list.component.html',
  styleUrls: ['./durations-list.component.scss']
})
export class DurationsListComponent implements OnInit {

  private subs = new Subscription();
  features:duration = {} as duration;
  planId:any
  currentPage = 1
  totalPage = 0
  perPage = 0
  columnsArray:columnHeaders[]= [

    {
     nameAR: ' المدة',
     nameEN:'Duration '
    },
    {
      nameAR: ' السعر',
      nameEN:'Price '
     },

   ]

   columnsNames:ColumnValue[]= [
    {
      name:'name',
      type:'normal'
    },
    {
      name:'price',
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
        nameAR:'تعديل بيانات المدة',
        nameEN:'Edit Duration Details',
        route:{
          path:`/admin/subscription-plans/duration-details/edit/${this.planId}/`,
          attribute:'plan_duration_id'
        },
        popUp:''
      },
      {
        nameAR:'حذف بيانات المدة',
        nameEN:'Delete Duration',
        route:{
          path:'',
          attribute:'plan_duration_id'
        },
        popUp:'DeleteAdminDuration'
      }
  
     ]
  }
  getAllData(filters : any){
    let x :LooseObject ={}; 
    for (const [key , value] of Object.entries(filters) ) {
      if(value)
        x[key] = value
    }

    let getUrl = `api/admin/plans/${this.planId}/durations`;
   return this.http.getReq(getUrl,{params:x}); 
 }

}
