import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { bank } from '@models/bank';
import { userInvoice } from '@modules/user-invoices';
import { ChangeLanguageService } from '@services/changeLanguage.service';
import { HttpService } from '@services/http.service';
import { ToastrService } from 'ngx-toastr';
import {MenuItem} from 'primeng/api';
import { Subscription, pipe } from 'rxjs';
import {Location} from '@angular/common';
const datePipe = new DatePipe('en-EG');



@Component({
  selector: 'app-Add-receipt-voucher',
  templateUrl: './Add-receipt-voucher.component.html',
  styleUrls: ['./Add-receipt-voucher.component.scss']
})
export class AddReceiptVoucherComponent implements OnInit {
  activeItem!: MenuItem;
  options=[{name:'item1'},{name:'item1'},{name:'item1'}]
  //dropdown data
  paymentType=[
    { 
      name_ar:'نقداً',
      name_en:'cash',
      name:'cash'
    },
    { 
      name_ar:'حوالة بنكية',
      name_en:'Bank transfer',
      name:'bank_transfer'
    },
    { 
      name_ar:'شيك',
      name_en:'Cheque',
      name:'cheque'
    },
    { 
      name_ar:'تحويل إلكتروني',
      name_en:'Electronic transfer',
      name:'visa_card'
    },
    { 
      name_ar:'مقاصة',
      name_en:'Clearing',
      name:'clearing'
    },
   
  ]
  // { 
  //   name_ar:'فيزا',
  //   name_en:'Visa'
  // },
  banks!:bank[]
  uuid!:string
  addVoucherForm!:FormGroup
  private subs=new Subscription()
  description={
    en:'',
    ar:''
  }
  notes={
    en:'',
    ar:''
  }
  invoiceDate!:Date;

  totalInvoice = 0;
  paidInvoice = 0;
  unpaidInvoice = 0;

