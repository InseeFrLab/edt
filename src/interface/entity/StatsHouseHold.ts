import { StateHouseholdEnum } from "../../enumerations/StateHouseholdEnum";

export interface StatsHousehold {
    numHouseholds?: number;
    numHouseholdsInProgress?: number;
    numHouseholdsClosed?: number;
    numHouseholdsValidated?: number;
    state: StateHouseholdEnum;
}
