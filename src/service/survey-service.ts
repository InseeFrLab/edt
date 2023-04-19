import {
    AutoCompleteActiviteOption,
    CheckboxOneCustomOption,
    generateDateFromStringInput,
    getFrenchDayFromDate,
} from "@inseefrlab/lunatic-edt";
import { EdtRoutesNameEnum } from "enumerations/EdtRoutesNameEnum";
import { ErrorCodeEnum } from "enumerations/ErrorCodeEnum";
import { FieldNameEnum } from "enumerations/FieldNameEnum";
import { ReferentielsEnum } from "enumerations/ReferentielsEnum";
import { SourcesEnum } from "enumerations/SourcesEnum";
import { StateDataStateEnum } from "enumerations/StateDataStateEnum";
import { SurveysIdsEnum } from "enumerations/SurveysIdsEnum";
import { t } from "i18next";
import { TabData } from "interface/component/Component";
import { StateData, SurveyData } from "interface/entity/Api";
import {
    Collected,
    LunaticData,
    LunaticModel,
    LunaticModelComponent,
    LunaticModelVariable,
    REFERENTIELS_ID,
    ReferentielData,
    SOURCES_MODELS,
    SURVEYS_IDS,
    SourceData,
    SurveysIds,
} from "interface/lunatic/Lunatic";
import { lunaticDatabase } from "service/lunatic-database";
import { LABEL_WORK_TIME_SURVEY, getCurrentPageSource } from "service/orchestrator-service";
import {
    fetchReferentiels,
    fetchSurveysSourcesByIds,
    fetchUserSurveysInfo,
    remoteGetSurveyData,
    remotePutSurveyData,
} from "./api-service";
import { getScore } from "./survey-activity-service";

const datas = new Map<string, LunaticData>();
let referentielsData: ReferentielData;
let sourcesData: SourceData;
let surveysIds: SurveysIds;

const toIgnoreForRoute = [
    FieldNameEnum.PLACE,
    FieldNameEnum.MAINACTIVITY_ID,
    FieldNameEnum.MAINACTIVITY_SUGGESTERID,
    FieldNameEnum.MAINACTIVITY_LABEL,
    FieldNameEnum.MAINACTIVITY_ISFULLYCOMPLETED,
    FieldNameEnum.INPUT_SUGGESTER,
    FieldNameEnum.ACTIVITY_SELECTER_HISTORY,
    FieldNameEnum.GOAL,
];

