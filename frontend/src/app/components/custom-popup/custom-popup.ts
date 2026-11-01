import { Component, effect, ElementRef, model, OnInit, viewChild } from '@angular/core';

@Component({
  selector: 'custom-popup',
  imports: [],
  templateUrl: './custom-popup.html',
  styleUrl: './custom-popup.css',
})
export class CustomPopup implements OnInit {
  private dialog = viewChild.required<ElementRef<HTMLDialogElement>>("dialog")
  public open = model.required<boolean>()

  constructor() {
    effect(() => {
      if (this.open() !== this.dialog().nativeElement.open) {
        if (this.open()) {
          this.dialog().nativeElement.showModal()
        } else {
          this.dialog().nativeElement.close()
        }
      }

    })
  }


  ngOnInit(): void {
    this.dialog().nativeElement.addEventListener("close", (ev) => {
      this.open.set(false);
    })
  }
}
