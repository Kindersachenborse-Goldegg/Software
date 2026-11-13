import { Component, effect, input, signal } from '@angular/core';
import { RouterLink, UrlTree } from '@angular/router';
import { ListModel } from '../../models';
import { Bean } from '../bean/bean';

@Component({
  selector: 'mobile-list-overview',
  imports: [Bean, RouterLink],
  templateUrl: './mobile-list-overview.html',
  styleUrl: './mobile-list-overview.css',
})
export class MobileListOverview {
  public list = input.required<ListModel>();
  public routerLink2 = input.required<string | readonly any[] | UrlTree | null | undefined>();
  public colorClass = signal<string>("");
  public itemcount = signal<number>(0);

  constructor() {
    effect(() => {
      const itemc = this.list().items.filter(i => !i.deleted).length;
      this.itemcount.set(itemc)
      const percent = itemc / this.list().maxItemCount

      if (percent >= 1) {
        this.colorClass.set("red");
      } else if (percent >= 0.5) {
        this.colorClass.set("yellow");
      } else {
        this.colorClass.set("green");
      }
    })
  }
}
