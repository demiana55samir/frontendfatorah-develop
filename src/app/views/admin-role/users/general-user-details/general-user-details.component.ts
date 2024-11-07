import { Component, OnInit } from '@angular/core';
import { AuthService } from '@services/auth.service';
import { ChangeLanguageService } from '@services/changeLanguage.service';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-general-user-details',
  templateUrl: './general-user-details.component.html',
  styleUrls: ['./general-user-details.component.scss']
})
export class GeneralUserDetailsComponent implements OnInit {
  activeItem!: MenuItem;

  items=[{label:'عرض بيانات المستخدم',command: (event:any) => {
    this.activeItem=this.items[0]
  }}
  ,{label:'الفواتير',command: (event:any) => {
    this.activeItem=this.items[1]
  }}
]
language:any
userRole = 'admin';
userPermissions:any;
  constructor(private changeLanguage:ChangeLanguageService, private authService: AuthService,) { 
    this.activeItem=this.items[0]
  }

  ngOnInit() {

    let user = this.authService.getUserObj();
    this.userRole = user.role;

    this.userPermissions = user.permissions
    if(this.userRole != 'admin'&& !this.userPermissions['all.manage'] && !this.userPermissions['invoices.manage']){
      this.items.splice(1,1);
    }

    this.language=this.changeLanguage.local_lenguage
    if(this.language=='en'){
      this.items[0].label='Show User Details'
      this.items[1].label='Invoices'

    }
    


  }
  }


