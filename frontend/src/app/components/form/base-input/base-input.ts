import { Component, input } from '@angular/core';
import { FieldTree } from '@angular/forms/signals';

type AutocompleteSection = `section-${string}`;
type AutocompleteModifier = "shipping" | "billing";
type AutocompleteContact = "home" | "work" | "mobile" | "fax" | "pager";

type AutocompleteField =
  | "name"
  | "honorific-prefix"
  | "given-name"
  | "additional-name"
  | "family-name"
  | "honorific-suffix"
  | "nickname"
  | "email"
  | "username"
  | "new-password"
  | "current-password"
  | "one-time-code"
  | "webauthn"
  | "organization-title"
  | "organization"
  | "street-address"
  | "address-line1"
  | "address-line2"
  | "address-line3"
  | "address-level4"
  | "address-level3"
  | "address-level2"
  | "address-level1"
  | "country"
  | "country-name"
  | "postal-code"
  | "cc-name"
  | "cc-given-name"
  | "cc-additional-name"
  | "cc-family-name"
  | "cc-number"
  | "cc-exp"
  | "cc-exp-month"
  | "cc-exp-year"
  | "cc-csc"
  | "cc-type"
  | "transaction-currency"
  | "transaction-amount"
  | "language"
  | "bday"
  | "bday-day"
  | "bday-month"
  | "bday-year"
  | "sex"
  | "url"
  | "photo"
  | "impp"
  | "tel"
  | "tel-country-code"
  | "tel-national"
  | "tel-area-code"
  | "tel-local"
  | "tel-local-prefix"
  | "tel-local-suffix"
  | "tel-extension";

type AutocompleteToken =
  | AutocompleteField
  | `${AutocompleteContact} ${AutocompleteField}`
  | `${AutocompleteModifier} ${AutocompleteField}`
  | `${AutocompleteModifier} ${AutocompleteContact} ${AutocompleteField}`;

export type HTMLAutocompleteAttribute =
  | "on"
  | "off"
  | AutocompleteToken
  | `${AutocompleteSection} ${AutocompleteToken}`
  | `${AutocompleteSection} ${AutocompleteField}`;

@Component({
  imports: [],
  template: '',
  host: {
    '[class.valid]': 'formField2()().touched() && formField2()().valid()',
    '[class.invalid]': 'formField2()().touched() && formField2()().invalid()'
  }
})
export class BaseInput<T> {
  public inputId = input.required<string>();
  public formField2 = input.required<FieldTree<T, string>>();
  public showErrorList = input<boolean>(true);

  public autocomplete = input.required<HTMLAutocompleteAttribute>();
  public autofocus = input<boolean>(false);
}
