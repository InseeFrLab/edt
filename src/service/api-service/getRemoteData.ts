import { NomenclatureActivityOption } from "@inseefrlab/lunatic-edt";
import axios from "axios";
import { ErrorCodeEnum } from "enumerations/ErrorCodeEnum";
import { ReferentielsEnum } from "enumerations/ReferentielsEnum";
import { StateData, SurveyData, UserSurveys } from "interface/entity/Api";
import { LunaticData, ReferentielData, SourceData } from "interface/lunatic/Lunatic";

import { AuthContextProps } from "oidc-react";
import { initStateData, initSurveyData } from "../survey-service";
import { getAuth, getUserToken, isReviewer } from "../user-service";

export const edtOrganisationApiBaseUrl = process.env.REACT_APP_EDT_ORGANISATION_API_BASE_URL;
export const stromaeBackOfficeApiBaseUrl = process.env.REACT_APP_STROMAE_BACK_OFFICE_API_BASE_URL;

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

const revertTransformedArray = (dataAct: any) => {
    const revertedDataAct: { [key: string]: any } = {};
    Object.keys(dataAct).forEach(key => {
        const revertedKey = key.startsWith("S_") ? key.substring(2) : key;
        revertedDataAct[revertedKey] = dataAct[key];
    });
    return revertedDataAct;
};

const fetchReferentiel = (auth: AuthContextProps, idReferentiel: ReferentielsEnum) => {
    return axios.get<NomenclatureActivityOption[]>(
        stromaeBackOfficeApiBaseUrl + "api/nomenclature/" + idReferentiel,
        getHeader(stromaeBackOfficeApiBaseUrl),
    );
};

export const fetchReferentiels = (
    setError: (error: ErrorCodeEnum) => void,
): Promise<ReferentielData> => {
    let refs: ReferentielData = {
        [ReferentielsEnum.ACTIVITYNOMENCLATURE]: [],
        [ReferentielsEnum.ACTIVITYAUTOCOMPLETE]: [],
        [ReferentielsEnum.ROUTE]: [],
        [ReferentielsEnum.MEANOFTRANSPORT]: [],
        [ReferentielsEnum.ACTIVITYSECONDARYACTIVITY]: [],
        [ReferentielsEnum.ROUTESECONDARYACTIVITY]: [],
        [ReferentielsEnum.LOCATION]: [],
        [ReferentielsEnum.KINDOFWEEK]: [],
        [ReferentielsEnum.KINDOFDAY]: [],
        [ReferentielsEnum.ACTIVITYGOAL]: [],
    };
    let refsEndPoints: string[] = [];
    Object.values(ReferentielsEnum).forEach(value => {
        refsEndPoints.push("api/nomenclature/" + value);
    });

    return new Promise(resolve => {
        axios
            .all(
                refsEndPoints.map(endPoint =>
                    axios.get(
                        stromaeBackOfficeApiBaseUrl + endPoint,
                        getHeader(stromaeBackOfficeApiBaseUrl),
                    ),
                ),
            )
            .then(res => {
                Object.values(ReferentielsEnum).forEach((key, index) => {
                    refs[key as ReferentielsEnum] = res[index].data;
                });
                resolve(refs);
            })
            .catch(err => {
                if (err.response?.status === 403) {
                    setError(ErrorCodeEnum.NO_RIGHTS);
                } else {
                    setError(ErrorCodeEnum.UNREACHABLE_NOMENCLATURES);
                }
            });
    });
};

