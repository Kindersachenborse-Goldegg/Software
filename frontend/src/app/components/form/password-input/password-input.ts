import { Component } from '@angular/core';
import { TextInput } from '../text-input/text-input';
import { FormField } from '@angular/forms/signals';

@Component({
  selector: 'password-input',
  imports: [FormField],
  templateUrl: './password-input.html',
  styleUrl: './password-input.css',
})
export class PasswordInput extends TextInput {
  constructor() {
    super();
    this.type.set("password")
  }

  toggleVisibility() {
    if (this.type() == "password") {
      this.type.set("text");
    } else {
      this.type.set("password");
    }
  }
}
