import { StateDataStateEnum } from "enumerations/StateDataStateEnum";
import { LunaticData } from "interface/lunatic/Lunatic";

export interface UserSurveys {
    id: number;
    campaignId: string;
    interviewerId: string;
    questionnaireModelId: string;
    reviewerId: string;
    surveyUnitId: string;
}

export interface SurveyData {
    stateData?: StateData;
    data: LunaticData;
}

export interface StateData {
    state: StateDataStateEnum | null;
    date: number;
    currentPage: number;
}
