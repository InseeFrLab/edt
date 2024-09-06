import { generateDateFromStringInput, getFrenchDayFromDate } from "@inseefrlab/lunatic-edt";
import dayjs from "dayjs";
import { EdtRoutesNameEnum } from "../enumerations/EdtRoutesNameEnum";
import { EdtSurveyRightsEnum } from "../enumerations/EdtSurveyRightsEnum";
import { ErrorCodeEnum } from "../enumerations/ErrorCodeEnum";
import { FieldNameEnum } from "../enumerations/FieldNameEnum";
import { LocalStorageVariableEnum } from "../enumerations/LocalStorageVariableEnum";
import { ModePersistenceEnum } from "../enumerations/ModePersistenceEnum";
import { ReferentielsEnum } from "../enumerations/ReferentielsEnum";
import { SourcesEnum } from "../enumerations/SourcesEnum";
import { StateHouseholdEnum } from "../enumerations/StateHouseholdEnum";
import { SurveysIdsEnum } from "../enumerations/SurveysIdsEnum";
import { t } from "i18next";
import _ from "lodash";
import { TabData } from "../interface/component/Component";
import { StateData, SurveyData, UserSurveys } from "../interface/entity/Api";
import { Household } from "../interface/entity/Household";
import { Person } from "../interface/entity/Person";
import { StatsHousehold } from "../interface/entity/StatsHouseHold";
import {
    Collected,
    DATA_STATE,
    DataState,
    LunaticModel,
    LunaticModelComponent,
    LunaticModelVariable,
    MultiCollected,
    ReferentielData,
    REFERENTIELS_ID,
    SourceData,
    SOURCES_MODELS,
    SURVEYS_IDS,
    SurveysIds,
    USER_SURVEYS_DATA,
    UserSurveysData,
} from "../interface/lunatic/Lunatic";
import { AuthContextProps } from "oidc-react";
import { NavigateFunction } from "react-router-dom";
import {
    fetchReviewerSurveysAssignments,
    fetchUserSurveysInfo,
    remoteGetSurveyData,
    remoteGetSurveyStateData,
    requestGetDataReviewer,
} from "./api-service/getRemoteData";
import { lunaticDatabase } from "./lunatic-database";
import { getCurrentPageSource, LABEL_WORK_TIME_SURVEY } from "./orchestrator-service";
import {
    addArrayToSession,
    addItemToSession,
    getArrayFromSession,
    getItemFromSession,
    groupBy,
    revertTransformedArray,
} from "../utils/utils";
import {
    dataEmptyActivity,
    dataEmptyWeeklyPlanner,
    edtActivitySurvey,
    edtWorkTimeSurvey,
} from "../assets/surveyData";
import { EdtUserRightsEnum } from "./../enumerations/EdtUserRightsEnum";
import { LunaticData } from "./../interface/lunatic/Lunatic";
import { getFlatLocalStorageValue } from "./local-storage-service";
import { navToPlanner, setAllNamesOfGroupAndNav } from "./navigation-service";
import { addToAutocompleteActivityReferentiel } from "./referentiel-service";
import { fixConditionals, getScore, saveQualityScore } from "./survey-activity-service";
import { getUserRights, isReviewer } from "./user-service";
import { remotePutSurveyData, remotePutSurveyDataReviewer } from "./api-service/putRemoteData";
import { fetchReferentiels } from "./api-service/getLocalSurveyData";
import {
    getLocalSurveyStateData,
    initStateData,
    isDemoMode,
    isSurveyClosed,
    isSurveyLocked,
    isSurveyStarted,
    isSurveyValidated,
} from "./survey-state-service";
import { createDataWeeklyPlanner } from "../pages/work-time/weekly-planner/utils";

const datas = new Map<string, LunaticData>();
const oldDatas = new Map<string, LunaticData>();

const NUM_MAX_ACTIVITY_SURVEYS = import.meta.env.VITE_NUM_ACTIVITY_SURVEYS ?? 6;
const NUM_MAX_WORKTIME_SURVEYS = 3;
//TODO: Find a way to remove these goddamn global variables
let referentielsData: ReferentielData;
let sourcesData: SourceData;
let surveysIds: SurveysIds = {
    [SurveysIdsEnum.ALL_SURVEYS_IDS]: [],
    [SurveysIdsEnum.ACTIVITY_SURVEYS_IDS]: [],
    [SurveysIdsEnum.WORK_TIME_SURVEYS_IDS]: [],
};
let userDatasActivity: UserSurveys[] = [];
let userDatasWorkTime: UserSurveys[] = [];
let userDatas: UserSurveys[] = [];
let surveysData: UserSurveys[] = [];
let initData = false;

const toIgnoreForRoute = [
    FieldNameEnum.PLACE,
    FieldNameEnum.MAINACTIVITY_ID,
    FieldNameEnum.MAINACTIVITY_SUGGESTERID,
    FieldNameEnum.MAINACTIVITY_LABEL,
    FieldNameEnum.MAINACTIVITY_ISFULLYCOMPLETED,
    FieldNameEnum.INPUT_SUGGESTER,
    FieldNameEnum.ACTIVITY_SELECTER_HISTORY,
    FieldNameEnum.SECONDARYACTIVITY_LABEL,
    FieldNameEnum.GOAL,
];

const toIgnoreForActivity = [
    FieldNameEnum.GOAL,
    FieldNameEnum.ROUTE,
    FieldNameEnum.FOOT,
    FieldNameEnum.BICYCLE,
    FieldNameEnum.TWOWHEELSMOTORIZED,
    FieldNameEnum.PRIVATECAR,
    FieldNameEnum.OTHERPRIVATE,
    FieldNameEnum.PUBLIC,
    FieldNameEnum.MAINACTIVITY_ISFULLYCOMPLETED,
    FieldNameEnum.SECONDARYACTIVITY_LABEL,
];

const initializeDatas = (setError: (error: ErrorCodeEnum) => void): Promise<boolean> => {
    const promisesToWait: Promise<any>[] = [];
    return new Promise(resolve => {
        promisesToWait.push(initializeRefs());
        promisesToWait.push(initializeSurveysIdsAndSources(setError));
        Promise.all(promisesToWait).then(() => {
            resolve(true);
        });
    });
};

const initPropsAuth = (auth: AuthContextProps): Promise<DataState> => {
    const dataState: DataState = {
        data: {
            userData: {
                access_token: auth.userData?.access_token,
                expires_at: auth.userData?.expires_at,
                id_token: auth.userData?.id_token,
                profile: auth.userData?.profile,
                refresh_token: auth.userData?.refresh_token,
                scope: auth.userData?.scope,
                session_state: auth.userData?.session_state ?? "",
                token_type: auth.userData?.token_type,
                state: auth.userData?.state,
                expires_in: auth.userData?.expires_in,
                expired: auth.userData?.expired,
                scopes: auth.userData?.scopes,
            },
        },
    };
    return lunaticDatabase.save(DATA_STATE, dataState).then(() => {
        return dataState;
    });
};

const getAuthCache = (): Promise<DataState> => {
    const clientTokenKey =
        "oidc.user:https://auth.demo.insee.io/auth/realms/questionnaires-edt/:client-edt";
    return lunaticDatabase.get(DATA_STATE).then(data => {
        let dataState = data as DataState;
        sessionStorage.setItem(clientTokenKey, JSON.stringify(dataState));
        return dataState;
    });
};

const initializeRefs = () => {
    return lunaticDatabase.get(REFERENTIELS_ID).then(refData => {
        if (!refData && navigator.onLine) {
            return fetchReferentiels().then(refs => {
                return saveReferentiels(refs);
            });
        } else {
            referentielsData = refData as ReferentielData;
        }
    });
};

