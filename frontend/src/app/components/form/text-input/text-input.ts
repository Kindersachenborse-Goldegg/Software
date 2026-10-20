import { Component, input, signal } from '@angular/core';
import { BaseInput } from '../base-input/base-input';
import { FormField } from '@angular/forms/signals';

@Component({
  selector: 'text-input',
  imports: [FormField],
  templateUrl: './text-input.html',
  styleUrl: './text-input.css',
})
export class TextInput extends BaseInput<string> {
  public placeholder = input<string>("");
  public type = signal<string>("text");
  public label = input.required<string>();
}
