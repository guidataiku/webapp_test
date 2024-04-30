import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { IBatch, IModelType, ISelectionPhase } from '../../../../types/pcv-prediction';
import { Observable, Subject, takeUntil, tap } from 'rxjs';
import { RdsDialogRef, RdsDialogService } from '@rds/angular-components';
import { PcvPredictionSelectionBatchComponent } from '../pcv-prediction-selection-batch/pcv-prediction-selection-batch.component';
import { RdsRadioChangedEvent } from '@rds/angular-components/lib/radio-button/radio-button-changed-event';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-pcv-prediction-tab',
  templateUrl: './pcv-prediction-tab.component.html',
  styleUrl: './pcv-prediction-tab.component.scss'
})
export class PcvPredictionTabComponent implements OnInit, OnDestroy {

  @Input({ required: true }) batchesObservable!: Observable<IBatch[]>;

  @Input({ required: true }) selection!: ISelectionPhase;

  @Output() updateSelection: EventEmitter<ISelectionPhase> = new EventEmitter();

  private _batches!: IBatch[];

  private destroy$: Subject<void> = new Subject();

  public batchesLoading: boolean = true;

  constructor(private dialogService: RdsDialogService) {

  }

  get model() {
    return this.selection?.model || null;
  }

  ngOnInit() {
    this.batchesObservable.pipe(
      takeUntil(this.destroy$),
      tap((batches: IBatch[]) => this._batches = batches),
      tap(() => this.batchesLoading = false)
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public openBatchesModal(): void {
    const dialogRef: RdsDialogRef<PcvPredictionSelectionBatchComponent> = this.dialogService.open(PcvPredictionSelectionBatchComponent, { 
      data: {
        selectedBatchId: this.selection.batchId || null,
        batches: this._batches
      },
      size: 'xl'
    });
    dialogRef.afterClosed().subscribe((selectedBatchId: string | null | undefined) => {
      if (!!selectedBatchId) {
        this.updateSelection.emit({
          ...this.selection,
          batchId: selectedBatchId
        });
      }
      if (selectedBatchId === null) {
        this.updateSelection.emit({
          ...this.selection,
          batchId: null
        });
      }
    });
  }

  public updateModel(event: RdsRadioChangedEvent<any>): void {
    this.updateSelection.emit({
      ...this.selection,
      model: event.value
    });
  }
}
