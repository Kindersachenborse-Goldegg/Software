import { Component, inject, signal, WritableSignal } from '@angular/core';
import { form, FormRoot, required } from '@angular/forms/signals';
import { Router, RouterModule } from '@angular/router';
import { ErrorList } from '../../components/error-list/error-list';
import { Button } from '../../components/form/button/button';
import { PasswordInput } from '../../components/form/password-input/password-input';
import { TextInput } from '../../components/form/text-input/text-input';
import { LoadingSpinner } from '../../components/loading-spinner/loading-spinner';
import { LoginModel, TokenResponseModel } from '../../models';
import { getError, Resource } from '../../services/api-service';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'login-page',
  imports: [TextInput, FormRoot, PasswordInput, RouterModule, Button, LoadingSpinner, ErrorList],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage {
  private authService = inject(AuthService);
  private router = inject(Router);

  public resource: WritableSignal<Resource<TokenResponseModel> | null> = signal(null)

  model = signal<LoginModel>({ username: "", password: "" })
  form = form(this.model, (schema) => {
    required(schema.username, { message: "Email muss ausgefüllt werden" });
    required(schema.password, { message: "Passwort muss ausgefüllt werden" });
  }, {
    submission: {
      action: async (fieldTree) => {
        // make the request
        const resource = this.authService.login(fieldTree().value())

        // subscribe to all status-changes (loading, done, error)
        resource.subscribe(res => {
          this.resource.set(res)
        })

        // when the request has completed: (state is now done or error)
        const error = await getError(resource);
        if (error) return error;

        fieldTree().reset({ username: "", password: "" })
        this.router.navigate(["public"])
        return;
      }
    }
  })
}
