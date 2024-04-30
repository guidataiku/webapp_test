import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { IBatch, IParameter, IParameterDataRow } from '../../../../types/pcv-model-insights';
import * as _ from 'lodash';
import { Observable, Subject, of, takeUntil, tap } from 'rxjs';
import { RdsDialogRef, RdsDialogService } from '@rds/angular-components';
import { PcvModelSelectionBatchesComponent } from '../pcv-model-selection-batches/pcv-model-selection-batches.component';
import { PcvModelSelectionParametersComponent } from '../pcv-model-selection-parameters/pcv-model-selection-parameters.component';

@Component({
  selector: 'app-pcv-model-tab',
  templateUrl: './pcv-model-tab.component.html',
  styleUrl: './pcv-model-tab.component.scss'
})
export class PcvModelTabComponent implements OnDestroy, OnInit {

  @Input({ required: true }) selectedBatchIds!: string[];

  @Input({ required: true }) selectedParameterIds!: string[];

  @Input({ required: true }) batchesObservable!: Observable<IBatch[]>;

  @Input({ required: true }) parametersObservable!: Observable<IParameter[]>;

  @Input({ required: true }) parametersData!: {[parameterId: string]: Observable<IParameterDataRow[]>};

  @Output() updateSelectedBatches = new EventEmitter<string[]>();

  @Output() updateSelectedParameters = new EventEmitter<string[]>();

  private batchlimit: number = 10;

  private _batches!: IBatch[];

  private _parameters!: IParameter[]

  public batchesLoading: boolean = true;

  public parametersLoading: boolean = true;

  private destroy$: Subject<void> = new Subject();

  get batches(): IBatch[] {
    return this._batches;
  }

  get parameters(): IParameter[] {
    return this._parameters;
  }

  constructor(private dialogService: RdsDialogService) {
    
  }

  ngOnInit(): void {
    this.batchesObservable.pipe(
      takeUntil(this.destroy$),
      tap((batches: IBatch[]) => this._batches = batches),
      tap(() => this.batchesLoading = false)
    ).subscribe();

    this.parametersObservable.pipe(
      takeUntil(this.destroy$),
      tap((parameters: IParameter[]) => this._parameters = parameters),
      tap(() => this.parametersLoading = false)
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public toggleBatch(batchId: string): void {
    if (_.includes(this.selectedBatchIds, batchId)) {
      this.updateSelectedBatches.emit(this.selectedBatchIds.filter((selectedBatchId: string) => selectedBatchId !== batchId));
    } else {
      const batches: string[] = [...this.selectedBatchIds, batchId];
      if (batches.length <= this.batchlimit) {
        this.updateSelectedBatches.emit(batches);
      }
    }
  }

  public toggleParameter(parameterId: string): void {
    if (_.includes(this.selectedParameterIds, parameterId)) {
      this.updateSelectedParameters.emit(this.selectedParameterIds.filter((selectedParameterId: string) => selectedParameterId !== parameterId));
    } else {
      const parameters: string[] = [...this.selectedParameterIds, parameterId];
      this.updateSelectedBatches.emit(parameters);
    }
  }

  public clearBatches(): void {
    this.updateSelectedBatches.emit([]);
  }

  public selectAllParameters(): void {
    this.updateSelectedParameters.emit(this._parameters.map((paramter: IParameter) => paramter.parameter_id));
  }

  public openBatchesModal(): void {
    const dialogRef: RdsDialogRef<PcvModelSelectionBatchesComponent> = this.dialogService.open(PcvModelSelectionBatchesComponent, { 
      data: {
        selectedBatchIds: this.selectedBatchIds,
        batches: this._batches,
        batchlimit: this.batchlimit
      },
      size: 'xl'
    });
    dialogRef.afterClosed().subscribe((selectedBatchIds: string[] | undefined) => {
      if (selectedBatchIds !== undefined) {
        this.updateSelectedBatches.emit(selectedBatchIds);
      }
    });
  }

  public openParametersModal(): void {
    const dialogRef: RdsDialogRef<PcvModelSelectionParametersComponent> = this.dialogService.open(PcvModelSelectionParametersComponent, { 
      data: {
        selectedParameterIds: this.selectedParameterIds,
        parameters: this._parameters
      },
      size: 'xl'
    });
    dialogRef.afterClosed().subscribe((selectedParameterIds: string[] | undefined) => {
      if (selectedParameterIds !== undefined) {
        this.updateSelectedParameters.emit(selectedParameterIds);
      }
    });
  }

  public getSelectedBatches(): IBatch[] {
    return this.batches.filter((batch: IBatch) => this.selectedBatchIds.includes(batch.batch_id))
  }

  public getParameterData(parameterId: string): Observable<IParameterDataRow[] | null> {
    if (this.parametersData.hasOwnProperty(parameterId)) {
      return this.parametersData[parameterId];
    }
    return of(null);
  }
}