  Allinvoices:userInvoice[] = []
  constructor(private activeRoute:ActivatedRoute,private router:Router,
    private _location: Location,
    private changeLang:ChangeLanguageService,private http:HttpService,private fb:FormBuilder,private toastr:ToastrService) { }
language:any
  ngOnInit() {
    this.language=this.changeLang.local_lenguage
    this.addVoucherForm=this.fb.group({
      number:['',Validators.required],
      bank_id:[''],
      invoice_uuid:['',Validators.required],
      amount:['',Validators.required],
      payment_method:['',Validators.required],
      received_at:['',Validators.required],
   
      description:this.fb.group({
        ar: [''],
        en: [''] 
      }),

      notes:this.fb.group({
        ar: [''],
        en: [''] 
      }),
 
    })
    this.uuid= String(this.activeRoute.snapshot.paramMap.get('uuid'))
    if(this.uuid == '-1'){
      this.getAllInvoices();
    }else{
      this.checkPermission(this.uuid)
      this.getData()
      this.getRecietNumber()
    }
   
  }
  checkPermission(invoiceUuid:any){
    let invoice:any
     this.subs.add(this.http.getReq(`api/dashboard/invoices/${String(invoiceUuid)}`).subscribe({
      next:res=>{
        invoice=res.data
        this.totalInvoice = res.data?.total;
        this.paidInvoice = res?.data?.paid;
        this.unpaidInvoice = res?.data?.unpaid;
        
         const newLocal = this;
        newLocal.invoiceDate = res.data.date;
        this.invoiceDate = new Date(this.changeLang.getSaudiDate(res.data.date))

      },complete:()=>{
        if(invoice.total==invoice.paid){
          if(this.language=='ar'){
            this.toastr.error('لا يمكنك انشاء سند قبض لهذة الفاتورة')
        }
        else{
            this.toastr.error('You cannot create a receipt voucher for this invoice')
        }
          window.history.back();
        }
      }
     }))
  }
  checkNegativeValue(){
    if(Number(this.addVoucherForm.controls['amount'].value)<0){
      this.changeLang.scrollToTop();
      // this.changeLang.scrollToInvalidInput(this.addVoucherForm);
      this.addVoucherForm.controls['amount'].setValue(0)
      if(this.language=='en'){
        this.toastr.error('Invalid Value for Price')
      }
      else{
        this.toastr.error('قيمة غير صالحة للسعر')
      }
    }
    
  }
  addVoucher(){
    this.addVoucherForm.controls['invoice_uuid'].setValue(this.uuid)
    if( this.addVoucherForm.controls['amount'].value){
      this.addVoucherForm.controls['amount'].setValue(Number(this.addVoucherForm.controls['amount'].value))
    }
    if(this.addVoucherForm.valid){
      let prevdate = this.addVoucherForm.controls['received_at'].value
      this.addVoucherForm.controls['received_at'].setValue(datePipe.transform(prevdate, 'yyyy-MM-dd'))
      // this.description.ar=this.addVoucherForm.controls['description'].value
      // this.description.en=this.addVoucherForm.controls['description'].value

      const descriptionArValue = this.addVoucherForm.get('description.ar')?.value;
      this.addVoucherForm.get('description')?.patchValue({
        ar:  descriptionArValue,
        en:  descriptionArValue
      });

      const notesArValue = this.addVoucherForm.get('notes.ar')?.value;
      this.addVoucherForm.get('notes')?.patchValue({
        ar:  notesArValue,
        en:  notesArValue
      });

      // this.notes.ar=this.addVoucherForm.controls['notes'].value
      // this.notes.en=this.addVoucherForm.controls['notes'].value
      // this.addVoucherForm.controls['notes'].setValue(this.notes)
      // this.addVoucherForm.controls['description'].setValue(this.description)
      this.subs.add(this.http.postReq(`api/dashboard/invoices/${this.uuid}/receipts`,this.addVoucherForm.value).subscribe({
        next:res=>{
        },
        complete:()=>{
          this.addVoucherForm.reset()
          if(this.language=='en'){
            this.toastr.info('added sucessfully')
          }
          else{
            this.toastr.info('تمت الإضافة بنجاح')
          }
          this.router.navigate(['/user/invoices/All-receipt-voucher'])
        },error:()=>{
          this.addVoucherForm.controls['notes'].setValue(this.notes.ar)
          this.addVoucherForm.controls['description'].setValue(this.description.ar)
          this.addVoucherForm.controls['received_at'].setValue(prevdate)

        }

      }))
    }
    else{
      if(this.language=='en'){
        this.toastr.error('Please Enter All Required Fields First')
      }
      else{
        this.toastr.error('الرجاء إدخال جميع القيم المطلوبة أولاً')
      }
      this.addVoucherForm.markAllAsTouched();
      // this.changeLang.scrollToTop();
      this.changeLang.scrollToInvalidInput(this.addVoucherForm);
    }
  }
  disable:any
  getRecietNumber(){
    this.subs.add(this.http.getReq(`api/dashboard/invoices/${this.uuid}/receipts/create`).subscribe({
      next:res=>{
        this.addVoucherForm.controls['number'].setValue(res.data.receipt_number)
        // console.log(this.addVoucherForm.controls['number'].value)
      },complete:()=>{
        this.disable=true
      }
    }))
  }

  getData(){
    this.subs.add(this.http.getReq('api/dashboard/settings/banks').subscribe({
      next:res=>{
        this.banks=res.data
      }
    }))
  }



  getAllInvoices(){
    let getUrl = 'api/dashboard/invoices';
    this.http.getReq(getUrl).subscribe({
      next:res=>{
        this.Allinvoices = res.data
      },
      complete:()=>{
        this.openModal()
      }
    }); 
 }

 chooseInovice(e:any){
  this.uuid = String(e.value);
  // this.getInvoiceDetails(this.uuid)
 }


 @ViewChild('InvoiceModal') InvoiceModal!: ElementRef<HTMLElement>;
  openModal() {
      let el: HTMLElement = this.InvoiceModal.nativeElement;
      el.click();
  }

  @ViewChild('closeModal') closeModal!: ElementRef<HTMLElement>;
  closeModalClick() {
      let el: HTMLElement = this.InvoiceModal.nativeElement;
      el.click();
  }
  ChooseInvoiceNumber(){
    if(this.uuid != '-1'){
      // this.getInvoiceDetails(this.uuid)

      this.checkPermission(this.uuid)
      this.getData()
      this.getRecietNumber()
      
      this.closeModalClick()
      this.router.navigateByUrl('/user/invoices/add-voucher/'+this.uuid);
    }
    
  }

  Back(){
    this._location.back();
  }
  
}
