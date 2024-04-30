import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IBatch, IData, IPhaseItem, ISelection, ISelectionPhase } from '../../../../types/pcv-prediction';
import { Observable, Subject, takeUntil, tap } from 'rxjs';
import { PcvPredictionService } from 'src/app/services/pcv-prediction.service';

@Component({
  selector: 'app-pcv-prediction',
  templateUrl: './pcv-prediction.component.html',
  styleUrl: './pcv-prediction.component.scss'
})
export class PcvPredictionComponent implements OnDestroy, AfterViewInit {

  readonly PHASES_ENDPOINT = `api/pcv-model-insights/${this.product}/phases`;

  private destroy$: Subject<void> = new Subject();

  private _phases!: IPhaseItem[];

  private _activePhaseId!: string;

  private _selection: ISelection = {};

  private _data: IData = {};

  get product(): string {
    return this.route.snapshot.params['product'];
  }

  get phases(): IPhaseItem[] | null {
    if (this._phases?.length > 0) {
      return this._phases;
    }
    return null;
  }

  get activePhaseId(): string | null {
    if (!!this._activePhaseId) {
      return this._activePhaseId;
    }
    if (!!this._phases) {
      return (this.phases as IPhaseItem[]).find((phase: IPhaseItem) => phase.disabled === false)!.phaseId;
    }
    return null;
  }

  constructor(private http: HttpClient, private route: ActivatedRoute, private pcvPredictionService: PcvPredictionService) {
    this.loadPhases();
  }

  ngAfterViewInit(): void {

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadPhases(): void {
    this.http.get<IPhaseItem[]>(this.PHASES_ENDPOINT).pipe(
      takeUntil(this.destroy$),
      tap((phases: IPhaseItem[]) => this._phases = phases)
    ).subscribe();
  }

  public selectPhaseByPhaseId(phaseId: string) {
    this._activePhaseId = phaseId;
  }

  public updateSelection(phaseId: string, selection: ISelectionPhase): void {
    this._selection[phaseId] = selection;
  }

  public getSelectionByPhase(phaseId: string): ISelectionPhase {
    if (this._selection.hasOwnProperty(phaseId)) {
      return this._selection[phaseId];
    }
    return {
      batchId: null,
      model: null
    };
  }


  public getBatchesObservable(phaseId: string): Observable<IBatch[]> {
    return this.pcvPredictionService.getBatches(this._data, this.product, phaseId);
  }
}
