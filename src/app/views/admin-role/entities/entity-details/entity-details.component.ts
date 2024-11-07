import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { entity } from '@modules/settings';
import { ChangeLanguageService } from '@services/changeLanguage.service';
import { CopyContentService } from '@services/copy-content';
import { HttpService } from '@services/http.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-entity-details',
  templateUrl: './entity-details.component.html',
  styleUrls: ['./entity-details.component.scss']
})
export class EntityDetailsComponent implements OnInit {

  private subs=new Subscription()
companyType:entity = {} as entity

  companyTypeId:any
  language:any
  constructor(private http:HttpService,private changelang:ChangeLanguageService,private activeRoute:ActivatedRoute,private router:Router,private fb:FormBuilder,private copier:CopyContentService,private toastr:ToastrService) {

   }

   
  ngOnInit() {
    this.companyTypeId= String(this.activeRoute.snapshot.paramMap.get('id'))
    this.language=this.changelang.local_lenguage
    this.getActivity()
  }

  getActivity(){
    this.subs.add(this.http.getReq(`api/admin/company_types/${this.companyTypeId}`).subscribe({
      next:res =>{
        this.companyType=res.data
      }
    }))
  }
}
