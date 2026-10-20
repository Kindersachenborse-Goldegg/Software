import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private httpClient = inject(HttpClient)

  /**
   * a list of all unexpected errors to show the user
   */
  public errorList = signal<ApiError[]>([]);

  private _observableToResource = <T>(response: Observable<HttpResponse<T>>, defaultValue: T, expectedErrorCodes: ErrorCodes = {}): Observable<Resource<T>> => {
    const subj = new ReplaySubject<Resource<T>>(5);

    subj.next({ state: "loading", error: null, value: defaultValue })

    response.subscribe({
      next: (res) => {
        subj.next({ state: "done", error: null, value: res.body! }) // we assume that the server must always send a body back
        subj.complete()
      },

      error: (err: HttpErrorResponse) => {
        let errorType = "unknown";

        for (const key in expectedErrorCodes) {
          const type = expectedErrorCodes[key];

          if (parseInt(key) === err.status) {
            errorType = type;
          }
        }

        const error: ApiError = {
          errorType,
          statusCode: err.status,
          rawResponse: err
        }

        if (errorType === "unknown") {
          this.errorList.update(l => [...l, error])
        }
        subj.next({ state: "error", error, value: defaultValue })
        subj.complete()
      }
    })


    return subj;
  }

  /**
   * get a resource of type T
   * see post in {@link ApiService}
   */
  public get<T>(url: string, defaultValue: T, expectedErrorCodes?: ErrorCodes): Observable<Resource<T>> {
    const response = this.httpClient.get<T>(url, {
      observe: 'response'
    })

    return this._observableToResource(response, defaultValue, expectedErrorCodes);
  }

  /**
   * post a request
   * @param url the url without the base
   * @param defaultValue what value should the resource have when no response exists
   * @param body the body to send, must be of type R
   * @param expectedErrorCodes the error-codes which might legitimately be returned for this route, all others create a popup to warn the user. Example: {404: "item-not-found"} result.error.errorType will only ever have values which are in this object or 'unknown'
   * @returns the Resource as an Observable
   */
  public post<R, T>(url: string, defaultValue: T, body: R, expectedErrorCodes?: ErrorCodes): Observable<Resource<T>> {
    const response = this.httpClient.post<T>(url, body, {
      observe: 'response'
    })

    return this._observableToResource(response, defaultValue, expectedErrorCodes);
  }
}

export type ErrorCodes = { [key: number]: string }

export interface ApiError {
  errorType: string | "unknown"
  statusCode: number,
  rawResponse: HttpErrorResponse
}

export type Resource<T> =
  { state: "loading", error: null, value: T } |
  { state: "error", error: ApiError, value: T } |
  { state: "done", error: null, value: T }