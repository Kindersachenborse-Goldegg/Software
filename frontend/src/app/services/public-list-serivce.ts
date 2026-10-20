import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, Resource } from './api-service';
import { CreateItemModel, ListModel, ModifyItemModel, PrintListModel, PublicItemModel } from '../models';

const INVALID_LIST: ListModel = {
  id: -1,
  userId: -1,
  name: "INVALID_LIST",
  maxItemCount: -1,
  items: []
}

const INVALID_PRINT: PrintListModel = {
  unauthenticatedUrl: "https://google.com/thatdidntwork"
}

@Injectable({
  providedIn: 'root',
})
export class PublicListSerivce {
  private apiService = inject(ApiService)

  private _myLists = signal<ListModel[]>([]);

  public myLists = this._myLists.asReadonly();
  public resource = signal<Resource<ListModel[]> | null>(null);


  constructor() {
    this.apiService.get<ListModel[]>("/list", []).subscribe(resource => {
      this._myLists.set(resource.value)
      this.resource.set(resource);
    })
  }

  /**
   * create a new list
   */
  public createNewList(): Observable<Resource<ListModel[]>> {
    const resource = this.apiService.post<null, ListModel[]>("/list", [], null);
    resource.subscribe(resource => {
      if (resource.state == "done") {
        this._myLists.set(resource.value)
      }
    })

    return resource;
  }

  /**
   * add an item to a list
   */
  public addItemToList(listId: number, item: CreateItemModel): Observable<Resource<ListModel>> {
    const resource = this.apiService.post<CreateItemModel, ListModel>(`/list/${listId}`, INVALID_LIST, item)
    resource.subscribe(resource => {
      if (resource.state == "done") {
        // replace the old list with the new one
        this._myLists.update(l => [...l.filter(li => li.id !== listId), resource.value].sort((a, b) => a.id - b.id))
      }
    })
    return resource;
  }

  /**
   * change the deletion state of an item
   */
  public modifyItem(itemId: number, data: ModifyItemModel): Observable<Resource<ListModel>> {
    const resource = this.apiService.post<ModifyItemModel, ListModel>(`/item/${itemId}`, INVALID_LIST, data)
    resource.subscribe(resource => {
      if (resource.state == "done") {
        // replace the old list with the new one
        this._myLists.update(l => [...l.filter(li => li.id !== resource.value.id), resource.value].sort((a, b) => a.id - b.id))
      }
    })
    return resource;
  }

  public printList(listId: number): Observable<Resource<PrintListModel>> {
    const resource = this.apiService.post<null, PrintListModel>(`/list/${listId}/print`, INVALID_PRINT, null)

    return resource;
  }
}