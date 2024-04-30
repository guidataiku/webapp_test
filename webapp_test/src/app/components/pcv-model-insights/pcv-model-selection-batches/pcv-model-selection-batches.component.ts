import { AfterViewInit, Component, ViewChild, inject } from '@angular/core';
import { RDS_DIALOG_DATA, RdsDialogRef, RdsSortDirective, RdsTableDataSource, SortDirection } from '@rds/angular-components';
import { IBatch } from '../../../../types/pcv-model-insights';
import * as _ from 'lodash';

@Component({
  selector: 'app-pcv-model-selection-batches',
  templateUrl: './pcv-model-selection-batches.component.html',
  styleUrl: './pcv-model-selection-batches.component.scss'
})
export class PcvModelSelectionBatchesComponent implements AfterViewInit {

  public readonly rdsDialogRef = inject<RdsDialogRef<PcvModelSelectionBatchesComponent>>(RdsDialogRef);

  protected readonly data: any = inject(RDS_DIALOG_DATA);

  @ViewChild(RdsSortDirective) sort!: RdsSortDirective;

  private _selectedBatchIds: string[] = [...this.data.selectedBatchIds] || []

  readonly dataSource = new RdsTableDataSource(this.batches).init();

  get search(): string {
    return this.dataSource.filter;
  }

  set search(term: string) {
    this.dataSource.filter = term;
  }

  get batches(): IBatch[] {
    return this.data.batches;
  }

  get selectedBatchIds(): string[] {
    return this._selectedBatchIds;
  }

  public displayedColumns: (keyof IBatch | "actions" | "multiselect")[] = [
    'multiselect',
    'batch_id',
    'predicted_pcv_10h',
    'predicted_pcv_60h',
    'measured_pcv'
  ];

  constructor() {
    this.dataSource.filterPredicate = this.filterPredicate;
    this.dataSource.sortData = this.sortData;
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;

  }

  public isDisabled(row: IBatch): boolean {
    if (this.selectedBatchIds.includes(row.batch_id)) {
      return false;
    }
    if (this.selectedBatchIds.length === this.data.batchlimit) {
      return true;
    }
    return false;
  }

  public checkboxLabel(row: IBatch): string {
    return row.batch_id;
  }

  public isSelected(row: IBatch): boolean {
    return this.selectedBatchIds.includes(row.batch_id);
  }

  public toggleSelection(row: IBatch): void {
    if (this._selectedBatchIds.includes(row.batch_id)) {
      this._selectedBatchIds = this._selectedBatchIds.filter((batchId: string) => batchId !== row.batch_id);
    } else {
      this._selectedBatchIds = [...this.selectedBatchIds, row.batch_id];
    }
  }

  public close(): void {
    this.rdsDialogRef.close();
  }

  public submit(): void {
    this.rdsDialogRef.close(this._selectedBatchIds);
  }

  private filterPredicate(data: IBatch, filter: string): boolean {
    if (!filter) {
      return true;
    }
    return data.batch_id.toLocaleLowerCase().includes(filter.toLocaleLowerCase());
  }

  private sortData(data: IBatch[], sort: RdsSortDirective): IBatch[] {
    const active: string | null = sort.active;
    const direction: SortDirection = sort.direction;
    if (!!active && !!direction) {
      return _.orderBy(data, [active], [direction]);
    }
    return data;
  }
}
