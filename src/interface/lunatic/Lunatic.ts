import {
    AutoCompleteActiviteOption,
    CheckboxOneCustomOption,
    NomenclatureActivityOption,
} from "@inseefrlab/lunatic-edt";
import { EdtRoutesNameEnum } from "enumerations/EdtRoutesNameEnum";
import { EdtSurveyRightsEnum } from "enumerations/EdtSurveyRightsEnum";
import { ReferentielsEnum } from "enumerations/ReferentielsEnum";
import { SourcesEnum } from "enumerations/SourcesEnum";
import { SurveysIdsEnum } from "enumerations/SurveysIdsEnum";
import { ActivityRouteOrGap } from "interface/entity/ActivityRouteOrGap";
import { UserSurveys } from "interface/entity/Api";

export const REFERENTIELS_ID = "referentiels";
export const SOURCES_MODELS = "sources";
export const SURVEYS_IDS = "surveysIds";
export const USER_SURVEYS_DATA = "userSurveysData";

export interface Collected {
    COLLECTED: string | boolean | null;
    EDITED: any;
    FORCED: any;
    INPUTED: any;
    PREVIOUS: any;
}

export interface MultiCollected {
    COLLECTED: string[] | boolean[] | null[] | { [key: string]: string }[];
    EDITED: string[] | boolean[] | null[] | { [key: string]: string }[];
    FORCED: any;
    INPUTED: any;
    PREVIOUS: any;
}

export interface LunaticData {
    id?: string;
    lastRemoteSaveDate?: number;
    lastLocalSaveDate?: number;
    houseReference?: string;
    EXTERNAL?: any;
    CALCULATED?: any;
    COLLECTED?: { [key: string]: Collected | MultiCollected }; // TOFIX : good var type with collected array
    EDITED?: { [key: string]: Collected | MultiCollected };
}

export interface ReferentielData extends LunaticData {
    [ReferentielsEnum.ACTIVITYNOMENCLATURE]: NomenclatureActivityOption[];
    [ReferentielsEnum.ACTIVITYAUTOCOMPLETE]: AutoCompleteActiviteOption[];
    [ReferentielsEnum.ROUTE]: CheckboxOneCustomOption[];
    [ReferentielsEnum.MEANOFTRANSPORT]: CheckboxOneCustomOption[];
    [ReferentielsEnum.ACTIVITYSECONDARYACTIVITY]: CheckboxOneCustomOption[];
    [ReferentielsEnum.ROUTESECONDARYACTIVITY]: CheckboxOneCustomOption[];
    [ReferentielsEnum.LOCATION]: CheckboxOneCustomOption[];
    [ReferentielsEnum.KINDOFWEEK]: CheckboxOneCustomOption[];
    [ReferentielsEnum.KINDOFDAY]: CheckboxOneCustomOption[];
    [ReferentielsEnum.ACTIVITYGOAL]: CheckboxOneCustomOption[];
}

export interface SourceData extends LunaticData {
    [SourcesEnum.ACTIVITY_SURVEY]: LunaticModel;
    [SourcesEnum.WORK_TIME_SURVEY]: LunaticModel;
}

export interface SurveysIds extends LunaticData {
    [SurveysIdsEnum.ALL_SURVEYS_IDS]: string[];
    [SurveysIdsEnum.ACTIVITY_SURVEYS_IDS]: string[];
    [SurveysIdsEnum.WORK_TIME_SURVEYS_IDS]: string[];
}

export interface UserSurveysData extends LunaticData {
    data: UserSurveys[];
}

export interface LunaticModel {
    variables: LunaticModelVariable[];
    components: LunaticModelComponent[];
    maxPage: string;
    label?: string;
}

export interface LunaticModelComponent {
    bindingDependencies?: string[];
    page?: string;
    iterations?: { value: string };
    components?: LunaticModelComponent[];
    responses?: any;
    response?: any;
    id?: string;
    componentType?: string;
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
    rightsSurvey: EdtSurveyRightsEnum;
    isRoute?: boolean;
    activityOrRoute?: ActivityRouteOrGap;
    global?: boolean;
    isOpenHeader?: boolean;
}

export interface LoopData {
    loopInitialSequencePage: string;
    loopInitialPage: string;
    loopInitialSubpage: string;
    loopLastSubpage: string;
}
