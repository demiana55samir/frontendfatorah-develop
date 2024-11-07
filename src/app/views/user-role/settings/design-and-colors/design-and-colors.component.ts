import { Component, OnInit } from '@angular/core';
import { ChangeLanguageService } from '@services/changeLanguage.service';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-design-and-colors',
  templateUrl: './design-and-colors.component.html',
  styleUrls: ['./design-and-colors.component.scss']
})
export class DesignAndColorsComponent implements OnInit {
  activeItem!: MenuItem;

  items=[{label:'الشعار والختم',command: (event:any) => {
    this.activeItem=this.items[0]
  }}
  ,{label:'الألوان',command: (event:any) => {
    this.activeItem=this.items[1]
  }},
  {label:'قوالب الفواتير',command: (event:any) => {
    this.activeItem=this.items[2]
  }}]
  constructor(private changeLang:ChangeLanguageService) { }
language:any
  ngOnInit() {
    this.language=this.changeLang.local_lenguage
    this.activeItem=this.items[0]
    if(this.language=='en'){
      this.items[0].label='Logo and Stamp'
      this.items[1].label='Colors'
      this.items[2].label="Invoices templates"
    }
  }

}