const initDataForSurveys = (setError: (error: ErrorCodeEnum) => void) => {
    if (navigator.onLine) {
        return fetchUserSurveysInfo(setError).then(userSurveyData => {
            let activitySurveysIds: string[] = [];
            let userSurveyDataActivity: UserSurveys[] = [];
            let workingTimeSurveysIds: string[] = [];
            let userSurveyDataWorkTime: UserSurveys[] = [];
            userSurveyData.forEach(surveyData => {
                if (surveyData.questionnaireModelId === SourcesEnum.ACTIVITY_SURVEY) {
                    activitySurveysIds.push(surveyData.surveyUnitId);
                    userSurveyDataActivity.push(surveyData);
                }
                if (surveyData.questionnaireModelId === SourcesEnum.WORK_TIME_SURVEY) {
                    workingTimeSurveysIds.push(surveyData.surveyUnitId);
                    userSurveyDataWorkTime.push(surveyData);
                }
                userDatas.push(surveyData);
            });
            userDatasActivity = userSurveyDataActivity;
            userDatasWorkTime = userSurveyDataWorkTime;
            addArrayToSession("userDatasWorkTime", userDatasWorkTime);
            addArrayToSession("userDatasActivity", userDatasActivity);
            addArrayToSession("userDatas", userDatas);

            let allSurveysIds = [...activitySurveysIds, ...workingTimeSurveysIds];
            const surveysIds: SurveysIds = {
                [SurveysIdsEnum.ALL_SURVEYS_IDS]: allSurveysIds,
                [SurveysIdsEnum.ACTIVITY_SURVEYS_IDS]: activitySurveysIds,
                [SurveysIdsEnum.WORK_TIME_SURVEYS_IDS]: workingTimeSurveysIds,
            };
            const sources: SourceData = {
                [SourcesEnum.ACTIVITY_SURVEY]: edtActivitySurvey,
                [SourcesEnum.WORK_TIME_SURVEY]: edtWorkTimeSurvey,
            };
            const innerPromises: Promise<any>[] = [
                getRemoteSavedSurveysDatas(allSurveysIds, setError).then(() => {
                    return initializeSurveysDatasCache(allSurveysIds);
                }),
                saveSurveysIds(surveysIds),
            ];
            const inerFetchPromises: Promise<any>[] = [
                saveSources(sources),
                saveUserSurveysData({ data: userDatas }),
            ];
            return Promise.all([...innerPromises, ...inerFetchPromises]);
        });
    } else {
        return lunaticDatabase.get(USER_SURVEYS_DATA).then((data: LunaticData | undefined) => {
            let userDaras = data as UserSurveysData;
            let userSurveyData = userDaras.data;
            let activitySurveysIds: string[] = [];
            let userSurveyDataActivity: UserSurveys[] = [];
            let workingTimeSurveysIds: string[] = [];
            let userSurveyDataWorkTime: UserSurveys[] = [];
            console.log("userSurveyData", userSurveyData);
            userSurveyData.forEach(surveyData => {
                if (surveyData.questionnaireModelId === SourcesEnum.ACTIVITY_SURVEY) {
                    activitySurveysIds.push(surveyData.surveyUnitId);
                    userSurveyDataActivity.push(surveyData);
                    if (!userDatas.find(survey => survey.surveyUnitId == surveyData.surveyUnitId))
                        userDatas.push(surveyData);
                }
                if (surveyData.questionnaireModelId === SourcesEnum.WORK_TIME_SURVEY) {
                    workingTimeSurveysIds.push(surveyData.surveyUnitId);
                    userSurveyDataWorkTime.push(surveyData);
                    if (!userDatas.find(survey => survey.surveyUnitId == surveyData.surveyUnitId))
                        userDatas.push(surveyData);
                }
            });
            userDatasActivity = userSurveyDataActivity;
            userDatasWorkTime = userSurveyDataWorkTime;

            addArrayToSession("userDatasWorkTime", userDatasWorkTime);
            addArrayToSession("userDatasActivity", userDatasActivity);
            addArrayToSession("userDatas", userDatas);
            let allSurveysIds = [...activitySurveysIds, ...workingTimeSurveysIds];
            const innerPromisesOffline: Promise<any>[] = [initializeSurveysDatasCache(allSurveysIds)];
            return Promise.all(innerPromisesOffline);
        });
    }
};

const initializeSurveysIdsAndSources = (setError: (error: ErrorCodeEnum) => void): Promise<any> => {
    const promises: Promise<any>[] = [];
    return lunaticDatabase.get(SURVEYS_IDS).then(data => {
        const surveyIdsData = data as SurveysIds;
        const existSurveysIds = surveyIdsData?.[SurveysIdsEnum.ALL_SURVEYS_IDS].length > 0;

        if (!existSurveysIds) {
            promises.push(initDataForSurveys(setError));
        } else {
            surveysIds = data as SurveysIds;
            const idHousehold = localStorage.getItem(LocalStorageVariableEnum.ID_HOUSEHOLD);
            const listSurveysOfHousehold =
                getListSurveysHousehold()
                    .find(household => household.idHousehold == idHousehold)
                    ?.surveys?.map(survey => survey.surveyUnitId) ?? [];
            const surveysIdsAct =
                getUserRights() == EdtUserRightsEnum.REVIEWER
                    ? listSurveysOfHousehold
                    : surveysIds[SurveysIdsEnum.ALL_SURVEYS_IDS];

            promises.push(
                lunaticDatabase.get(SOURCES_MODELS).then(data => {
                    if (sourcesData == undefined) {
                        sourcesData = data as SourceData;
                    }
                }),
            );
            if (navigator.onLine) {
                promises.push(
                    getRemoteSavedSurveysDatas(surveysIdsAct, setError).then(() => {
                        return initializeSurveysDatasCache(surveysIdsAct);
                    }),
                );
            } else promises.push(initializeSurveysDatasCache(surveysIdsAct));
        }
        return new Promise(resolve => {
            Promise.all(promises).finally(() => {
                resolve(true);
            });
        });
    });
};

const activitySurveyDemo = () => {
    let activitySurveysIds: string[] = [];
    let numInterviewer = 0;
    if (userDatas == null) userDatas = [];
    for (let i = 1; i <= Number(NUM_MAX_ACTIVITY_SURVEYS); i++) {
        if (i % 2 != 0) {
            numInterviewer += 1;
        }
        const userSurvey: UserSurveys = {
            interviewerId: "interviewer" + numInterviewer,
            surveyUnitId: "activitySurvey" + i,
            questionnaireModelId: SourcesEnum.ACTIVITY_SURVEY,
            campaignId: "",
            subCampaignId: "",
            id: i,
            reviewerId: "",
        };
        activitySurveysIds.push("activitySurvey" + i);
        userDatasActivity.push(userSurvey);
        userDatas?.push(userSurvey);
    }
    addArrayToSession("userDatasActivty", userDatasActivity);
    addArrayToSession("userDatas", userDatas);
    return activitySurveysIds;
};

const workTimeSurveyDemo = () => {
    let workingTimeSurveysIds: string[] = [];
    userDatasWorkTime = [];

    for (let i = 1; i <= Number(NUM_MAX_WORKTIME_SURVEYS); i++) {
        const userSurvey: UserSurveys = {
            interviewerId: "interviewer" + i,
            surveyUnitId: "workTimeSurvey" + i,
            questionnaireModelId: SourcesEnum.WORK_TIME_SURVEY,
            campaignId: "",
            subCampaignId: "",
            id: i,
            reviewerId: "",
        };
        workingTimeSurveysIds.push("workTimeSurvey" + i);
        userDatasWorkTime.push(userSurvey);
        userDatas.push(userSurvey);
    }
    addArrayToSession("userDatasWorkTime", userDatasWorkTime);
    addArrayToSession("userDatas", userDatas);
    return workingTimeSurveysIds;
};

const initializeSurveysIds = (innerSurveysIds: SurveysIds) => {
    const innerPromises: Promise<any>[] = [
        saveSurveysIds(innerSurveysIds),
        initializeSurveysDatasCache(),
    ];
    return Promise.all(innerPromises);
};

const initializeSurveysIdsDemo = (): Promise<any> => {
    userDatasActivity = [];
    let activitySurveysIds = activitySurveyDemo();
    let workingTimeSurveysIds = workTimeSurveyDemo();

    let allSurveysIds = [...activitySurveysIds, ...workingTimeSurveysIds];
    const innerSurveysIds: SurveysIds = {
        [SurveysIdsEnum.ALL_SURVEYS_IDS]: allSurveysIds,
        [SurveysIdsEnum.ACTIVITY_SURVEYS_IDS]: activitySurveysIds,
        [SurveysIdsEnum.WORK_TIME_SURVEYS_IDS]: workingTimeSurveysIds,
    };
    surveysIds = innerSurveysIds;
    return initializeSurveysIds(surveysIds);
};