const toIgnoreForActivity = [
    FieldNameEnum.GOAL,
    FieldNameEnum.ROUTE,
    FieldNameEnum.MEANOFTRANSPORT,
    FieldNameEnum.MAINACTIVITY_ISFULLYCOMPLETED,
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

const initializeRefs = () => {
    return lunaticDatabase.get(REFERENTIELS_ID).then(refData => {
        if (!refData) {
            return fetchReferentiels().then(refs => {
                saveReferentiels(refs);
            });
        } else {
            referentielsData = refData as ReferentielData;
        }
    });
};

const initializeSurveysIdsAndSources = (setError: (error: ErrorCodeEnum) => void): Promise<any> => {
    const promises: Promise<any>[] = [];
    return lunaticDatabase.get(SURVEYS_IDS).then(data => {
        if (!data) {
            promises.push(
                fetchUserSurveysInfo(setError).then(userSurveyData => {
                    const distinctSources = Array.from(
                        new Set(userSurveyData.map(surveyData => surveyData.questionnaireModelId)),
                    );
                    let activitySurveysIds: string[] = [];
                    let workingTimeSurveysIds: string[] = [];
                    userSurveyData.forEach(surveyData => {
                        if (surveyData.questionnaireModelId === SourcesEnum.ACTIVITY_SURVEY) {
                            activitySurveysIds.push(surveyData.surveyUnitId);
                        }
                        if (surveyData.questionnaireModelId === SourcesEnum.WORK_TIME_SURVEY) {
                            workingTimeSurveysIds.push(surveyData.surveyUnitId);
                        }
                    });
                    let allSurveysIds = [...activitySurveysIds, ...workingTimeSurveysIds];
                    const surveysIds: SurveysIds = {
                        [SurveysIdsEnum.ALL_SURVEYS_IDS]: allSurveysIds,
                        [SurveysIdsEnum.ACTIVITY_SURVEYS_IDS]: activitySurveysIds,
                        [SurveysIdsEnum.WORK_TIME_SURVEYS_IDS]: workingTimeSurveysIds,
                    };

                    const innerPromises: Promise<any>[] = [
                        getRemoteSavedSurveysDatas(allSurveysIds, setError).then(() => {
                            return initializeSurveysDatasCache();
                        }),
                        saveSurveysIds(surveysIds),
                        fetchSurveysSourcesByIds(distinctSources).then(sources => {
                            saveSources(sources);
                        }),
                    ];
                    return Promise.all(innerPromises);
                }),
            );
        } else {
            surveysIds = data as SurveysIds;
            promises.push(
                lunaticDatabase.get(SOURCES_MODELS).then(data => {
                    sourcesData = data as SourceData;
                }),
            );
            promises.push(
                getRemoteSavedSurveysDatas(surveysIds[SurveysIdsEnum.ALL_SURVEYS_IDS], setError).then(
                    () => {
                        return initializeSurveysDatasCache();
                    },
                ),
            );
        }
        return Promise.all(promises);
    });
};

const getRemoteSavedSurveysDatas = (
    surveysIds: string[],
    setError: (error: ErrorCodeEnum) => void,
): Promise<any> => {
    const promises: Promise<any>[] = [];
    surveysIds.forEach(surveyId => {
        promises.push(
            remoteGetSurveyData(surveyId, setError).then((remoteSurveyData: SurveyData) => {
                const regexp = new RegExp(
                    process.env.REACT_APP_HOUSE_REFERENCE_REGULAR_EXPRESSION || "",
                );
                remoteSurveyData.data.houseReference = surveyId.replace(regexp, "");
                return lunaticDatabase.get(surveyId).then(localSurveyData => {
                    if (
                        remoteSurveyData.stateData?.date &&
                        remoteSurveyData.stateData?.date > 0 &&
                        (localSurveyData === undefined ||
                            (localSurveyData.lastRemoteSaveDate ?? 0) < remoteSurveyData.stateData.date)
                    ) {
                        return lunaticDatabase.save(surveyId, remoteSurveyData.data);
                    }
                });
            }),
        );
    });
    return Promise.all(promises);
};

const initializeSurveysDatasCache = (): Promise<any> => {
    const promises: Promise<any>[] = [];
    return lunaticDatabase.get(SURVEYS_IDS).then(data => {
        surveysIds = data as SurveysIds;
        for (const idSurvey of surveysIds[SurveysIdsEnum.ALL_SURVEYS_IDS]) {
            promises.push(
                lunaticDatabase.get(idSurvey).then(data => {
                    if (data != null) {
                        const regexp = new RegExp(
                            process.env.REACT_APP_HOUSE_REFERENCE_REGULAR_EXPRESSION || "",
                        );
                        data.houseReference = idSurvey.replace(regexp, "");
                        datas.set(idSurvey, data || {});
                    }
                    return data;
                }),
            );
        }
        return Promise.all(promises);
    });
};

const getDatas = (): Map<string, LunaticData> => {
    return datas;
};

const getData = (idSurvey: string): LunaticData => {
    return datas.get(idSurvey) || {};
};

const dataIsChange = (idSurvey: string, data: LunaticData) => {
    const currentData = datas.get(idSurvey);
    const currentDataCollected = currentData && currentData.COLLECTED;
    const dataCollected = data && data.COLLECTED;

    let isChange = false;

    if (dataCollected && currentDataCollected) {
        const keys = Object.keys(dataCollected);
        keys.forEach(key => {
            if (dataCollected[key].COLLECTED != currentDataCollected[key].COLLECTED) {
                if (Array.isArray(dataCollected[key].COLLECTED)) {
                    const currentDataCollectedArray = currentDataCollected[key].COLLECTED as string[];
                    (dataCollected[key].COLLECTED as string[]).forEach((data, i) => {
                        if (currentDataCollectedArray[i] != data) {
                            isChange = true;
                        }
                    });
                } else {
                    isChange = true;
                }
            }
        });
    }
    return isChange;
};

const saveData = (idSurvey: string, data: LunaticData, localSaveOnly = false): Promise<LunaticData> => {
    data.lastLocalSaveDate = Date.now();
    if (!data.houseReference) {
        const regexp = new RegExp(process.env.REACT_APP_HOUSE_REFERENCE_REGULAR_EXPRESSION || "");
        data.houseReference = idSurvey.replace(regexp, "");
    }

    return lunaticDatabase.save(idSurvey, data).then(() => {
        const isChange = dataIsChange(idSurvey, data);
        datas.set(idSurvey, data);

        if (isChange) {
            //We try to submit each time the local database is updated if the user is online
            if (!localSaveOnly && navigator.onLine) {
                const surveyData: SurveyData = {
                    stateData: getSurveyStateData(data, idSurvey),
                    data: data,
                };

                remotePutSurveyData(idSurvey, surveyData).then(surveyData => {
                    data.lastRemoteSaveDate = surveyData.stateData?.date;
                    //set the last remote save date inside local database to be able to compare it later with remote data
                    lunaticDatabase.save(idSurvey, data).then(() => {
                        datas.set(idSurvey, data);
                    });
                });
            }
        }
        return data;
    });
};

const getSurveyStateData = (data: LunaticData, idSurvey: string): StateData => {
    const isSent = getValue(idSurvey, FieldNameEnum.ISENVOYED) as boolean;
    const stateData: StateData = {
        state: isSent ? StateDataStateEnum.VALIDATED : StateDataStateEnum.INIT,
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
        sourcesData = data;
        return data;
    });
};

const saveSurveysIds = (data: SurveysIds): Promise<SurveysIds> => {
    return lunaticDatabase.save(SURVEYS_IDS, data).then(() => {
        surveysIds = data;
        return data;
    });
};

