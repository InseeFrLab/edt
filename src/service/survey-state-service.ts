import { FieldNameEnum } from "enumerations/FieldNameEnum";
import { LocalStorageVariableEnum } from "enumerations/LocalStorageVariableEnum";
import { StateDataStateEnum } from "enumerations/StateDataStateEnum";
import { getFlatLocalStorageValue } from "./local-storage-service";
import {
    getValue,
    existVariableEdited,
    getData,
    getCurrentPage,
    saveData,
    getSurveysIdsForHousehold,
} from "./survey-service";
import { Collected, LunaticData } from "interface/lunatic/Lunatic";
import { StateData } from "interface/entity/Api";

const initStateData = (data?: LunaticData) => {
    const stateData = {
        state: StateDataStateEnum.INIT,
        date: data?.lastLocalSaveDate ?? Date.now(),
        currentPage: 0,
    };
    return stateData;
};

const isDemoMode = () => {
    return getFlatLocalStorageValue(LocalStorageVariableEnum.IS_DEMO_MODE) === "true";
};

const isSurveyValidated = (idSurvey: string) => {
    const stateData = getLocalSurveyStateData(getData(idSurvey));
    return stateData.state == StateDataStateEnum.VALIDATED;
};

const isSurveyStarted = (idSurvey: string) => {
    const stateData = getLocalSurveyStateData(getData(idSurvey));
    return stateData.state == StateDataStateEnum.INIT;
};

const isSurveyCompleted = (idSurvey: string) => {
    const stateData = getLocalSurveyStateData(getData(idSurvey));
    return stateData.state == StateDataStateEnum.COMPLETED;
};

const isSurveyClosed = (idSurvey: string) => {
    const isClosed = getValue(idSurvey, FieldNameEnum.ISCLOSED) as boolean;
    return isClosed != null && isClosed;
};

const isSurveyLocked = (idSurvey: string) => {
    const isLocked = getValue(idSurvey, FieldNameEnum.ISLOCKED) as boolean;
    return (isLocked != null && isLocked) || existVariableEdited(idSurvey);
};

const getStatutSurvey = (idSurvey: string) => {
    const isLocked = getValue(idSurvey, FieldNameEnum.ISLOCKED) as boolean;
    const isValidated = isSurveyValidated(idSurvey);
    const variableEdited = existVariableEdited(idSurvey);
    if (isValidated != null && isValidated) {
        return StateDataStateEnum.VALIDATED;
    } else if ((isLocked != null && isLocked) || variableEdited) {
        return StateDataStateEnum.LOCKED;
    } else return StateDataStateEnum.INIT;
};

const getLocalSurveyStateData = (data: LunaticData): StateData => {
    const lastRemoteDate = Date.now();
    const stateData: StateData = {
        state: data.stateData?.state ?? StateDataStateEnum.INIT,
        date: lastRemoteDate,
        currentPage: getCurrentPage(data),
    };
    return stateData;
};

const lockSurvey = (idSurvey: string) => {
    const data = getData(idSurvey || "");
    const variable: Collected = {
        COLLECTED: true,
        EDITED: true,
        FORCED: null,
        INPUTED: null,
        PREVIOUS: null,
    };

    if (data.COLLECTED?.[FieldNameEnum.ISLOCKED]) {
        data.COLLECTED[FieldNameEnum.ISLOCKED] = variable;
    } else if (data.COLLECTED) {
        data.COLLECTED.ISLOCKED = variable;
    }
    return saveData(idSurvey, data, false, true);
};

const lockAllSurveys = (idHousehold: string) => {
    const idSurveys = getSurveysIdsForHousehold(idHousehold);
    const promisesToWait: Promise<any>[] = [];
    idSurveys.forEach(idSurvey => {
        const data = getData(idSurvey || "");
        const value = getValue(idSurvey, FieldNameEnum.ISLOCKED) as boolean;
        if (value == null || (value != null && !value)) {
            const variable: Collected = {
                COLLECTED: true,
                EDITED: true,
                FORCED: null,
                INPUTED: null,
                PREVIOUS: null,
            };

            if (data.COLLECTED?.[FieldNameEnum.ISLOCKED]) {
                data.COLLECTED[FieldNameEnum.ISLOCKED] = variable;
                promisesToWait.push(saveData(idSurvey, data));
            } else if (data.COLLECTED) {
                data.COLLECTED.ISLOCKED = variable;
                promisesToWait.push(saveData(idSurvey, data));
            }
        }
    });

    return new Promise(resolve => {
        Promise.all(promisesToWait).then(() => {
            resolve(true);
        });
    });
};

const validateSurvey = (idSurvey: string) => {
    const data = getData(idSurvey);
    const stateData = getLocalSurveyStateData(getData(idSurvey));
    if (stateData.state != StateDataStateEnum.VALIDATED) {
        const validatedStateData: StateData = {
            idStateData: stateData.idStateData,
            state: StateDataStateEnum.VALIDATED,
            date: Date.now(),
            currentPage: getCurrentPage(getData(idSurvey)),
        };
        return saveData(idSurvey, data, false, true, validatedStateData);
    } else {
        return saveData(idSurvey, data, false, true, stateData);
    }
};

const validateAllEmptySurveys = (idHousehold: string) => {
    const idSurveys = getSurveysIdsForHousehold(idHousehold);
    const promisesToWait: Promise<any>[] = [];
    console.log("Validate all empty surveys", idSurveys);
    idSurveys.forEach((idSurvey: string) => {
        const data = getData(idSurvey || "");
        const stateData = getLocalSurveyStateData(data);
        const validatedStateData: StateData = {
            idStateData: stateData.idStateData,
            state: StateDataStateEnum.VALIDATED,
            date: Date.now(),
            currentPage: getCurrentPage(data),
        };
        const value = getValue(idSurvey, FieldNameEnum.FIRSTNAME) as string;
        if (value == null || value.length == 0) {
            data.stateData = validatedStateData;
            promisesToWait.push(saveData(idSurvey, data, false, true, validatedStateData));
        }
    });

    return new Promise(resolve => {
        Promise.all(promisesToWait).then(() => {
            resolve(true);
        });
    });
};
export {
    initStateData,
    isDemoMode,
    isSurveyLocked,
    isSurveyValidated,
    isSurveyClosed,
    isSurveyStarted,
    isSurveyCompleted,
    getStatutSurvey,
    getLocalSurveyStateData,
    lockAllSurveys,
    lockSurvey,
    validateSurvey,
    validateAllEmptySurveys,
};
