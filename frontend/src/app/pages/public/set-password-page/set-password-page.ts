import { Component, inject, signal } from '@angular/core';
import { form, FormRoot, required, validateTree } from '@angular/forms/signals';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CustomPopup } from '../../../components/custom-popup/custom-popup';
import { ErrorList } from '../../../components/error-list/error-list';
import { Button } from '../../../components/form/button/button';
import { PasswordInput } from '../../../components/form/password-input/password-input';
import { LoadingSpinner } from '../../../components/loading-spinner/loading-spinner';
import { getError, Resource } from '../../../services/api-service';
import { UserService } from '../../../services/user-service';

interface SetPasswordForm {
  password: string
  password2: string
}

@Component({
  selector: 'set-password-page',
  imports: [FormRoot, PasswordInput, ErrorList, Button, LoadingSpinner, CustomPopup, RouterLink],
  templateUrl: './set-password-page.html',
  styleUrl: './set-password-page.css',
})
export class SetPasswordPage {
  private userService = inject(UserService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  private secret = signal<string>("INVALID")
  public resource = signal<Resource<string> | null>(null)
  public showPopup = signal<boolean>(false);

  private model = signal<SetPasswordForm>({ password: "", password2: "" })
  public form = form(this.model, (schema) => {
    required(schema.password, { message: "Passwort muss ausgefüllt werden" })
    required(schema.password2, { message: "Passwort muss ausgefüllt werden" })

    validateTree(schema, (ctx) => {
      if (ctx.valueOf(schema.password) !== ctx.valueOf(schema.password2)) {
        return {
          kind: "equals",
          message: "Die Passwörter stimmen nicht überein",
          fieldTree: ctx.fieldTree.password2
        }
      }

      return null;
    })
  }, {
    submission: {
      action: async (fieldTree) => {
        if (fieldTree().value().password !== fieldTree().value().password2) return { kind: "assert", message: "Passwörter stimmen nicht überein" };

        const resource = this.userService.resetPassword({
          secret: this.secret(),
          password: fieldTree().value().password
        })

        resource.subscribe((res) => {
          this.resource.set(res);
        })

        const error = await getError(resource);
        if (error) return error;

        fieldTree().reset({ password: "", password2: "" })

        this.showPopup.set(true);

        return;
      }
    }
  })

  constructor() {
    this.activatedRoute.queryParamMap.subscribe(qpm => {
      const sec = qpm.get("sec");
      if (!sec) {
        this.router.navigate(["/login"])
        return;
      }
      this.secret.set(sec)
    })
  }
}
