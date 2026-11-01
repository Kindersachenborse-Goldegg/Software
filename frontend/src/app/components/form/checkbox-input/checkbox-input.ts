import { Component } from '@angular/core';
import { FormField } from '@angular/forms/signals';
import { ErrorList } from '../../error-list/error-list';
import { BaseInput } from '../base-input/base-input';

@Component({
  selector: 'checkbox-input',
  imports: [FormField, ErrorList],
  templateUrl: './checkbox-input.html',
  styleUrl: './checkbox-input.css',
})
export class CheckboxInput extends BaseInput<boolean> { }
