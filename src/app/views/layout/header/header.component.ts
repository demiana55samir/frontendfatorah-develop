import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { ChangeLanguageService } from '@services/changeLanguage.service';
import { GeneralService } from '@services/general.service';
import { HttpService } from '@services/http.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  private subs=new Subscription()
  profileImage:string=''
  name:string =''
  email:string =''
  uuid:string =''
  constructor(private auth:AuthService,
    private changelngServ:ChangeLanguageService,
    private router:Router,
    private http:HttpService,
    private generalService:GeneralService) { }

  ngOnInit() {
    this.getGeneralData();
    this.auth.UserObsrv$.subscribe({
      next: (res: any) => {
    
        let userInfoString = localStorage.getItem('UserObj')

        if (res) {
          let userData = res;
          localStorage.setItem('UserObj', JSON.stringify(userData));

          this.name = userData?.name
          this.email = userData?.email
          this.profileImage = userData?.media?.avatar
          this.uuid = userData?.uuid
                
        } else if (userInfoString) {
          let userData = JSON.parse(userInfoString);

          this.name = userData?.name
          this.email = userData?.email
          this.profileImage = userData?.media?.avatar
          this.uuid = userData?.uuid

        }
      }
    })
  }
  logout(){
    this.auth.signOut()
    this.auth.setViewOnly(true)
  }
  changeLang(clickedLanguage:string){
    if(clickedLanguage!=localStorage.getItem('currentLang')){
      if(clickedLanguage=='ar'){
        localStorage.setItem('currentLang', 'ar');
      }
      else{
        localStorage.setItem('currentLang', 'en');
  
      }
      window.location.reload();
    }

    }

    navigateToProfile(){
      if(this.auth.getUserObj().role=='user'){
        this.router.navigate(['/user/users/user-profile'])
      }
      else if(this.auth.getUserObj().role=='admin'){
        this.router.navigate([`/admin/user-data/update/${this.uuid}`])
       
      }
    }
    navigateToLanding(){
      this.router.navigate(['/landing'])
    }


    getGeneralData(){
      let generalData =  localStorage.getItem('UserObj');
      if(generalData){
        let userData = JSON.parse(generalData);
        this.name = userData?.name
        this.email = userData?.email
        this.profileImage = userData?.media?.avatar
        this.uuid = userData?.uuid
      }else{
        this.subs.add(this.generalService.getGeneralData().subscribe({
          next:(res)=>{
            this.name = res?.data?.name
            this.email = res?.data?.email
            this.profileImage = res?.data?.media?.avatar
            localStorage.setItem('UserObj',JSON.stringify(res?.user))
          }
        }));
      }
      
     }
}