const addToSecondaryActivityReferentiel = (
    referentiel: ReferentielsEnum.ACTIVITYSECONDARYACTIVITY | ReferentielsEnum.ROUTESECONDARYACTIVITY,
    newItem: CheckboxOneCustomOption,
) => {
    lunaticDatabase.get(REFERENTIELS_ID).then((currentData: any) => {
        currentData[referentiel].push(newItem);
        saveReferentiels(currentData);
    });
};

const addToAutocompleteActivityReferentiel = (newItem: AutoCompleteActiviteOption) => {
    lunaticDatabase.get(REFERENTIELS_ID).then((currentData: any) => {
        currentData[ReferentielsEnum.ACTIVITYAUTOCOMPLETE].push(newItem);
        saveReferentiels(currentData);
    });
};

const getReferentiel = (refName: ReferentielsEnum) => {
    return referentielsData[refName];
};

const getSource = (refName: SourcesEnum) => {
    return sourcesData[refName];
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
        const firstName = data.COLLECTED?.[FieldNameEnum.FIRSTNAME].COLLECTED;
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
            const value = data?.COLLECTED?.[variable.name]?.COLLECTED;
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
    if (iteration != null) {
        let value = datas.get(idSurvey)?.COLLECTED?.[variableName]?.COLLECTED;
        return Array.isArray(value) ? value[iteration] : null;
    } else {
        return datas.get(idSurvey)?.COLLECTED?.[variableName]?.COLLECTED;
    }
};

const setValue = (
    idSurvey: string,
    variableName: FieldNameEnum,
    value: string | boolean | null,
    iteration?: number,
) => {
    const dataAct = datas.get(idSurvey);
    if (dataAct && dataAct.COLLECTED && dataAct.COLLECTED[variableName]) {
        if (iteration != null && value != null) {
            const dataAsArray = dataAct.COLLECTED[variableName].COLLECTED;
            if (dataAsArray && Array.isArray(dataAsArray)) {
                dataAsArray[iteration] = value;
            }
        } else {
            const variable: Collected = {
                COLLECTED: value,
                EDITED: null,
                FORCED: null,
                INPUTED: null,
                PREVIOUS: null,
            };
            dataAct.COLLECTED[variableName] = variable;
        }
    }
    datas.set(idSurvey, dataAct || {});
    return dataAct;
};

const getLastName = (idSurvey: string) => {
    return getValue(idSurvey, FieldNameEnum.LASTNAME)?.toString();
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

const getTabsData = (t: any): TabData[] => {
    let tabsData: TabData[] = [];

    surveysIds[SurveysIdsEnum.ACTIVITY_SURVEYS_IDS].forEach(idSurvey => {
        let tabData: TabData = {
            idSurvey: idSurvey,
            surveyDateLabel: getPrintedSurveyDate(idSurvey, EdtRoutesNameEnum.ACTIVITY),
            firstNameLabel: getPrintedFirstName(idSurvey),
            score: getScore(idSurvey, t),
            isActivitySurvey: true,
        };
        tabsData.push(tabData);
    });
    surveysIds[SurveysIdsEnum.WORK_TIME_SURVEYS_IDS].forEach(idSurvey => {
        let tabData: TabData = {
            idSurvey: idSurvey,
            surveyDateLabel: getPrintedSurveyDate(idSurvey, EdtRoutesNameEnum.WORK_TIME),
            firstNameLabel: getPrintedFirstName(idSurvey),
            score: getScore(idSurvey, t),
            isActivitySurvey: false,
        };
        tabsData.push(tabData);
    });
    return tabsData;
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
        const capitalizedDayName = dayName.charAt(0).toUpperCase() + dayName.slice(1);

        const splittedDate = savedSurveyDate.split("-");
        return label + " - " + capitalizedDayName + " " + [splittedDate[2], splittedDate[1]].join("/");
    } else {
        return label + " 1";
    }
};

//Return date with full french format dd/MM/YYYY
const getFullFrenchDate = (surveyDate: string): string => {
    const splittedDate = surveyDate.split("-");
    return [splittedDate[2], splittedDate[1], splittedDate[0]].join("/");
};

const getPersonNumber = (idSurvey: string) => {
    const index =
        surveysIds[SurveysIdsEnum.ACTIVITY_SURVEYS_IDS].indexOf(idSurvey) !== -1
            ? surveysIds[SurveysIdsEnum.ACTIVITY_SURVEYS_IDS].indexOf(idSurvey)
            : surveysIds[SurveysIdsEnum.WORK_TIME_SURVEYS_IDS].indexOf(idSurvey);
    return index + 1;
};

export {
    getData,
    getDatas,
    initializeDatas,
    saveData,
    getCurrentPage,
    getLastName,
    getFirstName,
    getPrintedFirstName,
    getSurveyDate,
    getPrintedSurveyDate,
    getFullFrenchDate,
    getValue,
    setValue,
    getReferentiel,
    getSource,
    getComponentId,
    getComponentsOfVariable,
    getVariable,
    getTabsData,
    surveysIds,
    toIgnoreForRoute,
    toIgnoreForActivity,
    addToSecondaryActivityReferentiel,
    addToAutocompleteActivityReferentiel,
    initializeSurveysDatasCache,
};
