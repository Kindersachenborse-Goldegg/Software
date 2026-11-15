import { Component, computed, input } from '@angular/core';
import { Resource } from '../../services/api-service';

@Component({
  selector: 'fullscreen-spinner',
  imports: [],
  templateUrl: './fullscreen-spinner.html',
  styleUrl: './fullscreen-spinner.css',
})
export class FullscreenSpinner {
  public resource = input.required<Resource<unknown> | null>();
  public isLoading = computed(() => this.resource() && this.resource()?.state == "loading")
}
