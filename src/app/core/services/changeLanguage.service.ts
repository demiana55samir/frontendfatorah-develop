import {  DatePipe } from '@angular/common';
import {  Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';

const datePipe = new DatePipe('en-SA');

@Injectable({
  providedIn: 'root'
})
export class ChangeLanguageService {

  otherLang: string = '';
  local_lenguage = 'ar';
  current_lang: BehaviorSubject<string> = new BehaviorSubject<string>('ar');
  changeLangObs: Observable<string> = this.current_lang.asObservable();

  
  constructor(public translate: TranslateService ,
    private titleService: Title) {}


changeLang(lang:string) {
  this.current_lang.next(lang);
  this.local_lenguage = lang;
}

/* --------------------------------------------------------------- */
getBrowserLanguage(): string {
  return navigator.language;
}

checkLangage() {
  let current = localStorage.getItem('currentLang');
  if (current) this.changeLangage(current);
  else {
    this.getBrowserLanguage().includes('en') ? localStorage.setItem('currentLang', 'en') : localStorage.setItem('currentLang', 'ar');
    let newCurrentLang = localStorage.getItem('lang');
   this.changeLangage(newCurrentLang ? newCurrentLang : 'ar');

  }
}

changeLangage(currentLang: string) {
  if(currentLang)
  { this.translate.use(currentLang.toLowerCase()) ;}
  else{
    this.translate.use('ar')
  }
  localStorage.setItem('currentLang', currentLang);
  this.changeLang(currentLang);
  this.otherLang = currentLang === 'ar' ? 'en' : 'ar';
  
  let htmlTag = document.getElementsByTagName(
    'html'
  )[0] as HTMLHtmlElement;
  htmlTag.dir = currentLang === 'ar' ? 'rtl' : 'ltr';

  let dom: any = document.querySelector('body');

  if (currentLang == 'ar') {
    dom.classList.remove('ltr');
    dom.classList.add('rtl');

  } else {
    dom.classList.add('ltr');
    dom.classList.remove('rtl');
  }
  if(currentLang == 'ar') this.titleService.setTitle('فاتورة برو')
  else this.titleService.setTitle('Fatora Pro')
   this.changeCssFile(currentLang);
}


changeCssFile(currentLang: string) {
  let headTag = document.getElementsByTagName(
    'head'
  )[0] as HTMLHeadElement;
  let existingLink = document.getElementById(
    'langCss'
  ) as HTMLLinkElement;
  let bundleName = currentLang === 'ar' ? 'arabicStyle.css' : 'englishStyle.css';
  if (existingLink) existingLink.href = bundleName;
  else {
    let newLink = document.createElement('link');
    newLink.rel = 'stylesheet';
    newLink.type = 'text/css';
    newLink.id = 'langCss';
    newLink.href = bundleName;
    headTag.appendChild(newLink);

    let mainStyleScss = document.createElement('link');
    mainStyleScss.rel = 'stylesheet';
    mainStyleScss.type = 'text/scss';
    mainStyleScss.id = 'langScss';
    mainStyleScss.href = 'styles.scss';
    headTag.appendChild(mainStyleScss);

  
  }
}
reloadLang() {
  localStorage.getItem('currentLang') == 'ar'
    ? localStorage.setItem('currentLang', 'en')
    : localStorage.setItem('currentLang', 'ar');
  window.location.reload();
}

getSaudiDate(date: Date): string {

  const dateString = datePipe.transform(date , 'yyyy-MM-dd');
  if (dateString) {
    return dateString;
  }
  return date.toString();
}

scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

scrollFunc(sectionName: string) {
  var elem = document.getElementById(sectionName);
  elem?.scrollIntoView();
}
scrollToInvalidInput(FormList:FormGroup) {


  const invalidControl = Object.keys(FormList.controls).find(key => 
    FormList.controls[key].invalid
  );
  
  if (invalidControl) {
    console.log(invalidControl);
    
    const element = document.querySelector(`[formControlName="${invalidControl}"]`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      (element as HTMLElement).focus();
    }else{
      const formGroupNameElement = document.querySelector(`[formGroupName="${invalidControl}"]`);
      if (formGroupNameElement) {
        formGroupNameElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        (formGroupNameElement as HTMLElement).focus();
      }else{
        this.scrollToTop()
      }
    }
  }else{
    this.scrollToTop()
  }
}
}