const fetchUserSurveysInfo = (setError: (error: ErrorCodeEnum) => void): Promise<UserSurveys[]> => {
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

const fetchSurveysSourcesByIds = (
    sourcesIds: string[],
    setError: (error: ErrorCodeEnum) => void,
): Promise<SourceData> => {
    let sources: any = {};
    let sourcesEndPoints: string[] = [];
    sourcesIds.forEach(sourceId => sourcesEndPoints.push("api/questionnaire/" + sourceId));
    return new Promise(resolve => {
        axios
            .all(
                sourcesEndPoints.map(endPoint =>
                    axios.get(
                        stromaeBackOfficeApiBaseUrl + endPoint,
                        getHeader(stromaeBackOfficeApiBaseUrl),
                    ),
                ),
            )
            .then(res => {
                sourcesIds.forEach((idSource, index) => {
                    sources[idSource] = res[index].data.value;
                });
                resolve(sources as SourceData);
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

const fetchReviewerSurveysAssignments = (setError: (error: ErrorCodeEnum) => void): Promise<any> => {
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

const remoteGetSurveyData = (
    idSurvey: string,
    setError?: (error: ErrorCodeEnum) => void,
): Promise<SurveyData> => {
    return new Promise(resolve => {
        axios
            .get(
                stromaeBackOfficeApiBaseUrl + "api/survey-unit/" + idSurvey + "/data",
                getHeader(stromaeBackOfficeApiBaseUrl),
            )
            .then(response => {
                if (response.data.COLLECTED != null) {
                    const revertedTranformedData = revertTransformedArray(response.data.COLLECTED);
                    response.data.COLLECTED = revertedTranformedData;
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

const requestGetDataReviewer = (
    idSurvey: string,
    setError: (error: ErrorCodeEnum) => void,
): Promise<LunaticData> => {
    return new Promise<LunaticData>(resolve => {
        axios
            .get(
                stromaeBackOfficeApiBaseUrl + "api/survey-unit/" + idSurvey + "/data",
                getHeader(stromaeBackOfficeApiBaseUrl),
            )
            .then(response => {
                if (response.data != null) {
                    const revertedTranformedData = revertTransformedArray(response.data.COLLECTED);
                    response.data.COLLECTED = revertedTranformedData;
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
                    //requestGetDataReviewer(idSurvey, setError);
                }
            });
    });
};

const requestGetStateReviewer = (
    idSurvey: string,
    setError: (error: ErrorCodeEnum) => void,
): Promise<StateData> => {
    return new Promise<StateData>(resolve => {
        axios
            .get(
                stromaeBackOfficeApiBaseUrl + "api/survey-unit/" + idSurvey + "/state-data",
                getHeader(stromaeBackOfficeApiBaseUrl),
            )
            .then(response => {
                resolve(response.data);
            })
            .catch(err => {
                console.log(err);
                if (err.response?.status === 403) {
                    setError(ErrorCodeEnum.NO_RIGHTS);
                } else {
                    resolve(initStateData());
                }
            });
    });
};

const requestGetSurveyDataReviewer = (
    idSurvey: string,
    setError: (error: ErrorCodeEnum) => void,
): Promise<SurveyData> => {
    return requestGetStateReviewer(idSurvey, setError).then((stateData: StateData) => {
        return requestGetDataReviewer(idSurvey, setError).then(data => {
            return new Promise(resolve => {
                const surveyData: SurveyData = {
                    stateData: stateData,
                    data: data,
                };
                console.log("requestGetSurveyDataReviewer", surveyData);
                resolve(surveyData);
            });
        });
    });
};

const remoteGetSurveyDataReviewer = (
    idSurvey: string,
    setError: (error: ErrorCodeEnum) => void,
): Promise<SurveyData> => {
    const isReviewerMode = isReviewer();
    if (!isReviewerMode) setError?.(ErrorCodeEnum.NO_RIGHTS);
    return requestGetSurveyDataReviewer(idSurvey, setError)
        .then(response => {
            console.log("response remoteGetSurveyDataReviewer", response);
            return response;
        })
        .catch(err => {
            if (err.response?.status === 403) {
                setError?.(ErrorCodeEnum.NO_RIGHTS);
            } else {
                return {
                    data: initSurveyData(idSurvey),
                    stateData: initStateData(),
                };
            }
            return Promise.reject(err);
        });
};

export {
    fetchReferentiel,
    fetchReviewerSurveysAssignments,
    fetchSurveysSourcesByIds,
    fetchUserSurveysInfo,
    remoteGetSurveyData,
    remoteGetSurveyDataReviewer,
};
