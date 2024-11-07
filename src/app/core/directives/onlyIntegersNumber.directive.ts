import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appOnlyIntegersNumber]'
})
export class OnlyIntegersNumberDirective {

 // HostListener listens to keypress events on the host element
 @HostListener('keypress', ['$event']) onKeyPress(event: KeyboardEvent) {
  const charCode = event.which ? event.which : event.keyCode;

  // Check if the input character is a number (0-9) 
  // Allow charCode between 48 (0) and 57 (9)
  if (charCode < 48 || charCode > 57) {
    event.preventDefault();  // prevent the default action (disallow character input)
  }
}

// Optionally, we can also listen to paste events to handle pasting non-integer values
@HostListener('paste', ['$event']) onPaste(event: ClipboardEvent) {
  const clipboardData = event.clipboardData || (window as any).clipboardData;
  const pastedText = clipboardData.getData('text');
  
  // Check if the pasted text contains only integers
  if (!/^[0-9]*$/.test(pastedText)) {
    event.preventDefault();  // prevent the paste if it contains non-integer values
  }
}

}
