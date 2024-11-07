import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { userInvoice } from '@models/user-invoices';
import { AuthService } from '@services/auth.service';
import { ChangeLanguageService } from '@services/changeLanguage.service';
import { HttpService } from '@services/http.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-All-invoice-templates',
  templateUrl: './All-invoice-templates.component.html',
  styleUrls: ['./All-invoice-templates.component.scss']
})
export class AllInvoiceTemplatesComponent implements OnInit {
  templates:any=[]
  templateId = -1;
  invoiceColor=''
  language:any
private subs=new Subscription()

primaryColor:any = '';
show:any = null;
templatesUrl=[
  {url:'../../../../assets/images/templates/template1.PNG',id:1},
  {url:'../../../../assets/images/templates/template2.PNG',id:2},
  {url:'../../../../assets/images/templates/template3.PNG',id:3},
  {url:'../../../../assets/images/templates/template4.PNG',id:4},
  {url:'../../../../assets/images/templates/template5.PNG',id:5},
  {url:'../../../../assets/images/templates/template6.PNG',id:6},
  
]
templateUrl=''
  constructor(private http:HttpService,private changeLang:ChangeLanguageService,
    private auth:AuthService,
    private router:Router,private toastr:ToastrService) { }

  ngOnInit() {
    if( localStorage.getItem('primaryColor') ){
      this.primaryColor = localStorage.getItem('primaryColor');
    }
    this.language=this.changeLang.local_lenguage
    this.getTemplates()
    this.invoiceColor=String(localStorage.getItem('invoiceColor'))
    if(localStorage.getItem('default_template_id')) this.templateId = Number(localStorage.getItem('default_template_id'));
    this.getUserExistingData();
  }

  getTemplates(){
    this.subs.add(this.http.getReq('api/dashboard/settings/templates').subscribe({
      next:res=>{
        this.templates=res.data
      }
    }))
  }

  setTemplate(id:any){
    let body={
      "default_template_id": id
    }
    this.subs.add(this.http.putReq('api/dashboard/settings/templates',body).subscribe({
      next:res=>{
       
      },complete:()=>{
        this.templateId = id;
        if(this.language=='en'){
          this.toastr.info('Template Updated Successfully')
        }
        else{
          this.toastr.info('تم تحديث القالب بنجاح.')
        }
          if(localStorage.getItem('default_template_id')){
            localStorage.removeItem('default_template_id')
            localStorage.setItem('default_template_id',id)
          }
      }
    }))
  }
  setTemplateUrl(templatePreview:string){
   this.templateUrl=templatePreview
   this.openImagesModal()
  }

  @ViewChild('imagesModal') imagesModal!: ElementRef<HTMLElement>;
  openImagesModal() {
      let el: HTMLElement = this.imagesModal.nativeElement;
      el.click();
  }


  getUserExistingData(){
    this.subs.add(this.http.getReq('api/dashboard/account/profile').subscribe({
     next:res=>{

      if(res?.data?.show_due_date == 1){
       this.show=true
      }
      else{
       this.show=false

      }
     }
    }))
 }

  updateInvoiceDue(){ 
    // this.show=!this.show;
    let body={
      'show_due_date':Number(this.show)
    }
    this.subs.add(this.http.putReq('api/dashboard/account/show-due-date',body).subscribe({
      next:res=>{

      },complete:()=>{
        let user=this.auth.getUserObj()
        if(this.show==true){
          user.show_due_date=1;
        }
        else{
          user.show_due_date=0
        }
        this.show = Boolean(user.show_due_date)
    
        localStorage.setItem('UserObj',JSON.stringify(user))
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
