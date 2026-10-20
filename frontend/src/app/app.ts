import { Component, effect, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApiService } from './services/api-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private apiService = inject(ApiService);

  constructor() {
    effect(() => {
      const list = this.apiService.errorList()
      if (list.length === 0) return
      list.forEach((f) => {
        console.error(f.rawResponse)
        alert("Unerwarteter Fehler, bitte den Administrator informieren: " + f.rawResponse.message)
      })

      this.apiService.errorList.set([])
    })
  }
}
