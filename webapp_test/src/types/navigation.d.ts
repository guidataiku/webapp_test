import { RdsIconName } from "@rds/angular-components";
import { Observable } from "rxjs";

export interface INavigationItem {
    icon?: RdsIconName;
    translationKey: string;
    link?: string | string[];
    blank?: boolean;
}

export interface INavigationRequest {
    loading: boolean;
    data: null | INavigationItem[];
    error: boolean;
    request: null | Observable<INavigationItem[]>;
}

export interface ITreeNavigationItem extends INavigationItem {
    children?: INavigationItem[];
}