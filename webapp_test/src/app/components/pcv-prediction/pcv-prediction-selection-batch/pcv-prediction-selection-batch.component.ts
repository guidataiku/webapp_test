import { AfterViewInit, Component, ViewChild, inject } from '@angular/core';
import { RDS_DIALOG_DATA, RdsDialogRef, RdsSortDirective, RdsTableDataSource, SortDirection } from '@rds/angular-components';
import { IBatch } from '../../../../types/pcv-prediction';
import * as _ from 'lodash';

@Component({
  selector: 'app-pcv-prediction-selection-batch',
  templateUrl: './pcv-prediction-selection-batch.component.html',
  styleUrl: './pcv-prediction-selection-batch.component.scss'
})
export class PcvPredictionSelectionBatchComponent implements AfterViewInit {

  public readonly rdsDialogRef = inject<RdsDialogRef<PcvPredictionSelectionBatchComponent>>(RdsDialogRef);

  protected readonly data: any = inject(RDS_DIALOG_DATA);

  @ViewChild(RdsSortDirective) sort!: RdsSortDirective;

  private _selectedBatchId: string | null = this.data.selectedBatchId || null;

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

  get selectedBatchId(): string | null {
    return this._selectedBatchId;
  }

  public displayedColumns: (keyof IBatch | "actions" | "select")[] = [
    'select',
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

  public checkboxLabel(row: IBatch): string {
    return row.batch_id;
  }

  public isSelected(row: IBatch): boolean {
    return this.selectedBatchId === row.batch_id;
  }

  public toggleSelection(row: IBatch): void {
    if (this._selectedBatchId === row.batch_id) {
      this._selectedBatchId = null;
    } else {
      this._selectedBatchId = row.batch_id;
    }

  }

  public close(): void {
    this.rdsDialogRef.close();
  }

  public submit(): void {
    this.rdsDialogRef.close(this._selectedBatchId);
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
