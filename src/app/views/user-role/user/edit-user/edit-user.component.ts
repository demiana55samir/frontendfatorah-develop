import cli from '@angular/cli';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { client } from '@models/client';
import { ChangeLanguageService } from '@services/changeLanguage.service';
import { HttpService } from '@services/http.service';
import { ValidationService } from '@services/validation.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
  editClientForm!:FormGroup
  clientStatusChanged = false;
  private subs=new Subscription()
  uuid:any
  client:client={} as client
  language:any
  constructor(private fb:FormBuilder,
    private router:Router,
    private changeLang:ChangeLanguageService,private http:HttpService,
    private validationserv:ValidationService,
    private activeRoute:ActivatedRoute,private toastr:ToastrService) { }
name={
  ar:'',
  en:''
}

 selectedTypes = 1;
  client_types=[
    {
      id:1,
      img:'./assets/images/user/Frame2.svg',
      name_ar:' شركة ',
      name_en:' Organization ',
    },
    {
      id:2,
      img:'./assets/images/user/Frame.svg',
      name_ar:' عميل ',
      name_en:' Client ',
    },
]
  ngOnInit() {
    this.language=this.changeLang.local_lenguage
    this.uuid= String(this.activeRoute.snapshot.paramMap.get('uuid'))
   
    
    this.editClientForm=this.fb.group({
      name:this.fb.group({
        ar: ['',Validators.compose([ Validators.pattern(this.validationserv.textOnly),Validators.required])],
        en: ['',Validators.compose([ Validators.pattern(this.validationserv.textOnly)])] 
      }),

      email: ['',Validators.compose([Validators.email])],
      fax:['',Validators.pattern(this.validationserv.saudiNumber)],
      phone:[null,Validators.pattern(this.validationserv.saudiNumber)],
      mobile:['',Validators.pattern(this.validationserv.saudiNumber)],
      tax_number:['',[Validators.maxLength(15),Validators.minLength(15), Validators.pattern('^[0-9]*$')]],
      postal_code:['',Validators.compose([Validators.required,Validators.pattern(this.validationserv.numerical)]) ],
      commercial_record_number:['',[Validators.required,Validators.minLength(10), Validators.pattern('^[0-9]*$')]],
      address:[''],
      city:['',Validators.required],
      street_name: ['',Validators.required],
      building_number: ['',Validators.required],
      plot_identification: ['',Validators.required],
      region: ['',Validators.required],
    })

    this.getClient(this.uuid);
  }
  getClient(uuid:string){
    this.subs.add(this.http.getReq(`api/dashboard/clients/${uuid}`).subscribe({
      next:res=>{
       this.client=res.data;
       this.editClientForm.patchValue(this.client);
       this.editClientForm.get('name')?.setValue({
         ar: res.data.name_ar,
         en: res.data.name_en
       });

       console.log(this.client.tax_number);
       
       if(!this.client.tax_number || this.client.tax_number?.length == 0){
        this.selectedTypes = 2;
       }
      }
    }))
  }

  editClient(){
    if(this.selectedTypes == 2){
      this.editClientForm.controls['tax_number'].removeValidators(Validators.required)
      this.editClientForm.controls['commercial_record_number'].removeValidators(Validators.required)
      this.editClientForm.controls['street_name'].removeValidators(Validators.required)
      this.editClientForm.controls['building_number'].removeValidators(Validators.required)
      this.editClientForm.controls['plot_identification'].removeValidators(Validators.required)
      this.editClientForm.controls['region'].removeValidators(Validators.required)

      this.editClientForm.controls['tax_number'].setValue(null)
      this.editClientForm.controls['commercial_record_number'].setValue(null)
      this.editClientForm.controls['street_name'].setValue(null)
      this.editClientForm.controls['building_number'].setValue(null)
      this.editClientForm.controls['plot_identification'].setValue(null)
      this.editClientForm.controls['region'].setValue(null)
    }

    if(this.editClientForm.valid){
  
      if(this.editClientForm.dirty || this.clientStatusChanged){
   // this.name.ar=this.editClientForm.controls['name'].value
      // this.name.en=this.editClientForm.controls['name'].value
      // this.editClientForm.controls['name'].setValue(this.name)
      this.subs.add(this.http.putReq(`api/dashboard/clients/${this.uuid}`,this.editClientForm.value).subscribe({
        next:res=>{
          
        },complete:()=>{
         if(this.language=='en'){
           this.toastr.info('client information updated successfully')
         }
         else{
           this.toastr.info('تم تحديث معلومات العميل بنجاح')
         }
         setTimeout( ()=>{
           // window.location.reload();
           this.router.navigate(['/user/users/users-list'])
         }, 1000);
        },error:()=>{
          this.editClientForm.controls['tax_number'].setValidators([Validators.required,Validators.maxLength(15),Validators.minLength(15), Validators.pattern('^[0-9]*$')])
          this.editClientForm.controls['commercial_record_number'].setValidators(Validators.required)
          this.editClientForm.controls['street_name'].setValidators(Validators.required)
          this.editClientForm.controls['building_number'].setValidators(Validators.required)
          this.editClientForm.controls['plot_identification'].setValidators(Validators.required)
          this.editClientForm.controls['region'].setValidators(Validators.required)
        }
       }))
      }
      else{
        if(this.language=='en'){
          this.toastr.warning('Saved Successfully, but without changing any data.')
        }
        else{
          this.toastr.warning('تم الحفظ بنجاح، ولكن دون تغيير في أي بيانات.')
        }
        this.router.navigate(['/user/users/users-list'])
      }
    }
    else{

      if(this.language=='en'){
        this.toastr.error('Please Enter All Required Fields First')
      }
      else{
        this.toastr.error('الرجاء إدخال جميع القيم المطلوبة أولاً')
      }

      this.editClientForm.markAllAsTouched();
      // this.changeLang.scrollToTop();
      this.changeLang.scrollToInvalidInput(this.editClientForm);
      this.editClientForm.controls['tax_number'].setValidators([Validators.required,Validators.maxLength(15),Validators.minLength(15), Validators.pattern('^[0-9]*$')])
      this.editClientForm.controls['commercial_record_number'].setValidators(Validators.required)
      this.editClientForm.controls['street_name'].setValidators(Validators.required)
      this.editClientForm.controls['building_number'].setValidators(Validators.required)
      this.editClientForm.controls['plot_identification'].setValidators(Validators.required)
      this.editClientForm.controls['region'].setValidators(Validators.required)
    }
  }
  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
