import { EdtRoutesNameEnum } from "routes/EdtRoutesMapping";

export interface OrchestratorEdtNavigation {
    parentPage: EdtRoutesNameEnum;
    page: EdtRoutesNameEnum;
    surveySource: string;
    surveyPage: string;
    surveySubPage?: string;
    surveyStep?: number;
}
