import { Component, inject, signal } from '@angular/core';
import { CustomPopup } from '../../../components/custom-popup/custom-popup';
import { Button } from '../../../components/form/button/button';
import { LoadingSpinner } from '../../../components/loading-spinner/loading-spinner';
import { MobileListOverview } from '../../../components/mobile-list-overview/mobile-list-overview';
import { Resource } from '../../../services/api-service';
import { PublicListSerivce } from '../../../services/public-list-serivce';

@Component({
  selector: 'public-home-page',
  imports: [MobileListOverview, Button, LoadingSpinner, CustomPopup],
  templateUrl: './public-home-page.html',
  styleUrl: './public-home-page.css',
})
export class PublicHomePage {
  public listService = inject(PublicListSerivce);

  public canCreateList = signal<boolean>(true); // TODO
  public showErrorPopup = signal<boolean>(false);
  public resource = signal<Resource<any> | null>(null);

  public createList() {
    const obs = this.listService.createNewList();
    obs.subscribe(res => {
      this.resource.set(res);

      if (res.error) {
        this.showErrorPopup.set(true);
      }
    })
  }
}
