import { RdsIconName } from "@rds/angular-components";

export interface IParameterDashboard {
    [index: number]: IParameterDashboardStep
}

export interface IParameterDashboardStep {
    items: IParameterDashboardItem[];
    stepname: string;
}

export interface IParameterDashboardItem {
    type: 'Dropdown' | 'SelectBy';
    id: string;
    labelBefore?: string;
    multiselect: boolean;
    selectBy?: ISelectByItem[];
}

export interface ISelectByItem {
    icon?: RdsIconName;
    id: string;
    label: string;
}

export type IRangeOptions = 'last_week' | 'last_month' | 'last_3_months' | 'date_range';
