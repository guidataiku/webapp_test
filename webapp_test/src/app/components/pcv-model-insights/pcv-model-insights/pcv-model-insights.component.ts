import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IBatch, IBatchIdsSelection, IData, IParameter, IParameterIdsSelection, IPhaseItem } from '../../../../types/pcv-model-insights';
import { Observable, Subject, takeUntil, tap } from 'rxjs';
import { PcvModelInsightService } from '../../../services/pcv-model-insight.service';

@Component({
  selector: 'app-pcv-model-insights',
  templateUrl: './pcv-model-insights.component.html',
  styleUrl: './pcv-model-insights.component.scss'
})
export class PcvModelInsightsComponent implements OnDestroy, AfterViewInit {

  readonly PHASES_ENDPOINT = `api/pcv-model-insights/${this.product}/phases`;

  private destroy$: Subject<void> = new Subject();

  private _phases!: IPhaseItem[];

  private _activePhaseId!: string;

  private _batchIdsSelection: IBatchIdsSelection = {};

  private _parameterIdsSelection: IParameterIdsSelection = {};

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

  constructor(private http: HttpClient, private route: ActivatedRoute, private pcvModelInsightService: PcvModelInsightService) {
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

  public updateBatchesSelection(phaseId: string, batches: string[]): void {
    this._batchIdsSelection[phaseId] = batches;
  }

  public updateParametersSelection(phaseId: string, parameters: string[]): void {
    this._parameterIdsSelection[phaseId] = parameters;
  }

  public getSelectedBatchIdsByPhase(phaseId: string): string[] {
    if (this._batchIdsSelection.hasOwnProperty(phaseId)) {
      return this._batchIdsSelection[phaseId];
    }
    return [];
  }

  public getSelectedParameterIdsByPhase(phaseId: string): string[] {
    if (this._parameterIdsSelection.hasOwnProperty(phaseId)) {
      return this._parameterIdsSelection[phaseId];
    }
    return [];
  }

  public getBatchesObservable(phaseId: string): Observable<IBatch[]> {
    return this.pcvModelInsightService.getData(this._data, this.product, phaseId, 'batches');
  }

  public getParametersObservable(phaseId: string): Observable<IParameter[]> {
    return this.pcvModelInsightService.getData(this._data, this.product, phaseId, 'parameters');
  }

  
  public getParametersDataByPhase(phaseId: string): any {
    return this.pcvModelInsightService.getParametersData(this._data, this.product, phaseId, this.getSelectedParameterIdsByPhase(phaseId))
  }
}
