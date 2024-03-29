import { EdtRoutesNameEnum } from "enumerations/EdtRoutesNameEnum";

export interface OrchestratorEdtNavigation {
    parentPage: EdtRoutesNameEnum;
    page: EdtRoutesNameEnum;
    surveySource: string;
    surveyPage: string;
    surveySubPage?: string;
    surveyStep?: number;
}
