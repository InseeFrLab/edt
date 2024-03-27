import {
    AutoCompleteActiviteOption,
    CheckboxOneCustomOption,
    NomenclatureActivityOption,
    findItemInCategoriesNomenclature,
    generateDateFromStringInput,
    getFrenchDayFromDate,
} from "@inseefrlab/lunatic-edt";
import activitySurveySource from "activity-survey.json";
import dayjs from "dayjs";
import { EdtRoutesNameEnum } from "enumerations/EdtRoutesNameEnum";
import { EdtSurveyRightsEnum } from "enumerations/EdtSurveyRightsEnum";
import { ErrorCodeEnum } from "enumerations/ErrorCodeEnum";
import { FieldNameEnum } from "enumerations/FieldNameEnum";
import { LocalStorageVariableEnum } from "enumerations/LocalStorageVariableEnum";
import { ModePersistenceEnum } from "enumerations/ModePersistenceEnum";
import { ReferentielsEnum } from "enumerations/ReferentielsEnum";
import { SourcesEnum } from "enumerations/SourcesEnum";
import { StateDataStateEnum } from "enumerations/StateDataStateEnum";
import { StateHouseholdEnum } from "enumerations/StateHouseholdEnum";
import { StateSurveyEnum } from "enumerations/StateSurveyEnum";
import { SurveysIdsEnum } from "enumerations/SurveysIdsEnum";
import { t } from "i18next";
import { TabData } from "interface/component/Component";
import { StateData, SurveyData, UserSurveys } from "interface/entity/Api";
import { Household } from "interface/entity/Household";
import { Person } from "interface/entity/Person";
import { StatsHousehold } from "interface/entity/StatsHouseHold";
import {
    Collected,
    DATA_STATE,
    DataState,
    LunaticModel,
    LunaticModelComponent,
    LunaticModelVariable,
    MultiCollected,
    REFERENTIELS_ID,
    ReferentielData,
    SOURCES_MODELS,
    SURVEYS_IDS,
    SourceData,
    SurveysIds,
    USER_SURVEYS_DATA,
    UserSurveysData,
} from "interface/lunatic/Lunatic";
import { AuthContextProps } from "oidc-react";
import { NavigateFunction } from "react-router-dom";
import { fetchReviewerSurveysAssignments } from "service/api-service";
import { lunaticDatabase } from "service/lunatic-database";
import { LABEL_WORK_TIME_SURVEY, getCurrentPageSource } from "service/orchestrator-service";
import dataEmptyActivity from "utils/dataEmptyActivity.json";
import dataEmptyWorkTime from "utils/dataEmptyWeeklyPlanner.json";
import {
    addArrayToSession,
    addItemToSession,
    getArrayFromSession,
    getItemFromSession,
    groupBy,
    objectEquals,
} from "utils/utils";
import { validate } from "uuid";
import workTimeSource from "work-time-survey.json";
import { EdtUserRightsEnum } from "./../enumerations/EdtUserRightsEnum";
import { LunaticData } from "./../interface/lunatic/Lunatic";
import {
    fetchReferentiels,
    fetchSurveysSourcesByIds,
    fetchUserSurveysInfo,
    remoteGetSurveyData,
    remoteGetSurveyDataReviewer,
    remotePutSurveyData,
    remotePutSurveyDataReviewer,
} from "./api-service";
import { getFlatLocalStorageValue } from "./local-storage-service";
import { getFullNavigatePath, setAllNamesOfGroupAndNav } from "./navigation-service";
import { getQualityScore } from "./summary-service";
import { getActivitiesOrRoutes, getScore } from "./survey-activity-service";
import { getUserRights, isReviewer } from "./user-service";

const datas = new Map<string, LunaticData>();
const oldDatas = new Map<string, LunaticData>();

const NUM_MAX_ACTIVITY_SURVEYS = process.env.REACT_APP_NUM_ACTIVITY_SURVEYS ?? 6;
const NUM_MAX_WORKTIME_SURVEYS = 3;

let referentielsData: ReferentielData;
let sourcesData: SourceData;
let surveysIds: SurveysIds;
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
        promisesToWait.push(initializeRefs(setError));
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
    return lunaticDatabase.get(DATA_STATE).then(data => {
        let dataState = data as DataState;
        return dataState;
    });
};

