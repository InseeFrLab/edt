import { ActivityRouteOrGap } from "interface/entity/ActivityRouteOrGap";
import {
    AutoCompleteActiviteOption,
    CheckboxOneCustomOption,
    NomenclatureActivityOption,
} from "lunatic-edt";
import { EdtRoutesNameEnum } from "routes/EdtRoutesMapping";
import { ReferentielsEnum } from "service/survey-service";
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

export const REFERENTIEL_ID = "referentiels";
export interface ReferentielData extends LunaticData {
    [ReferentielsEnum.ACTIVITYNOMENCLATURE]: NomenclatureActivityOption[];
    [ReferentielsEnum.ACTIVITYAUTOCOMPLETE]: AutoCompleteActiviteOption[];
    [ReferentielsEnum.ROUTE]: CheckboxOneCustomOption[];
    [ReferentielsEnum.ACTIVITYSECONDARYACTIVITY]: CheckboxOneCustomOption[];
    [ReferentielsEnum.ROUTESECONDARYACTIVITY]: CheckboxOneCustomOption[];
    [ReferentielsEnum.LOCATION]: CheckboxOneCustomOption[];
    [ReferentielsEnum.KINDOFWEEK]: CheckboxOneCustomOption[];
    [ReferentielsEnum.KINDOFDAY]: CheckboxOneCustomOption[];
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
    responses?: any;
    response?: any;
    id?: string;
}

export interface LunaticModelVariable {
    values?: Collected | MultiCollected;
    variableType: string;
    name: string;
    componentRef?: string;
}

export interface OrchestratorContext {
    source: LunaticModel;
    data: LunaticData;
    idSurvey: string;
    surveyRootPage: EdtRoutesNameEnum;
    isRoute?: boolean;
    activityOrRoute?: ActivityRouteOrGap;
}

export interface LoopData {
    loopInitialSequencePage: string;
    loopInitialPage: string;
    loopInitialSubpage: string;
    loopLastSubpage: string;
}
