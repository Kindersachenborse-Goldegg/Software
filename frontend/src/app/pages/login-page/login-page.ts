import { Component, inject, signal, WritableSignal } from '@angular/core';
import { form, FormRoot, required } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';
import { Button } from '../../components/form/button/button';
import { PasswordInput } from '../../components/form/password-input/password-input';
import { TextInput } from '../../components/form/text-input/text-input';
import { LoadingSpinner } from '../../components/loading-spinner/loading-spinner';
import { LoginModel, TokenResponseModel } from '../../models';
import { Resource } from '../../services/api-service';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'login-page',
  imports: [TextInput, FormRoot, PasswordInput, RouterLink, Button, LoadingSpinner],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage {
  private authService = inject(AuthService);

  public resource: WritableSignal<Resource<TokenResponseModel> | null> = signal(null)

  model = signal<LoginModel>({ username: "", password: "" })
  form = form(this.model, (schema) => {
    required(schema.username, { message: "Email muss ausgefüllt werden" });
    required(schema.password, { message: "Passwort muss ausgefüllt werden" });
  }, {
    submission: {
      action: async (fieldTree) => {
        this.authService.login(fieldTree().value()).subscribe(res => {
          this.resource.set(res)
        })
        fieldTree().reset({ username: "", password: "" })
      }
    }
  })
}
