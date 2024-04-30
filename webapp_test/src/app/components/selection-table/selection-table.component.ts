import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, ViewChild, inject } from '@angular/core';
import { RDS_DIALOG_DATA, RdsDialogRef, RdsSortDirective } from '@rds/angular-components';
import { Subject, takeUntil, tap } from 'rxjs';
import * as _  from 'lodash';

@Component({
  selector: 'app-selection-table',
  templateUrl: './selection-table.component.html',
  styleUrl: './selection-table.component.scss'
})
export class SelectionTableComponent implements OnDestroy {

  public readonly rdsDialogRef = inject<RdsDialogRef<SelectionTableComponent>>(RdsDialogRef);

  @ViewChild("sort", { static: true, read: RdsSortDirective })
  sort: RdsSortDirective | null = null;

  protected readonly marker: RegExp = /\${(.*?)\}/gi;

  protected readonly data: any = inject(RDS_DIALOG_DATA);

  public searchPattern: string = '';

  private rawData: any[] = [];

  private destroy$: Subject<void> = new Subject();

  public selection: string[] = [];

  private sorting: ('desc' | 'asc' | boolean)[] = this.data?.defaultSorting || [false];

  get type(): string {
    if (this.data?.hasOwnProperty('type')) {
      return (this.data as {[type: string]: string})['type'] as string;
    }
    return '';
  }

  get columns(): (string | "actions" | "multiselect")[] {
    const columns: string[] = [];
    if (this.isMultiSelect()) {
      columns.push('multiselect');
    }
    if (this.data?.hasOwnProperty('columns')) {
      columns.push(...(this.data as {[type: string]: string[]})['columns'] as string[]);
    }
    return columns;
  }

  get sortableColumns(): string[] {
    if (this.data?.hasOwnProperty('sortableColumns')) {
      return (this.data as {[type: string]: string[]})['sortableColumns'] as string[];
    }
    return [];
  }

  public getTranslationKey(prop1: string, prop2: string): string {
    return `${prop1}.${prop2}`;
  }

  public isSortable(column: string): boolean {
    if (this.sortableColumns.includes(column)) {
      return true;
    }
    return false;
  }

  public isMultiSelect(): boolean {
    return this.data?.multiselect === true;
  }

  public getSelectionKey(): string {
    return this.data.selectable;
  }

  public getSearchKey(): string {
    return this.data.search;
  }

  constructor(private http: HttpClient) {
    if ((this.data as any).endpoint) {
      const result: string[] = ((this.data as any).endpoint.uri).match(this.marker);
      const uri = result.reduce((acc: string, match: string) => {
        const key = match.replace('${', '').replace('}', '');
        acc = acc.replace(match, (this.data as any).params[key]);
        return acc;
      }, (this.data as any).endpoint.uri);

      this.http.get<any[]>(uri).pipe(
        takeUntil(this.destroy$),
        // tap((data: any[]) => this.dataSource = new RdsTableDataSource(data).init())
        tap((data: any[]) => this.rawData = data)
      ).subscribe();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  checkboxLabel(row: any): string {
    return 'test';
  }

  selectionChange(row: any): void {
    if (this.isSelected(row)) {
      _.pull(this.selection, row[this.getSelectionKey()]);
    } else {
      this.selection.push(row[this.getSelectionKey()]);
    }
  }

  isSelected(row: any): boolean {
    return this.selection.includes(row[this.getSelectionKey()]);
  }

  getFilteredSortedData(): any[] {
    let data = this.rawData;
    if (this.searchPattern?.length >= 1) {
      data = _.filter(this.rawData, (row: any) => {
        return row[this.getSearchKey()].toLowerCase().includes(this.searchPattern.toLowerCase());
      });
    }
    if (this.sorting?.length > 0  && this.data.sortableColumns?.length > 0) {
      data = _.orderBy(data, this.data.sortableColumns, this.sorting);
    }
    return data;
  }

  public submit() {
    this.rdsDialogRef.close(this.selection);
  }

  public close() {
    this.rdsDialogRef.close();
  } 
}
