import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
  })
export class CopyContentService {
  constructor() { }
   private fakeElem: HTMLTextAreaElement | null | undefined;

  createFake(text: string) {
    const docElem = document.documentElement!;
    const isRTL = docElem.getAttribute('dir') === 'rtl';
    // Create a fake element to hold the contents to copy
    this.fakeElem = document.createElement('textarea');
    // Prevent zooming on iOS
    this.fakeElem.style.fontSize = '12pt';
    // Reset box model
    this.fakeElem.style.border = '0';
    this.fakeElem.style.padding = '0';
    this.fakeElem.style.margin = '0';
    // Move element out of screen horizontally
    this.fakeElem.style.position = 'absolute';
    this.fakeElem.style[isRTL ? 'right' : 'left'] = '-9999px';
    // Move element to the same position vertically
    const yPosition = window.pageYOffset || docElem.scrollTop;
    this.fakeElem.style.top = yPosition + 'px';
    this.fakeElem.setAttribute('readonly', '');
    this.fakeElem.value = text;
    document.body.appendChild(this.fakeElem);
    this.fakeElem.select();
    this.fakeElem.setSelectionRange(0, this.fakeElem.value.length);
  }
  removeFake() {
    if (this.fakeElem) {
      document.body.removeChild(this.fakeElem);
      this.fakeElem = null;
    }
  }
  copyText(text: string) {
    try {
      return document.execCommand('copy');
    } catch (err) {
      return false;
    } finally {
      this.removeFake();
    }
  }
}


