import { Component, OnInit } from '@angular/core';
import { ChangeLanguageService } from '@services/changeLanguage.service';

@Component({
  selector: 'app-register-step4',
  templateUrl: './register-step4.component.html',
  styleUrls: ['./register-step4.component.scss']
})
export class RegisterStep4Component implements OnInit {

  constructor(private changeLang:ChangeLanguageService) { }
language=''
  ngOnInit() {
  this.language=this.changeLang.local_lenguage
  }

  

}
