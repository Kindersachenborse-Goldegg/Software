import { Component, computed, input } from '@angular/core';
import { FieldTree } from '@angular/forms/signals';

@Component({
  selector: 'error-list',
  imports: [],
  templateUrl: './error-list.html',
  styleUrl: './error-list.css',
})
export class ErrorList {
  public form = input.required<FieldTree<unknown, any>>()

  public errors = computed(() => {
    return this.form()().errors().filter(e => e.kind !== "required")
  })
}
