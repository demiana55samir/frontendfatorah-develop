import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ChangeLanguageService } from '@services/changeLanguage.service';
import { HttpService } from '@services/http.service';
import { SubscriptionDataService } from '@services/subscription-data.service';
import { ValidationService } from '@services/validation.service';
import { ToastrService } from 'ngx-toastr';
import {MenuItem} from 'primeng/api';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-add-new-user',
  templateUrl: './add-new-user.component.html',
  styleUrls: ['./add-new-user.component.scss']
})
export class AddNewUserComponent implements OnInit {
  items=[{label:"عربي"},{label:"انجليزي"}]
  activeItem!: MenuItem;
  addClientForm!:FormGroup
  // name={
  //   ar:'',
  //   en:''
  // }
  language:any
  subscriptioData:any
  private subs = new Subscription();


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

  constructor(private fb:FormBuilder,private userSubscription:SubscriptionDataService,private validationserv:ValidationService,private changeLang:ChangeLanguageService,private router:Router,private http:HttpService,private activatedRoute: ActivatedRoute,private toastr:ToastrService) { }

  ngOnInit() {
    this.language=this.changeLang.local_lenguage
    this.userSubscription.GetUserSubscriptionData().subscribe({
      next:res=>{
         this.subscriptioData=res.data
      },complete:()=> {
        if(this.subscriptioData.clients==0){
          if(this.language=='ar'){
            this.toastr.error('لقد تخطيت عدد العملاء المتاحه لك')
        }
        else{
            this.toastr.error('You have exceeded the number of clients available to you')
        }
          window.history.back();
          // window.location.reload()
        }
      },
    })
    this.addClientForm=this.fb.group({
      // name:['',Validators.required],
      name:this.fb.group({
        ar: ['',Validators.compose([ Validators.pattern(this.validationserv.textOnly),Validators.required])],
        en: [null,Validators.compose([ Validators.pattern(this.validationserv.textOnly)])] 
      }),

      email: ['',Validators.compose([Validators.email])],
      fax:['',Validators.pattern(this.validationserv.saudiNumber)],
      phone:[null,Validators.pattern(this.validationserv.saudiNumber)],
      mobile:['',Validators.pattern(this.validationserv.saudiNumber)],
      tax_number:['',[Validators.required,Validators.maxLength(15),Validators.minLength(15), Validators.pattern('^[0-9]*$')]],
      postal_code:['',Validators.compose([Validators.required,Validators.pattern(this.validationserv.numerical)]) ],
      commercial_record_number:['',[Validators.required,Validators.minLength(10), Validators.pattern('^[0-9]*$')]],
      address:[''],
      city:['',Validators.required],

      street_name: ['',Validators.required],
      building_number: ['',Validators.required],
      plot_identification: ['',Validators.required],
      region: ['',Validators.required],

    })
    this.activeItem=this.items[0]
  }
  newUuid:any
addClient(){
  // console.log(this.addClientForm);
  if(this.selectedTypes == 2){
    // this.addClientForm.removeControl('tax_number');
    // this.addClientForm.removeControl('commercial_record_number');
    // this.addClientForm.removeControl('street_name');
    // this.addClientForm.removeControl('building_number');
    // this.addClientForm.removeControl('plot_identification');
    // this.addClientForm.removeControl('region');

    this.addClientForm.controls['tax_number'].removeValidators(Validators.required)
    this.addClientForm.controls['commercial_record_number'].removeValidators(Validators.required)
    this.addClientForm.controls['street_name'].removeValidators(Validators.required)
    this.addClientForm.controls['building_number'].removeValidators(Validators.required)
    this.addClientForm.controls['plot_identification'].removeValidators(Validators.required)
    this.addClientForm.controls['region'].removeValidators(Validators.required)

    this.addClientForm.controls['tax_number'].setValue(null)
    this.addClientForm.controls['commercial_record_number'].setValue(null)
    this.addClientForm.controls['street_name'].setValue(null)
    this.addClientForm.controls['building_number'].setValue(null)
    this.addClientForm.controls['plot_identification'].setValue(null)
    this.addClientForm.controls['region'].setValue(null)

  }
  if(this.addClientForm.valid && this.addClientForm.dirty){
  
    this.subs.add(this.http.postReq('api/dashboard/clients',this.addClientForm.value).subscribe({
      next:res=>{
       this.newUuid=res?.data?.uuid
      },complete:()=>{
        if(this.language=='en'){
          this.toastr.info('client added successfully')
        }
        else{
          this.toastr.info('تمت إضافة العميل بنجاح.')
        }
        // this.addClientForm.reset()
        this.router.navigate(['/user/users/user-details/',this.newUuid])
      },error:()=>{
        // this.addClientForm.addControl('tax_number',[Validators.maxLength(15),Validators.minLength(15), Validators.pattern('^[0-9]*$')])
        // this.addClientForm.addControl('commercial_record_number',[])
        // this.addClientForm.addControl('street_name',Validators.required)
        // this.addClientForm.addControl('building_number',Validators.required)
        // this.addClientForm.addControl('plot_identification',Validators.required)
        // this.addClientForm.addControl('region',Validators.required)

        this.addClientForm.controls['tax_number'].setValidators([Validators.required,Validators.maxLength(15),Validators.minLength(15), Validators.pattern('^[0-9]*$')])
        this.addClientForm.controls['commercial_record_number'].setValidators(Validators.required)
        this.addClientForm.controls['street_name'].setValidators(Validators.required)
        this.addClientForm.controls['building_number'].setValidators(Validators.required)
        this.addClientForm.controls['plot_identification'].setValidators(Validators.required)
        this.addClientForm.controls['region'].setValidators(Validators.required)
      }
    }))
  }
  else{
    if(this.language=='en'){
      this.toastr.error('Please check all the required fields.');
    }
    else{
      this.toastr.error('يرجى التحقق من جميع الحقول المطلوبة');
    }
    this.addClientForm.markAllAsTouched();
    // this.changeLang.scrollToTop();
    this.changeLang.scrollToInvalidInput(this.addClientForm);
    // this.addClientForm.addControl('tax_number',[Validators.maxLength(15),Validators.minLength(15), Validators.pattern('^[0-9]*$')])
    // this.addClientForm.addControl('commercial_record_number',[])
    // this.addClientForm.addControl('street_name',Validators.required)
    // this.addClientForm.addControl('building_number',Validators.required)
    // this.addClientForm.addControl('plot_identification',Validators.required)
    // this.addClientForm.addControl('region',Validators.required)

    this.addClientForm.controls['tax_number'].setValidators([Validators.required,Validators.maxLength(15),Validators.minLength(15), Validators.pattern('^[0-9]*$')])
    this.addClientForm.controls['commercial_record_number'].setValidators(Validators.required)
    this.addClientForm.controls['street_name'].setValidators(Validators.required)
    this.addClientForm.controls['building_number'].setValidators(Validators.required)
    this.addClientForm.controls['plot_identification'].setValidators(Validators.required)
    this.addClientForm.controls['region'].setValidators(Validators.required)
  }
}

ngOnDestroy() {
  this.subs.unsubscribe();
}
}
