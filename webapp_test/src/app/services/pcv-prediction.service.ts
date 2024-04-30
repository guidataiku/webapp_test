import { Injectable } from '@angular/core';
import { IData, IBatch } from '../../types/pcv-prediction';
import { EMPTY, Observable, catchError, delay, finalize, of, retry, share, tap } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PcvPredictionService {

  constructor(private http: HttpClient) { }

  public getBatches(data: IData, productId: string, phaseId: string): Observable<any> {
    if (data.hasOwnProperty(phaseId) && data[phaseId].hasOwnProperty('batches') && data[phaseId].batches.loading === false && data[phaseId].batches.data) {
      return of(data[phaseId].batches.data as any[]);
    }
    if (data.hasOwnProperty(phaseId) && data[phaseId].hasOwnProperty('batches') && data[phaseId].batches.loading === true && data[phaseId].batches.request) {
      return data[phaseId].batches.request;
    }
    if (data.hasOwnProperty(phaseId) === false) {
      (data[phaseId] as any) = {};
    }
    data[phaseId]['batches'] = {
      loading: true,
      data: null,
      error: false,
      request: this.http.get<any>(`api/pcv-model-insights/${productId}/${phaseId}/batches`)
        .pipe(
          retry(2),
          delay(2000),
          tap((loadedData: IBatch[]) => {
            data[phaseId].batches = {
              ...data[phaseId].batches,
              loading: false,
              error: false,
              data: loadedData as any
            };
          }),
          catchError((error: HttpErrorResponse) => {
            data[phaseId].batches = {
              ...data[phaseId].batches,
              loading: false,
              data: null,
              error: true
            };
            return EMPTY;
          }),
          share(),
          finalize(() => {
            data[phaseId].batches = {
              ...data[phaseId].batches,
              request: null
            } as any
          })
        )
    };
    return data[phaseId].batches.request;
  }
}
