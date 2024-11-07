import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@services/auth.service';
import { ChangeLanguageService } from '@services/changeLanguage.service';
import { HttpService } from '@services/http.service';
import { ValidationService } from '@services/validation.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
interface prevData{
  account_name:string,
  city_id: number,
  postal_code:string,
  address:string,
  company_type_id: number,
  business_type_id: number,
  is_taxable:any,
  telephone: string,
  offering: any,
  fax:string,
  tax_number:string,
  capital_money:number
}
@Component({
  selector: 'app-account-details',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.scss']
})
export class AccountDetailsComponent implements OnInit {
  private subs=new Subscription()
  additionalInfoForm!:FormGroup
  OTPForm!:FormGroup
  language:any
  invoices_types=[
    {
      id:1,
      img:'./assets/images/invoices/Tax_invoice.svg',
      name_ar:'فاتورة ضريبية',
      name_en:'Tax invoice',
    },
    {
      id:0,
      img:'./assets/images/invoices/Non-tax_invoice.svg',
      name_ar:'فاتورة غير ضريبية',
      name_en:'Non-tax invoice',
    },
]
sales_type=[
  {
    id:1,
    img:'./assets/images/products/product.svg',
    name_ar:' منتج ',
    name_en:' product ',
    checked:false
  },
  {
    id:2,
    img:'./assets/images/products/service.svg',
    name_ar:' خدمة ',
    name_en:' service ',
    checked:false
  },
]
generalInfo:any=[]
selectedTypes1 = -1;
selectedTypes2 = 1;
selectedTypes3=1;
changed=false
formDataPayLoad1 = new FormData();
logoImage:any
cities:any[]=[]
company_type:any[]=[]
business_types:any[]=[]
prevData:any
accountName={
  ar:'',
  en:''
}

zatcaStages = [
  {
    nameAr:'تجريبية',
    nameEn:'Simulation',
    value:'simulation'
  },
  {
    nameAr:'فعلية',
    nameEn:'Live',
    value:'core'
  }
]
  constructor(private http:HttpService,
    private changeLang:ChangeLanguageService,
    private fb:FormBuilder,
    private auth:AuthService,
    private validationserv:ValidationService,
    private toastr:ToastrService) { }

