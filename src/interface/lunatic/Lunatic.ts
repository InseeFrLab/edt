export interface Collected {
    COLLECTED: string | boolean | null;
    EDITED: any;
    FORCED: any;
    INPUTED: any;
    PREVIOUS: any;
}

export interface LunaticData {
    id?: string;
    EXTERNAL?: any;
    CALCULATED?: any;
    COLLECTED?: { [key: string]: Collected };
}

export interface LunaticModel {
    variables: LunaticModelVariable[];
    components: LunaticModelComponent[];
    maxPage: string;
}

export interface LunaticModelComponent {
    bindingDependencies?: string[];
    page: string;
}

export interface LunaticModelVariable {
    values?: Collected;
    variableType: string;
    name: string;
}

export interface OrchestratorContext {
    source: LunaticModel;
    data: LunaticData;
    idSurvey: string;
}
