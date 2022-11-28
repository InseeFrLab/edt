import { EdtRoutesNameEnum } from "routes/EdtRoutes";

export interface OrchestratorEdtNavigation {
    parentPage: EdtRoutesNameEnum;
    page: EdtRoutesNameEnum;
    surveySource: string;
    surveyPage: string;
    surveySubPage?: string;
}
