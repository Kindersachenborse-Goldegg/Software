import { Component, inject, signal } from '@angular/core';
import { form, FormRoot, required } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';
import { CustomPopup } from '../../../components/custom-popup/custom-popup';
import { ErrorList } from '../../../components/error-list/error-list';
import { Button } from '../../../components/form/button/button';
import { EmailInput } from '../../../components/form/text-input/text-input';
import { LoadingSpinner } from '../../../components/loading-spinner/loading-spinner';
import { ResetPasswordRequestModel } from '../../../models';
import { getError, Resource } from '../../../services/api-service';
import { UserService } from '../../../services/user-service';

@Component({
  selector: 'reset-password-page',
  imports: [EmailInput, Button, FormRoot, ErrorList, LoadingSpinner, CustomPopup, RouterLink],
  templateUrl: './reset-password-page.html',
  styleUrl: './reset-password-page.css',
})
export class ResetPasswordPage {
  private userService = inject(UserService);

  public resource = signal<Resource<string> | null>(null);
  public showPopup = signal<boolean>(false);

  public model = signal<ResetPasswordRequestModel>({ email: "" })
  public form = form(this.model, (schema) => {
    required(schema.email, { message: "Email muss ausgefüllt werden" })
  },
    {
      submission: {
        action: async (fieldTree) => {
          const resource = this.userService.requestPasswordReset(fieldTree().value());
          resource.subscribe((res) => {
            this.resource.set(res);
          })

          const error = await getError(resource);
          if (error) return error;

          this.form().reset({ email: "" })
          this.showPopup.set(true);

          return;
        }
      }
    })

  constructor() {
    if (history.state.email) { // passed by the router
      this.model.set({ email: history.state.email })
    }
  }
}
