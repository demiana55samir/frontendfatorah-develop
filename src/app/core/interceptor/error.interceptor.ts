import {
  HttpErrorResponse,
    HttpHandler,
    HttpInterceptor,
    HttpRequest
  } from '@angular/common/http';
  import { Injectable } from '@angular/core';
  import { throwError } from 'rxjs';
  import { ToastrService } from 'ngx-toastr';
  import { catchError, finalize, retry } from 'rxjs/operators';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router } from '@angular/router';
import { AuthService } from '@services/auth.service';
  
  @Injectable()
  export class ErrorInterceptor implements HttpInterceptor {
    constructor(private toastr:ToastrService,
      private ngxService: NgxUiLoaderService,
      private auth:AuthService,
      private router:Router
    ) { }
  
    intercept(req: HttpRequest<any>, next: HttpHandler) {
      this.ngxService.start();
      return next.handle(req).pipe(
        retry(1),
        finalize(() =>  this.ngxService.stop()),
        catchError((errors:HttpErrorResponse)=>{
          console.log(errors.error)
           if(errors.error && errors.error.message){
            this.toastr.error(errors.error.message)
               if(errors.error.message === 'Route [account.complete] not defined.'){
                // this.toastr.error(errors.error.message)
                this.router.navigate(['/auth/register-step3'])
                }
              
              if(errors.error.message === 'Your account is not verified.'){
                // this.toastr.error(errors.error.message)
                this.router.navigate(['/auth/register-step2'])
              }
             if(errors.error.code==401 || errors.message.includes('Unauthenticated') || errors.error.message.includes('Unauthenticated')){
              // this.toastr.error(errors.error.message)
              this.auth.signOut()
             }
             if(errors.error.code==401 || errors.message.includes('Unauthenticated') || errors.error.message.includes('Unauthenticated') 
             || errors.status==401 || errors.statusText .includes('Unauthenticated')){
              this.auth.signOut()
             }
            }
            else if(errors.error.status == 'not_complete'){
              this.toastr.error(errors.error.error)
              let lang = localStorage.getItem('currentLang')

            localStorage.clear();
              setTimeout(() => {
            if(lang)
            localStorage.setItem('currentLang' , lang);
            }, 200);
              this.router.navigate(['/auth/register-step3'])
              
            }
            else if(errors.error && errors.error.error){
              this.toastr.error(errors.error.error)
            }
            let  errorMessage = `${errors.error}`;
         
          return throwError(() => errors.error);
        })
      );

    }
  
  }
  