import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ChangeLanguageService } from '@services/changeLanguage.service';
import { HttpService } from '@services/http.service';
import { ValidationService } from '@services/validation.service';
import { CountryISO, PhoneNumberFormat ,SearchCountryField } from 'ngx-intl-tel-input';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

interface user{
  name: string,
  email:string,
  phone: string,
  status:any,
  role:number,
  is_banned:any
}
@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
  addUserForm!:FormGroup
  showPassword:boolean=false
  language:any
  separateDialCode = false;
SearchCountryField = SearchCountryField;
CountryISO = CountryISO;
PhoneNumberFormat = PhoneNumberFormat;
preferredCountries: CountryISO[] = [CountryISO.Egypt];
phone:any
roles:any
type:any
userUuid:any
user:any
prevUser:user={} as user
private subs=new Subscription()
btnColor:any = '#6759FF'

primaryColor:any ='';

  constructor(private fb:FormBuilder,private activeRoute:ActivatedRoute,private router:Router,private ValidationSer:ValidationService,
    private changeLanguag:ChangeLanguageService,private http:HttpService,
    private toastr:ToastrService) { }

  ngOnInit() {
    if( localStorage.getItem('primaryColor') ){
      this.primaryColor = localStorage.getItem('primaryColor');
    }
    this.btnColor = (localStorage.getItem('primaryColor')) ? localStorage.getItem('primaryColor') :'#6759FF'

    this.getRoles()
    this.language=this.changeLanguag.local_lenguage
    this.type = String(this.activeRoute.snapshot.paramMap.get('type'))
    this.userUuid = String(this.activeRoute.snapshot.paramMap.get('uuid'))
    if(this.type=='update'){
      this.getUserData(this.userUuid)
    }
    this.addUserForm=this.fb.group({
      name: ['',Validators.required],
      email: ['',Validators.compose([Validators.required,Validators.email])],
      phone: ['',Validators.compose([Validators.required,Validators.minLength(9)])],
      phoneObj: ['',Validators.compose([Validators.required])],
      password: ['',Validators.pattern(this.ValidationSer.passwordGeneral)],
      status: [''],
      role: [''],
      is_banned:['']
    })

  }
  phoneObj:any
  addUser(){
    if(this.addUserForm.dirty){
      if(this.addUserForm.controls['phoneObj'].value){
        this.phoneObj=this.addUserForm.controls['phoneObj'].value
        this.phone=this.addUserForm.controls['phoneObj'].value
        this.phone = this.phone.e164Number.replace("+", "")
        this.addUserForm.controls['phone'].setValue(this.phone)
        this.addUserForm.removeControl('phoneObj');
      }
  
      if(this.addUserForm.controls['is_banned'].value){
        if(this.addUserForm.controls['is_banned'].value==true){
        this.addUserForm.controls['is_banned'].setValue(1)
        }
        else{
        this.addUserForm.controls['is_banned'].setValue(0)
        }
      }

      if(this.addUserForm.valid){

        this.subs.add(this.http.postReq('api/admin/users',this.addUserForm.value).subscribe({
          next:res=>{
          //  this.newUuid=res?.data?.uuid
          },complete:()=>{
            if(this.language=='en'){
              this.toastr.info('User added successfully')
            }
            else{
              this.toastr.info('تمت إضافة المستخدم بنجاح.')
            }
            this.addUserForm.reset()

               this.router.navigate(['/admin/users/All-users/'])
            
          },error:()=>{
            const newFormControl = new FormControl('');
            this.addUserForm.addControl('phoneObj',newFormControl); 
            this.addUserForm.controls['phoneObj'].setValue(this.phoneObj)
          }
        }))
      }
      else{
        this.addUserForm.markAllAsTouched();
        // this.changeLanguag.scrollToTop();
        this.changeLanguag.scrollToInvalidInput(this.addUserForm);

        if(this.language=='en'){
          this.toastr.info('update Data first')
        }
        else{
          this.toastr.info('الرجاء تحديث البيانات أولاً')
        }
      }

    }
   else{
        this.addUserForm.markAllAsTouched()
        if(this.language=='en'){
          this.toastr.info('update Data first')
        }
        else{
          this.toastr.info('الرجاء تحديث البيانات أولاً')
        }
      }
      

  }

  getRoles(){
    this.subs.add(this.http.getReq('api/admin/roles').subscribe({
      next:res=>{
        this.roles=res.data
      }
    }))
  }

  roleId = -1;
  //update user
  editUserData(){

    if(this.addUserForm.touched){
      if(this.addUserForm.controls['phoneObj'].value){
        this.phoneObj=this.addUserForm.controls['phoneObj'].value
        this.phone=this.addUserForm.controls['phoneObj'].value
        this.phone = this.phone.e164Number.replace("+", "")
        this.addUserForm.controls['phone'].setValue(this.phone)
        this.addUserForm.removeControl('phoneObj');
      }
  
        if(this.addUserForm.controls['is_banned'].value==true){
          // console.log('in')
          this.addUserForm.controls['is_banned'].setValue(1)
        }else{
          this.addUserForm.controls['is_banned'].setValue(0)
        }
    
        if(this.addUserForm.valid){
          if( this.addUserForm.controls['password'].value == "" || this.addUserForm.controls['password'].value.length == 0 ){
            this.addUserForm.removeControl('password')
          }

          if(JSON.stringify(this.addUserForm.value) != JSON.stringify(this.prevUser)){
            this.subs.add(this.http.putReq(`api/admin/users/${this.userUuid}`,this.addUserForm.value).subscribe({
              next:res=>{
              //  this.newUuid=res?.data?.uuid
              },complete:()=>{
                if(this.language=='en'){
                  this.toastr.info('User Edited successfully')
                }
                else{
                  this.toastr.info('تم تعديل المستخدم بنجاح.')
                }
                this.addUserForm.reset()
     
                if(this.roleId == 1 ){
                  this.router.navigate(['/admin/users/All-administrative-users'])
                }else{
                   this.router.navigate(['/admin/users/All-users/'])
                }
              },error:()=>{
                const newFormControl = new FormControl('');
                this.addUserForm.addControl('phoneObj',newFormControl); 
                this.addUserForm.controls['phoneObj'].setValue(this.phoneObj)
              }
            }))
  
          }else{
            const newFormControl = new FormControl('');
                this.addUserForm.addControl('phoneObj',newFormControl); 
                this.addUserForm.controls['phoneObj'].setValue(this.phoneObj)
            if(this.language=='en'){
              this.toastr.error('please update Data first')
            }
            else{
              this.toastr.error('الرجاء تحديث البيانات أولاً')
            }
          }
  
        }
        else{
          this.addUserForm.markAllAsTouched()
          if(this.language=='en'){
            this.toastr.error('please update Data first')
          }
          else{
            this.toastr.error('الرجاء تحديث البيانات أولاً')
          }
        }
    }else{
      if(this.language=='en'){
        this.toastr.error('please update Data first')
      }
      else{
        this.toastr.error('الرجاء تحديث البيانات أولاً')
      }
    }
    
  }

  getUserData(uuid:string){
    this.subs.add(this.http.getReq(`api/admin/users/${uuid}`).subscribe({
      next:res=>{
        // console.log(res.user);
        
        this.user=res.data
        this.addUserForm.patchValue(this.user)
        this.prevUser.name=res.data.name
        this.prevUser.email=res.data.email
        this.prevUser.phone=res.data.phone
        if(res.data.verified_at){
          this.addUserForm.controls['status'].setValue(1)
          this.prevUser.status=1
        }else{
          this.addUserForm.controls['status'].setValue(0)
          this.prevUser.status=0
        }
        this.prevUser.role=res.data.role_id
        if(res.data.is_banned==true){
          this.addUserForm.controls['is_banned'].setValue(1)
          this.prevUser.is_banned=1
        }
        else{
          this.addUserForm.controls['is_banned'].setValue(0)

          this.prevUser.is_banned=0
        }
        let phone=res.data.phone.replace('966','')
        this.addUserForm.controls['phoneObj'].setValue(phone)
        this.addUserForm.controls['role'].setValue(res.data.role_id)
        this.roleId = res.data.role_id;
        this.addUserForm.controls['password'].setValue('')

        this.addUserForm.markAsUntouched()
      }
    }))
  }

  
}