const initializeRefs = (setError: (error: ErrorCodeEnum) => void) => {
    return lunaticDatabase.get(REFERENTIELS_ID).then(refData => {
        if (!refData && navigator.onLine) {
            return fetchReferentiels(setError).then(refs => {
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
                    userDatas.push(surveyData);
                }
                if (surveyData.questionnaireModelId === SourcesEnum.WORK_TIME_SURVEY) {
                    workingTimeSurveysIds.push(surveyData.surveyUnitId);
                    userSurveyDataWorkTime.push(surveyData);
                    userDatas.push(surveyData);
                }
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
            const innerPromises: Promise<any>[] = [
                getRemoteSavedSurveysDatas(allSurveysIds, setError).then(() => {
                    return initializeSurveysDatasCache(allSurveysIds);
                }),
                saveSurveysIds(surveysIds),
                fetchSurveysSourcesByIds(
                    [SourcesEnum.ACTIVITY_SURVEY, SourcesEnum.WORK_TIME_SURVEY],
                    setError,
                ).then(sources => {
                    const inerFetchPromises: Promise<any>[] = [
                        saveSources(sources),
                        saveUserSurveysData({ data: userDatas }),
                    ];
                    return Promise.all(inerFetchPromises);
                }),
            ];
            return Promise.all(innerPromises);
        });
    } else {
        return lunaticDatabase.get(USER_SURVEYS_DATA).then((data: LunaticData | undefined) => {
            let userDaras = data as UserSurveysData;
            let userSurveyData = userDaras.data;
            let activitySurveysIds: string[] = [];
            let userSurveyDataActivity: UserSurveys[] = [];
            let workingTimeSurveysIds: string[] = [];
            let userSurveyDataWorkTime: UserSurveys[] = [];

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
            const surveysIds: SurveysIds = {
                [SurveysIdsEnum.ALL_SURVEYS_IDS]: allSurveysIds,
                [SurveysIdsEnum.ACTIVITY_SURVEYS_IDS]: activitySurveysIds,
                [SurveysIdsEnum.WORK_TIME_SURVEYS_IDS]: workingTimeSurveysIds,
            };

            const innerPromisesOffline: Promise<any>[] = [
                initializeSurveysDatasCache(allSurveysIds),
                //saveSurveysIds(surveysIds),
                //saveUserSurveysData({ data: userDatas }),
            ];
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
                        return initializeSurveysDatasCache();
                    }),
                );
            }
            promises.push(initializeSurveysDatasCache());
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
        userDatas.push(userSurvey);
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

const initializeData = (remoteSurveyData: SurveyData, surveyId: string) => {
    const regexp = new RegExp(process.env.REACT_APP_HOUSE_REFERENCE_REGULAR_EXPRESSION || "");
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
    surveyData.COLLECTED = remoteSurveyData.data?.COLLECTED ?? getDataEmpty(surveyId);
    surveyData.lastLocalSaveDate = remoteSurveyData.data?.lastLocalSaveDate ?? 0;
    surveyData.stateData = remoteSurveyData.stateData;
    return surveyData;
};

const getRemoteSavedSurveysDatas = (
    surveysIds: string[],
    setError: (error: ErrorCodeEnum) => void,
    withoutState?: boolean,
): Promise<any> => {
    const promises: Promise<any>[] = [];
    if (navigator.onLine) {
        const urlRemote = isReviewer() ? remoteGetSurveyDataReviewer : remoteGetSurveyData;
        surveysIds.forEach(surveyId => {
            promises.push(
                urlRemote(surveyId, setError, withoutState ?? true).then(
                    (remoteSurveyData: SurveyData) => {
                        const surveyData = initializeData(remoteSurveyData, surveyId);
                        return lunaticDatabase.get(surveyId).then(localSurveyData => {
                            if (
                                localSurveyData == null ||
                                remoteSurveyData.stateData?.date == null ||
                                (remoteSurveyData.stateData?.date &&
                                    remoteSurveyData.stateData?.date > 0 &&
                                    (localSurveyData === undefined ||
                                        (localSurveyData.lastLocalSaveDate ?? 0) <
                                            remoteSurveyData.stateData.date))
                            ) {
                                const stateData = getSurveyStateData(surveyData, surveyId);
                                setLocalOrRemoteData(surveyId, remoteSurveyData, surveyData, stateData);
                                return lunaticDatabase.save(surveyId, surveyData);
                            }
                        });
                    },
                ),
            );
        });
    }
    return Promise.all(promises);
};

const initializeSurveysDatasCache = (idSurveys?: string[]): Promise<any> => {
    const promises: Promise<any>[] = [];
    const idSurveysToInit = idSurveys ?? surveysIds[SurveysIdsEnum.ALL_SURVEYS_IDS];
    return lunaticDatabase.get(SURVEYS_IDS).then(data => {
        surveysIds = data as SurveysIds;
        return new Promise(resolve => {
            for (const idSurvey of idSurveysToInit) {
                promises.push(initializeDatasCache(idSurvey));
                promises.push(
                    lunaticDatabase.get(USER_SURVEYS_DATA).then(data => {
                        userDatas = (data as UserSurveysData)?.data;
                    }),
                );
            }
            return Promise.all(promises).finally(() => {
                resolve(true);
            });
        });
    });
};

const initializeDatasCache = (idSurvey: string) => {
    return lunaticDatabase.get(idSurvey).then(data => {
        if (data != null) {
            const regexp = new RegExp(process.env.REACT_APP_HOUSE_REFERENCE_REGULAR_EXPRESSION || "");
            data.houseReference = idSurvey.replace(regexp, "");
            datas.set(idSurvey, data);
            addItemToSession(idSurvey, data);
            oldDatas.set(idSurvey, data);
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
                    if (surveyData.questionnaireModelId === SourcesEnum.ACTIVITY_SURVEY) {
                        userDatas.push(surveyData);
                    }
                    if (surveyData.questionnaireModelId === SourcesEnum.WORK_TIME_SURVEY) {
                        userDatas.push(surveyData);
                    }
                });
                return saveUserSurveysData({ data: userDatas });
            })
            .catch(() => {
                return lunaticDatabase.get(USER_SURVEYS_DATA);
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
            console.log("user surveys datas gets", data);
            //return saveUserSurveysData({ data: userDatas });
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
    const emptyData = getDataCache(idSurvey) ?? createDataEmpty(idSurvey ?? "");
    const data = modifyCollected || emptyData;
    return data;
};

const getDataCache = (idSurvey: string) => {
    const dataSession = getItemFromSession(idSurvey);
    return datas.get(idSurvey) ?? dataSession;
};

const modifyIndividualCollected = (idSurvey: string) => {
    let dataSurv = Object.assign(getDataCache(idSurvey));

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
        return dataEmptyWorkTime;
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
    };
    data.COLLECTED = getDataEmpty(idSurvey);
    return data;
};

const getIfArrayIsChange = (
    currentData:
        | string
        | boolean
        | string[]
        | boolean[]
        | null[]
        | {
              [key: string]: string;
          }[],
    data:
        | string
        | boolean
        | string[]
        | boolean[]
        | null[]
        | {
              [key: string]: string;
          }[],
    isChange: boolean,
) => {
    let isChangeArray = isChange;
    const currentDataCollectedArray = currentData as string[];
    const dataCollectedArray = data as string[];
    dataCollectedArray?.forEach((data, i) => {
        if (
            (typeof data === "object" && !objectEquals(currentDataCollectedArray[i], data)) ||
            (typeof data != "object" &&
                (currentDataCollectedArray == null || currentDataCollectedArray[i] != data))
        ) {
            isChangeArray = true;
        }
    });
    if (dataCollectedArray.length != currentDataCollectedArray.length) {
        isChangeArray = true;
    }
    return isChangeArray;
};
const dataIsChange = (idSurvey: string, dataAct: LunaticData) => {
    const currentDataSurvey = oldDatas.get(idSurvey);
    const currentDataCollected = currentDataSurvey?.COLLECTED;
    const dataCollected = dataAct?.COLLECTED;
    let isChange = false;
    if (dataCollected && currentDataCollected) {
        const keys = Object.keys(dataCollected);

        keys?.forEach(key => {
            const data = getValueOfData(dataAct, key) ?? [];
            const currentData = getValueOfData(currentDataSurvey, key) ?? [];
            if (data != currentData) {
                if (Array.isArray(data)) {
                    isChange = getIfArrayIsChange(currentData, data, isChange);
                } else {
                    isChange = true;
                }
            }
        });
        if (surveysIds[SurveysIdsEnum.WORK_TIME_SURVEYS_IDS].includes(idSurvey)) {
            isChange = true;
        }
    } else {
        isChange = true;
    }

    return isChange;
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
const undefineVarSomeone = (data: LunaticData, modePersistence: ModePersistenceEnum, index: number) => {
    const dataCollected = data.COLLECTED;
    if (dataCollected) {
        const child = getVarBooleanModepersistance(dataCollected, modePersistence, FieldNameEnum.CHILD);
        const couple = getVarBooleanModepersistance(
            dataCollected,
            modePersistence,
            FieldNameEnum.COUPLE,
        );
        const parents = getVarBooleanModepersistance(
            dataCollected,
            modePersistence,
            FieldNameEnum.PARENTS,
        );
        const otherknow = getVarBooleanModepersistance(
            dataCollected,
            modePersistence,
            FieldNameEnum.OTHERKNOWN,
        );
        const other = getVarBooleanModepersistance(dataCollected, modePersistence, FieldNameEnum.OTHER);

        if (child) child[index] = null;
        if (couple) couple[index] = null;
        if (parents) parents[index] = null;
        if (otherknow) otherknow[index] = null;
        if (other) other[index] = null;
    }
};

const undefineVarSecondaryActivity = (
    data: LunaticData,
    modePersistence: ModePersistenceEnum,
    index: number,
) => {
    const dataCollected = data.COLLECTED;
    const modeInterviewer = modePersistence == ModePersistenceEnum.COLLECTED;
    if (dataCollected) {
        const secondaryActivity = (
            modeInterviewer
                ? dataCollected[FieldNameEnum.SECONDARYACTIVITY].COLLECTED
                : dataCollected[FieldNameEnum.SECONDARYACTIVITY].EDITED
        ) as (string | null)[];
        const secondaryActivityLabel = (
            modeInterviewer
                ? dataCollected[FieldNameEnum.SECONDARYACTIVITY_LABEL].COLLECTED
                : dataCollected[FieldNameEnum.SECONDARYACTIVITY_LABEL].EDITED
        ) as (string | null)[];

        if (secondaryActivity) secondaryActivity[index] = null;
        if (secondaryActivityLabel) secondaryActivityLabel[index] = null;
    }
};

const fixConditionals = (data: LunaticData) => {
    const withSomeone = data.COLLECTED?.[FieldNameEnum.WITHSOMEONE];
    const withSecondaryActivity = data.COLLECTED?.[FieldNameEnum.WITHSECONDARYACTIVITY];
    const modePersistence = getModePersistence(data);

    const arrayWithSomeone =
        modePersistence == ModePersistenceEnum.COLLECTED ? withSomeone?.COLLECTED : withSomeone?.EDITED;
    const arrayWithSecondaryActivity =
        modePersistence == ModePersistenceEnum.COLLECTED
            ? withSecondaryActivity?.COLLECTED
            : withSecondaryActivity?.EDITED;
    if (arrayWithSomeone?.length && arrayWithSomeone?.length == 0) {
        arrayWithSomeone?.forEach((withSom: string, index: number) => {
            if (withSom == "false") {
                undefineVarSomeone(data, modePersistence, index);
            }
        });
    }

    if (arrayWithSecondaryActivity && arrayWithSecondaryActivity.length == 0) {
        arrayWithSecondaryActivity?.forEach((withSecAct: string, index: number) => {
            if (withSecAct == "false") {
                undefineVarSecondaryActivity(data, modePersistence, index);
            }
        });
    }
};

const saveQualityScore = (idSurvey: string, data: LunaticData) => {
    const { activitiesRoutesOrGaps, overlaps } = getActivitiesOrRoutes(t, idSurvey);
    const qualityScore = getQualityScore(idSurvey, activitiesRoutesOrGaps, overlaps, t);
    const modePersistence = getModePersistence(data);
    if (data.COLLECTED?.[FieldNameEnum.QUALITY_SCORE_SUBSTRACT_POINTS]) {
        data.COLLECTED[FieldNameEnum.QUALITY_SCORE_SUBSTRACT_POINTS] = {
            COLLECTED: modePersistence == ModePersistenceEnum.COLLECTED ? qualityScore.points : null,
            EDITED: modePersistence == ModePersistenceEnum.EDITED ? qualityScore.points : null,
            FORCED: null,
            INPUTED: null,
            PREVIOUS: null,
        };
    }
    if (data.COLLECTED?.[FieldNameEnum.QUALITY_SCORE]) {
        data.COLLECTED[FieldNameEnum.QUALITY_SCORE] = {
            COLLECTED: modePersistence == ModePersistenceEnum.COLLECTED ? qualityScore.group : null,
            EDITED: modePersistence == ModePersistenceEnum.EDITED ? qualityScore.group : null,
            FORCED: null,
            INPUTED: null,
            PREVIOUS: null,
        };
    }
    return data;
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

const saveData = (
    idSurvey: string,
    data: LunaticData,
    localSaveOnly = false,
    forceUpdate = false,
): Promise<LunaticData> => {
    data.lastLocalSaveDate = Date.now();
    if (!data.houseReference) {
        const regexp = new RegExp(process.env.REACT_APP_HOUSE_REFERENCE_REGULAR_EXPRESSION || "");
        data.houseReference = idSurvey.replace(regexp, "");
    }
    const isDemoMode = getFlatLocalStorageValue(LocalStorageVariableEnum.IS_DEMO_MODE) === "true";
    const isReviewerMode = getUserRights() == EdtUserRightsEnum.REVIEWER;
    fixConditionals(data);
    const isChange = forceUpdate || dataIsChange(idSurvey, data);
    data = updateLocked(idSurvey, data);
    return lunaticDatabase.save(idSurvey, data).then(() => {
        const promisesToWait: Promise<any>[] = [];
        datas.set(idSurvey, data);
        if (isChange) {
            data = saveQualityScore(idSurvey, data);
            if (!isDemoMode && isReviewerMode && !localSaveOnly && navigator.onLine) {
                const stateData = getSurveyStateData(data, idSurvey);
                promisesToWait.push(
                    remotePutSurveyDataReviewer(idSurvey, stateData, data)
                        .then(dataRemote => {
                            setLocalOrRemoteData(idSurvey, dataRemote, data, stateData);
                        })
                        .catch(() => {
                            //return Promise.reject({});
                            //We ignore the error because user is stuck on EndSurveyPage if he couldn't submit in any moment his survey.
                        }),
                );
            }
            //We try to submit each time the local database is updated if the user is online
            else if (!isDemoMode && !localSaveOnly && navigator.onLine) {
                const stateData = getSurveyStateData(data, idSurvey);
                const surveyData: SurveyData = {
                    stateData: stateData,
                    data: data,
                };
                promisesToWait.push(
                    remotePutSurveyData(idSurvey, surveyData)
                        .then(dataRemote => {
                            setLocalOrRemoteData(idSurvey, dataRemote, data, stateData);
                        })
                        .catch(() => {
                            //return Promise.reject();
                            //We ignore the error because user is stuck on EndSurveyPage if he couldn't submit in any moment his survey.
                        }),
                );
            } else if (isDemoMode || localSaveOnly) {
                promisesToWait.push(
                    new Promise(resolve => {
                        setLocalDatabase(getSurveyStateData(data, idSurvey), data, idSurvey);
                        resolve(data);
                    }),
                );
            }
        }

        return new Promise(resolve => {
            Promise.all(promisesToWait).finally(() => {
                resolve(data);
            });
        });
    });
};

const setLocalOrRemoteData = (
    idSurvey: string,
    dataRemote: SurveyData,
    data: LunaticData,
    stateData: StateData,
) => {
    if (dataRemote != data && (data == null || data.COLLECTED == undefined)) {
        setLocalDatabase(stateData, dataRemote.data, idSurvey);
    } else {
        setLocalDatabase(stateData, data, idSurvey);
    }
};

const setLocalDatabase = (stateData: StateData, data: LunaticData, idSurvey: string) => {
    data.lastRemoteSaveDate = stateData.date;
    //set the last remote save date inside local database to be able to compare it later with remote data
    lunaticDatabase.save(idSurvey, data).then(() => {
        datas.set(idSurvey, data);
        addItemToSession(idSurvey, data);
        oldDatas.set(idSurvey, data);
    });
};

const getStateOfSurvey = (idSurvey: string): StateDataStateEnum => {
    const isSent = getValue(idSurvey, FieldNameEnum.ISENVOYED) as boolean;
    const isValidated = surveyValidated(idSurvey);
    let state: StateDataStateEnum = StateDataStateEnum.INIT;

    if (isSent) {
        state = StateDataStateEnum.COMPLETED;
    } else if (isValidated) {
        state = StateDataStateEnum.VALIDATED;
    }
    return state;
};

const getSurveyStateData = (data: LunaticData, idSurvey: string): StateData => {
    const stateData: StateData = {
        state: getStateOfSurvey(idSurvey),
        date: Date.now(),
        currentPage: getCurrentPage(data),
    };
    return stateData;
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

const setSurveysIds = (data: SurveysIds) => {
    surveysIds = data;
};

const saveSurveysIds = (data: SurveysIds): Promise<SurveysIds> => {
    return lunaticDatabase.save(SURVEYS_IDS, data).then(() => {
        surveysIds = data;
        return data;
    });
};

const setUserSurveysData = (data: UserSurveysData) => {
    userDatas = data.data;
};

const saveUserSurveysData = (data: UserSurveysData): Promise<UserSurveys[]> => {
    return lunaticDatabase.save(USER_SURVEYS_DATA, data).then(() => {
        userDatas = data.data;
        return data.data;
    });
};

const getUserDatasActivity = (): UserSurveys[] => {
    return userDatasActivity.length > 0 ? userDatasActivity : getArrayFromSession("userDatasActivity");
};

const getUserDatasWorkTime = (): UserSurveys[] => {
    return userDatasWorkTime.length > 0 ? userDatasWorkTime : getArrayFromSession("userDatasWorkTime");
};

const getUserDatas = () => {
    return userDatas.length > 0 ? userDatas : getArrayFromSession("userDatas");
};

const addToSecondaryActivityReferentiel = (
    referentiel: ReferentielsEnum.ACTIVITYSECONDARYACTIVITY | ReferentielsEnum.ROUTESECONDARYACTIVITY,
    newItem: CheckboxOneCustomOption,
) => {
    lunaticDatabase.get(REFERENTIELS_ID).then((currentData: any) => {
        currentData[referentiel].push(newItem);
        currentData[ReferentielsEnum.ACTIVITYAUTOCOMPLETE].push({
            id: newItem.value,
            label: newItem.label,
        });
        saveReferentiels(currentData);
    });
};

const getNewSecondaryActivities = (idSurvey: string, referentiel: CheckboxOneCustomOption[]) => {
    const listSecondaryActivitiesIds = getValue(idSurvey, FieldNameEnum.SECONDARYACTIVITY);
    const listSecondaryActivitiesLabel = getValue(idSurvey, FieldNameEnum.SECONDARYACTIVITY_LABEL);

    let listSecondaryActivities = referentiel;
    listSecondaryActivitiesIds?.forEach((id: string, index: number) => {
        const existActivity = referentiel.find(ref => ref.value == id) != null;
        if (validate(id) && !existActivity) {
            const newActivity = {
                value: id,
                label: listSecondaryActivitiesLabel[index],
            };
            listSecondaryActivities.push(newActivity);
        }
    });
    return listSecondaryActivities;
};

const addToAutocompleteActivityReferentiel = (newItem: AutoCompleteActiviteOption) => {
    lunaticDatabase.get(REFERENTIELS_ID).then((currentData: any) => {
        const ref = currentData[ReferentielsEnum.ACTIVITYAUTOCOMPLETE];
        if (!ref.find((opt: any) => opt.label == newItem.label)) {
            currentData[ReferentielsEnum.ACTIVITYAUTOCOMPLETE].push(newItem);
            saveReferentiels(currentData);
        }
    });
};

const createNewActivityInCategory = (
    newItem: AutoCompleteActiviteOption,
    categoryId: string | undefined,
    newActivity: string,
    reeferentiel: NomenclatureActivityOption[],
) => {
    lunaticDatabase.get(REFERENTIELS_ID).then((currentData: any) => {
        const ref = currentData[ReferentielsEnum.ACTIVITYNOMENCLATURE];
        const category = findItemInCategoriesNomenclature(categoryId, reeferentiel);
        const categoryParent = category?.parent ?? category?.item;
        const parentCategoryId = categoryParent?.id;
        const existCategory = category?.item.subs.find((cat: any) => cat.label == newItem.label);
        if (!existCategory) {
            category?.item.subs.push({
                id: newItem.id,
                rang: category?.item.rang + 1,
                label: newItem.label,
            });
            const indexParentCategory = ref.findIndex((opt: any) => opt.id == parentCategoryId);

            ref[indexParentCategory] = categoryParent;
            return saveReferentiels(currentData).then(() => {
                addToAutocompleteActivityReferentiel(newItem);
                localStorage.setItem("selectedIdNewActivity", newActivity);
            });
        }

        if (!categoryId) {
            return saveReferentiels(currentData).then(() => {
                addToAutocompleteActivityReferentiel(newItem);
                localStorage.setItem("selectedIdNewActivity", newActivity);
            });
        }
    });
};

const getReferentiel = (refName: ReferentielsEnum) => {
    return referentielsData[refName];
};

const getSource = (refName: SourcesEnum) => {
    return refName == SourcesEnum.ACTIVITY_SURVEY ? activitySurveySource : workTimeSource;
};

const getVariable = (source: LunaticModel, dependency: string): LunaticModelVariable | undefined => {
    return source.variables.find(v => v.variableType === "COLLECTED" && v.name === dependency);
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
        const firstName = getValueOfData(data, FieldNameEnum.FIRSTNAME);
        if (firstName) currentPage = Number(components[components.length - 2].page);
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
    } else if (isReviewer()) {
        setSurveysIdsReviewers();
        return getTabsDataInterviewer(t);
    } else {
        return getTabsDataInterviewer(t);
    }
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

// return survey date in french format (day x - dd/mm) if exist or default value
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

//Return date with full french format dd/MM/YYYY
const getFullFrenchDate = (surveyDate: string): string => {
    const splittedDate = surveyDate?.split("-");
    return splittedDate?.length > 2 ? [splittedDate[2], splittedDate[1], splittedDate[0]].join("/") : "";
};

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

const isDemoMode = () => {
    return getFlatLocalStorageValue(LocalStorageVariableEnum.IS_DEMO_MODE) === "true";
};

const surveyLocked = (idSurvey: string) => {
    const isLocked = getValue(idSurvey, FieldNameEnum.ISLOCKED) as boolean;
    const variableEdited = existVariableEdited(idSurvey);
    return (isLocked != null && isLocked) || variableEdited;
};

const surveyValidated = (idSurvey: string) => {
    const isValidated = getValue(idSurvey, FieldNameEnum.ISVALIDATED) as boolean;
    return isValidated != null && isValidated;
};

const surveyClosed = (idSurvey: string) => {
    const isClosed = getValue(idSurvey, FieldNameEnum.ISCLOSED) as boolean;
    return isClosed != null && isClosed;
};

const surveyStarted = (idSurvey: string) => {
    const surveyDate = getValue(idSurvey, FieldNameEnum.SURVEYDATE) as string;
    return surveyDate != null && surveyDate.length > 0;
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
        const isValidated = surveyValidated(idSurvey);
        const isClosed = surveyClosed(idSurvey);
        const isStarted = surveyStarted(idSurvey);

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

const lockSurvey = (idSurvey: string) => {
    const promisesToWait: Promise<any>[] = [];
    const data = getData(idSurvey || "");
    const isLocked = surveyLocked(idSurvey);
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

    return new Promise(resolve => {
        Promise.all(promisesToWait).then(() => {
            resolve(isLocked);
        });
    });
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
    const promisesToWait: Promise<any>[] = [];
    const data = getData(idSurvey || "");

    const stateData: StateData = {
        idStateData: data.stateData?.idStateData,
        state: StateDataStateEnum.VALIDATED,
        date: Date.now(),
        currentPage: getCurrentPage(data),
    };

    remotePutSurveyDataReviewer(idSurvey, stateData, data).then(() => {
        data.stateData = stateData;
        promisesToWait.push(saveData(idSurvey, data));
    });

    return new Promise(resolve => {
        Promise.all(promisesToWait).then(() => {
            resolve(true);
        });
    });
};

const validateAllEmptySurveys = (idHousehold: string) => {
    const idSurveys = getSurveysIdsForHousehold(idHousehold);
    const promisesToWait: Promise<any>[] = [];

    idSurveys.forEach(idSurvey => {
        const data = getData(idSurvey || "");
        const stateData: StateData = {
            idStateData: data.stateData?.idStateData,
            state: StateDataStateEnum.VALIDATED,
            date: Date.now(),
            currentPage: getCurrentPage(data),
        };
        const value = getValue(idSurvey, FieldNameEnum.FIRSTNAME) as string;
        if (value == null || value.length == 0) {
            data.stateData = stateData;
            promisesToWait.push(saveData(idSurvey, data));
        }
    });

    return new Promise(resolve => {
        Promise.all(promisesToWait).then(() => {
            resolve(true);
        });
    });
};

const getSurveyRights = (idSurvey: string) => {
    const isReviewerMode = isReviewer();
    const isValidated = surveyValidated(idSurvey);
    const isLocked = surveyLocked(idSurvey);

    let rights: EdtSurveyRightsEnum;

    if (isReviewerMode) {
        rights = EdtSurveyRightsEnum.WRITE_REVIEWER;
    } else {
        const existVariable = existVariableEdited(idSurvey);
        rights =
            isLocked || isValidated || existVariable
                ? EdtSurveyRightsEnum.READ_INTERVIEWER
                : EdtSurveyRightsEnum.WRITE_INTERVIEWER;
    }
    return rights;
};

const existVariableEdited = (idSurvey?: string, data?: LunaticData) => {
    const dataSurv = data ?? getDataCache(idSurvey ?? "");
    const dataOfSurvey = dataSurv?.COLLECTED;

    for (let prop in FieldNameEnum as any) {
        if (prop == FieldNameEnum.FIRSTNAME) continue;
        const data = dataOfSurvey && dataOfSurvey[prop];
        const ifArrayInputed =
            data?.EDITED &&
            Array.isArray(data.EDITED) &&
            data.EDITED.length > 0 &&
            data.EDITED[0] != null;
        if ((data?.EDITED && ifArrayInputed) || (data?.EDITED && !Array.isArray(data.EDITED))) {
            return true;
        }
    }
    return false;
};

const getModePersistence = (data: LunaticData | undefined): ModePersistenceEnum => {
    const isReviewerMode = isReviewer();
    const isLocked = data?.COLLECTED?.[FieldNameEnum.ISLOCKED]?.COLLECTED as boolean;
    const variableEdited = existVariableEdited(undefined, data);
    return isReviewerMode || isLocked || variableEdited
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

const getStatutSurvey = (idSurvey: string) => {
    const isLocked = getValue(idSurvey, FieldNameEnum.ISLOCKED) as boolean;
    const isValidated = surveyValidated(idSurvey);
    const variableEdited = existVariableEdited(idSurvey);
    if (isValidated != null && isValidated) {
        return StateSurveyEnum.VALIDATED;
    } else if ((isLocked != null && isLocked) || variableEdited) {
        return StateSurveyEnum.LOCKED;
    } else return StateSurveyEnum.INIT;
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

const navToPlanner = (
    idSurvey: string,
    surveyRootPage: EdtRoutesNameEnum.ACTIVITY | EdtRoutesNameEnum.WORK_TIME,
) => {
    const dayOfSurvey = getValue(idSurvey, FieldNameEnum.SURVEYDATE) as string;
    let route = "";

    if (dayOfSurvey) {
        const routeActivity = getFullNavigatePath(
            idSurvey,
            EdtRoutesNameEnum.ACTIVITY_OR_ROUTE_PLANNER,
            surveyRootPage,
        );
        const routeWorktime = getFullNavigatePath(
            idSurvey,
            EdtRoutesNameEnum.WEEKLY_PLANNER,
            surveyRootPage,
        );

        route = surveyRootPage == EdtRoutesNameEnum.WORK_TIME ? routeWorktime : routeActivity;
    } else {
        route = getFullNavigatePath(idSurvey, EdtRoutesNameEnum.DAY_OF_SURVEY, surveyRootPage);
    }
    return route;
};

const getPerson = (idSurvey: string) => {
    const surveys = getSurveysAct();
    const personAct = surveys?.find(survey => survey.data.surveyUnitId == idSurvey);
    return personAct;
};

const getGroupOfPerson = (idSurvey: string) => {
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

const initStateData = () => {
    const stateData = {
        state: StateDataStateEnum.INIT,
        date: Date.now(),
        currentPage: 0,
    };
    return stateData;
};

const initSurveyData = (surveyId: string): LunaticData => {
    const regexp = new RegExp(process.env.REACT_APP_HOUSE_REFERENCE_REGULAR_EXPRESSION || "");
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
    addToSecondaryActivityReferentiel,
    arrayOfSurveysPersonDemo,
    createDataEmpty,
    createNewActivityInCategory,
    existVariableEdited,
    getAuthCache,
    getComponentId,
    getComponentsOfVariable,
    getCurrentPage,
    getData,
    getDatas,
    getFirstName,
    getFullFrenchDate,
    getIdSurveyActivity,
    getIdSurveyWorkTime,
    getListSurveys,
    getListSurveysHousehold,
    getModePersistence,
    getNewSecondaryActivities,
    getPerson,
    getPrintedFirstName,
    getPrintedSurveyDate,
    getReferentiel,
    getRemoteSavedSurveysDatas,
    getSource,
    getStatutSurvey,
    getSurveyDate,
    getSurveyRights,
    getTabsData,
    getUserDatas,
    getUserDatasActivity,
    getUserDatasWorkTime,
    getValue,
    getValueOfData,
    getValueWithData,
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
    isDemoMode,
    lockAllSurveys,
    lockSurvey,
    nameSurveyGroupMap,
    nameSurveyMap,
    navToPlanner,
    refreshSurvey,
    refreshSurveyData,
    saveData,
    setData,
    setSurveysIds,
    setUserSurveysData,
    setValue,
    surveyLocked,
    surveyValidated,
    surveysIds,
    toIgnoreForActivity,
    toIgnoreForRoute,
    userDatasMap,
    validateAllEmptySurveys,
    validateAllGroup,
    validateSurvey,
};
