import { Injectable } from '@angular/core';
import { IBatch, IData, IParameter, IParameterDataRow } from '../../types/pcv-model-insights';
import { EMPTY, Observable, catchError, delay, finalize, forkJoin, map, of, retry, share, tap } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParamsOptions } from '@angular/common/http';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class PcvModelInsightService {

  private readonly httpOptions: any = {
    headers: new HttpHeaders({}),
    responseType: 'text'
  };

  constructor(private http: HttpClient) {}

  public getData(data: IData, productId: string, phaseId: string, type: 'batches' | 'parameters'): Observable<any> {
    if (data.hasOwnProperty(phaseId) && data[phaseId].hasOwnProperty(type) && data[phaseId][type].loading === false && data[phaseId][type].data) {
      return of(data[phaseId][type].data as any[]);
    }
    if (data.hasOwnProperty(phaseId) && data[phaseId].hasOwnProperty(type) && data[phaseId][type].loading === true && data[phaseId][type].request) {
      return data[phaseId][type].request;
    }
    if (data.hasOwnProperty(phaseId) === false) {
      (data[phaseId] as any) = {};
    }
    data[phaseId][type] = {
      loading: true,
      data: null,
      error: false,
      request: this.http.get<any>(`api/pcv-model-insights/${productId}/${phaseId}/${type}`)
        .pipe(
          retry(2),
          delay(2000),
          tap((loadedData: IBatch[] | IParameter[]) => {
            data[phaseId][type] = {
              ...data[phaseId][type],
              loading: false,
              error: false,
              data: loadedData as any
            };
          }),
          catchError((error: HttpErrorResponse) => {
            data[phaseId][type] = {
              ...data[phaseId][type],
              loading: false,
              data: null,
              error: true
            };
            return EMPTY;
          }),
          share(),
          finalize(() => {
            data[phaseId][type] = {
              ...data[phaseId][type],
              request: null
            } as any
          })
        )
    };
    return data[phaseId][type].request;
  }

  public getParametersData(data: IData, productId: string, phaseId: string, parameterIds: string[]): {[parameterId: string]: Observable<null | IParameterDataRow[]>} {
    this.cleanUpParameterIds(data, phaseId, parameterIds);
    return parameterIds.reduce((acc: {[parameterId: string]: Observable<null | IParameterDataRow[]>}, parameterId: string) => {
      acc[parameterId] = this.getDataByParameter(data, productId, phaseId, parameterId);
      return acc;
    }, {});
  }

  private cleanUpParameterIds(data: IData, phaseId: string, parameterIds: string[]): void {
    if (data.hasOwnProperty(phaseId) && data[phaseId].hasOwnProperty('parametersData')) {
      const parameterRequestsToDelete: string[] = Object.keys(data[phaseId].parametersData).filter((existingId: string) => parameterIds.includes(existingId) === false);
      parameterRequestsToDelete.forEach((parameterId: string) => delete data[phaseId].parametersData[parameterId]);
    }
  }

  private getDataByParameter(data: IData, productId: string, phaseId: string, parameterId: string): Observable<null | IParameterDataRow[]> {
    if (data.hasOwnProperty(phaseId) && data[phaseId].hasOwnProperty('parametersData') && data[phaseId].parametersData.hasOwnProperty(parameterId) && data[phaseId].parametersData[parameterId].loading === false && data[phaseId].parametersData[parameterId].data !== null) {
      return of(data[phaseId].parametersData[parameterId].data);
    }
    if (data.hasOwnProperty(phaseId) && data[phaseId].hasOwnProperty('parametersData') && data[phaseId].parametersData.hasOwnProperty(parameterId) && data[phaseId].parametersData[parameterId].loading === true && data[phaseId].parametersData[parameterId].data === null) {
      return of(data[phaseId].parametersData[parameterId].request);
    }
    if (data.hasOwnProperty(phaseId) === false) {
      (data[phaseId] as any) = {};
    }
    if (data[phaseId].hasOwnProperty('parametersData') === false) {
      (data[phaseId]['parametersData'] as any) = {};
    }
    data[phaseId]['parametersData'][parameterId] = {
      loading: true,
      data: null,
      error: false,
      request: this.http.get<any>(`api/pcv-model-insights/${productId}/${phaseId}/parameters/${parameterId}`)
        .pipe(
          retry(2),
          delay(2000),
          tap((loadedData: IParameterDataRow[]) => {
            if (data[phaseId]['parametersData'][parameterId]) {
              data[phaseId]['parametersData'][parameterId] = {
                ...data[phaseId]['parametersData'][parameterId],
                loading: false,
                error: false,
                data: loadedData as any
              };
            }
          }),
          catchError((error: HttpErrorResponse) => {
            if (data[phaseId]['parametersData'][parameterId]) {
              data[phaseId]['parametersData'][parameterId] = {
                ...data[phaseId]['parametersData'][parameterId],
                loading: false,
                data: null,
                error: true
              };
            }
            return EMPTY;
          }),
          share(),
          finalize(() => {
            if (data[phaseId]['parametersData'][parameterId]) {
              data[phaseId]['parametersData'][parameterId] = {
                ...data[phaseId]['parametersData'][parameterId],
                request: null
              };
            }
          })
        )
    };
    return data[phaseId].parametersData[parameterId].request;
  }
}
