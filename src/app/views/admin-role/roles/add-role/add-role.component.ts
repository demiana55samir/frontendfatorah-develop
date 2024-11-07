import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ChangeLanguageService } from '@services/changeLanguage.service';
import { HttpService } from '@services/http.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-role',
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.scss']
})
export class AddRoleComponent implements OnInit {
private subs=new Subscription()
selectedData:any=[]
selectedRoles:any=[]
language:any
type:any
id:any
role:any
prevName:any
permissions:any=[]
addURoleForm!:FormGroup
  constructor(private activeRoute:ActivatedRoute,private http:HttpService,private toastr:ToastrService,private router:Router,private fb:FormBuilder,private changelang:ChangeLanguageService) { }

  ngOnInit() {
    this.language=this.changelang.local_lenguage
    this.getPermissions()
    this.type = String(this.activeRoute.snapshot.paramMap.get('type'))
    this.id = String(this.activeRoute.snapshot.paramMap.get('uuid'))
    this.addURoleForm=this.fb.group({
      name:['',Validators.required],
      permissions:['',Validators.required]
    })
    if(this.type=='edit'){
      this.getRoleDate(this.id)
    }
  }
getPermissions(){
  this.subs.add(this.http.getReq('api/admin/roles/create').subscribe({
    next:res=>{
       this.permissions=res.data
    }
  }))

}
setCancelledRoles(event:any){
  console.log('test');
  
  this.selectedData=[]
  console.log(event);
  let allManageIndex = event.findIndex((item:any) => (item == 22))
  
  // && event.length == this.permissions.length
  if(event[event.length-1]  == 22 ){
    // this.selectedData = event[allManageIndex]
    this.permissions.forEach((permission:any) =>{
      this.selectedData.push(permission.id)  
    })
  }else{
    event.forEach((element:any) => {
      this.selectedData.push(element)  
    });
    let allManageIndexInPermission = this.selectedData.findIndex((item:any) => (item == 22))
    if(allManageIndexInPermission > -1) {
      this.selectedData.splice(allManageIndexInPermission,1);
    }
  }
  console.log(this.selectedData);
  
  this.addURoleForm.controls['permissions'].setValue(this.selectedData)
}


// setCancelledRoles(event:any){

//   console.log(event.target.value);
//   let roleId = Number(event.target.value)
//   if(this.selectedRoles.includes(roleId)){
//     let index = this.selectedRoles.findIndex(x => x == roleId)
//     this.selectedRoles.splice(index,1);
//   }else{
//     this.selectedRoles.push(roleId) 
//   }
//   // event.forEach((element:any) => {
//   //   this.selectedRoles.push(element)  
//   // });
//   console.log(this.selectedRoles)
//   this.addURoleForm.controls['permissions'].setValue(event)
// }
addRole(){
  if(this.addURoleForm.valid && this.addURoleForm.dirty){
    this.subs.add(this.http.postReq('api/admin/roles',this.addURoleForm.value).subscribe({
      next:res=>{
  
      },complete:()=>{
        if(this.language=='en'){
          this.toastr.info('Role added successfully')
        }
        else{
          this.toastr.info('تمت إضافة الدور بنجاح.')
        }
        this.router.navigate(['/admin/roles/All-roles'])
      }
    }))
  }
  else{
    this.addURoleForm.markAllAsTouched()
    // this.changelang.scrollToTop();
    this.changelang.scrollToInvalidInput(this.addURoleForm);
  }
}
editRoleData(){
  if(this.addURoleForm.valid){
    if(this.selectedRoles!=this.selectedData || this.addURoleForm.controls['name'].value != this.prevName ){
      this.subs.add(this.http.putReq(`api/admin/roles/${this.id}`,this.addURoleForm.value).subscribe({
        next:res=>{

      },complete:()=>{
        if(this.language=='en'){
          this.toastr.info('Data Updated successfully')
        }
        else{
          this.toastr.info('تم تحديث البيانات بنجاح.')
        }
        this.router.navigate(['/admin/roles/All-roles'])
      }
      }))
  }

else{
  if(this.language=='en'){
    this.toastr.error('please update Data first')
  }
  else{
    this.toastr.error('الرجاء تحديث البيانات أولاً')
  }
}
  }
  else{
    this.addURoleForm.markAllAsTouched();
    // this.changelang.scrollToTop();
    this.changelang.scrollToInvalidInput(this.addURoleForm);
  }
}
rolesPermissions:any
viewData:any=false
getRoleDate(id:any){
  this.subs.add(this.http.getReq(`api/admin/roles/${id}`).subscribe({
    next:res=>{
       this.role=res.data
       this.prevName=res.data.name
       this.rolesPermissions=res.data.permissions
       this.addURoleForm.controls['name'].setValue(this.role.name)
        this.rolesPermissions.forEach((element:any) => {
           this.selectedData.push(element.id)
        });
        

  },complete:()=>{
    this.addURoleForm.controls['permissions'].setValue(this.selectedData)
    this.selectedRoles=this.selectedData
    this.viewData=true

    // this.rolesPermissions.forEach((element:any) => {
    //   this.selectedData.push(element.id)
      
    // });
  }
  }))
}
}
