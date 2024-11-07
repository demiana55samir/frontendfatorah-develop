import { Directive ,HostListener, Input } from '@angular/core';

@Directive({
  selector: '[libAutoTab]'
})
export class AutoTabDirectiveDirective {

  @Input() libAutoTab:any;
  @Input() prev:any

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Backspace') {
      // const field = document.getElementById(this.libAutoTab.prev);
      // if (field) {
      //     field.focus();
      // }
    }
  }

  constructor() {}
  @HostListener('input', ['$event.target']) onInput(input:any) {
    const length = input.value.length;
    const maxLength = input.attributes.maxlength.value;
    
    
    if (length >= maxLength && this.libAutoTab.next) {
      // console.log(this.libAutoTab);
      const field = document.getElementById(this.libAutoTab.next);
      if (field) {
        field.focus();
      }
    }
  }



}
