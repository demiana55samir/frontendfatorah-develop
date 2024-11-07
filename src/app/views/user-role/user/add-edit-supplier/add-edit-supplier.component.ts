import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { supplier } from '@modules/supplier';
import { ChangeLanguageService } from '@services/changeLanguage.service';
import { HttpService } from '@services/http.service';
import { SubscriptionDataService } from '@services/subscription-data.service';
import { ValidationService } from '@services/validation.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-edit-supplier',
  templateUrl: './add-edit-supplier.component.html',
  styleUrls: ['./add-edit-supplier.component.scss']
})
export class AddEditSupplierComponent implements OnInit {

  addSupplierForm!:FormGroup
  private subs = new Subscription();
  
  uuid:any
  currentProduct:any;
  language:any;
  subscriptioData:any;

  name={
    ar:'',
    en:''
   }
   Type:any
  constructor(private fb:FormBuilder,private toaster:ToastrService,
    private userSubscription:SubscriptionDataService,private validationserv:ValidationService,
    private activeRoute:ActivatedRoute,private router:Router,
    private changeLangua:ChangeLanguageService,private http:HttpService,private toastr:ToastrService) { }

  ngOnInit() {
 
    this.language=this.changeLangua.local_lenguage
    this.userSubscription.GetUserSubscriptionData().subscribe({
      next:res=>{
         this.subscriptioData=res.data
      },complete:()=> {
        if(this.subscriptioData.products==0){
          if(this.language=='ar'){
            this.toastr.error('لقد تخطيت عدد المنتجات المتاحه لك')
        }
        else{
            this.toastr.error('You have exceeded the number of products available to you')
        }
          window.history.back();
        }
      },
    })
    this.addSupplierForm=this.fb.group({
      name:this.fb.group({
        ar: ['',Validators.compose([ Validators.pattern(this.validationserv.textOnly),Validators.required])],
        en: ['',Validators.compose([ Validators.pattern(this.validationserv.textOnly),Validators.required])] 
      }),
      // name:['',Validators.compose([ Validators.pattern(this.validationserv.textOnly),Validators.required])],
      tax_number:[]
    })

    this.Type=String(this.activeRoute.snapshot.paramMap.get('type'))
    this.uuid=String(this.activeRoute.snapshot.paramMap.get('uuid'))
    if(this.Type=='edit'){
      this.getSupplierData()
    }

    
  }

 

  addProduct(){
  
    // let currentName = this.addSupplierForm.get('name.ar')?.value;
    // console.log(currentName);
    // this.addSupplierForm.get('name')?.setValue({
    //   ar: currentName,
    //   en:currentName
    // });

    if(this.addSupplierForm.valid && this.addSupplierForm.dirty){
      // this.name.en=this.addSupplierForm.controls['name'].value
      // this.name.ar=this.addSupplierForm.controls['name'].value
      // this.addSupplierForm.controls['name'].setValue(this.name)
     
      this.subs.add(this.http.postReq('api/dashboard/suppliers',this.addSupplierForm.value).subscribe({
        next:res=>{
          
        },complete:()=>{
          if(this.language=='en'){
            this.toastr.info('Supplier added successfully')
          }
          else{
            this.toastr.info('تمت إضافة المورد بنجاح')
          }
          this.addSupplierForm.reset();
          this.router.navigate(['/user/suppliers-list'])
        },
        error:()=>{
          this.addSupplierForm.controls['name'].setValue(this.name.ar)
        }
      }))
    }
    else{
      this.addSupplierForm.markAllAsTouched()
      if(this.language=='en'){
        this.toaster.info('Please enter Data first')
      }
      else{
        this.toaster.info('الرجاء إدخال البيانات أولاً')
      }
    }
    }


    getSupplierData(){
      this.subs.add(this.http.getReq(`api/dashboard/suppliers/${this.uuid}`).subscribe({
        next:res=>{
          let supplier:supplier = res.data;
          this.addSupplierForm.patchValue(supplier)
          this.addSupplierForm.get('name')?.patchValue({
            ar: supplier.name_ar,
            en: supplier.name_en
          });
        }
      }))
    }
  editProduct(){

    // let currentName = this.addSupplierForm.get('name.ar')?.value;
    // this.addSupplierForm.get('name')?.setValue({
    //   ar: currentName,
    //   en:currentName
    // });

    if(this.addSupplierForm.valid){
      // console.log(JSON.stringify(this.currentProduct) +"-"+JSON.stringify(this.addSupplierForm.value))
      if(JSON.stringify(this.currentProduct) != JSON.stringify(this.addSupplierForm.value)){
        // this.name.en=this.addSupplierForm.controls['name'].value
        // this.name.ar=this.addSupplierForm.controls['name'].value
        // this.addSupplierForm.controls['name'].setValue(this.name)

       
        this.subs.add(this.http.putReq(`api/dashboard/suppliers/${this.uuid}`,this.addSupplierForm.value).subscribe({
          next:res=>{
            
          },complete:()=>{
            if(this.language=='en'){
              this.toastr.info('Supplier details updated successfully')
            }
            else{
              this.toastr.info('تم تعديل بيانات المورد بنجاح')
            }
            this.addSupplierForm.reset();
            this.router.navigate(['/user/suppliers-list'])
          },error:()=>{
            // this.addSupplierForm.controls['name'].setValue(this.name.ar)
          }
        }))
  
      }
      else{
        if(this.language=='en'){
          this.toaster.info('update Data first')
        }
        else{
          this.toaster.info('الرجاء تحديث البيانات أولاً')
        }
      }
    }
    else{
      this.addSupplierForm.markAllAsTouched()
      // this.changeLangua.scrollToTop();
      this.changeLangua.scrollToInvalidInput(this.addSupplierForm);
      if(this.language=='en'){
        this.toaster.info('update Data first')
      }
      else{
        this.toaster.info('الرجاء تحديث البيانات أولاً')
      }
    }
  }
    ngOnDestroy() {
      this.subs.unsubscribe();
    }


}
