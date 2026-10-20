import { Component, input } from '@angular/core';

@Component({
  selector: 'custom-button',
  imports: [],
  templateUrl: './button.html',
  styleUrl: './button.css',
})
export class Button {
  disabled = input<boolean>(false);
  type = input.required<"danger" | "warning" | "info" | "success" | "neutral">()
  isNoSubmit = input<boolean>(false);
}
