import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LooseObject } from '@models/LooseObject';
import { ChangeLanguageService } from '@services/changeLanguage.service';
import { HttpService } from '@services/http.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription, switchMap } from 'rxjs';
import { ColumnValue, ControlItem, columnHeaders } from '@models/tableData';
import { Paginator } from 'primeng/paginator';


@Component({
  selector: 'app-balance-transfer-requests',
  templateUrl: './balance-transfer-requests.component.html',
  styleUrls: ['./balance-transfer-requests.component.scss']
})
export class BalanceTransferRequestsComponent implements OnInit {
   addBalanceTransferRequestsForm!:FormGroup
   BalanceTransferRequests:any
   private subs=new Subscription()
   currentPage = 1
   totalPage = 0
   perPage = 0
   language:any
   columnsArray:columnHeaders[]= [
    {
      nameAR:'رقم الطلب',
      nameEN:'order id'
    },
    {
      nameAR: 'اسم صاحب الحساب',
      nameEN:'Client name'
    },
    {
     nameAR: ' اسم البنك',
     nameEN:'Bank Name'
    },
    {
     nameAR: 'المبلغ',
     nameEN:'Amount'

    },{
     nameAR: 'حالة الطلب',
     nameEN:'Status'

    },{
      nameAR: 'تاريخ الانشاء',
      nameEN:'Created At'
    }
          
    ]
 
    columnsNames:ColumnValue[]= [
     {
       name:'id',
       type:'normal'
     },
     {
       name:'account_name',
       type:'normal'
     },
     {
       name:'bank_name',
       type:'normal'
     },
     {
       name:'amount',
       type:'normal'
     },
     {
       name:'status',
       type:'blueBG'
     },
     {
       name:'created_at',
       type:'normal'
     }
    ]
   
    controlArray:ControlItem[]=[
     {
       nameAR:'رؤية طلب تحويل',
       nameEN:'View balance transfer request',
       route:{
         path:'',
         attribute:''
       },
       popUp:''
 
     },

    ]
    @ViewChild('paginator') paginator!: Paginator;
  constructor(private fb:FormBuilder,private changeLang:ChangeLanguageService,private http:HttpService,private toastr:ToastrService,private router:Router,private activatedRoute:ActivatedRoute) {
    this.router.navigate([], { queryParams: {page:1}, queryParamsHandling: 'merge' })  

   }

  ngOnInit() {
    this.language=this.changeLang.local_lenguage
    this.addBalanceTransferRequestsForm=this.fb.group({
      account_name:['',Validators.required],
      bank_name:['',Validators.required],
      iban:['',Validators.required],
      amount:[,Validators.required]
    })

    this.subs.add(this.activatedRoute.queryParams.pipe(
      switchMap((param: any) => {
        if(param['page'] ){
          this.currentPage = Number(param['page']);
      }
        return this.getAllData(param);
      })
    ).subscribe({
      next:res=>{
        this.BalanceTransferRequests=res.data.data
        this.perPage=res.data.per_page
        this.totalPage=res.data.total
        setTimeout(() => {
          this.paginator.changePage(this.currentPage -1 )
        }, 200);
      }
    }));
  }

  @ViewChild('closePoPModal') closePoPModal!: ElementRef<HTMLElement>;
  @ViewChild('createBalanceTransferRequestModel') createBalanceTransferRequestModel!: ElementRef<HTMLElement>;


  openModal() {
    let el: HTMLElement = this.createBalanceTransferRequestModel.nativeElement;
      el.click();
}

closeModalClick() {
  let el: HTMLElement = this.closePoPModal.nativeElement;
  el.click();
}
addBalanceTransferRequest(){
  if(this.addBalanceTransferRequestsForm.valid && this.addBalanceTransferRequestsForm.dirty){
    this.subs.add(this.http.postReq('api/dashboard/orders',this.addBalanceTransferRequestsForm.value).subscribe({
      next:res=>{
    
      },complete:()=>{
        if(this.language=='en'){
          this.toastr.info('Done')
        }
        else{
          this.toastr.info('تم')
        }
        this.closeModalClick()
      }
    }))
  }
  else{
    this.addBalanceTransferRequestsForm.markAllAsTouched()
  }
}


getAllData(filters : any){
  let x :LooseObject ={}; 
  for (const [key , value] of Object.entries(filters) ) {
    // console.log( key ,  value);
    if(value)
      x[key] = value
  }
  let getUrl = 'api/dashboard/orders/index';

 return this.http.getReq(getUrl,{params:x}); 
}

onPageChange(e:any){

  this.currentPage = e.page + 1
  this.router.navigate([], { queryParams: {page: this.currentPage}, queryParamsHandling: 'merge' });
}
}
