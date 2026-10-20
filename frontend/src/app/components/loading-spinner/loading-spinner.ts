import { Component, computed, input } from '@angular/core';
import { Resource } from '../../services/api-service';

@Component({
  selector: 'spinner',
  imports: [],
  templateUrl: './loading-spinner.html',
  styleUrl: './loading-spinner.css',
})
export class LoadingSpinner {
  public resource = input.required<Resource<unknown> | null>();
  public isLoading = computed(() => this.resource() && this.resource()?.state == "loading")
}
