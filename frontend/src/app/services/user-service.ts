import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RegisterModel, RegisterResponseModel, ResetPasswordModel, ResetPasswordRequestModel } from '../models';
import { ApiService, Resource } from './api-service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiService = inject(ApiService);

  /**
   * request that an email containing a link to reset the password be sent to the specified address
   * @param data the destination email
   * @returns OK even if the user does not exist to not disclose what emails are in use
   */
  public requestPasswordReset(data: ResetPasswordRequestModel): Observable<Resource<string>> {
    const resource = this.apiService.post<ResetPasswordRequestModel, string>(
      "/reset-password",
      "LOADING",
      data);

    return resource;
  }

  /**
   * reset a users password with a secret that was sent by mail
   */
  public resetPassword(data: ResetPasswordModel): Observable<Resource<string>> {
    const resource = this.apiService.post<ResetPasswordModel, string>(
      "/set-password",
      "LOADING",
      data, {
      404: "ungültiges Secret, haben Sie die URL richtig kopiert?"
    });

    return resource;
  }

  /**
   * register a user
   */
  public register(data: RegisterModel): Observable<Resource<RegisterResponseModel>> {
    const resource = this.apiService.post<RegisterModel, RegisterResponseModel>(
      "/register",
      { nickname: "" },
      data,
      {
        403: "leider sind schon alle Plätze vergeben",
        409: "diese E-Mail Adresse wird bereits verwendet"
      }
    )

    return resource;
  }
}