const initializeHomeSurveys = (idHousehold: string) => {
    let userDatasCopy: UserSurveys[] = [];
    let userDatasWorkTimeCopy: UserSurveys[] = [];
    let userDatasActivityCopy: UserSurveys[] = [];
    return new Promise(resolve => {
        userDatasCopy =
            getListSurveysHousehold().find(household => household.idHousehold == idHousehold)?.surveys ??
            [];
        userDatasCopy.forEach(userSurvey => {
            if (userSurvey.questionnaireModelId == SourcesEnum.WORK_TIME_SURVEY) {
                userDatasWorkTimeCopy.push(userSurvey);
            } else {
                userDatasActivityCopy.push(userSurvey);
            }
        });
        setSurveysIdsReviewers();

        userDatas = userDatasCopy.length > 0 ? userDatasCopy : getUserDatas();
        userDatasWorkTime =
            userDatasWorkTimeCopy.length > 0 ? userDatasWorkTimeCopy : getUserDatasWorkTime();
        userDatasActivity =
            userDatasActivityCopy.length > 0 ? userDatasActivityCopy : getUserDatasActivity();

        addArrayToSession("userDatasWorkTime", userDatasWorkTime);
        addArrayToSession("userDatasActivity", userDatasActivity);
        addArrayToSession("userDatas", userDatas);
        resolve(true);
    });
};

const getSurveysIdsForHousehold = (idHousehold: string) => {
    return (
        getListSurveysHousehold()
            .find(household => household.idHousehold == idHousehold)
            ?.surveys?.map(survey => survey.surveyUnitId) ?? []
    );
};

const setSurveysIdsReviewers = () => {
    let allSurveysIds = getUserDatas().map(data => data.surveyUnitId);
    const innerSurveysIds: SurveysIds = {
        [SurveysIdsEnum.ALL_SURVEYS_IDS]: allSurveysIds,
        [SurveysIdsEnum.ACTIVITY_SURVEYS_IDS]: getUserDatasActivity().map(data => data.surveyUnitId),
        [SurveysIdsEnum.WORK_TIME_SURVEYS_IDS]: getUserDatasWorkTime().map(data => data.surveyUnitId),
    };
    surveysIds = innerSurveysIds;
};

const initializeSurveysIdsModeReviewer = () => {
    let activitySurveysIds: string[] = [];
    let workingTimeSurveysIds: string[] = [];

    getListSurveys().forEach(userSurvey => {
        if (userSurvey.questionnaireModelId != SourcesEnum.WORK_TIME_SURVEY) {
            activitySurveysIds.push(userSurvey.surveyUnitId);
        } else {
            workingTimeSurveysIds.push(userSurvey.surveyUnitId);
        }
    });

    let allSurveysIds = [...activitySurveysIds, ...workingTimeSurveysIds];
    const innerSurveysIds: SurveysIds = {
        [SurveysIdsEnum.ALL_SURVEYS_IDS]: allSurveysIds,
        [SurveysIdsEnum.ACTIVITY_SURVEYS_IDS]: activitySurveysIds,
        [SurveysIdsEnum.WORK_TIME_SURVEYS_IDS]: workingTimeSurveysIds,
    };
    surveysIds = innerSurveysIds;
};

const refreshSurveyData = (
    setError: (error: ErrorCodeEnum) => void,
    specifiquesSurveysIds?: string[],
): Promise<any> => {
    initData = false;
    const promisesToWait: Promise<any>[] = [];
    promisesToWait.push(
        getRemoteSavedSurveysDatas(
            specifiquesSurveysIds ?? surveysIds[SurveysIdsEnum.ALL_SURVEYS_IDS],
            setError,
        ),
        initializeSurveysDatasCache(),
    );
    return Promise.all(promisesToWait);
};

const refreshSurvey = (idSurvey: string, setError: (error: ErrorCodeEnum) => void): Promise<any> => {
    initData = false;
    return getRemoteSavedSurveysDatas([idSurvey], setError).then(() => {
        return initializeSurveysDatasCache([idSurvey]);
    });
};

const initializeSurveysIdsDataModeReviewer = (
    setError: (error: ErrorCodeEnum) => void,
): Promise<any> => {
    initializeSurveysIdsModeReviewer();
    return initializeSurveysIds(surveysIds).then(() => {
        if (!initData && navigator.onLine) {
            return refreshSurveyData(setError);
        } else {
            return initializeSurveysDatasCache();
        }
    });
};

/**
 * Create a data object from fetched survey data
 */
const initializeData = (remoteSurveyData: any, idSurvey: string) => {
    const regexp = new RegExp(import.meta.env.VITE_HOUSE_REFERENCE_REGULAR_EXPRESSION || "");
    let surveyData: LunaticData = {
        COLLECTED: {},
        CALCULATED: {},
        EXTERNAL: {},
        houseReference: "",
        id: "",
        lastLocalSaveDate: Date.now(),
    };
    surveyData.houseReference = idSurvey?.replace(regexp, "");
    surveyData.CALCULATED = {};
    surveyData.EXTERNAL = {};
    surveyData.COLLECTED = remoteSurveyData.COLLECTED ?? getDataEmpty(idSurvey);
    surveyData.lastLocalSaveDate =
        remoteSurveyData.lastLocalSaveDate ?? remoteSurveyData.stateData?.date ?? new Date(0).getTime();
    surveyData.stateData = remoteSurveyData.stateData;
    return surveyData;
};

/**
 * Fetch survey data from the server
 */
const getRemoteSavedSurveyData = (
    surveyId: string,
    setError: (error: ErrorCodeEnum) => void,
): Promise<any> => {
    if (!navigator.onLine) {
        return Promise.reject(new Error("Offline"));
    }

    const getSurveyDataFunction = isReviewer() ? requestGetDataReviewer : remoteGetSurveyData;
    const getSurveyStateDataFunction = remoteGetSurveyStateData;

    //TODO: Refactor dirty code
    return getSurveyDataFunction(surveyId, setError)
        .then((remoteSurveyData: any) => {
            const surveyData = initializeData(remoteSurveyData, surveyId);
            return lunaticDatabase.get(surveyId).then(localSurveyData => {
                if (shouldInitData(remoteSurveyData, localSurveyData)) {
                    const stateData = getLocalSurveyStateData(surveyData);
                    return saveInDatabase(surveyId, { ...surveyData, stateData });
                } else {
                    if (shouldSaveRemoteData(remoteSurveyData, localSurveyData)) {
                        // TEMP: WeeklyPlanner stuff (to be removed)
                        if (remoteSurveyData.COLLECTED && "WEEKTYPE" in remoteSurveyData.COLLECTED) {
                            const weeklyPlannerData = createDataWeeklyPlanner(remoteSurveyData);
                            const WeeklyPlannerVariable: MultiCollected = {
                                COLLECTED: weeklyPlannerData,
                                EDITED: [],
                                FORCED: null,
                                INPUTED: null,
                                PREVIOUS: null,
                            };
                            remoteSurveyData.COLLECTED["WEEKLYPLANNER"] = WeeklyPlannerVariable;
                        }

                        //TODO: fix a bug where other variable are overwrited if there is no weeklyPlanner
                        return getSurveyStateDataFunction(surveyId, setError).then(stateData => {
                            return saveInDatabase(surveyId, { ...remoteSurveyData, stateData });
                        });
                    }
                }
            });
        })
        .catch(err => {
            console.log(err);
            setError(err);
        });
};

const getRemoteSavedSurveysDatas = (
    surveysIds: string[],
    setError: (error: ErrorCodeEnum) => void,
): Promise<any[]> => {
    return Promise.all(surveysIds.map(surveyId => getRemoteSavedSurveyData(surveyId, setError)));
};

const shouldSaveRemoteData = (remoteSurveyData: any, localSurveyData: any): boolean => {
    const lastRemoteSaveDate =
        remoteSurveyData.lastRemoteSaveDate ?? remoteSurveyData.data?.lastRemoteSaveDate ?? 1;
    const lastLocalSaveDate =
        remoteSurveyData.lastLocalSaveDate ??
        remoteSurveyData?.data?.lastLocalSaveDate ??
        localSurveyData?.lastLocalSaveDate ??
        0;
    const remoteStateDataDate = remoteSurveyData?.stateData?.date ?? 1;
    if (!localSurveyData) return true;
    if (lastRemoteSaveDate >= lastLocalSaveDate) return true;
    if (lastLocalSaveDate <= remoteStateDataDate) return true;
    return false;
};

/**
 * Detect if collected data is empty
 */
const shouldInitData = (remoteSurveyData: any, localSurveyData: any): boolean => {
    if (!localSurveyData) {
        if (remoteSurveyData && typeof remoteSurveyData === "object") {
            const isCollectedEmpty =
                "COLLECTED" in remoteSurveyData && Object.keys(remoteSurveyData.COLLECTED).length === 0;
            return isCollectedEmpty;
        }
    }
    return false;
};

