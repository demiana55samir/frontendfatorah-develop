
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '@environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authBool: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  Auth$: Observable<boolean> = this.authBool.asObservable();

  updateAuthBool(updatedAuth:boolean) {
      this.authBool.next(updatedAuth);
  }
  getAuthBool(){
    return this.authBool.value;
  }

  private authUser: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  UserObsrv$: Observable<boolean> = this.authUser.asObservable();

  updateAuthUser(user:any) {
        this.authUser.next(user);
  }
  getUser(){
    return this.authUser.value;
  }
  setViewOnly(b:boolean){
    this.viewOnly=b
  }
  getViewOnly(){
    return this.viewOnly
  }
  isAuth: boolean = false;
  isAdmin: boolean = false;

  isSupport:boolean = false;
  viewOnly:boolean = false
  baseUrl = environment.baseUrl;

  user:any;
  constructor(
    private router: Router) { 

      if(localStorage.getItem('UserObj')){
        this.updateAuthUser( this.getUserObj());
      }

      if(localStorage.getItem('UserToken')){
        this.updateAuthBool(true);
      }else{
        this.updateAuthBool(false);
      }
    }

  setUserToken(token: any) {
    localStorage.setItem('UserToken', token);
    this.isAuth = true;

    this.updateAuthBool(true);
    this.checkUserAuth();
  }
  setUserObj(userObj: any) {
    this.user = userObj;
    this.updateAuthUser(userObj);
    localStorage.setItem('UserObj', JSON.stringify(userObj));
    userObj?.role == 'admin' ? this.isAdmin = true : this.isAdmin =  false;
  }
  checkUserAuth() {
    if (this.getUserToken()) {
      this.isAuth = true;

      this.updateAuthBool(true);
      const userObj: any = this.getUserObj();
      userObj?.role == 'admin' ? this.isAdmin = true : this.isAdmin =  false;
      userObj?.role == 'support' ? this.isSupport = true : this.isSupport =  false;
    }
  }

  signOut() {
    let lang = localStorage.getItem('currentLang')

    localStorage.clear();
      setTimeout(() => {
    if(lang)
    localStorage.setItem('currentLang' , lang);
    }, 200);
    setTimeout(() => {
      this.router.navigate(['/auth/login'])
    }, 1000);
      
  }

  getUserToken() {
    return localStorage.getItem('UserToken');
  }
  getUserObj() {
    if (localStorage.getItem('UserObj')) {
      return JSON.parse(localStorage.getItem('UserObj') || '')
    }
    return {};
  }

  isUserAuth() {
    return this.getAuthBool();
  }
}
