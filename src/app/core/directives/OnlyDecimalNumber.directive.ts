// only-number.directive.ts
import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appOnlyDecimalNumber]'
})
export class OnlyDecimalNumberDirective {

  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event']) onInputChange(event: Event) {
    const inputElement: HTMLInputElement = this.el.nativeElement;
    const initialValue = inputElement.value;

    // Replace anything that is not a digit or a decimal point, and ensure only one decimal point is present
    let newValue = initialValue.replace(/[^0-9.]/g, '');

    // Ensure only one decimal point
    const parts = newValue.split('.');
    if (parts.length > 2) {
      newValue = parts[0] + '.' + parts.slice(1).join('');
    }

    // Parse the value to a number
    const numericValue = newValue ? parseFloat(newValue) : 0;

    if (initialValue !== newValue) {
      inputElement.value = numericValue.toString(); // Update the input value if it's changed
      event.preventDefault(); // Prevent the default input behavior
    }
  }
}