const initializeSurveysDatasCache = (idSurveys?: string[]): Promise<any> => {
    const promises: Promise<any>[] = [];
    const idSurveysToInit = idSurveys ?? surveysIds[SurveysIdsEnum.ALL_SURVEYS_IDS];
    return lunaticDatabase.get(SURVEYS_IDS).then(data => {
        surveysIds = data as SurveysIds;

        return new Promise(resolve => {
            for (const idSurvey of idSurveysToInit) {
                promises.push(initializeDatasCache(idSurvey));
            }
            promises.push(
                lunaticDatabase.get(USER_SURVEYS_DATA).then(data => {
                    userDatas = (data as UserSurveysData)?.data;
                }),
            );
            return Promise.all(promises).finally(() => {
                resolve(true);
            });
        });
    });
};

const initializeDatasCache = (idSurvey: string) => {
    return lunaticDatabase.get(idSurvey).then(data => {
        if (data != null) {
            const regexp = new RegExp(import.meta.env.VITE_HOUSE_REFERENCE_REGULAR_EXPRESSION || "");
            data.houseReference = idSurvey.replace(regexp, "");
            datas.set(idSurvey, data);
            addItemToSession(idSurvey, data);
            //oldDatas.set(idSurvey, data);
            initData = true;
        } else {
            datas.set(idSurvey, createDataEmpty(idSurvey ?? ""));
            addItemToSession(idSurvey, createDataEmpty(idSurvey ?? ""));
        }
        return data;
    });
};

const initializeListSurveys = (setError: (error: ErrorCodeEnum) => void) => {
    if (navigator.onLine) {
        return fetchReviewerSurveysAssignments(setError)
            .then(data => {
                surveysData = data;
                addArrayToSession("surveysData", surveysData);
                data.forEach((surveyData: UserSurveys) => {
                    if (!userDatas?.find(user => user.surveyUnitId == surveyData.surveyUnitId)) {
                        if (userDatas == null) userDatas = [];
                        if (surveyData.questionnaireModelId === SourcesEnum.ACTIVITY_SURVEY) {
                            userDatas.push(surveyData);
                        }
                        if (surveyData.questionnaireModelId === SourcesEnum.WORK_TIME_SURVEY) {
                            userDatas.push(surveyData);
                        }
                    }
                });
                return saveUserSurveysData({ data: userDatas });
            })
            .catch(err => {
                console.log(err);
                return lunaticDatabase.get(USER_SURVEYS_DATA).then((data: LunaticData | undefined) => {
                    let datas = data as UserSurveysData;
                    return datas.data;
                });
            });
    } else {
        return lunaticDatabase.get(USER_SURVEYS_DATA).then((data: LunaticData | undefined) => {
            let datas = data as UserSurveysData;
            surveysData = datas.data;
            addArrayToSession("surveysData", surveysData);
            datas.data.forEach((surveyData: UserSurveys) => {
                if (surveyData.questionnaireModelId === SourcesEnum.ACTIVITY_SURVEY) {
                    if (!userDatas.find(survey => survey.surveyUnitId == surveyData.surveyUnitId))
                        userDatas.push(surveyData);
                }
                if (surveyData.questionnaireModelId === SourcesEnum.WORK_TIME_SURVEY) {
                    if (!userDatas.find(survey => survey.surveyUnitId == surveyData.surveyUnitId))
                        userDatas.push(surveyData);
                }
            });
        });
    }
};

const getListSurveys = () => {
    return surveysData ?? getArrayFromSession("surveysData");
};

const getSurveyDataHousehold = (surveys: UserSurveys[]) => {
    const activitiesSurveys = surveys
        .filter(survey => survey.questionnaireModelId == SourcesEnum.ACTIVITY_SURVEY)
        .map(survey => survey.surveyUnitId);
    const workTimeSurveys = surveys
        .filter(survey => survey.questionnaireModelId == SourcesEnum.ACTIVITY_SURVEY)
        .map(survey => survey.surveyUnitId);

    const firstSurvey = getOrderedSurveys(activitiesSurveys, workTimeSurveys)[0];

    const firstSurveyDate = getValue(
        firstSurvey?.data?.surveyUnitId,
        FieldNameEnum.SURVEYDATE,
    ) as string;
    return firstSurveyDate?.length && firstSurveyDate.length > 0
        ? dayjs(generateDateFromStringInput(firstSurveyDate)).format("DD/MM/YYYY")
        : undefined;
};

const getListSurveysHousehold = (): Household[] => {
    const listSurveys = getListSurveys();
    let grouped = groupBy(listSurveys, surveyData => {
        const length = surveyData.surveyUnitId.length - 1;
        const group = surveyData.surveyUnitId.substring(0, length);
        return group;
    });
    let mapped = Object.entries(grouped)
        .map(([key, value]) => {
            return {
                idHousehold: key,
                userName: value[0]?.nameHousehold ?? "",
                surveys: value,
                surveyDate: getSurveyDataHousehold(value),
                stats: getStatsHousehold(value),
                campaingId: value[0].campaignId ?? undefined,
                subCampaignId: value[0].subCampaignId ?? undefined,
            };
        })
        .sort(
            (houseHoldData1: any, houseHoldData2: any) =>
                Number(houseHoldData1.idHousehold) - Number(houseHoldData2.idHousehold),
        );
    return mapped;
};

const getDatas = (): Map<string, LunaticData> => {
    return datas;
};

const getData = (idSurvey: string): LunaticData => {
    const modifyCollected = modifyIndividualCollected(idSurvey);
    // const emptyData = getDataCache(idSurvey) ?? createDataEmpty(idSurvey ?? "");
    // const data = modifyCollected || emptyData;
    // return data;
    return modifyCollected;
};

const getDataCache = (idSurvey: string) => {
    const data = getItemFromSession(idSurvey) ?? datas.get(idSurvey);
    return data;
};

const setDataCache = (idSurvey: string, data: LunaticData) => {
    datas.set(idSurvey, data);
    addItemToSession(idSurvey, data);
};

/**
 * Edit the collected data using the EDITED property from cache.
 * 1. Retrieves the cached data for the given survey ID and creates copy.
 * 2. Checks if the mode persistence of the survey data is not EDITED.
 * 3. For each property, it checks if the EDITED and COLLECTED properties exist and are not arrays.
 * 4. If the conditions are met, it overwrite the EDITED value to the COLLECTED property.
 */
const modifyIndividualCollected = (idSurvey: string) => {
    let dataSurv = Object.assign(getDataCache(idSurvey));
    if (dataSurv?.COLLECTED && Object.keys(dataSurv.COLLECTED).length === 0) {
        dataSurv = createDataEmpty(idSurvey);
        saveInDatabase(idSurvey, dataSurv);
    }
    if (getModePersistence(dataSurv) != ModePersistenceEnum.EDITED) {
        const dataOfSurvey = dataSurv?.COLLECTED;
        for (let prop in FieldNameEnum as any) {
            const data = dataOfSurvey?.[prop];
            if (
                data?.EDITED &&
                !Array.isArray(data.EDITED) &&
                data.COLLECTED &&
                !Array.isArray(data.COLLECTED)
            ) {
                data.COLLECTED = dataSurv?.COLLECTED?.[prop].EDITED;
            }
        }
    }
    return dataSurv;
};

const setData = (idSurvey: string, data: LunaticData) => {
    datas.set(idSurvey, data);
    addItemToSession(idSurvey, data);
};

const getDataEmpty = (idSurvey: string) => {
    if (surveysIds[SurveysIdsEnum.ACTIVITY_SURVEYS_IDS].includes(idSurvey)) {
        return dataEmptyActivity;
    } else {
        return dataEmptyWeeklyPlanner;
    }
};

const createDataEmpty = (idSurvey: string): LunaticData => {
    const householdId = "";

    const data = {
        COLLECTED: {},
        CALCULATED: {},
        EXTERNAL: {},
        houseReference: householdId,
        id: idSurvey,
        lastLocalSaveDate: Date.now(),
        lastRemoteSaveDate: undefined,
    };
    data.COLLECTED = getDataEmpty(idSurvey);
    return data;
};

const dataIsChange = (idSurvey: string, dataAct: LunaticData, lastData: LunaticData): boolean => {
    const dataCollected = dataAct?.COLLECTED;
    const currentDataCollected = lastData?.COLLECTED;
    if (surveysIds[SurveysIdsEnum.WORK_TIME_SURVEYS_IDS].includes(idSurvey)) {
        return true;
    }

    if (!dataCollected || !currentDataCollected) {
        return true;
    }
    return !_.isEqual(dataCollected, currentDataCollected);
};

