import axios from "axios";
import { ErrorCodeEnum } from "../../enumerations/ErrorCodeEnum";
import { StateData, SurveyData, UserSurveys } from "../../interface/entity/Api";
import { LunaticData } from "../../interface/lunatic/Lunatic";
import { initStateData, initSurveyData } from "../survey-service";
import { getUserToken } from "../user-service";
import { revertTransformedArray } from "../../utils/utils";

export const edtOrganisationApiBaseUrl = import.meta.env.VITE_EDT_ORGANISATION_API_BASE_URL;
export const stromaeBackOfficeApiBaseUrl = import.meta.env.VITE_STROMAE_BACK_OFFICE_API_BASE_URL;

axios.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if (error?.response?.status === 401) {
            window.location.reload();
            return Promise.reject(error);
        }
        return Promise.reject(error);
    },
);

export const getHeader = (origin?: string, userToken?: string) => {
    return {
        headers: {
            "Authorization": "Bearer " + (userToken ?? getUserToken()),
            "Access-Control-Allow-Origin": origin ?? "*",
            "Content-type": "application/json",
        },
    };
};

export const fetchUserSurveysInfo = (
    setError: (error: ErrorCodeEnum) => void,
): Promise<UserSurveys[]> => {
    return new Promise(resolve => {
        axios
            .get(
                edtOrganisationApiBaseUrl + "api/survey-assigment/interviewer/my-surveys",
                getHeader(edtOrganisationApiBaseUrl),
            )
            .then(response => {
                const data: UserSurveys[] = response.data;
                resolve(data);
            })
            .catch(err => {
                if (err.response?.status === 403) {
                    setError(ErrorCodeEnum.NO_RIGHTS);
                } else {
                    setError(ErrorCodeEnum.UNREACHABLE_SURVEYS_ASSIGNMENTS);
                }
            });
    });
};

export const fetchReviewerSurveysAssignments = (
    setError: (error: ErrorCodeEnum) => void,
): Promise<UserSurveys[]> => {
    return new Promise(resolve => {
        axios
            .get(
                edtOrganisationApiBaseUrl + "api/survey-assigment/reviewer/my-surveys",
                getHeader(edtOrganisationApiBaseUrl),
            )
            .then(response => {
                resolve(response.data);
            })
            .catch(err => {
                if (err.response?.status === 403) {
                    setError(ErrorCodeEnum.NO_RIGHTS);
                } else {
                    setError(ErrorCodeEnum.UNREACHABLE_SOURCE);
                }
            });
    });
};

export const remoteGetSurveyData = (
    interrogationId: string,
    setError?: (error: ErrorCodeEnum) => void,
): Promise<SurveyData> => {
    return new Promise(resolve => {
        axios
            .get(
                `${stromaeBackOfficeApiBaseUrl}api/interrogations/${interrogationId}/data`,
                getHeader(stromaeBackOfficeApiBaseUrl),
            )
            .then(response => {
                if (response.data.COLLECTED != null) {
                    try {
                        const revertedTranformedData = revertTransformedArray(response.data.COLLECTED);
                        response.data.COLLECTED = revertedTranformedData;
                    } catch (error) {
                        console.error("Error reverting transformed data:", error);
                    }
                    resolve(response.data);
                }
                resolve(response.data);
            })
            .catch(err => {
                if (err.response?.status === 403) {
                    setError?.(ErrorCodeEnum.NO_RIGHTS);
                } else if (err.response?.status != 404) {
                    setError?.(ErrorCodeEnum.UNREACHABLE_SURVEYS_DATAS);
                }
            });
    });
};

export const remoteGetSurveyStateData = (
    interrogationId: string,
    setError?: (error: ErrorCodeEnum) => void,
): Promise<StateData> => {
    return new Promise(resolve => {
        axios
            .get(
                `${stromaeBackOfficeApiBaseUrl}api/interrogations/${interrogationId}/state-data`,
                getHeader(stromaeBackOfficeApiBaseUrl),
            )
            .then(response => {
                const stateData: StateData = response.data;
                resolve(stateData);
            })
            .catch(err => {
                if (err.response?.status === 403) {
                    setError?.(ErrorCodeEnum.NO_RIGHTS);
                } else if (err.response?.status != 404) {
                    setError?.(ErrorCodeEnum.UNREACHABLE_SURVEYS_DATAS);
                }
                //Temp fix for reviewer refresh mode when state data is not available (when survey is not started)
                //data is initialized on first login but state data isn't
                const stateData = initStateData();
                resolve(stateData);
            });
    });
};

export const requestGetDataReviewer = (
    idSurvey: string,
    interrogationId: string,
    setError: (error: ErrorCodeEnum) => void,
): Promise<LunaticData> => {
    return new Promise<LunaticData>(resolve => {
        axios
            .get(
                `${stromaeBackOfficeApiBaseUrl}api/interrogations/${interrogationId}/data`,
                getHeader(stromaeBackOfficeApiBaseUrl),
            )
            .then(response => {
                if (response.data != null) {
                    try {
                        const revertedTranformedData = revertTransformedArray(response.data.COLLECTED);
                        response.data.COLLECTED = revertedTranformedData;
                    } catch (error) {
                        console.error("Error reverting transformed data:", error);
                    }
                    resolve(response.data);
                } else {
                    resolve(response.data);
                }
            })
            .catch(err => {
                if (err.response?.status === 403) {
                    setError(ErrorCodeEnum.NO_RIGHTS);
                } else if ([401, 404].includes(err.response?.status)) {
                    return resolve(initSurveyData(idSurvey));
                } else {
                    console.error(err);
                    setError(ErrorCodeEnum.UNREACHABLE_SURVEYS_DATAS);
                }
            });
    });
};
