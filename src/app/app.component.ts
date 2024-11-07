import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChangeLanguageService } from '@services/changeLanguage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'fatoraPro';
  // private changeColorServ:CheckColorChangeService
  constructor(public changeLangService:ChangeLanguageService) {
    // this.changeLangService.checkLangage()
  }

//   @HostListener('window:beforeunload', ['$event'])
// onBeforeUnload(event: Event) {
//   if (Boolean(localStorage.getItem('RememberMe')) != true) {
//     this.auth.signOut()
//     localStorage.clear();
//   }
// }
ngOnInit(){
  this.changeLangService.checkLangage()
// this.changeColorServ.checkColorChange()
}

ngOnDestroy() {
  // this.changeColorServ.destroy()
}

}