const getVarBooleanModepersistance = (
    dataCollected: {
        [key: string]: Collected | MultiCollected;
    },
    modePersistence: ModePersistenceEnum,
    variableName: FieldNameEnum,
) => {
    const modeInterviewer = modePersistence == ModePersistenceEnum.COLLECTED;
    const data = modeInterviewer
        ? dataCollected[variableName].COLLECTED
        : dataCollected[variableName].EDITED;
    return data as (boolean | null)[];
};

const updateLocked = (idSurvey: string, data: LunaticData) => {
    if (existVariableEdited(idSurvey, data) && data.COLLECTED) {
        data.COLLECTED[FieldNameEnum.ISLOCKED] = {
            COLLECTED: true,
            EDITED: true,
            FORCED: null,
            INPUTED: null,
            PREVIOUS: null,
        };
    }
    return data;
};

const getDataUpdatedOffline = () => {
    let surveysToUpdated = new Map<string, LunaticData>();
    surveysIds[SurveysIdsEnum.ALL_SURVEYS_IDS].forEach(idSurvey => {
        let data = getDataCache(idSurvey);
        //state data -> last data recuperée from stateData
        //lastRemoteSaveDate -> a pouvoir supprimer (change lastRemoteSaveDate to stateData.date)
        if (
            data.lastLocalSaveDate > data.lastRemoteSaveDate ||
            data.lastLocalSaveDate > data.stateData?.date
        ) {
            surveysToUpdated.set(idSurvey, data);
        }
    });
    return surveysToUpdated;
};

const saveDatas = () => {
    const promisesToWait: Promise<any>[] = [];
    getDataUpdatedOffline().forEach((value, key) => {
        promisesToWait.push(saveData(key, value, false, true));
    });
    return Promise.all(promisesToWait).then(result => {
        console.log(result);
    });
};

/**
 * Save data in the local database and push to the server if necessary
 */
const saveData = (
    idSurvey: string,
    data: LunaticData,
    localSaveOnly = false,
    forceUpdate = false,
    stateDataForced?: StateData,
): Promise<LunaticData> => {
    if (stateDataForced) {
        console.error(
            "stateDataForced parameter was removed, put state data inside the data object instead",
        );
    }
    console.log("SaveData", data);
    data.lastLocalSaveDate = navigator.onLine ? Date.now() : Date.now() + 1;
    if (!data.houseReference) {
        const regexp = new RegExp(import.meta.env.VITE_HOUSE_REFERENCE_REGULAR_EXPRESSION || "");
        data.houseReference = idSurvey.replace(regexp, "");
    }
    const isDemoMode = getFlatLocalStorageValue(LocalStorageVariableEnum.IS_DEMO_MODE) === "true";
    const isReviewerMode = getUserRights() == EdtUserRightsEnum.REVIEWER;
    fixConditionals(data);
    let oldDataSurvey = datas.get(idSurvey) ?? {};
    const dataIsChanged = dataIsChange(idSurvey, data, oldDataSurvey);
    const isChange = forceUpdate || dataIsChanged;
    datas.set(idSurvey, data);
    data = updateLocked(idSurvey, data);
    let stateData: StateData = data?.stateData ?? getLocalSurveyStateData(data) ?? initStateData(data);

    if (!navigator.onLine || isDemoMode || localSaveOnly) stateData.date = 0;

    if (isChange) {
        data = saveQualityScore(idSurvey, data);

        if (!navigator.onLine) {
            stateData.date = 0;
            data.stateData = stateData;
            return saveInDatabase(idSurvey, data);
        }
        if (!isDemoMode && !localSaveOnly) {
            stateData.date = data.lastLocalSaveDate ?? Date.now();
            const surveyData: SurveyData = {
                stateData: stateData,
                data: data,
            };
            data.lastRemoteSaveDate = stateData.date;

            if (isReviewerMode) {
                return remotePutSurveyDataReviewer(idSurvey, stateData, data).then(() => {
                    stateData.date = Math.max(stateData.date, data.lastLocalSaveDate ?? 0);
                    data.stateData = stateData;
                    data.lastRemoteSaveDate = stateData.date;
                    const revertedTranformedData = revertTransformedArray(data.COLLECTED);
                    data.COLLECTED = revertedTranformedData;
                    if (data.COLLECTED && "WEEKTYPE" in data.COLLECTED) {
                        const weeklyPlannerData = createDataWeeklyPlanner(data);
                        const WeeklyPlannerVariable: MultiCollected = {
                            COLLECTED: weeklyPlannerData,
                            EDITED: [],
                            FORCED: null,
                            INPUTED: null,
                            PREVIOUS: null,
                        };
                        data.COLLECTED["WEEKLYPLANNER"] = WeeklyPlannerVariable;
                    }
                    return saveInDatabase(idSurvey, data);
                });
            } else {
                return remotePutSurveyData(idSurvey, surveyData).then(() => {
                    data.stateData = stateData;
                    const revertedTranformedData = revertTransformedArray(data.COLLECTED);
                    data.COLLECTED = revertedTranformedData;
                    data.COLLECTED = revertedTranformedData;
                    if (data.COLLECTED && "WEEKTYPE" in data.COLLECTED) {
                        const weeklyPlannerData = createDataWeeklyPlanner(data);
                        const WeeklyPlannerVariable: MultiCollected = {
                            COLLECTED: weeklyPlannerData,
                            EDITED: [],
                            FORCED: null,
                            INPUTED: null,
                            PREVIOUS: null,
                        };
                        data.COLLECTED["WEEKLYPLANNER"] = WeeklyPlannerVariable;
                    }
                    return saveInDatabase(idSurvey, data);
                });
            }
        } else {
            stateData.date = 0;
            data.stateData = stateData;
            return saveInDatabase(idSurvey, data);
        }
    } else {
        data.stateData = stateData;
        return saveInDatabase(idSurvey, data);
    }
};

/**
 * @deprecated use saveData with the right parameters instead
 */
const saveDataLocally = (
    idSurvey: string,
    data: LunaticData,
    // localSaveOnly parameter is not used anymore
    _ = false,
    forceUpdate = false,
    stateDataForced?: StateData,
): Promise<LunaticData> => {
    return saveData(idSurvey, data, true, forceUpdate, stateDataForced);
};

/**
 * Save the new data in the database and keep the previous data in "oldDatas" variable
 */
const saveInDatabase = (idSurvey: string, data: LunaticData) => {
    let oldDataSurvey = datas.get(idSurvey) ?? {};
    oldDatas.set(idSurvey, oldDataSurvey);
    setDataCache(idSurvey, data);
    return lunaticDatabase.save(idSurvey, data).then(() => {
        datas.set(idSurvey, data);
        addItemToSession(idSurvey, data);
        return data;
    });
};

const saveReferentiels = (data: ReferentielData): Promise<ReferentielData> => {
    return lunaticDatabase.save(REFERENTIELS_ID, data).then(() => {
        referentielsData = data;
        return data;
    });
};

const saveSources = (data: SourceData): Promise<SourceData> => {
    return lunaticDatabase.save(SOURCES_MODELS, data).then(() => {
        if (sourcesData == undefined) {
            sourcesData = data;
        }
        return data;
    });
};

const saveSurveysIds = (data: SurveysIds): Promise<SurveysIds> => {
    return lunaticDatabase.save(SURVEYS_IDS, data).then(() => {
        surveysIds = data;
        return data;
    });
};

const saveUserSurveysData = (data: UserSurveysData): Promise<UserSurveys[]> => {
    return data.data?.length > 0
        ? lunaticDatabase.save(USER_SURVEYS_DATA, data).then(() => {
              userDatas = data.data;
              return data.data;
          })
        : lunaticDatabase.get(USER_SURVEYS_DATA).then(userDatas => {
              let userDatasLocal = userDatas as UserSurveysData;
              return userDatasLocal?.data;
          });
};

const getUserDatasActivity = (): UserSurveys[] => {
    return userDatasActivity.length > 0 ? userDatasActivity : getArrayFromSession("userDatasActivity");
};

const getUserDatasWorkTime = (): UserSurveys[] => {
    return userDatasWorkTime.length > 0 ? userDatasWorkTime : getArrayFromSession("userDatasWorkTime");
};

const getUserDatas = () => {
    return userDatas?.length > 0 ? userDatas : getArrayFromSession("userDatas");
};

const getSource = (refName: SourcesEnum) => {
    return refName == SourcesEnum.ACTIVITY_SURVEY ? edtActivitySurvey : edtWorkTimeSurvey;
};

