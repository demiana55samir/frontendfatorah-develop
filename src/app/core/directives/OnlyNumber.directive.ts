// import { Directive, ElementRef, HostListener } from '@angular/core';

// @Directive({
//   selector: '[appOnlyNumber]'
// })
// export class OnlyNumberDirective {

//   constructor(private el: ElementRef) { }

//   @HostListener('input', ['$event']) onInputChange(event: Event) {
//     const inputElement: HTMLInputElement = this.el.nativeElement;
//     const initialValue = inputElement.value;

//     const newValue = initialValue.replace(/[^0-9]/g, '');

//     if (initialValue !== newValue) {
//       inputElement.value = newValue; 
//       event.preventDefault(); 
//     }
//   }
// }

import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appOnlyNumber]'
})
export class OnlyNumberDirective {

  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event']) onInputChange(event: Event) {
    const inputElement: HTMLInputElement = this.el.nativeElement;
    const initialValue = inputElement.value;

    // Replace anything that is not a digit or a decimal point
    // Allow only one decimal point in the value
    const newValue = initialValue.replace(/[^0-9.]/g, '');

    // Check if there is more than one decimal point
    const decimalCount = (newValue.match(/\./g) || []).length;
    if (decimalCount > 1) {
      inputElement.value = newValue.substring(0, newValue.lastIndexOf('.'));
    } else if (initialValue !== newValue) {
      inputElement.value = newValue; // Update the input value if it's changed
    }
    event.preventDefault(); // Prevent the default input behavior
  }
}
