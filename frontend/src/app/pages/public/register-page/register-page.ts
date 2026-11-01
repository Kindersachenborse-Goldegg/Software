import { Component, inject, signal } from '@angular/core';
import { form, FormRoot, minLength, required, validateTree } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';
import { CustomPopup } from '../../../components/custom-popup/custom-popup';
import { ErrorList } from '../../../components/error-list/error-list';
import { Button } from '../../../components/form/button/button';
import { CheckboxInput } from '../../../components/form/checkbox-input/checkbox-input';
import { PasswordInput } from '../../../components/form/password-input/password-input';
import { EmailInput, TelInput, TextInput } from '../../../components/form/text-input/text-input';
import { LoadingSpinner } from '../../../components/loading-spinner/loading-spinner';
import { RegisterModel, RegisterResponseModel } from '../../../models';
import { getError, Resource } from '../../../services/api-service';
import { UserService } from '../../../services/user-service';

interface RegisterFormModel extends RegisterModel {
  password2: string
}

@Component({
  selector: 'register-page',
  imports: [FormRoot, TextInput, EmailInput, TelInput, PasswordInput, ErrorList, Button, LoadingSpinner, CustomPopup, CheckboxInput, RouterLink],
  templateUrl: './register-page.html',
  styleUrl: './register-page.css',
})
export class RegisterPage {
  private userService = inject(UserService);

  public resource = signal<Resource<RegisterResponseModel> | null>(null);
  public showPopup = signal<boolean>(false);
  private model = signal<RegisterFormModel>({
    firstname: "",
    lastname: "",
    city: "",
    email: "",
    phone: "",
    password: "",
    password2: "",
    accept_tnc: false
  })

  public form = form(this.model, (schema) => {
    required(schema.firstname, { message: "Der Vorname muss angegeben werden" })
    required(schema.lastname, { message: "Der Nachname muss angegeben werden" })
    required(schema.city, { message: "Der Wohnort muss angegeben werden" })
    required(schema.email, { message: "die E-mail Adresse muss angegeben werden" })
    required(schema.phone, { message: "Eine gültige Telefonnummer muss hinterlegt werden" })
    required(schema.password, { message: "Ein Passwort muss gesetzt werden" })
    required(schema.password2, { message: "Das Passwort muss wiederholt werden" })
    required(schema.accept_tnc, { message: "Sie müssen den AGBs zustimmen" })
    minLength(schema.password, 8, { message: "Das Passwort muss aus mindestens 8 Zeichen bestehen" })

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
        const resource = this.userService.register(fieldTree().value());
        resource.subscribe((res) => {
          this.resource.set(res)
        })

        const error = await getError(resource);
        if (error) return error;

        fieldTree().reset({
          firstname: "",
          lastname: "",
          city: "",
          email: "",
          phone: "",
          password: "",
          password2: "",
          accept_tnc: false
        })

        this.showPopup.set(true);

        return
      }
    }
  })
}