const getVariable = (source: LunaticModel, dependency: string): LunaticModelVariable | undefined => {
    return source.variables.find(v => v.variableType === "COLLECTED" && v.name === dependency);
};
const getReferentiel = (refName: ReferentielsEnum) => {
    return referentielsData[refName];
};

//Return the last lunatic model page that has been fill with data
const getCurrentPage = (data: LunaticData | undefined, source?: LunaticModel): number => {
    if (data == null || !source?.components) {
        return -1;
    }
    const components = (source ?? getCurrentPageSource())?.components;
    let currentPage = 0;
    let notFilled = false;
    let i = 0;

    while (!notFilled && i < components.length) {
        const component = components[i];
        if (component.componentType != "Loop")
            notFilled = haveVariableNotFilled(component, source, data);
        if (notFilled) currentPage = Number(component.page ?? 0);
        i++;
    }
    if (currentPage == 0) {
        //TODO: Fix this
        const firstName = getValueOfData(data, FieldNameEnum.FIRSTNAME);
        if (firstName) currentPage = Number(components[components.length - 1].page);
        if (source.label == LABEL_WORK_TIME_SURVEY) currentPage = 3;
    }
    return currentPage;
};

const haveVariableNotFilled = (
    component: LunaticModelComponent | undefined,
    source: LunaticModel,
    data: LunaticData | undefined,
) => {
    const variables = component?.bindingDependencies;
    if (variables == null || variables.length == 0) return false;
    let filled = false;

    variables.forEach(v => {
        const variable = getVariable(source, v);
        if (variable) {
            const value = getValueOfData(data, variable.name);
            if (value != null && !Array.isArray(value)) {
                filled = false;
            } else if (Array.isArray(value)) {
                const arrayWeeklyPlanner = value as { [key: string]: string }[];
                filled = arrayWeeklyPlanner.find((val: any) => val != null) == null;
            } else filled = true;
        }
    });
    return filled;
};

const getComponentId = (variableName: FieldNameEnum, source: LunaticModel) => {
    return source?.variables.find(variable => variable.name === variableName)?.componentRef;
};

const getComponentsOfVariable = (
    variableName: FieldNameEnum,
    source: LunaticModel,
): LunaticModelComponent[] => {
    return source?.components.filter(
        component => component.response && component.response["name"] == variableName,
    );
};

const getValue = (idSurvey: string, variableName: FieldNameEnum, iteration?: number) => {
    const data = getDataCache(idSurvey);
    const valueEdited = data?.COLLECTED?.[variableName]?.EDITED;
    const valueCollected = data?.COLLECTED?.[variableName]?.COLLECTED;
    const modePersistenceEdited = getModePersistence(data) == ModePersistenceEnum.EDITED;

    if (iteration != null) {
        let value = valueCollected;
        if (modePersistenceEdited && valueEdited && valueEdited[iteration] != null) value = valueEdited;
        return Array.isArray(value) ? value[iteration] : null;
    } else {
        let value = modePersistenceEdited && valueEdited != null ? valueEdited : valueCollected;
        return value;
    }
};

const setValue = (
    idSurvey: string,
    variableName: FieldNameEnum,
    value: string | boolean | null,
    iteration?: number,
): LunaticData => {
    let dataAct = getDataCache(idSurvey) ?? {};
    if (dataAct == null) {
        lunaticDatabase.get(idSurvey).then(data => {
            getDataModePersist(idSurvey, data ?? {}, variableName, value, iteration);
        });
    } else {
        getDataModePersist(idSurvey, dataAct, variableName, value, iteration);
    }
    return dataAct;
};

const getDataModePersistOfArray = (
    dataAct: LunaticData,
    variableName: FieldNameEnum,
    modePersistenceEdited: boolean,
    value: string | boolean,
    iteration: number,
) => {
    if (dataAct?.COLLECTED && dataAct.COLLECTED[variableName]) {
        let dataAsArray = modePersistenceEdited
            ? dataAct.COLLECTED[variableName].EDITED
            : dataAct.COLLECTED[variableName].COLLECTED;
        if (dataAsArray && Array.isArray(dataAsArray)) {
            dataAsArray[iteration] = value;
        } else {
            dataAsArray = Array(iteration + 1);
            dataAsArray[iteration] = value;
        }

        if (modePersistenceEdited) dataAct.COLLECTED[variableName].EDITED = dataAsArray;
        else dataAct.COLLECTED[variableName].COLLECTED = dataAsArray;
    }
    return dataAct;
};

const getDataModePersist = (
    idSurvey: string,
    dataAct: LunaticData,
    variableName: FieldNameEnum,
    value: string | boolean | null,
    iteration?: number,
) => {
    const modePersistenceEdited = getModePersistence(dataAct) == ModePersistenceEnum.EDITED;
    if (dataAct?.COLLECTED && dataAct.COLLECTED[variableName]) {
        if (iteration != null && value != null) {
            dataAct = getDataModePersistOfArray(
                dataAct,
                variableName,
                modePersistenceEdited,
                value,
                iteration,
            );
        } else {
            const valueCollected = dataAct.COLLECTED[variableName].COLLECTED as string | boolean;
            const variable: Collected = {
                COLLECTED: modePersistenceEdited ? valueCollected : value,
                EDITED: modePersistenceEdited ? value : dataAct.COLLECTED[variableName].EDITED,
                FORCED: null,
                INPUTED: null,
                PREVIOUS: null,
            };
            dataAct.COLLECTED[variableName] = variable;
        }
    }
    datas.set(idSurvey, dataAct);
    addItemToSession(idSurvey, dataAct);
    return dataAct;
};

const getFirstName = (idSurvey: string) => {
    return getValue(idSurvey, FieldNameEnum.FIRSTNAME)?.toString();
};

const getSurveyDate = (idSurvey: string) => {
    return getValue(idSurvey, FieldNameEnum.SURVEYDATE)?.toString();
};

// return survey firstname if exist or default value
const getPrintedFirstName = (idSurvey: string): string => {
    return getFirstName(idSurvey) || t("common.user.person") + " " + getPersonNumber(idSurvey);
};

const getIdSurveyActivity = (interviewer: string, numActivity: number): string => {
    return getUserDatasActivity().filter(data => data.interviewerId == interviewer)[numActivity]
        ?.surveyUnitId;
};

const getIdSurveyWorkTime = (interviewer: string) => {
    return getUserDatasWorkTime().filter(data => data.interviewerId == interviewer)[0]?.surveyUnitId;
};

const createTabData = (idSurvey: string, t: any, isActivitySurvey: boolean) => {
    let tabData: TabData = {
        idSurvey: idSurvey,
        surveyDateLabel: getPrintedSurveyDate(
            idSurvey,
            isActivitySurvey ? EdtRoutesNameEnum.ACTIVITY : EdtRoutesNameEnum.WORK_TIME,
        ),
        firstNameLabel: getPrintedFirstName(idSurvey),
        score: getScore(idSurvey, t),
        isActivitySurvey: isActivitySurvey,
    };
    return tabData;
};

const getTabsDataReviewer = (t: any) => {
    let tabsData: TabData[] = [];

    const interviewers = getUserDatasActivity().map(data => data.interviewerId);
    const interviewersUniques = interviewers.filter(
        (value, index, self) => self.indexOf(value) === index,
    );

    interviewersUniques.forEach(interviewer => {
        let tabData1 = createTabData(getIdSurveyActivity(interviewer, 0), t, true);
        tabsData.push(tabData1);
        const tabData2 = createTabData(getIdSurveyActivity(interviewer, 1), t, true);
        tabsData.push(tabData2);
        if (getIdSurveyWorkTime(interviewer)) {
            const tabData3 = createTabData(getIdSurveyWorkTime(interviewer), t, false);
            tabsData.push(tabData3);
        }
    });
    return tabsData;
};

const getTabsDataInterviewer = (t: any) => {
    let tabsData: TabData[] = [];

    const dataOrdered = getOrderedSurveys(
        surveysIds[SurveysIdsEnum.ACTIVITY_SURVEYS_IDS],
        surveysIds[SurveysIdsEnum.WORK_TIME_SURVEYS_IDS],
    );

    dataOrdered.forEach(data => {
        const isActivity = data.data.questionnaireModelId == SourcesEnum.ACTIVITY_SURVEY;
        const tabData = createTabData(data.data.surveyUnitId, t, isActivity);
        tabsData.push(tabData);
    });
    return tabsData;
};

const getTabsData = (t: any): TabData[] => {
    if (isDemoMode()) {
        return getTabsDataReviewer(t);
    }
    if (isReviewer()) {
        setSurveysIdsReviewers();
    }
    return getTabsDataInterviewer(t);
};

