import axios from "axios";
import { StateDataStateEnum } from "enumerations/StateDataStateEnum";
import { SurveyData, StateData } from "interface/entity/Api";
import { LunaticData } from "interface/lunatic/Lunatic";
import { User } from "oidc-react";
import { getUserToken, getAuth } from "service/user-service";
import { stromaeBackOfficeApiBaseUrl, getHeader } from "./getRemoteData";
import jwt, { JwtPayload } from "jwt-decode";
import { logout } from "service/auth-service";
import { transformCollectedArray } from "utils/utils";

const requestPutSurveyData = (
    idSurvey: string,
    data: SurveyData,
    token?: string,
): Promise<SurveyData> => {
    const collectedData = transformCollectedArray(data?.data?.COLLECTED);
    if (data.data) {
        data.data.COLLECTED = collectedData;
        delete data.data.COLLECTED?.WEEKLYPLANNER;
        delete data.data.stateData;
    }
    console.log("requestPutSurveyData", data);
    const stateData = data.stateData;
    const putLunaticData = axios.put(
        `${stromaeBackOfficeApiBaseUrl}api/survey-unit/${idSurvey}/data`,
        data.data,
        getHeader(stromaeBackOfficeApiBaseUrl, token),
    );

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

const remotePutSurveyData = (idSurvey: string, data: SurveyData): Promise<SurveyData> => {
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

const remotePutSurveyDataReviewer = (
    idSurvey: string,
    stateData: StateData,
    data: LunaticData,
): Promise<SurveyData> => {
    //Temporar check on token validity to avoid 401 error, if not valid, reload page
    //
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

const requestPutDataReviewer = (
    idSurvey: string,
    data: LunaticData,
    token?: string,
): Promise<LunaticData> => {
    console.log("requestPutDataReviewer", data);
    data.COLLECTED = transformCollectedArray(data?.COLLECTED);
    //TODO: Find another solution to avoid ui problem
    delete data.COLLECTED?.WEEKLYPLANNER;
    return new Promise<LunaticData>(resolve => {
        axios
            .put(
                stromaeBackOfficeApiBaseUrl + "api/survey-unit/" + idSurvey + "/data",
                data,
                getHeader(stromaeBackOfficeApiBaseUrl, token),
            )
            .then(() => {
                return resolve(data);
            });
    });
};

const requestPutStateReviewer = (
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

const requestPutSurveyDataReviewer = (
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

export {
    remotePutSurveyData,
    remotePutSurveyDataReviewer,
    requestPutSurveyData,
    requestPutDataReviewer,
    requestPutStateReviewer,
    requestPutSurveyDataReviewer,
    transformCollectedArray,
};
