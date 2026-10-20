import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const _observableToResource = <T>(response: Observable<HttpResponse<T>>, defaultValue: T): Observable<Resource<T>> => {
  return new Observable(observer => {
    observer.next({state: "loading", error: null, value: defaultValue})

    response.subscribe((res) => {
      if(res.ok) {
        observer.next({state: "done", error: null, value: res.body!}) // we assume that the server must always send a body back
        observer.complete()
      } else {
        observer.next({state: "error", error: res, value: defaultValue})
        observer.complete()
      }
    })
  })
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private httpClient = inject(HttpClient)

  /**
   * get a resource of type T
   */
  public get<T>(url: string, defaultValue: T): Observable<Resource<T>> {
    const response = this.httpClient.get<T>(url, {
      observe: 'response'
    })

    return _observableToResource(response, defaultValue);
  }

  /**
   * get a resource of type T
   */
  public post<R,T>(url: string, defaultValue: T, body: R): Observable<Resource<T>> {
    const response = this.httpClient.post<T>(url, body, {
      observe: 'response'
    })

    return _observableToResource(response, defaultValue);
  }
}

export type Resource<T>  = 
  { state: "loading", error: null, value: T } | 
  { state: "error", error: HttpResponse<any>, value: T } | 
  { state: "done", error: null, value: T }