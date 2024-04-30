import { Component, OnDestroy, inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { IRangeOptions } from '../../../types/parameter-dashboard-form';
import { Subject, Subscription, filter, map, takeUntil, tap } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { RDS_DIALOG_DATA, RdsDialogRef } from '@rds/angular-components';

@Component({
  selector: 'app-selection-date-range',
  templateUrl: './selection-date-range.component.html',
  styleUrl: './selection-date-range.component.scss'
})
export class SelectionDateRangeComponent implements OnDestroy {
  
  public readonly rdsDialogRef = inject<RdsDialogRef<SelectionDateRangeComponent>>(RdsDialogRef);

  protected readonly marker: RegExp = /\${(.*?)\}/gi;

  protected readonly data: any = inject(RDS_DIALOG_DATA);

  public showResult: boolean = false;

  public subscription!: Subscription;

  public ranges: IRangeOptions[] = [
    'last_week',
    'last_month',
    'last_3_months',
    'date_range'
  ];

  public dateNow: Date = new Date(Date.now());

  public form: FormGroup = new FormGroup({
    type: new FormControl(null),
    range: new FormGroup({
      from: new FormControl({value: null, disabled: true}),
      to: new FormControl({value: null, disabled: true})
    })
  });

  public selection: string[] = [];

  private destroy$: Subject<void> = new Subject();

  constructor(private http: HttpClient) {
    this.getTypeFormControl().valueChanges.pipe(
      takeUntil(this.destroy$),
      tap((type: IRangeOptions) => this.updateBySelection(type))
    ).subscribe();
    this.getRangeFormGroup().valueChanges.pipe(
      takeUntil(this.destroy$),
      filter((data: any) => data.from !== null && data.to !== null),
      tap((data: any) => this.performRequest('date_range', data))
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public getTypeFormControl(): FormControl {
    return this.form.get('type') as FormControl;
  }

  public getRangeFormGroup(): FormGroup {
    return this.form.get('range') as FormGroup;
  }

  private updateBySelection(type: IRangeOptions): void {
    this.showResult = false;
    const from: FormControl = this.getRangeFormGroup().get('from') as FormControl;
    const to: FormControl = this.getRangeFormGroup().get('to') as FormControl;
    if (type === 'date_range') {
      from.enable();
      to.enable();
    } else {
      from.setValue(null);
      to.setValue(null);
      from.disable();
      to.disable();
      this.performRequest(type);
    }
  }

  private performRequest(type: IRangeOptions, dateParams?: any) {
    let params: HttpParams;
    if (type !== 'date_range') {
      params = new HttpParams()
        .set('interval', type);
    } else {
      params = new HttpParams()
        .set('start_date', (dateParams.from as Date).toISOString())
        .set('end_date', (dateParams.to as Date).toISOString());
    }
    this.subscription = this.http.get(this.getUri(), {params}).pipe(
      takeUntil(this.destroy$),
      tap((data: any) => {
        this.selection = data.map((el: any) => el['batch_id']);
        this.showResult = true;
      })
    ).subscribe();
  }

  private getUri(): string {
    const result: string[] = ((this.data as any).endpoint).match(this.marker);
    return result.reduce((acc: string, match: string) => {
      const key = match.replace('${', '').replace('}', '');
      acc = acc.replace(match, (this.data as any).params[key]);
      return acc;
    }, (this.data as any).endpoint);
  }

  public reset() {
    this.rdsDialogRef.close([]);
  }

  public submit() {
    this.rdsDialogRef.close(this.selection);
  }

  public close() {
    this.rdsDialogRef.close();
  }
}
