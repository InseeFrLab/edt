import axios from "axios";
import { StateDataStateEnum } from "../../enumerations/StateDataStateEnum";
import { SurveyData, StateData } from "../../interface/entity/Api";
import { LunaticData } from "../../interface/lunatic/Lunatic";
import { User } from "oidc-react";
import { getUserToken, getAuth } from "../../service/user-service";
import { stromaeBackOfficeApiBaseUrl, getHeader } from "./getRemoteData";
import jwt, { JwtPayload } from "jwt-decode";
import { logout } from "../../service/auth-service";
import { transformCollectedArray } from "../../utils/utils";

export const requestPutSurveyData = (
    idSurvey: string,
    data: SurveyData,
    token?: string,
): Promise<SurveyData> => {
    const stateData = data.stateData;
    const tempData = { ...data };
    const collectedData = transformCollectedArray(tempData?.data?.COLLECTED);
    if (tempData.data) {
        tempData.data.COLLECTED = collectedData;
    }
    delete tempData.data.COLLECTED?.WEEKLYPLANNER;
    delete tempData.data.stateData;

    console.log("requestPutSurveyData", tempData);
    const putLunaticData = axios.put(
        `${stromaeBackOfficeApiBaseUrl}api/survey-unit/${idSurvey}/data`,
        tempData.data,
        getHeader(stromaeBackOfficeApiBaseUrl, token),
    );

    console.log("requestPutSurveyData", tempData);
    const putStateData = axios.put(
        `${stromaeBackOfficeApiBaseUrl}api/survey-unit/${idSurvey}/state-data`,
        stateData,
        getHeader(stromaeBackOfficeApiBaseUrl, token),
    );

    return Promise.all([putLunaticData, putStateData])
        .then(() => {
            return data;
        })
        .catch(error => {
            throw error;
        });
};

export const remotePutSurveyData = (idSurvey: string, data: SurveyData): Promise<SurveyData> => {
    const now = new Date();
    const tokenExpiresAt = jwt<JwtPayload>(getUserToken() ?? "").exp;
    // * 1000 because tokenExpiresAt is in seconds and now.getTime() in milliseconds
    if (!tokenExpiresAt || tokenExpiresAt * 1000 < now.getTime()) {
        let auth = getAuth();
        return auth.userManager
            .signinSilent()
            .then((user: User | null) => {
                return requestPutSurveyData(idSurvey, data, user?.access_token);
            })
            .catch(err => {
                logout();
                return Promise.reject(err);
            });
    } else {
        return requestPutSurveyData(idSurvey, data);
    }
};

export const remotePutSurveyDataReviewer = (
    idSurvey: string,
    stateData: StateData,
    data: LunaticData,
): Promise<SurveyData> => {
    const now = new Date();
    const tokenExpiresAt = jwt<JwtPayload>(getUserToken() ?? "").exp;
    // * 1000 because tokenExpiresAt is in seconds and now.getTime() in milliseconds
    if (!tokenExpiresAt || tokenExpiresAt * 1000 < now.getTime()) {
        let auth = getAuth();
        return auth.userManager
            .signinSilent()
            .then((user: User | null) => {
                return requestPutSurveyDataReviewer(idSurvey, data, stateData, user?.access_token);
            })
            .catch(err => {
                logout();
                return Promise.reject(err);
            });
    } else {
        return requestPutSurveyDataReviewer(idSurvey, data, stateData);
    }
};

export const requestPutDataReviewer = (
    idSurvey: string,
    data: LunaticData,
    token?: string,
): Promise<LunaticData> => {
    data.COLLECTED = transformCollectedArray(data?.COLLECTED);
    const tempData = { ...data };
    const collectedData = transformCollectedArray(tempData?.COLLECTED);
    tempData.COLLECTED = collectedData;
    delete tempData.COLLECTED?.WEEKLYPLANNER;
    delete tempData.stateData;
    console.log("requestPutSurveyData", tempData);

    return new Promise<LunaticData>(resolve => {
        axios
            .put(
                stromaeBackOfficeApiBaseUrl + "api/survey-unit/" + idSurvey + "/data",
                tempData,
                getHeader(stromaeBackOfficeApiBaseUrl, token),
            )
            .then(() => {
                return resolve(data);
            });
    });
};

export const requestPutStateReviewer = (
    idSurvey: string,
    data: StateData,
    token?: string,
): Promise<StateData> => {
    return new Promise<StateData>(resolve => {
        axios
            .put(
                stromaeBackOfficeApiBaseUrl + "api/survey-unit/" + idSurvey + "/state-data",
                data,
                getHeader(stromaeBackOfficeApiBaseUrl, token),
            )
            .then(() => {
                return resolve(data);
            })
            .catch(err => {
                if (err.response?.status == 404) {
                    const stateData = {
                        state: StateDataStateEnum.INIT,
                        date: Date.now(),
                        currentPage: 0,
                    };
                    return resolve(stateData);
                }
            });
    });
};

export const requestPutSurveyDataReviewer = (
    idSurvey: string,
    data: LunaticData,
    stateData: StateData,
    token?: string,
): Promise<SurveyData> => {
    return requestPutDataReviewer(idSurvey, data, token).then(() => {
        requestPutStateReviewer(idSurvey, stateData, token);
        const surveyData: SurveyData = {
            stateData: stateData,
            data: data,
        };
        return surveyData;
    });
};
