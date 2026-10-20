import { Component, effect, input, signal } from '@angular/core';
import { FieldTree } from '@angular/forms/signals';

@Component({
  imports: [],
  template: '',
  host: {
    '[className]': 'hostClass()'
  }
})
export class BaseInput<T> {
  public inputId = input.required<string>();
  public formField2 = input.required<FieldTree<T, string>>();
  public showErrorList = input<boolean>(true);

  public hostClass = signal<string>("");
  public autocomplete = input.required<string>();

  constructor() {
    effect(() => {
      if (this.formField2()().touched() && this.formField2()().invalid()) {
        this.hostClass.set("invalid")
      } else {
        this.hostClass.set("valid")
      }
    })
  }
}
