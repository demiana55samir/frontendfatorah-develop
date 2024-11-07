import { Component, OnInit } from '@angular/core';
import { ChangeLanguageService } from '@services/changeLanguage.service';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-commercial-account-details',
  templateUrl: './commercial-account-details.component.html',
  styleUrls: ['./commercial-account-details.component.scss']
})
export class CommercialAccountDetailsComponent implements OnInit {
  activeItem!: MenuItem;

  items=[{label:'بيانات الحساب',command: (event:any) => {
    this.activeItem=this.items[0]
  }}
  ,{label:'الحسابات البنكية',command: (event:any) => {
    this.activeItem=this.items[1]
  }},
  {label:'إعدادات عامة',command: (event:any) => {
    this.activeItem=this.items[2]
  }}]
  constructor(private changeLang:ChangeLanguageService) { }
language:any
  ngOnInit() {
    this.language=this.changeLang.local_lenguage
    if(this.language=='en'){
      this.items[0].label="Account Details"
      this.items[1].label="Bank Accounts"
      this.items[2].label="General preferences"
      
    }
    this.activeItem=this.items[0]
  }

}