const getNumSurveyDateReviewer = (
    label: string,
    idSurvey: string,
    surveyParentPage?: EdtRoutesNameEnum,
) => {
    let index = 0;
    if (isDemoMode()) {
        const dataUserSurvey = userDatas?.filter(data => data.surveyUnitId == idSurvey)[0];
        const indexInterviewerId = userDatas
            ?.filter(
                data =>
                    data.interviewerId == dataUserSurvey?.interviewerId &&
                    data.questionnaireModelId == dataUserSurvey?.questionnaireModelId,
            )
            .map(data => data.surveyUnitId)
            .indexOf(idSurvey);
        index = indexInterviewerId + 1;
    } else {
        const surveyMap = isReviewer() ? userDatasMap() : nameSurveyMap();
        const indexOfSurvey = surveyMap.find(user => user.data.surveyUnitId == idSurvey)?.num;
        index =
            surveyMap
                .filter(user => user.num == indexOfSurvey)
                .map(user => user.data.surveyUnitId)
                .indexOf(idSurvey) + 1;
    }

    if (surveyParentPage == EdtRoutesNameEnum.WORK_TIME) {
        return label;
    } else {
        return label + " " + index;
    }
};

/**
 * Returns the survey date in French format (day x - dd/mm) if it exists, or a default value.
 *
 * @param {string} idSurvey - The ID of the survey.
 * @param {EdtRoutesNameEnum} [surveyParentPage] - The parent page of the survey.
 * @returns {string} The formatted survey date or a default value.
 */
const getPrintedSurveyDate = (idSurvey: string, surveyParentPage?: EdtRoutesNameEnum): string => {
    const savedSurveyDate = getSurveyDate(idSurvey);
    const label =
        surveyParentPage === EdtRoutesNameEnum.WORK_TIME
            ? t("component.week-card.week")
            : t("component.day-card.day");
    if (savedSurveyDate) {
        const dayName = getFrenchDayFromDate(generateDateFromStringInput(savedSurveyDate));
        const capitalizedDayName =
            surveyParentPage === EdtRoutesNameEnum.WORK_TIME
                ? "Semaine du"
                : dayName.charAt(0).toUpperCase() + dayName.slice(1);

        const splittedDate = savedSurveyDate.split("-");
        return capitalizedDayName + " " + [splittedDate[2], splittedDate[1]].join("/");
    } else {
        return getNumSurveyDateReviewer(label, idSurvey, surveyParentPage);
    }
};

/**
 * Returns the date in full French format (dd/MM/YYYY).
 *
 * @param {string} surveyDate - The survey date in string format.
 * @returns {string} The formatted date in dd/MM/YYYY format.
 */
const getFullFrenchDate = (surveyDate: string): string => {
    const splittedDate = surveyDate?.split("-");
    return splittedDate?.length > 2 ? [splittedDate[2], splittedDate[1], splittedDate[0]].join("/") : "";
};

/**
 * Creates a map of survey names based on the provided survey IDs.
 *
 * @param {string[]} idSurveys - An array of survey IDs.
 * @returns {Array} An array of objects containing survey data, first name, and index.
 */
const createNameSurveyMap = (idSurveys: string[]) => {
    let numInterviewer = 0;
    return idSurveys
        .map((idSurvey, index) => {
            if (index % 2 == 0 && index != 0) {
                numInterviewer += 1;
            }
            const isActivity =
                surveysIds != null &&
                surveysIds[SurveysIdsEnum.ACTIVITY_SURVEYS_IDS].indexOf(idSurvey) >= 0;
            const userData: UserSurveys = {
                surveyUnitId: idSurvey,
                questionnaireModelId: isActivity
                    ? SourcesEnum.ACTIVITY_SURVEY
                    : SourcesEnum.WORK_TIME_SURVEY,
                id: 0,
                campaignId: "",
                subCampaignId: "",
                interviewerId: "",
                reviewerId: "",
            };
            const indexData = isActivity ? numInterviewer + 1 : index + 1;
            const name = isActivity ? "zzzz " + indexData : "zzzzz " + indexData;
            const data = {
                data: userData,
                firstName: name,
                num: indexData,
            };
            return data;
        })
        .sort((u1, u2) => u1.data.surveyUnitId.localeCompare(u2.data.surveyUnitId));
};

const nameSurveyMap = (): Person[] => {
    return getOrderedSurveys(
        surveysIds[SurveysIdsEnum.ACTIVITY_SURVEYS_IDS],
        surveysIds[SurveysIdsEnum.WORK_TIME_SURVEYS_IDS],
    );
};

const nameSurveyGroupMap = () => {
    const listSurveysAct = getOrderedSurveys(
        surveysIds[SurveysIdsEnum.ACTIVITY_SURVEYS_IDS],
        surveysIds[SurveysIdsEnum.WORK_TIME_SURVEYS_IDS],
    );
    let grouped = groupBy(listSurveysAct, nameSurveyData => nameSurveyData.num);
    return grouped;
};

const getOrderedSurveys = (activitiesIds: string[], workTimeIds: string[]) => {
    const userActivityMap = createNameSurveyMap(activitiesIds);
    const userWeeklyPlannerMap = createNameSurveyMap(workTimeIds);
    const userMap = userActivityMap.concat(userWeeklyPlannerMap).sort((u1, u2) => {
        if (u1.num == u2.num) return u1.firstName.localeCompare(u2.firstName);
        else return u1.num > u2.num ? 1 : -1;
    });
    return userMap;
};

const createUserDataMap = (usersurvey: UserSurveys[]): Person[] => {
    let numInterviewer = 0;
    return usersurvey
        .map((data, index) => {
            if (index % 2 == 0 && index != 0) {
                numInterviewer += 1;
            }
            return data.questionnaireModelId == SourcesEnum.ACTIVITY_SURVEY
                ? {
                      data: data,
                      firstName: "zzzz " + (numInterviewer + 1),
                      num: numInterviewer + 1,
                  }
                : {
                      data: data,
                      firstName: "zzzzz " + index + 1,
                      num: index + 1,
                  };
        })
        .sort((u1, u2) => u1.data.surveyUnitId.localeCompare(u2.data.surveyUnitId));
};

/**
 * map of name of survey and data of survey
 */
const userDatasMap = () => {
    const userActivityMap = createUserDataMap(getUserDatasActivity());
    const userWeeklyPlannerMap = createUserDataMap(getUserDatasWorkTime());

    const userMap = userActivityMap.concat(userWeeklyPlannerMap).sort((u1, u2) => {
        if (u1.num == u2.num) return u1.firstName.localeCompare(u2.firstName);
        else return u1.num > u2.num ? 1 : -1;
    });
    return userMap;
};

const arrayOfSurveysPersonDemo = (interviewer: string, index: number): Person[] => {
    return [
        {
            data: {
                questionnaireModelId: SourcesEnum.ACTIVITY_SURVEY,
                surveyUnitId: getIdSurveyActivity(interviewer, 0),
                interviewerId: interviewer,
                campaignId: "",
                subCampaignId: "",
            },
            firstName: "zzzz" + interviewer,
            num: index,
        },
        {
            data: {
                questionnaireModelId: SourcesEnum.ACTIVITY_SURVEY,
                surveyUnitId: getIdSurveyActivity(interviewer, 1),
                interviewerId: interviewer,
                campaignId: "",
                subCampaignId: "",
            },
            firstName: "zzzz" + interviewer,
            num: index,
        },
        {
            data: {
                questionnaireModelId: SourcesEnum.WORK_TIME_SURVEY,
                surveyUnitId: getIdSurveyWorkTime(interviewer),
                interviewerId: interviewer,
                campaignId: "",
                subCampaignId: "",
            },
            firstName: "zzzz" + interviewer,
            num: index,
        },
    ];
};

const getPersonNumber = (idSurvey: string) => {
    const interviewerId = userDatas?.filter(data => data.surveyUnitId == idSurvey)[0]?.interviewerId;
    let indexDemo = interviewerId?.split("interviewer")[1];

    const surveyMap = isReviewer() ? userDatasMap() : nameSurveyMap();
    indexDemo = (surveyMap?.find(user => user.data.surveyUnitId == idSurvey)?.num ?? 1).toString();
    return indexDemo;
};

