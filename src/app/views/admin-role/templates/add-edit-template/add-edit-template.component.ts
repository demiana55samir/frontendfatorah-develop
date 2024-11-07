import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ChangeLanguageService } from '@services/changeLanguage.service';
import { HttpService } from '@services/http.service';
import { ValidationService } from '@services/validation.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-edit-template',
  templateUrl: './add-edit-template.component.html',
  styleUrls: ['./add-edit-template.component.scss']
})
export class AddEditTemplateComponent implements OnInit {
  templateId:any
  private subs=new Subscription()
  template:any
  type:any
  prevTemplateData:any
  templateDataForm!:FormGroup
  language:any
  selectedPlans:any=[]
  selectedData:any=[]
  files: File[] = [];
  formDataPayLoad = new FormData();
  plans:any=[]
  showImageRequired=false
  imageUploaded=false
  primaryColor:any ='';
  constructor(private http:HttpService,private router:Router,private toastr:ToastrService,private fb:FormBuilder,private validserv:ValidationService,private activeRoute:ActivatedRoute,private changelang:ChangeLanguageService) { }

  ngOnInit() {
    if( localStorage.getItem('primaryColor') ){
      this.primaryColor = localStorage.getItem('primaryColor');
    }
    this.templateId = Number(this.activeRoute.snapshot.paramMap.get('id'))
    this.getTemplateData(this.templateId)
    // this.getPlans()
    this.type = String(this.activeRoute.snapshot.paramMap.get('type'))
    this.language=this.changelang.local_lenguage
    this.templateDataForm=this.fb.group({
      name_ar:[''],
      name_en:[''],
      name: [''],
      slug: ['',Validators.required],
      plans: ['',Validators.required],
      is_active: ['',Validators.required]
    })
  }

  getTemplateData(id:any){
    this.subs.add(this.http.getReq(`api/admin/templates/${id}`).subscribe({
      next:res=>{
        this.template=res.data
        let plansId:any=[]
        res.data.plans.forEach((element:any) => {
          this.selectedPlans.push(element.id)
          plansId.push(element.id)
        });
        this.templateDataForm.patchValue(this.template)
        this.templateDataForm.controls['plans'].setValue(plansId)
        this.prevTemplateData=this.templateDataForm.value
      },complete:()=>{
        this.convertUrlToFile(this.template.preview_image).then(file => {
          this.files.push(file)
          this.formDataPayLoad.append("preview", file);
          console.log(this.formDataPayLoad.get('preview'))
        });
      }
    }))
  }

  async convertUrlToFile(url: string): Promise<File> {
    const response = await fetch(url);
    const blob = await response.blob();
  
    // Get the file name from the URL
    const fileName = url.substring(url.lastIndexOf('/') + 1);
  
    const file = new File([blob], fileName, { type: blob.type });
  
    return file;
  }

  getPlans(){
    this.subs.add(this.http.getReq(`api/admin/plans`).subscribe({
      next:res=>{
        this.plans=res.data
      }
    })) 
  }
  setPlanChange(event:any){
    this.selectedData=[]
    event.forEach((element:any) => {
      this.selectedData.push(element)  
    });
    this.templateDataForm.controls['plans'].setValue(event)
  }

  editTemplateData(){
    // console.log(this.templateDataForm);
    // return
    if(this.templateDataForm.valid && this.files.length!=0){
      // console.log(this.templateDataForm.controls['is_active'].value , typeof this.templateDataForm.controls['is_active'].value);
      
      if(this.templateDataForm.controls['is_active'].value ){
        this.templateDataForm.controls['is_active'].setValue(1)
      }
      else if(!this.templateDataForm.controls['is_active'].value){
        this.templateDataForm.controls['is_active'].setValue(0)
      }
      if(JSON.stringify(this.templateDataForm.value) != JSON.stringify(this.prevTemplateData) || this.imageUploaded){
        this.formDataPayLoad.append('_method','PUT')
        for (const key in this.templateDataForm.value) {
          const value = this.templateDataForm.value[ key ];
            if (value !== null && value !== undefined && value !== '') {
               if(key=='name_en'){
                 this.formDataPayLoad.append(`name[en]`,String(value))
               }
               else if(key=='name_ar'){
                this.formDataPayLoad.append(`name[ar]`,String(value))
              }
               else if(key=='plans'){
                this.selectedPlans.forEach((element:any , index:any) => {
                  this.formDataPayLoad.append(`${key}[${index}]`,element)
                });
               }
               else{
                this.formDataPayLoad.append(key,String(value))
               }
            }
        }

        // if(this.templateDataForm.controls['is_active'].value == '1' ){
        //   this.templateDataForm.controls['is_active'].setValue('true')
        // }
        // else if(this.templateDataForm.controls['is_active'].value == '0'){
        //   this.templateDataForm.controls['is_active'].setValue('false')
        // }

         this.subs.add(this.http.postReq(`api/admin/templates/${this.templateId}`,this.formDataPayLoad).subscribe({
          next:res=>{

          },error:()=>{
            for (const key in this.templateDataForm.value) {
              const value = this.templateDataForm.value[ key ];
                if (value !== null && value !== undefined && value !== '') {
                   if(key=='name'){
                     this.formDataPayLoad.delete(`${key}[en]`)
                     this.formDataPayLoad.delete(`${key}[ar]`)
                   }
                   else if(key=='plans'){
                    this.selectedPlans.forEach((element:any , index:any) => {
                      this.formDataPayLoad.delete(`${key}[${index}]`)
                    });
                   }
                   else{
                    this.formDataPayLoad.delete(key)
                   }
                }
            }
          },complete:()=>{
            this.formDataPayLoad=new FormData()
            if(this.language=='en'){
              this.toastr.info('Data Updated successfully')
            }
            else{
              this.toastr.info('تم تحديث البيانات بنجاح.')
            }
            this.router.navigate(['/admin/templates/All-templates'])
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
      if(this.files.length==0){
        this.showImageRequired=true
      }
      this.templateDataForm.markAllAsTouched()
    }

  }

  onFilesAdded(event: any) {
    this.files=[]
    if(this.formDataPayLoad.get('preview')){
      this.formDataPayLoad.delete('preview')
    }
    this.files.push(...event.addedFiles)
    let reader = new FileReader();
    this.showImageRequired=false
    this.imageUploaded=true
    if (this.files) { 
      for(let i = 0; i < this.files.length; i++) {
        this.formDataPayLoad.append("preview", this.files[i]);
      }
    }

  }

  onRemove(event:any) {
    let index = this.files.indexOf(event)
    this.files.splice(index, 1);
    let TempformDataPayLoad = new FormData();
    this.formDataPayLoad.forEach((value:any, key:string) => {
      if (!key.startsWith('preview')) {
        TempformDataPayLoad.append(key,value);
      }
    });
    this.formDataPayLoad = TempformDataPayLoad;
    for(let i=0; i<this.files.length ;i++){
      this.formDataPayLoad.append('preview',this.files[i])
    }
    this.imageUploaded=false
    if(this.files.length==0){
      this.showImageRequired=true
    }
  }

}
