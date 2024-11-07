import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@services/auth.service';
import { ChangeLanguageService } from '@services/changeLanguage.service';
import { HttpService } from '@services/http.service';
import { ValidationService } from '@services/validation.service';
import { ToastrService } from 'ngx-toastr';
import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';

export interface userData{
  name:string,
  phone:string,
  email:string
}

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  showCurrentPassword!: boolean;
  showNewPassword!: boolean;
  showNewPasswordConf!: boolean;

  //tabs
  activeItem!: MenuItem;
  items=[{label:'الملف الشخصي',command: (event:any) => {
    this.activeItem=this.items[0]
    this.changePasswordForm.reset()
  }}
  ,{label:'تغيير كلمة المرور',command: (event:any) => {
    this.activeItem=this.items[1]
  }}
]

//profile image
editProfileForm!:FormGroup
formDataPayLoad = new FormData();
profilePhoto:any=''

private subs=new Subscription()
user:any
userDataObject!:userData
currentUserObject!:userData

//change password

changePasswordForm!:FormGroup

  constructor(private fb:FormBuilder,private changelang:ChangeLanguageService,private auth:AuthService,private http:HttpService,private toastr:ToastrService,private ValidationSer:ValidationService) { }
language:any
  ngOnInit() {
    this.language=this.changelang.local_lenguage
    if(this.language=='en'){
      this.items[0].label="Profile",
      this.items[1].label="Change Password"
    }
    this.activeItem=this.items[0]
    this.editProfileForm=this.fb.group({
      name:[''],
      number:[''],
      email:['']
    })
    this.changePasswordForm=this.fb.group({
      current_password:['',Validators.required], 
      new_password:['',[Validators.compose([Validators.required,Validators.pattern(this.ValidationSer.passwordGeneral)])]],
      new_password_confirmation:['',Validators.required]
    },
    {
      validator: this.ValidationSer.confirmPasswordMismatchacc
    })
    this.getGeneralData()
  }
  validateProfileImage(event:any) {
    this.formDataPayLoad.delete('avatar')
    let reader = new FileReader();
    const file:File = event.target.files[0];
    if (file) {
      reader.readAsDataURL(file);
        reader.onload = () => {
          this.profilePhoto = reader.result;
        }
        this.formDataPayLoad.append("avatar", file);
        this.subs.add(this.http.postReq('api/dashboard/settings/upload',this.formDataPayLoad).subscribe({
          next:res=>{
            this.user.media.avatar=this.profilePhoto
            localStorage.setItem('UserObj',JSON.stringify(this.user))
            window.location.reload()

          }
       }))
    }
  }
  getGeneralData(){
    this.subs.add(this.http.getReq('api/dashboard/settings/general').subscribe({
      next:res=>{
        this.user=res.data
        // console.log(this.user)
        if(this.user){
          this.editProfileForm.controls['name'].setValue(this.user.name)
          this.editProfileForm.controls['number'].setValue(this.user.phone)
          this.editProfileForm.controls['email'].setValue(this.user.email)
     
          this.userDataObject={
           'name':this.editProfileForm.controls['name'].value,
           'phone':this.editProfileForm.controls['number'].value,
           'email':this.editProfileForm.controls['email'].value,
          }
        }
      }
    }))
  }
  getUserProfile(){
   this.user=this.auth.getUserObj()
  //  console.log(this.user)
   if(this.user){
     this.editProfileForm.controls['name'].setValue(this.user.name)
     this.editProfileForm.controls['number'].setValue(this.user.phone)
     this.editProfileForm.controls['email'].setValue(this.user.email)

     this.userDataObject={
      'name':this.editProfileForm.controls['name'].value,
      'phone':this.editProfileForm.controls['number'].value,
      'email':this.editProfileForm.controls['email'].value,
     }
   }

  }
  editProfile(){
   this.currentUserObject={
    'name':this.editProfileForm.controls['name'].value,
    'phone':this.editProfileForm.controls['number'].value,
    'email':this.editProfileForm.controls['email'].value,
   }
   if(JSON.stringify(this.currentUserObject) != JSON.stringify(this.userDataObject)){
    this.subs.add(this.http.putReq('api/dashboard/account/profile',this.currentUserObject).subscribe({
      next:res=>{

      },complete:()=>{
        this.user.name=this.editProfileForm.controls['name'].value
        this.user.phone=this.editProfileForm.controls['number'].value
        this.user.email=this.editProfileForm.controls['email'].value
        if(this.language=='en'){
          this.toastr.info('Data Updated successfully')
        }
        else{
          this.toastr.info('تم تحديث البيانات بنجاح.')
        }
        localStorage.setItem('UserObj',JSON.stringify(this.user))

      }
    }))
   }
   else{
    if(this.language=='en'){
      this.toastr.error('update Data first')
    }
    else{
      this.toastr.error('الرجاء تحديث البيانات أولاً')
    }
   }
  }

  changePassword(){
    if(this.changePasswordForm.valid && this.changePasswordForm.dirty){
      this.subs.add(this.http.putReq('api/dashboard/account/change_password',this.changePasswordForm.value).subscribe({
       next:res=>{
   
       },complete:()=>{
        if(this.language=='en'){
          this.toastr.info('Password changed sucessfully')
        }
        else{
          this.toastr.info('تم تغيير كلمة المرور بنجاح.')
        }
         this.changePasswordForm.reset()
       }
      }))
    }
    else{
      this.changePasswordForm.markAllAsTouched()
    }
  }

  removeMedia(type:string){
    let body={
      collection_name:type
    }
    this.subs.add(this.http.postReq('api/dashboard/settings/clearMediaCollection',body).subscribe({
    next:res=>{

    },complete:()=>{
      this.profilePhoto=''
      this.user.media.avatar=this.profilePhoto
      localStorage.setItem('UserObj',JSON.stringify(this.user))
      if(this.language=='en'){
        this.toastr.info('Data Updated successfully')
      }
      else{
        this.toastr.info('تم تحديث البيانات بنجاح.')
      }
      window.location.reload()


    }
    }))
  }
}