const getStatsHousehold = (surveys: UserSurveys[]): StatsHousehold => {
    const surveysIdsHousehold = surveys
        .filter(survey => survey.questionnaireModelId == SourcesEnum.ACTIVITY_SURVEY)
        .map(survey => survey.surveyUnitId);
    let stats = null;
    let state: StateHouseholdEnum;
    let numHouseholds = 0,
        numHouseholdsInProgress = 0,
        numHouseholdsClosed = 0,
        numHouseholdsValidated = 0;
    surveysIdsHousehold.forEach(idSurvey => {
        const isValidated = isSurveyValidated(idSurvey);
        const isClosed = isSurveyClosed(idSurvey);
        const isStarted = isSurveyStarted(idSurvey);

        if (isValidated) {
            numHouseholdsValidated++;
        }
        if (isClosed && !isValidated) {
            numHouseholdsClosed++;
        }

        if (!isValidated && !isClosed && isStarted) {
            numHouseholdsInProgress++;
        }
        numHouseholds++;
    });

    if (numHouseholds == numHouseholdsValidated) state = StateHouseholdEnum.VALIDATED;
    else if (numHouseholdsClosed > 0) state = StateHouseholdEnum.CLOSED;
    else state = StateHouseholdEnum.IN_PROGRESS;

    stats = {
        numHouseholds: numHouseholds,
        numHouseholdsInProgress: numHouseholdsInProgress,
        numHouseholdsClosed: numHouseholdsClosed,
        numHouseholdsValidated: numHouseholdsValidated,
        state: state,
    };
    return stats;
};

const getSurveyRights = (idSurvey: string) => {
    const isReviewerMode = isReviewer();
    const isValidated = isSurveyValidated(idSurvey);
    const isLocked = isSurveyLocked(idSurvey);

    if (isReviewerMode) {
        return EdtSurveyRightsEnum.WRITE_REVIEWER;
    } else {
        return isLocked || isValidated || existVariableEdited(idSurvey)
            ? EdtSurveyRightsEnum.READ_INTERVIEWER
            : EdtSurveyRightsEnum.WRITE_INTERVIEWER;
    }
};

const existVariableEdited = (idSurvey?: string, data?: LunaticData) => {
    const dataSurv = data ?? getDataCache(idSurvey ?? "");
    const dataOfSurvey = dataSurv?.COLLECTED;

    for (let prop in FieldNameEnum as any) {
        if (prop == FieldNameEnum.FIRSTNAME) continue;
        const surveyData = dataOfSurvey && dataOfSurvey[prop];
        const ifArrayInputed =
            surveyData?.EDITED &&
            Array.isArray(surveyData.EDITED) &&
            surveyData.EDITED.length > 0 &&
            surveyData.EDITED[0] != null;
        if (
            (surveyData?.EDITED && ifArrayInputed) ||
            (surveyData?.EDITED && !Array.isArray(surveyData.EDITED))
        ) {
            return true;
        }
    }
    return false;
};

const getModePersistence = (data: LunaticData | undefined): ModePersistenceEnum => {
    const isReviewerMode = isReviewer();
    const isLocked = data?.COLLECTED?.[FieldNameEnum.ISLOCKED]?.COLLECTED as boolean;
    return isReviewerMode || isLocked || existVariableEdited(undefined, data)
        ? ModePersistenceEnum.EDITED
        : ModePersistenceEnum.COLLECTED;
};

const getValueWithData = (
    data: LunaticData | undefined,
    variableName: string,
): string | boolean | string[] | boolean[] | null[] | { [key: string]: string }[] | null | undefined => {
    return data?.COLLECTED?.[variableName]?.COLLECTED;
};

const getValueOfData = (
    data: LunaticData | undefined,
    variableName: string,
): string | boolean | string[] | boolean[] | null[] | { [key: string]: string }[] | null | undefined => {
    const modePersistenceEdited = getModePersistence(data) == ModePersistenceEnum.EDITED;
    const dataCollected = data?.COLLECTED;
    const dataSurvey = dataCollected?.[variableName];
    const dataEdited = dataSurvey?.EDITED;
    const dataCollect = dataSurvey?.COLLECTED;
    if (dataCollected) {
        if (modePersistenceEdited) {
            return dataEdited ?? dataCollect;
        } else {
            return dataCollect;
        }
    }
    return null;
};

const getSurveysAct = () => {
    let surveys: Person[] = [];
    const isDemo = isDemoMode();
    if (getUserRights() === EdtUserRightsEnum.REVIEWER && !isDemo) {
        surveys = userDatasMap();
    } else if (getUserRights() === EdtUserRightsEnum.REVIEWER) {
        let interviewers = getUserDatasActivity().map(data => data.interviewerId);
        let interviewersUniques = interviewers.filter(
            (value, index, self) => self.indexOf(value) === index,
        );
        interviewersUniques.forEach((interviewer, index) => {
            surveys = surveys.concat(arrayOfSurveysPersonDemo(interviewer, index));
        });
    } else {
        surveys = nameSurveyMap();
    }
    return surveys;
};

const getPerson = (idSurvey: string) => {
    const surveys = getSurveysAct();
    const personAct = surveys?.find(survey => survey.data.surveyUnitId == idSurvey);
    return personAct;
};

export const getGroupOfPerson = (idSurvey: string) => {
    const surveys = getSurveysAct();
    const personAct = surveys?.find(survey => survey.data.surveyUnitId == idSurvey);
    const idsSurveysFromGroupAct = surveys
        ?.filter(survey => survey.num == personAct?.num)
        .map(survey => survey.data.surveyUnitId);
    return idsSurveysFromGroupAct;
};

const validateAllGroup = (
    navigate: NavigateFunction,
    idSurvey: string,
    inputNameAct: string,
    inputDate?: string,
) => {
    const personAct = getPerson(idSurvey);
    const surveyRootPage =
        personAct?.data?.questionnaireModelId == SourcesEnum.WORK_TIME_SURVEY
            ? EdtRoutesNameEnum.WORK_TIME
            : EdtRoutesNameEnum.ACTIVITY;

    const route = navToPlanner(idSurvey, surveyRootPage);

    setAllNamesOfGroupAndNav(
        navigate,
        route,
        idSurvey,
        getGroupOfPerson(idSurvey),
        inputNameAct,
        inputDate,
    );
};

const initSurveyData = (surveyId: string): LunaticData => {
    const regexp = new RegExp(import.meta.env.VITE_HOUSE_REFERENCE_REGULAR_EXPRESSION || "");
    let surveyData: LunaticData = {
        COLLECTED: {},
        CALCULATED: {},
        EXTERNAL: {},
        houseReference: "",
        id: "",
        lastLocalSaveDate: Date.now(),
    };
    surveyData.houseReference = surveyId?.replace(regexp, "");
    surveyData.CALCULATED = {};
    surveyData.EXTERNAL = {};
    surveyData.COLLECTED = getDataEmpty(surveyId);
    surveyData.lastLocalSaveDate = Date.now();
    surveyData.stateData = initStateData();
    return surveyData;
};

export {
    addToAutocompleteActivityReferentiel,
    arrayOfSurveysPersonDemo,
    createDataEmpty,
    createNameSurveyMap,
    existVariableEdited,
    getAuthCache,
    getComponentId,
    getComponentsOfVariable,
    getCurrentPage,
    getData,
    getDataEmpty,
    getDataUpdatedOffline,
    getDatas,
    getFirstName,
    getFullFrenchDate,
    getIdSurveyActivity,
    getIdSurveyWorkTime,
    getListSurveys,
    getListSurveysHousehold,
    getModePersistence,
    getPerson,
    getPrintedFirstName,
    getPrintedSurveyDate,
    getReferentiel,
    getRemoteSavedSurveysDatas,
    getSource,
    getSurveyDate,
    getSurveysIdsForHousehold,
    getSurveyRights,
    getLocalSurveyStateData,
    getTabsData,
    getUserDatas,
    getUserDatasActivity,
    getUserDatasWorkTime,
    getValue,
    getValueOfData,
    getValueWithData,
    getVarBooleanModepersistance,
    getVariable,
    initPropsAuth,
    initStateData,
    initSurveyData,
    initializeDatas,
    initializeHomeSurveys,
    initializeListSurveys,
    initializeSurveysDatasCache,
    initializeSurveysIdsDataModeReviewer,
    initializeSurveysIdsDemo,
    initializeSurveysIdsModeReviewer,
    nameSurveyGroupMap,
    nameSurveyMap,
    navToPlanner,
    refreshSurvey,
    refreshSurveyData,
    saveData,
    saveDataLocally,
    saveDatas,
    saveReferentiels,
    setData,
    setValue,
    surveysIds,
    toIgnoreForActivity,
    toIgnoreForRoute,
    userDatasMap,
    validateAllGroup,
    isDemoMode,
};
