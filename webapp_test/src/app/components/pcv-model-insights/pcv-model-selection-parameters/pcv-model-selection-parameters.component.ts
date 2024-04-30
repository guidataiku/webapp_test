
import { AfterViewInit, Component, ViewChild, inject } from '@angular/core';
import { RDS_DIALOG_DATA, RdsDialogRef, RdsSortDirective, RdsTableDataSource, SortDirection } from '@rds/angular-components';
import { IParameter } from '../../../../types/pcv-model-insights';
import * as _ from 'lodash';

@Component({
  selector: 'app-pcv-model-selection-parameters',
  templateUrl: './pcv-model-selection-parameters.component.html',
  styleUrl: './pcv-model-selection-parameters.component.scss'
})
export class PcvModelSelectionParametersComponent implements AfterViewInit {

  public readonly rdsDialogRef = inject<RdsDialogRef<PcvModelSelectionParametersComponent>>(RdsDialogRef);

  protected readonly data: any = inject(RDS_DIALOG_DATA);

  @ViewChild(RdsSortDirective) sort!: RdsSortDirective;

  private _selectedParameterIds: string[] = [...this.data.selectedParameterIds] || []

  readonly dataSource = new RdsTableDataSource(this.parameters).init();

  get search(): string {
    return this.dataSource.filter;
  }

  set search(term: string) {
    this.dataSource.filter = term;
  }

  get parameters(): IParameter[] {
    return this.data.parameters;
  }

  get selectedParameterIds(): string[] {
    return this._selectedParameterIds;
  }

  public displayedColumns: (keyof IParameter | "actions" | "multiselect")[] = [
    'multiselect',
    'parameter_id'
  ]

  constructor() {
    this.dataSource.filterPredicate = this.filterPredicate;
    this.dataSource.sortData = this.sortData;
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;

  }

  public isDisabled(row: IParameter): boolean {
    if (this.selectedParameterIds.includes(row.parameter_id)) {
      return false;
    }
    return false;
  }

  public checkboxLabel(row: IParameter): string {
    return row.parameter_id;
  }

  public isSelected(row: IParameter): boolean {
    return this.selectedParameterIds.includes(row.parameter_id);
  }

  public toggleSelection(row: IParameter): void {
    if (this._selectedParameterIds.includes(row.parameter_id)) {
      this._selectedParameterIds = this._selectedParameterIds.filter((parameterId: string) => parameterId !== row.parameter_id);
    } else {
      this._selectedParameterIds = [...this.selectedParameterIds, row.parameter_id];
    }
  }

  public close(): void {
    this.rdsDialogRef.close();
  }

  public submit(): void {
    this.rdsDialogRef.close(this._selectedParameterIds);
  }

  public submitAll(): void {
    this.rdsDialogRef.close(this.parameters.map((paramater: IParameter) => paramater.parameter_id));
  }

  private filterPredicate(data: IParameter, filter: string): boolean {
    if (!filter) {
      return true;
    }
    return data.parameter_id.toLocaleLowerCase().includes(filter.toLocaleLowerCase());
  }

  private sortData(data: IParameter[], sort: RdsSortDirective): IParameter[] {
    const active: string | null = sort.active;
    const direction: SortDirection = sort.direction;
    if (!!active && !!direction) {
      return _.orderBy(data, [active], [direction]);
    }
    return data;
  }

  public selectAll(): void {
    this._selectedParameterIds = this.dataSource.filteredData.map((filteredRow: IParameter) => filteredRow.parameter_id);
  }

  public deselectAll(): void {
    const filteredIds: string[] = this.dataSource.filteredData.map((filteredRow: IParameter) => filteredRow.parameter_id);
    this._selectedParameterIds = this._selectedParameterIds.filter((selectedId: string) => filteredIds.includes(selectedId) === false);

  }

  public isIntermediate(): boolean {
    const filteredIds: string[] = this.dataSource.filteredData.map((filteredRow: IParameter) => filteredRow.parameter_id);
    const someChecked: boolean = _.some(filteredIds, (filteredId: string) => this._selectedParameterIds.includes(filteredId));
    const someUnchecked: boolean = _.some(filteredIds, (filteredId: string) => this._selectedParameterIds.includes(filteredId) === false);
    if (someChecked && someUnchecked) {
      return true;
    }
    return false;
  }

  public isAllChecked(): boolean {
    const filteredIds: string[] = this.dataSource.filteredData.map((filteredRow: IParameter) => filteredRow.parameter_id);
    if (_.some(filteredIds, (filteredId: string) => this._selectedParameterIds.includes(filteredId) === false)) {
      return false;
    }
    return true;
  }

  public allCheckboxLabel(): string {
    return 'Toggle all';
  }
}
