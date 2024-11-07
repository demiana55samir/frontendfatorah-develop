import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LooseObject } from '@models/LooseObject';
import { ChangeLanguageService } from '@services/changeLanguage.service';
import { HttpService } from '@services/http.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-edit-blog',
  templateUrl: './add-edit-blog.component.html',
  styleUrls: ['./add-edit-blog.component.scss']
})
export class AddEditBlogComponent implements OnInit {
  type:any
  articleId:any
  article:any
  prevArticle:LooseObject={}
  articleDataForm!:FormGroup
  language:any
  files: File[] = [];
  selectedTags:any=[]
  formDataPayLoad = new FormData();
  showImageRequired=false
  private subs=new Subscription()

  tags=[
    {
      nameAR:'تجارة إلكترونية',
      nameEN:'E-commerce',
    },
    {
      nameAR:'مبيعات',
      nameEN:'sales',
    }
  ]
  
  constructor(private toastr:ToastrService,private router:Router,private activeRoute:ActivatedRoute,private http:HttpService,private fb:FormBuilder,private changelang:ChangeLanguageService) { }

  ngOnInit() {
    this.language=this.changelang.local_lenguage
    this.type = String(this.activeRoute.snapshot.paramMap.get('type'))
    this.articleId = String(this.activeRoute.snapshot.paramMap.get('id'))
    if(this.type=='edit'){
      this.getArticleData(this.articleId)
    }
    this.articleDataForm=this.fb.group({
      title:[''],
      content:[''],
      slug: [''],
      tags: ['',Validators.required],
    })
  }

  getArticleData(acticleId:any){
   this.subs.add(this.http.getReq(`api/admin/blogs/${acticleId}`).subscribe({
    next:res=>{
      this.article=res.data
      this.articleDataForm.patchValue(res.data)
      let tagsName:any=[]
      this.article.tags.forEach((element:any) => {
        tagsName.push(element.name)
      });
      this.articleDataForm.controls['tags'].setValue(tagsName)
      // console.log(this.files)


    },complete:()=>{
      for (const key in this.articleDataForm.value) {
        const value = this.articleDataForm.value[ key ];
          if (value !== null && value !== undefined && value !== '') {
            this.prevArticle[key]=value
          }
      }
      this.convertUrlToFile(this.article.media).then(file => {
       this.files.push(file)
       this.formDataPayLoad.append("image", file);
      //  console.log(this.formDataPayLoad.get('image'))
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

  
  onFilesAdded(event: any) {
    this.files=[]

    this.files.push(...event.addedFiles)
    // console.log(this.files)

    let reader = new FileReader();
    this.showImageRequired=false
    if (this.files) { 
      for(let i = 0; i < this.files.length; i++) {
        this.formDataPayLoad.append("image", this.files[i]);
        this.formDataJson['image']=this.files[i]
      }
    }
    // console.log(this.files)
  }

  onRemove(event:any) {
    let index = this.files.indexOf(event)
    this.files.splice(index, 1);
    delete this.formDataJson['image'];
    let TempformDataPayLoad = new FormData();
    this.formDataPayLoad.forEach((value:any, key:string) => {
      if (!key.startsWith('image')) {
        TempformDataPayLoad.append(key,value);
      }
    });
    this.formDataPayLoad = TempformDataPayLoad;
    for(let i=0; i<this.files.length ;i++){
      this.formDataPayLoad.append(`image`,this.files[i])
    }
    if(this.files.length==0){
      this.showImageRequired=true
    }
  }

  addArticle(){
    if(this.articleDataForm.valid && this.articleDataForm.dirty && this.files.length!=0){
     //set data of form to formdata
    this.articleDataForm.controls['tags'].setValue(this.selectedTags)

      for (const key in this.articleDataForm.value) {
        const value = this.articleDataForm.value[ key ];
          if (value !== null && value !== undefined && value !== '') {
            if(key=='tags'){
               this.selectedTags.forEach((element:any,index:any) => {
                this.formDataPayLoad.append(`${key}[${index}][en]`,String(element))
                this.formDataPayLoad.append(`${key}[${index}][ar]`,String(element))
               });
            }
            else{
              this.formDataPayLoad.append(`${key}[en]`,String(value))
              this.formDataPayLoad.append(`${key}[ar]`,String(value))
            }
          }
      }
      this.subs.add(this.http.postReq('api/admin/blogs',this.formDataPayLoad).subscribe({
        next:res=>{
          
        },complete:()=>{
          if(this.language=='en'){
            this.toastr.info('Article added successfully')
          }
          else{
            this.toastr.info('تمت إضافة المقال بنجاح.')
          }
          this.router.navigate(['/admin/blogs/All-blogs'])
        },error:()=>{
              for (const key in this.articleDataForm.value) {
                const value = this.articleDataForm.value[ key ];
                  if (value !== null && value !== undefined && value !== '') {
                    if(key!='image'){
                      this.formDataPayLoad.delete(key)
                    }
                  }
              }
            }
      }))
    }
    else{
      if(this.files.length==0){
        this.showImageRequired=true
      }
      this.articleDataForm.markAllAsTouched()
    }
  }
 formDataJson:LooseObject={}
  editArticleData(){

    if(this.articleDataForm.valid && this.files.length!=0){
         //set data of form to formdata
         for (const key in this.articleDataForm.value) {
          const value = this.articleDataForm.value[ key ];
            if (value !== null && value !== undefined && value !== '') {
              if(key=='tags'){
                this.selectedTags.forEach((element:any,index:any) => {
                 this.formDataPayLoad.append(`${key}[${index}][en]`,String(element))
                 this.formDataPayLoad.append(`${key}[${index}][ar]`,String(element))
                });
             }
             else{
               this.formDataPayLoad.append(`${key}[en]`,String(value))
               this.formDataPayLoad.append(`${key}[ar]`,String(value))
             }
              this.formDataJson[key]=value
            }
        }

        // console.log('formdata'+ JSON.stringify(this.formDataJson))
        // console.log('prev'+ JSON.stringify(this.prevArticle))
         if(JSON.stringify(this.formDataJson) != JSON.stringify(this.prevArticle)){
          this.formDataPayLoad.append('_method','PUT')
          this.subs.add(this.http.postReq(`api/admin/blogs/${this.articleId}`,this.formDataPayLoad).subscribe({
            next:res=>{
              
            },complete:()=>{
              this.formDataPayLoad=new FormData()
              if(this.language=='en'){
                this.toastr.info('Data Updated successfully')
              }
              else{
                this.toastr.info('تم تحديث البيانات بنجاح.')
              }
              this.router.navigate(['/admin/blogs/All-blogs'])
            },
            error:()=>{
              for (const key in this.articleDataForm.value) {
                const value = this.articleDataForm.value[ key ];
                  if (value !== null && value !== undefined && value !== '') {
                    if(key!='image'){
                      this.formDataPayLoad.delete(key)
                    }
                  }
              }
            }
          }))
         }
         else{
          this.formDataPayLoad=new FormData()
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
      this.articleDataForm.markAllAsTouched()
      // this.formDataPayLoad=new FormData()
     }

     
  }

}
