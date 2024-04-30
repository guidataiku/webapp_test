export interface IPhase {
    selectedBatchs: string[];
    selectedParamters: string[];
} 

export interface IPcvModelInsights {
    [phaseId: string]: IPhase;
}

export interface IBatch {
    batch_id: string;
    predicted_pcv_10h: number;
    predicted_pcv_60h: number;
    measured_pcv: number;
    outlier_flag: boolean;
    [parameterId: string]: any;
}

export interface IParameter {
    parameter_id: string;
    description: string;
}

export interface IPhaseItem {
    title: string;
    phaseId: string;
    disabled: boolean;
}

export interface IPhaseData {
    batches: {
        data: IBatch[] | null;
        loading: boolean;
        error: boolean;
        request: any;
    },
    parameters: {
        data: IParameter[] | null;
        loading: boolean;
        error: boolean;
        request: any;
    }
    parametersData: {
        [parameterId: string]: {
            data: IParameterDataRow[] | null;
            loading: boolean;
            error: boolean;
            request: any;
        }
    }
}

export interface IData {
    [phaseId: string]: IPhaseData; 
}

export interface IBatchIdsSelection {
    [phaseId: string]: string[];
}

export interface IParameterIdsSelection {
    [parameterId: string]: string[];
}

export interface IParameterDataRow {
    x: number;
    y: number;
}
