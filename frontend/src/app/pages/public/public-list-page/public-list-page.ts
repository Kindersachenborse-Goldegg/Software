import { Component, computed, effect, inject, signal } from '@angular/core';
import { form, FormRoot, required } from '@angular/forms/signals';
import { ActivatedRoute } from '@angular/router';
import { Action, ArticleList } from '../../../components/article-list/article-list';
import { ErrorList } from '../../../components/error-list/error-list';
import { Button } from '../../../components/form/button/button';
import { NumberInput, TextInput } from '../../../components/form/text-input/text-input';
import { CreateItemModel, ListModel, PublicItemModel } from '../../../models';
import { getError, getValue, Resource } from '../../../services/api-service';
import { PublicListSerivce } from '../../../services/public-list-serivce';

@Component({
  selector: 'public-list-page',
  imports: [ArticleList, FormRoot, TextInput, ErrorList, Button, NumberInput],
  templateUrl: './public-list-page.html',
  styleUrl: './public-list-page.css',
})
export class PublicListPage {
  public actions: Action[] = [
    {
      type: "danger",
      text: "bi-trash",
      click: (item: PublicItemModel, event: MouseEvent) => {
        return this.listService.modifyItem(item.barcode, { deleted: true })
      },
      when(item: PublicItemModel) {
        return !item.deleted;
      },
    },
    {
      type: "success",
      text: "bi-arrow-counterclockwise",
      click: (item: PublicItemModel, event: MouseEvent) => {
        return this.listService.modifyItem(item.barcode, { deleted: false })
      },
      when(item: PublicItemModel) {
        return item.deleted;
      },
      disabled: (item: PublicItemModel) => {
        return this.itemcount() >= this.list()!.maxItemCount;
      },
    }
  ]

  private activatedRoute = inject(ActivatedRoute);
  private listService = inject(PublicListSerivce);

  public listId = signal<number | null>(null);
  public itemcount = signal<number>(0);
  public list = computed<ListModel | null>(() => {
    if (this.listId() === null) {
      return null;
    }

    return this.listService.myLists().find(l => l.id === this.listId())!
  })

  private resource = signal<Resource<any> | null>(null)
  private model = signal<CreateItemModel>({ name: "", price: NaN, size: "" });
  public form = form(this.model, (schema) => {
    required(schema.name, { message: "Der Name muss angegeben werden" })
    required(schema.price, { message: "Der Preis muss angegeben werden" })
  }, {
    submission: {
      action: async (fieldTree) => {
        const observable = this.listService.addItemToList(this.listId()!, fieldTree().value());
        observable.subscribe(o => {
          this.resource.set(o)
        })

        const error = await getError(observable);
        if (error) return error;

        fieldTree().reset({ name: "", price: NaN, size: "" })
        return;
      }
    }
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
    })
  }

  async printList() {
    const observable = this.listService.printList(this.listId()!)
    observable.subscribe(o => {
      this.resource.set(o);
    })

    const url = await getValue(observable);
    if (url) {
      const iframe = document.createElement("iframe");
      iframe.src = url.unauthenticatedUrl;
      iframe.style = "display: none;"

      iframe.addEventListener("load", (ev) => {
        iframe.contentWindow?.print()
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 20)
      })

      document.body.appendChild(iframe)
    }
  }
}
