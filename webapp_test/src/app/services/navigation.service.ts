import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, delay, EMPTY, finalize, Observable, of, retry, share, tap } from 'rxjs';
import { INavigationItem, INavigationRequest } from '../../types/navigation';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  private navigations: {[key: string]: INavigationRequest} = {}; 

  constructor(private http: HttpClient) { }

  getNavigationByChapter(chapter: string): Observable<INavigationItem[]> {
    if (this.navigations.hasOwnProperty(chapter) && this.navigations[chapter].loading === false && this.navigations[chapter].data !== null) {
      return of(this.navigations[chapter].data as INavigationItem[]);
    }
    if (this.navigations.hasOwnProperty(chapter) && this.navigations[chapter].loading === true && this.navigations[chapter].request !== null) {
      return this.navigations[chapter].request as Observable<INavigationItem[]>;
    }
    this.navigations[chapter] = {
      loading: true,
      data: null,
      error: false,
      request: this.http.get<any>(`./assets/mock/${chapter}/navigation.json`)
        .pipe(
          retry(2),
          delay(2000),
          tap((data: INavigationItem[]) => {
            this.navigations[chapter] = {
              ...this.navigations[chapter], 
              loading: false,
              data: data
            };
          }),
          catchError((error: HttpErrorResponse) => {
            this.navigations[chapter] = {
              ...this.navigations[chapter], 
              loading: false,
              data: null,
              error: true
            };
            return EMPTY;
          }),
          share(),
          finalize(() => {
            this.navigations[chapter] = {
              ...this.navigations[chapter], 
              request: null
            };
          })
        )
    };
    return this.navigations[chapter].request as Observable<INavigationItem[]>;
  }
}
