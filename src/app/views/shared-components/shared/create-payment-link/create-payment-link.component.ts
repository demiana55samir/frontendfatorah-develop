import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ChangeLanguageService } from '@services/changeLanguage.service';
import { HttpService } from '@services/http.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-create-payment-link',
  templateUrl: './create-payment-link.component.html',
  styleUrls: ['./create-payment-link.component.scss']
})
export class CreatePaymentLinkComponent implements OnInit ,OnDestroy {
  selectedValues1!:boolean
  selectedValues2!:boolean
  @Input() invoiceUuid!:string
  paymentLinkDataForm!:FormGroup
  private subs=new Subscription()
  language:any
  constructor(private fb:FormBuilder,private http:HttpService,private changeLang:ChangeLanguageService,private toastr:ToastrService) { }

  ngOnInit() {
    this.language=this.changeLang.local_lenguage
    this.paymentLinkDataForm=this.fb.group({
      payment_for:[''],
      partial_payment_allowed :[''],
      email:[''],
      amount:[''],
      expiry_days:['']
    })
    
  }
    @ViewChild('createLinkModel') createLinkModel!: ElementRef<HTMLElement>;
    openModal() {
      let el: HTMLElement = this.createLinkModel.nativeElement;
        el.click();
  }
  openCreateLinkModel(){
    this.openModal()
  }
  resetForm(){
    let el: HTMLElement = this.createLinkModel.nativeElement;
    el.click();
    this.paymentLinkDataForm.reset()
  }
  
  checkActive(index:number){
    if(index===1 && this.selectedValues2){
    this.selectedValues2=false
    }
    if(index===2 && this.selectedValues1){
    this.selectedValues1=false
    }
      }

      createPaymentLink(){
        if(this.paymentLinkDataForm.valid && this.paymentLinkDataForm.dirty){
          this.subs.add(this.http.postReq(`api/dashboard/invoices/${this.invoiceUuid}/generateLink`,this.paymentLinkDataForm.value).subscribe({
            next:res=>{

            },
            complete:()=>{
              if(this.language=='en'){
                this.toastr.info('Payment link added successfully')
              }
              else{
                this.toastr.info('تمت إضافة رابط الدفع بنجاح.')
              }
              this.openModal()
            }
          }))
        }
        else{
          this.paymentLinkDataForm.markAllAsTouched()
        }
      }
      ngOnDestroy(): void {
        this.subs.unsubscribe()
      }
}
