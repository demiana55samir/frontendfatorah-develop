// recaptcha.service.ts
import { Injectable } from '@angular/core';

declare const grecaptcha: any;

@Injectable({
  providedIn: 'root'
})
export class RecaptchaService {
  private siteKey: string = '6LfXLrMaAAAAADNZMFsZKtj-4TKjfxqgXITmvM5F';

  constructor() {}

  public execute(action: string): Promise<string> {
    return new Promise((resolve, reject) => {
      grecaptcha.ready(() => {
        grecaptcha.execute(this.siteKey, { action }).then((token: string) => {
          if (token) {
            resolve(token);
          } else {
            reject('Token generation failed');
          }
        });
      });
    });
  }
}