  ngOnInit() {
    this.language=this.changeLang.local_lenguage
    this.getData()
    this.getGeneralData()
    

    this.OTPForm = this.fb.group({
      // name: ['',Validators.required],
      // trn: ['',Validators.required],
      // crn: ['',Validators.required],
      // street_name: ['',Validators.required],
      // building_number: ['',Validators.required],
      // plot_identification: ['',Validators.required],
      // region: ['',Validators.required],
      // city: ['',Validators.required],
      // postal_number: ['',Validators.required],
      // business_category: ['',Validators.required],
      // common_name: ['',Validators.required],
      // organization_unit_name: ['',Validators.required],
      // organization_name: ['',Validators.required],
      // registered_address: ['',Validators.required],
      // email_address: ['',Validators.required],
      // invoice_type: ['',Validators.required],
      // stage: ['',Validators.required],
      otp: ['',Validators.required],
      zatca_stage: ['',Validators.required]
    });

    this.additionalInfoForm=this.fb.group({
      account_name:this.fb.group({
        ar: ['',Validators.compose([Validators.required])],
        en: ['',Validators.compose([Validators.required])] 
      }),
      city_id: ['',Validators.required],
      postal_code:['',Validators.required],
      address:['',Validators.required],
      company_type_id: ['',Validators.required],
      business_type_id: ['',Validators.required],
      is_taxable: ['',Validators.required],
      offering: [''],
   
      opening_balance :[''],
      fax:['',Validators.pattern(this.validationserv.saudiNumber)],
      telephone:[null,Validators.pattern(this.validationserv.saudiNumber)],

      street_name: ['',Validators.required],
      building_number: ['',Validators.required],
      plot_identification: ['',Validators.required],
      // sub_division_name: ['',Validators.required],

      region: ['',Validators.required],
      commercial_registration_number:['',[Validators.required,Validators.minLength(10), Validators.pattern('^[0-9]*$')]],
      tax_number:['',[Validators.required,Validators.maxLength(15),Validators.minLength(15), Validators.pattern('^[0-9]*$')]],
    })

    this.OTPForm.controls['zatca_stage'].setValue(this.zatcaStages[0].value)
  }
  serviceChecked:any=false
  productChecked:any=false
  getGeneralData(){
    // this.subs.add(this.http.getReq('api/dashboard/settings/general').subscribe({
      this.subs.add(this.http.getReq('api/dashboard/settings/business').subscribe({
      next:res=>{
        this.generalInfo=res.data
        this.additionalInfoForm.get('account_name')?.setValue({
          ar: res.data.account_name,
          en: res.data.account_name
        });
        
        this.auth.setUserObj(res.data)

        if(res?.data?.media?.logo){
          this.logoImage=res?.data?.media?.logo
         }
        this.additionalInfoForm.patchValue(this.generalInfo);
        this.additionalInfoForm.controls['city_id'].setValue(res.data.city.id)
        this.additionalInfoForm.controls['company_type_id'].setValue(res.data.company_type.id)
        this.additionalInfoForm.controls['business_type_id'].setValue(res.data.business_type.id)
        this.selectedTypes1=res.data.is_taxable
        
        if(res.data.offering=='both'){
          this.sales_type[0].checked=true
          this.sales_type[1].checked=true
          this.serviceChecked=true
          this.productChecked=true
        }
        else if(res.data.offering=='service'){
          this.sales_type[1].checked=true
          this.serviceChecked=true
          this.productChecked=false

        }
        else if(res.data.offering=='product'){
          this.sales_type[0].checked=true
          this.productChecked=true
          this.serviceChecked=false


        }
        this.prevData=res.data

        
      }
    }))
  }
  check(index:number){
    this.sales_type[index].checked=!this.sales_type[index].checked
  }
  getData(){
    this.subs.add(this.http.getReq('api/dashboard/settings/cities').subscribe({
      next:res=>{
    this.cities=res.data.data
      }
    }))
    this.subs.add(this.http.getReq('api/dashboard/settings/business_types').subscribe({
      next:res=>{
      this.business_types=res.data.data
      }
    }))
    this.subs.add(this.http.getReq('api/dashboard/settings/company_types').subscribe({
      next:res=>{
      this.company_type=res.data.data
      }
    }))
  }
  validateLogo(event:any) {
    this.formDataPayLoad1.delete('logo')
    let reader = new FileReader();
    const file:File = event.target.files[0];
    if (file) {
      reader.readAsDataURL(file);
        reader.onload = () => {
          this.logoImage = reader.result;
        }
        this.formDataPayLoad1.append("logo", file);
        this.subs.add(this.http.postReq('api/dashboard/settings/upload',this.formDataPayLoad1).subscribe({
          next:res=>{
          },complete:()=>{
            if(this.language=='en'){
              this.toastr.info('Data Updated successfully')
            }
            else{
              this.toastr.info('تم تحديث البيانات بنجاح.')
            }
          }
       }))
    }
  }
  removeMedia(type:string){
    let body={
      collection_name:type
    }
    this.subs.add(this.http.postReq('api/dashboard/settings/clearMediaCollection',body).subscribe({
    next:res=>{
      
    },complete:()=>{
    if(type=='logo'){
      this.logoImage=''
    }
    if(this.language=='en'){
      this.toastr.info('Data Updated successfully')
    }
    else{
      this.toastr.info('تم تحديث البيانات بنجاح.')
    }
    }
    }))
  }
  updateAdditionalData(type:number){
    // if(type==2){
      if(this.additionalInfoForm.controls['account_name'].value != this.prevData.account_name ||
      this.additionalInfoForm.controls['address'].value != this.prevData.address||
      this.additionalInfoForm.controls['city_id'].value != this.prevData.city.id ||
      this.additionalInfoForm.controls['postal_code'].value != this.prevData.postal_code||
      this.additionalInfoForm.controls['company_type_id'].value != this.prevData.company_type.id ||
      this.additionalInfoForm.controls['business_type_id'].value != this.prevData.business_type.id||
      this.additionalInfoForm.controls['fax'].value != this.prevData.fax ||
      this.additionalInfoForm.controls['telephone'].value != this.prevData.telephone||
      this.additionalInfoForm.controls['tax_number'].value != this.prevData.tax_number||
      this.additionalInfoForm.controls['opening_balance'].value != this.prevData.opening_balance||
      this.selectedTypes1 != this.prevData.is_taxable|| 
      this.sales_type[1].checked != this.serviceChecked ||
      this.sales_type[0].checked != this.productChecked 
      ){
        if(this.selectedTypes1!=1){
        
          // this.additionalInfoForm.removeControl('tax_number')
          // this.additionalInfoForm.removeControl('commercial_registration_number')
          // this.additionalInfoForm.removeControl('street_name')
          // this.additionalInfoForm.removeControl('building_number')
          // this.additionalInfoForm.removeControl('plot_identification')
          // this.additionalInfoForm.removeControl('region')

          this.additionalInfoForm.controls['tax_number'].removeValidators(Validators.required)
          this.additionalInfoForm.controls['commercial_registration_number'].removeValidators(Validators.required)
          this.additionalInfoForm.controls['street_name'].removeValidators(Validators.required)
          this.additionalInfoForm.controls['building_number'].removeValidators(Validators.required)
          this.additionalInfoForm.controls['plot_identification'].removeValidators(Validators.required)
          this.additionalInfoForm.controls['region'].removeValidators(Validators.required)

          this.additionalInfoForm.controls['tax_number'].setValue(null)
          this.additionalInfoForm.controls['commercial_registration_number'].setValue(null)
          this.additionalInfoForm.controls['street_name'].setValue(null)
          this.additionalInfoForm.controls['building_number'].setValue(null)
          this.additionalInfoForm.controls['plot_identification'].setValue(null)
          this.additionalInfoForm.controls['region'].setValue(null)
        }

        this.additionalInfoForm.get('account_name')?.setValue({
          ar:  this.additionalInfoForm.get('account_name.ar')?.value,
          en:  this.additionalInfoForm.get('account_name.ar')?.value
        });
        // this.additionalInfoForm.get('account_name.en')?.setValue(this.additionalInfoForm.get('account_name.ar')?.value)

        // this.accountName.ar=this.additionalInfoForm.controls['account_name'].value
        // this.accountName.en=this.additionalInfoForm.controls['account_name'].value
        // this.additionalInfoForm.controls['account_name'].setValue(this.accountName)
        this.additionalInfoForm.controls['is_taxable'].setValue(this.selectedTypes1.toString())

        let saleType: string[]=[]
        if(this.sales_type[1].checked && this.sales_type[0].checked){
          saleType.push("service")
          saleType.push("product")
        }
        else if(this.sales_type[1].checked){
          saleType.push("service")
        }
        else{
          saleType.push("product")
        }
        this.additionalInfoForm.controls['offering'].setValue(saleType)

        this.additionalInfoForm.controls['opening_balance'].setValue(Number(this.additionalInfoForm.controls['opening_balance'].value))
        // this.subs.add(this.http.postReq('api/dashboard/settings/general',this.additionalInfoForm.value).subscribe({
        
       
        if (this.additionalInfoForm.valid) {
          this.subs.add(
            this.http
              .putReq(
                'api/dashboard/settings/business',
                this.additionalInfoForm.value
              )
              .subscribe({
                next: (res) => {
                  this.getGeneralData();
                },
                complete: () => {
                  // const newFormControl = new FormControl('');
                  // this.additionalInfoForm.addControl(
                  //   'tax_number',
                  //   newFormControl
                  // );
                  // this.additionalInfoForm.controls['tax_number'].setValue(
                  //   this.prevData.tax_number
                  // );
                  // this.additionalInfoForm.get('account_name')?.setValue({
                  //   ar:  this.additionalInfoForm.get('account_name.ar')?.value,
                  //   en:  this.additionalInfoForm.get('account_name.ar')?.value
                  // });
                  if (this.language == 'en') {
                    this.toastr.info('Data Updated successfully');
                  } else {
                    this.toastr.info('تم تحديث البيانات بنجاح.');
                  }
                  // this.additionalInfoForm.controls['account_name'].setValue(
                  //   this.accountName.ar
                  // );
                },
                error: () => {
                  // this.additionalInfoForm.get('account_name')?.setValue({
                  //   ar:  this.additionalInfoForm.get('account_name.ar')?.value,
                  //   en:  this.additionalInfoForm.get('account_name.ar')?.value
                  // });
                  // const newFormControl = new FormControl('');
                  // this.additionalInfoForm.addControl(
                  //   'tax_number',
                  //   newFormControl
                  // );
                  this.additionalInfoForm.controls['tax_number'].setValue(this.prevData.tax_number);

                  this.additionalInfoForm.controls['tax_number'].setValidators([Validators.required,Validators.maxLength(15),Validators.minLength(15), Validators.pattern('^[0-9]*$')])
                  this.additionalInfoForm.controls['commercial_registration_number'].setValidators(Validators.required)
                  this.additionalInfoForm.controls['street_name'].setValidators(Validators.required)
                  this.additionalInfoForm.controls['building_number'].setValidators(Validators.required)
                  this.additionalInfoForm.controls['plot_identification'].setValidators(Validators.required)
                  this.additionalInfoForm.controls['region'].setValidators(Validators.required)
                },
              })
          );
        }else{
            if(this.language=='en'){
              this.toastr.error('Please Enter All Required Fields First')
            }
            else{
              this.toastr.error('الرجاء إدخال جميع القيم المطلوبة أولاً')
            }
            this.additionalInfoForm.markAllAsTouched();
            // this.changeLang.scrollToTop();
            this.changeLang.scrollToInvalidInput(this.additionalInfoForm);
        }
      }   
      else{
        if(this.language=='en'){
          this.toastr.error('please update Data first')
        }
        else{
          this.toastr.error('الرجاء تحديث البيانات أولاً')
        }
        this.additionalInfoForm.markAllAsTouched();
        // this.changeLang.scrollToTop();
        this.changeLang.scrollToInvalidInput(this.additionalInfoForm);
        
        this.additionalInfoForm.controls['tax_number'].setValidators([Validators.required,Validators.maxLength(15),Validators.minLength(15), Validators.pattern('^[0-9]*$')])
        this.additionalInfoForm.controls['commercial_registration_number'].setValidators(Validators.required)
        this.additionalInfoForm.controls['street_name'].setValidators(Validators.required)
        this.additionalInfoForm.controls['building_number'].setValidators(Validators.required)
        this.additionalInfoForm.controls['plot_identification'].setValidators(Validators.required)
        this.additionalInfoForm.controls['region'].setValidators(Validators.required)
      }
    // }
    // if(type==2){
    //   if(this.additionalInfoForm.controls['company_type_id'].value != this.prevData.company_type.id ||
    //   this.additionalInfoForm.controls['business_type_id'].value != this.prevData.business_type.id||
    //   this.additionalInfoForm.controls['fax'].value != this.prevData.fax ||
    //   this.additionalInfoForm.controls['telephone'].value != this.prevData.telephone||
    //   this.additionalInfoForm.controls['tax_number'].value != this.prevData.tax_number||
    //   this.selectedTypes1 != this.prevData.is_taxable|| 
    //   this.sales_type[1].checked != this.serviceChecked ||
    //   this.sales_type[0].checked != this.productChecked 

    //   ){
    //     this.accountName.ar=this.additionalInfoForm.controls['account_name'].value
    //     this.accountName.en=this.additionalInfoForm.controls['account_name'].value
    //     this.additionalInfoForm.controls['account_name'].setValue(this.accountName)
    //     this.additionalInfoForm.controls['is_taxable'].setValue(this.selectedTypes1)
    //     let saleType: string[]=[]
    //     if(this.sales_type[1].checked && this.sales_type[0].checked){
    //       // saleType=["service,product"]
    //       saleType.push("service")
    //       saleType.push("product")
    //     }
    //     else if(this.sales_type[1].checked){
    //       // saleType=["service"]
    //       saleType.push("service")
    //     }
    //     else{
    //       saleType.push("product")
    //     }
    //     this.additionalInfoForm.controls['offering'].setValue(saleType)
    //     let cardData2={
    //       'company_type_id': this.additionalInfoForm.controls['company_type_id'].value,
    //       'business_type_id': this.additionalInfoForm.controls['business_type_id'].value,
    //       'is_taxable': this.additionalInfoForm.controls['is_taxable'].value,
    //       'telephone': this.additionalInfoForm.controls['telephone'].value,
    //       'offering': this.additionalInfoForm.controls['offering'].value,
    //       'fax':this.additionalInfoForm.controls['fax'].value,
    //       'tax_number':this.additionalInfoForm.controls['tax_number'].value,
    //     }

    //     this.subs.add(this.http.putReq('api/dashboard/settings/general',cardData2).subscribe({
    //       next:res=>{
    
    //       },complete:()=>{
    //         this.toastr.info('Data Updated Successfully')
    //       },error:()=>{
    //         this.additionalInfoForm.controls['account_name'].setValue(this.accountName.ar)
    //       }
    //     }))
    //   }
    //   else{
    //     this.toastr.error('Please Update Data First')
    //   }
    // }
  }

  sendOTP(){
    if(this.additionalInfoForm.valid){
      if(this.OTPForm.valid){
        this.subs.add(this.http.postReq('api/dashboard/settings/zatca',this.OTPForm.value).subscribe({
          next:(res)=>{
            if(this.language=='en'){
              this.toastr.success('Zatca OTP has been activated successfully')
            }
            else{
              this.toastr.success('تم تنشيط رمز التحقق لهيئة الزكاة بنجاح')
            }

            // this.toastr.success(res?.message)
         
            
          },
          error:(err)=>{
            console.log(err);
            
          }
        }));
      }else{
        if(this.language=='en'){
          this.toastr.error('please Enter OTP')
        }
        else{
          this.toastr.error(' الرجاء ادخال رمز التحقق')
        }
        this.OTPForm.markAllAsTouched();
      }
    }else{
      if(this.language=='en'){
        this.toastr.error('Please check all the required fields.');
      }
      else{
        this.toastr.error('يرجى التحقق من جميع الحقول المطلوبة');
      }
      this.additionalInfoForm.markAllAsTouched();
      // this.changeLang.scrollToTop();
      this.changeLang.scrollToInvalidInput(this.additionalInfoForm);
    }
    
    
  }
}
