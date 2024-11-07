import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { category } from '@modules/settings';
import { ChangeLanguageService } from '@services/changeLanguage.service';
import { HttpService } from '@services/http.service';
import { ValidationService } from '@services/validation.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-edit-category',
  templateUrl: './add-edit-category.component.html',
  styleUrls: ['./add-edit-category.component.scss']
})
export class AddEditCategoryComponent implements OnInit {
  private subs= new Subscription()
  categoryDataForm!:FormGroup
  catgId:any
  category:category = {} as category;
  type:any
  language:any
  prevCatgData:any
  primaryColor:any = ''

  selectedTypes = 'purchase';
  purchase_types=[
    {
      id:1,
      img:'./assets/images/invoices/Tax_invoice.svg',
      name_ar:' مشتريات ',
      name_en:' purchases',
      type:'purchase'
    },
    {
      id:0,
      img:'./assets/images/invoices/Non-tax_invoice.svg',
      name_ar:' مصروفات ',
      name_en:' Expenses ',
      type:'expense'
    },
]
  constructor(private fb:FormBuilder,
    private http:HttpService,
    private activeRoute:ActivatedRoute,
    private changeLang:ChangeLanguageService,
    private toastr:ToastrService,
    private router:Router,
    private validationServ:ValidationService
    ) { }

  ngOnInit() {
    if( localStorage.getItem('primaryColor') ){
      this.primaryColor = localStorage.getItem('primaryColor');
    }
    this.language=this.changeLang.local_lenguage
    this.catgId= String(this.activeRoute.snapshot.paramMap.get('id'))
    this.type= String(this.activeRoute.snapshot.paramMap.get('type'))
    this.categoryDataForm=this.fb.group({
      name:this.fb.group({
        ar: ['',Validators.required],
        en: ['',Validators.required] 
      }),
      type: ['',Validators.required],
      taxable  : ['',Validators.required]
    })

    if(this.type=='edit'){
      this.getCategory()
    }

  }

  getCategory(){
    this.subs.add(this.http.getReq(`api/admin/expenses/${this.catgId}`).subscribe({
      next:res =>{
        this.category=res.data
        this.categoryDataForm.patchValue(this.category)
        this.prevCatgData=this.categoryDataForm.value
        this.categoryDataForm.get('name')?.setValue({
          ar: res.data.name_ar,
          en: res.data.name_en
        });

        this.selectedTypes = this.category.type;
      }
    }))
  }

  addCategory(){
  
    if(this.categoryDataForm.valid && this.categoryDataForm.dirty){

      // let nameVal:any = ''
      // if(this.language == 'ar'){
      //    nameVal = this.categoryDataForm.get('name.ar')?.value;
      // }
      // else if (this.language == 'en'){
      //    nameVal = this.categoryDataForm.get('name.en')?.value;
      // }
      // this.categoryDataForm.get('name')?.setValue({
      //   ar: nameVal,
      //   en: nameVal
      // });


       this.subs.add(this.http.postReq('api/admin/expenses',this.categoryDataForm.value).subscribe({
        next:res=>{

        },complete:()=>{
          if(this.language=='en'){
            this.toastr.info('Category added successfully')
          }
          else{
            this.toastr.info('تمت إضافة التصنيف بنجاح.')
          }
          this.router.navigate(['/admin/settings/categories/All-categories'], { queryParams: { page: 1 } });
        },error:()=>{
          // this.categoryDataForm.controls['name'].setValue(name.ar)
        }
       }))
    }
    else{
      this.categoryDataForm.markAllAsTouched()
      // this.changeLang.scrollToTop();
      this.changeLang.scrollToInvalidInput(this.categoryDataForm);
    }

  }

  editCategory(){
    if(this.categoryDataForm.valid){
      if(JSON.stringify(this.categoryDataForm.value) != JSON.stringify(this.prevCatgData)){

        // let nameVal:any = ''
        // if(this.language == 'ar'){
        //    nameVal = this.categoryDataForm.get('name.ar')?.value;
        // }
        // else if (this.language == 'en'){
        //    nameVal = this.categoryDataForm.get('name.en')?.value;
        // }
        // this.categoryDataForm.get('name')?.setValue({
        //   ar: nameVal,
        //   en: nameVal
        // });

         this.subs.add(this.http.putReq(`api/admin/expenses/${this.catgId}`,this.categoryDataForm.value).subscribe({
          next:res=>{

          },complete:()=>{
            if(this.language=='en'){
              this.toastr.info('Category Updated successfully')
            }
            else{
              this.toastr.info('تم تحديث التصنيف بنجاح.')
            }
            this.router.navigate(['/admin/settings/categories/All-categories'], { queryParams: { page: 1 } });
          },error:()=>{
           
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
      this.categoryDataForm.markAllAsTouched()
      // this.changeLang.scrollToTop();
      this.changeLang.scrollToInvalidInput(this.categoryDataForm);
    }
  }


}
