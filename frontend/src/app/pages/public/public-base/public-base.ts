import { Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../services/auth-service';

@Component({
  selector: 'public-base',
  imports: [RouterOutlet],
  templateUrl: './public-base.html',
  styleUrl: './public-base.css',
})
export class PublicBase {
  private location = inject(Location)
  private authService = inject(AuthService);
  private router = inject(Router);


  back() {
    this.location.back()
  }

  logout() {
    this.authService.resetToken()
    this.router.navigate(["/"])
  }
}
