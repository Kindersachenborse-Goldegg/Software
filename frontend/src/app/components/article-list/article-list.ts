import { CurrencyPipe } from '@angular/common';
import { Component, computed, input, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';
import { PublicItemModel } from '../../models';
import { Resource } from '../../services/api-service';
import { Button } from '../form/button/button';
import { LoadingSpinner } from '../loading-spinner/loading-spinner';

@Component({
  selector: 'article-list',
  imports: [CurrencyPipe, Button, LoadingSpinner],
  templateUrl: './article-list.html',
  styleUrl: './article-list.css',
})
export class ArticleList {
  public items = input.required<PublicItemModel[]>();
  public actions = input.required<Action[]>();
  public resources = computed<{ [index: number]: WritableSignal<Resource<any> | null> }>(() => Object.fromEntries(this.items().map(a => [a.barcode, signal(null)])))

  public runOnClick(action: Action, item: PublicItemModel, event: MouseEvent) {
    const observable = action.click(item, event);
    const res = this.resources()[item.barcode];
    observable.subscribe(o => {
      res.set(o);
    });
  }
}

export interface Action {
  type: "danger" | "warning" | "info" | "success" | "neutral",
  text: string,
  click: (item: PublicItemModel, event: MouseEvent) => Observable<Resource<any>>
  when?: ((item: PublicItemModel) => boolean) | undefined,
  disabled?: ((item: PublicItemModel) => boolean) | undefined
}