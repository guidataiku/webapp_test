export interface IBatch {
    batch_id: string;
    predicted_pcv_10h: number;
    predicted_pcv_60h: number;
    measured_pcv: number;
}

export interface IPhaseData {
    batches: {
        data: IBatch[] | null;
        loading: boolean;
        error: boolean;
        request: any;
    }
}

export interface ISelection {
    [phaseId: string]: ISelectionPhase;
}

export type IModelType = 'initial-model' | 'later-model' | 'both-models' | null;

export interface ISelectionPhase {
    batchId: string | null;
    model: IModelType;
}

export interface IData {
    [phaseId: string]: IPhaseData; 
}

export interface IPhaseItem {
    title: string;
    phaseId: string;
    disabled: boolean;
}