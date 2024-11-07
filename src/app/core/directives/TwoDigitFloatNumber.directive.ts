import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[TwoDigitFloatNumber]'
})
export class TwoDigitFloatNumber {

  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event']) onInputChange(event: Event) {
    const inputElement: HTMLInputElement = this.el.nativeElement;
    const initialValue = inputElement.value;

    // Replace anything that is not a digit or a decimal point
    let newValue = initialValue.replace(/[^0-9.]/g, '');

    // Allow only one decimal point in the value and limit to two decimal places
    const decimalIndex = newValue.indexOf('.');
    if (decimalIndex !== -1) {
      newValue = newValue.substring(0, decimalIndex + 1 + 2);
    }

    // Check if the input value changed and round it to two decimal places if necessary
    if (initialValue !== newValue) {
      inputElement.value = newValue; // Update the input value if it’s changed
    }

    // Convert the value to a float and round it to two decimal places
    const roundedValue = parseFloat(inputElement.value).toFixed(2);
    if (!isNaN(+roundedValue)) {
      inputElement.value = roundedValue; // Assign the rounded value to input
    }

    event.preventDefault(); // Prevent the default input behavior
  }
}
