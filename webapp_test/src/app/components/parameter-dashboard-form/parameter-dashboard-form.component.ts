import { Component } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { environment } from '@environment';
import { RdsDialogRef, RdsDialogService } from '@rds/angular-components';
import { SelectionTableComponent } from '../selection-table/selection-table.component';
import { IParameterDashboard, IParameterDashboardItem, IParameterDashboardStep } from '../../../types/parameter-dashboard-form';
import { SelectionDateRangeComponent } from '../selection-date-range/selection-date-range.component';
import * as _ from 'lodash';
import { throws } from 'assert';
import { SelectionTreeTableComponent } from '../selection-tree-table/selection-tree-table.component';

@Component({
  selector: 'app-parameter-dashboard-form',
  templateUrl: './parameter-dashboard-form.component.html',
  styleUrl: './parameter-dashboard-form.component.scss'
})
export class ParameterDashboardFormComponent {

  public definition!: IParameterDashboardStep[];

  public form!: FormGroup;

  private dialog!: RdsDialogRef<any>;

  constructor(private route: ActivatedRoute, private dialogService: RdsDialogService) {
    const type: 'stability' | 'univariety' | 'bivariate' = this.route.snapshot.paramMap.get('type') as 'stability' | 'univariety' | 'bivariate';
    this.definition = environment.forms.hasOwnProperty(type) ? environment.forms[type] as IParameterDashboardStep[] : [];
    this.form = (this.definition).reduce((form: FormGroup, step: IParameterDashboardStep, stepIndex: number) => {
        const stepFormGroup = step.items.reduce((stepForm: FormGroup, item: IParameterDashboardItem) => {
          stepForm.addControl(item.id, item.multiselect === true ? new FormArray([]) : new FormControl(null));
          return stepForm;
        }, new FormGroup({}));
        form.addControl(this.getStepId(stepIndex), stepFormGroup);
        return form;
    }, new FormGroup({}));
  }

  public openModal(stepIndex: number, itemId: string, modalType: string): void {
    console.log('asd')
    if (modalType === 'byDate') {
      this.dialog = this.dialogService.open(SelectionDateRangeComponent, {
        data: {
          params: this.getParamsByKeys(['product']),
          endpoint: 'api/products/${product}/batches'
        }
      });
    } else {
      const tableDefinition: any | null = this.getTableDefinition(modalType);
      const component: any = tableDefinition.type === 'selection-table' ? SelectionTableComponent : SelectionTreeTableComponent;
      if (tableDefinition) {
        this.dialog = this.dialogService.open(component, {
          data: {
            type: modalType,
            params: this.getParamsByKeys(tableDefinition.params),
            ...tableDefinition
          }
        });

      }
    }
    this.dialog.afterClosed().subscribe((val: string[] | undefined) => {
      if (val !== undefined) {
        this.addValues(stepIndex, itemId, val);
      }
    });
  }

  private addValues(stepIndex: number, itemId: string, values: string[]): void {
    const formControls: FormControl[] = values.map((value: string) => new FormControl(value));
    (this.form.get(this.getStepId(stepIndex)) as FormGroup).setControl(itemId, new FormArray(formControls));
  }

  private getTableDefinition(modalType: string): any | null {
    if (environment.selectionTables.hasOwnProperty(modalType)) {
      return (environment.selectionTables as {[type: string]: any})[modalType];
    }
    return null;
  }

  private getStepId(index: number): string {
    return `step-${index}`;
  }

  public getStepControl(index: number): FormGroup {
    return this.form.controls[this.getStepId(index)] as FormGroup;
  }

  public getFormArrayControls(index: number, itemId: string): AbstractControl[] {
    return (this.getStepControl(index).get(itemId) as FormArray).controls;
  }

  public getItemControl(index: number, itemId: string): FormControl {
    return this.getStepControl(index).get(itemId) as FormControl;
  }

  private getFormValues(): any {
    return Object.keys(this.form.value).reduce((acc: any, key: string) => {
      return {
        ...acc,
        ...this.form.value[key]
      };
    }, {});
  }

  private getParamsByKeys(keys: string[]): any {
    const formValues = this.getFormValues();
    return _.reduce(keys, (acc: any, key: string) => {
      acc[key] = formValues[key];
      return acc;
    }, {});
  }

  public isStepDisabled(step: IParameterDashboardStep): boolean {
    const formValues: any = this.getFormValues();
    return _.some(step.items, (item: IParameterDashboardItem) => {
      const id = item.id;
      if (item.multiselect) {
        return formValues[id].length === 0;
      }
      return formValues[id] === null;
    });
  }

  public onRemoveFromArray(stepIndex: number, itemId: string, index: number): void {
    ((this.form.get(this.getStepId(stepIndex)) as FormGroup).get(itemId) as FormArray).removeAt(index);
  }
}