import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { ChangeLanguageService } from '@services/changeLanguage.service';

@Component({
  selector: 'app-landing-header',
  templateUrl: './landing-header.component.html',
  styleUrls: ['./landing-header.component.scss']
})
export class LandingHeaderComponent implements OnInit {
language:any
isSmallScreen=false
isAuth=false

isScrolled = false;

@HostListener('window:scroll', [])
onWindowScroll() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.isScrolled = scrollPosition > 70;
}

  constructor(private auth:AuthService,private router:Router,private changelngServ:ChangeLanguageService) { }

  ngOnInit() {
    this.isAuth=this.auth.getAuthBool()
    this.language=this.changelngServ.local_lenguage
  }
  login(){
    if(this.auth.getAuthBool()){
      if(this.auth.getUserObj().role=='user'){
        this.router.navigate(['user/control/dashboard'])
      }
      else{
        this.router.navigate(['admin/control/dashboard'])
      }
    }
    else{
      this.router.navigate(['/auth/login'])
    }
  }
  changeLang(){
  this.changelngServ.reloadLang()
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.isSmallScreen = window.innerWidth <= 598; 
    // console.log(this.isSmallScreen + ' '+ window.innerWidth)
    // Adjust the breakpoint as needed
  }

  
  scrollFunc(sectionName: string) {
    var elem = document.getElementById(sectionName);
    elem?.scrollIntoView();
  }
}
