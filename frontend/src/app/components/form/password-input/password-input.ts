import { Component } from '@angular/core';
import { FormField } from '@angular/forms/signals';
import { ErrorList } from '../../error-list/error-list';
import { TextInput } from '../text-input/text-input';

@Component({
  selector: 'password-input',
  imports: [FormField, ErrorList],
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
