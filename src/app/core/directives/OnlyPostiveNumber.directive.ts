import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appOnlyPositiveNumber]'
})
export class OnlyPositiveNumberDirective {

  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event']) onInputChange(event: Event) {
    const inputElement: HTMLInputElement = this.el.nativeElement;
    const initialValue = inputElement.value;

    // Replace anything that is not a digit or a decimal point
    let newValue = initialValue.replace(/[^0-9.]/g, '');

    // Ensure only one decimal point
    const decimalCount = (newValue.match(/\./g) || []).length;
    if (decimalCount > 1) {
      newValue = newValue.substring(0, newValue.lastIndexOf('.'));
    }

    // Allow numbers like "0.5" but prevent leading zeros (like "0123") unless it's "0."
    if (newValue.startsWith('0') && newValue.length > 1 && newValue[1] !== '.') {
      newValue = newValue.replace(/^0+/, '');
    }

    // Prevent invalid numbers like just ".", and ensure the number is >= 0
    const isInvalidNumber = newValue === '.' || (newValue !== '' && parseFloat(newValue) < 0);
    if (isInvalidNumber) {
      newValue = ''; // Clear the input if it's an invalid number
    }

    // Allow valid numbers including 0.5, but not plain "0" without a decimal point
    if (newValue === '0') {
      newValue = ''; // Clear the input if it's just "0" without a decimal point
    }

    // Update the input value if it's changed
    if (initialValue !== newValue) {
      inputElement.value = newValue;
    }

    event.preventDefault(); // Prevent the default input behavior
  }
}
