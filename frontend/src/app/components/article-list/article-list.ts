import { CurrencyPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { PublicItemModel } from '../../models';
import { Button } from '../form/button/button';

@Component({
  selector: 'article-list',
  imports: [CurrencyPipe, Button],
  templateUrl: './article-list.html',
  styleUrl: './article-list.css',
})
export class ArticleList {
  public items = input.required<PublicItemModel[]>();
  public actions = input.required<Action[]>();
}

export interface Action {
  type: "danger" | "warning" | "info" | "success" | "neutral",
  text: string,
  click: (item: PublicItemModel, event: MouseEvent) => Promise<void>
  when?: ((item: PublicItemModel) => boolean) | undefined
}