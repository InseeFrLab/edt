import { UserSurveys } from "./Api";
import { StatsHousehold } from "./StatsHouseHold";

export interface Household {
    idHousehold?: string;
    userName?: string;
    surveys?: UserSurveys[];
    surveyDate?: string;
    stats: StatsHousehold;
    campaingId: string;
    subCampaignId?: string;
}
