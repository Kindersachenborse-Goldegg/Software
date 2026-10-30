import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginModel, TokenResponseModel } from '../models';
import { ApiService, Resource } from './api-service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authToken: string | null = null

  private apiService = inject(ApiService);

  public getAuthToken(): string | null {
    return this.authToken;
  }

  /**
   * login
   */
  public login(loginData: LoginModel): Observable<Resource<TokenResponseModel>> {
    const resource = this.apiService.post<LoginModel, TokenResponseModel>(
      "/login",
      { token: "invalid" },
      loginData,
      {
        401: "Benutzername oder Passwort inkorrekt"
      });

    resource.subscribe(res => {
      if (res.state === "done") {
        this.authToken = res.value.token;
      }
    })

    return resource;
  }
}
