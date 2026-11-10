import { Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Action, ArticleList } from '../../../components/article-list/article-list';
import { Bean } from '../../../components/bean/bean';
import { ListModel, PublicItemModel } from '../../../models';
import { PublicListSerivce } from '../../../services/public-list-serivce';

@Component({
  selector: 'public-list-page',
  imports: [ArticleList, Bean],
  templateUrl: './public-list-page.html',
  styleUrl: './public-list-page.css',
})
export class PublicListPage {
  public actions: Action[] = [
    {
      type: "success",
      text: "a",
      click: async (item: PublicItemModel, event: MouseEvent) => {

      }
    }
  ]

  private activatedRoute = inject(ActivatedRoute);
  private listService = inject(PublicListSerivce);

  public listId = signal<number | null>(null);
  public itemcount = signal<number>(0);
  public colorClass = signal<string>("");
  public list = computed<ListModel | null>(() => {
    if (this.listId() === null) {
      return null;
    }

    return this.listService.myLists().find(l => l.id === this.listId())!
  })

  constructor() {
    this.activatedRoute.paramMap.subscribe(pm => {
      const id = parseInt(pm.get("id")!);
      this.listId.set(id);
    })

    effect(() => {
      if (this.list() === null) return;
      const itemc = this.list()!.items.filter(i => !i.deleted).length;
      this.itemcount.set(itemc)

      const percent = itemc / this.list()!.maxItemCount

      if (percent == 1) {
        this.colorClass.set("red");
      } else if (percent >= 0.5) {
        this.colorClass.set("yellow");
      } else {
        this.colorClass.set("green");
      }
    })
  }
}
