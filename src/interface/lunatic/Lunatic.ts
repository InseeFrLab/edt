import { EdtRoutesNameEnum } from "routes/EdtRoutes";
export interface Collected {
    COLLECTED: string | boolean | null;
    EDITED: any;
    FORCED: any;
    INPUTED: any;
    PREVIOUS: any;
}

export interface MultiCollected {
    COLLECTED: string[] | boolean[] | null[];
    EDITED: any;
    FORCED: any;
    INPUTED: any;
    PREVIOUS: any;
}

export interface LunaticData {
    id?: string;
    EXTERNAL?: any;
    CALCULATED?: any;
    COLLECTED?: { [key: string]: Collected | MultiCollected }; // TOFIX : good var type with collected array
}

export interface LunaticModel {
    variables: LunaticModelVariable[];
    components: LunaticModelComponent[];
    maxPage: string;
}

export interface LunaticModelComponent {
    bindingDependencies?: string[];
    page?: string;
    iterations?: { value: string };
    components?: LunaticModelComponent[];
}

export interface LunaticModelVariable {
    values?: Collected | MultiCollected;
    variableType: string;
    name: string;
}

export interface OrchestratorContext {
    source: LunaticModel;
    data: LunaticData;
    idSurvey: string;
    surveyRootPage: EdtRoutesNameEnum;
    iteration?: number;
}

export interface LoopData {
    loopInitialSequencePage: string;
    loopInitialPage: string;
    loopInitialSubpage: string;
}
