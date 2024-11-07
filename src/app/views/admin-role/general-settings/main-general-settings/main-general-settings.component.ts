import { Component, OnInit } from '@angular/core';
import { ChangeLanguageService } from '@services/changeLanguage.service';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-main-general-settings',
  templateUrl: './main-general-settings.component.html',
  styleUrls: ['./main-general-settings.component.scss']
})
export class MainGeneralSettingsComponent implements OnInit {
  activeItem!: MenuItem;

  items=[{label:'الاعدادات العامة',command: (event:any) => {
    this.activeItem=this.items[0]
  }}
  ,{label:'الشروط والأحكام',command: (event:any) => {
    this.activeItem=this.items[1]
  }},
]
  constructor(private changeLang:ChangeLanguageService) { }
language:any
  ngOnInit() {
    this.language=this.changeLang.local_lenguage
    if(this.language=='en'){
      this.items[0].label="General Settings"
      this.items[1].label="Terms & Conditions"
      
    }
    this.activeItem=this.items[0]
  }

}
