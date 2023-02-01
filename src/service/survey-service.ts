import { t } from "i18next";
import { TabData } from "interface/component/Component";
import { ActivityRouteOrGap } from "interface/entity/ActivityRouteOrGap";
import {
    Collected,
    LunaticData,
    LunaticModel,
    LunaticModelComponent,
    LunaticModelVariable,
    ReferentielData,
    REFERENTIEL_ID,
} from "interface/lunatic/Lunatic";
import {
    AutoCompleteActiviteOption,
    CheckboxOneCustomOption,
    generateDateFromStringInput,
    getFrenchDayFromDate,
    NomenclatureActivityOption,
} from "lunatic-edt";
import { EdtRoutesNameEnum } from "routes/EdtRoutesMapping";
import { lunaticDatabase } from "service/lunatic-database";
import { getCurrentPageSource } from "service/orchestrator-service";
import { fetchReferentiels } from "./api-service";
import { LoopEnum } from "./loop-service";
import { getNextLoopPage, getStepPage, getLastStep } from "./loop-stepper-service";
import {
    getCurrentNavigatePath,
    getOrchestratorPage,
    saveAndLoopNavigate,
    saveAndNav,
} from "./navigation-service";
import { getNomenclatureRef } from "./referentiel-service";
import { getActivitiesOrRoutes, getScore } from "./survey-activity-service";

const datas = new Map<string, LunaticData>();
let referentielsData: ReferentielData;
const activitySurveysIds = ["activitySurvey1", "activitySurvey2", "activitySurvey3"];
const workingTimeSurveysIds = ["workingSurvey1", "workingSurvey2"];
const surveysIds = [...activitySurveysIds, ...workingTimeSurveysIds];

const enum FieldNameEnum {
    LASTNAME = "LASTNAME",
    FIRSTNAME = "FIRSTNAME",
    SURVEYDATE = "SURVEYDATE",
    SURVEYDATE2 = "SURVEYDATE2",
    STARTTIME = "STARTTIME",
    ENDTIME = "ENDTIME",
    MAINACTIVITY_ID = "MAINACTIVITY_ID",
    MAINACTIVITY_SUGGESTERID = "MAINACTIVITY_SUGGESTERID",
    MAINACTIVITY_ISFULLYCOMPLETED = "MAINACTIVITY_ISFULLYCOMPLETED",
    MAINACTIVITY_LABEL = "MAINACTIVITY_LABEL",
    ROUTE = "ROUTE",
    GOAL = "GOAL",
    WITHSECONDARYACTIVITY = "WITHSECONDARYACTIVITY",
    SECONDARYACTIVITY = "SECONDARYACTIVITY",
    FOOT = "FOOT",
    BICYCLE = "BICYCLE",
    TWOWHEELSMOTORIZED = "TWOWHEELSMOTORIZED",
    PRIVATECAR = "PRIVATECAR",
    OTHERPRIVATE = "OTHERPRIVATE",
    PUBLIC = "PUBLIC",
    PLACE = "PLACE",
    WITHSOMEONE = "WITHSOMEONE",
    COUPLE = "COUPLE",
    PARENTS = "PARENTS",
    CHILD = "CHILD",
    OTHERKNOWN = "OTHERKNOWN",
    OTHER = "OTHER",
    WITHSCREEN = "WITHSCREEN",
    WEEKLYPLANNER = "WEEKLYPLANNER",
    WORKINGWEEK = "WORKINGWEEK",
    HOLIDAYWEEK = "HOLIDAYWEEK",
    OTHERWEEK = "OTHERWEEK",
    GREATESTACTIVITYDAY = "GREATESTACTIVITYDAY",
    WORSTACTIVITYDAY = "WORSTACTIVITYDAY",
    KINDOFDAY = "KINDOFDAY",
    EXCEPTIONALDAY = "EXCEPTIONALDAY",
    TRAVELTIME = "TRAVELTIME",
    PHONETIME = "PHONETIME",
    ISCLOSED = "ISCLOSED",
    ISROUTE = "ISROUTE",
    ISCOMPLETED = "ISCOMPLETED",
}

const toIgnoreForRoute = [
    FieldNameEnum.PLACE,
    FieldNameEnum.MAINACTIVITY_ID,
    FieldNameEnum.MAINACTIVITY_SUGGESTERID,
    FieldNameEnum.MAINACTIVITY_LABEL,
    FieldNameEnum.MAINACTIVITY_ISFULLYCOMPLETED,
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
];

enum ReferentielsEnum {
    ACTIVITYNOMENCLATURE = "edt-activityCategory",
    ACTIVITYAUTOCOMPLETE = "edt-activityAutoComplete",
    ROUTE = "edt-route",
    ACTIVITYSECONDARYACTIVITY = "edt-activitySecondaryActivity",
    ROUTESECONDARYACTIVITY = "edt-routeSecondaryActivity",
    LOCATION = "edt-place",
    KINDOFWEEK = "edt-kindOfWeek",
    KINDOFDAY = "edt-kindOfDay",
}

const initializeDatas = (): Promise<LunaticData[]> => {
    // fetch referentiels only first time when they are not in indexedDB
    return lunaticDatabase.get(REFERENTIEL_ID).then((refData: any) => {
        const promises: Promise<LunaticData>[] = [];
        if (!refData) {
            fetchReferentiels().then(refs => {
                promises.push(saveReferentiels(refs));
            });
        } else {
            referentielsData = refData;
        }

        for (const idSurvey of surveysIds) {
            promises.push(
                lunaticDatabase.get(idSurvey).then(data => {
                    datas.set(idSurvey, data || {});
                    return data || {};
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

const saveData = (idSurvey: string, data: LunaticData): Promise<LunaticData> => {
    return lunaticDatabase.save(idSurvey, data).then(() => {
        datas.set(idSurvey, data);
        return data;
    });
};

const saveReferentiels = (data: ReferentielData): Promise<ReferentielData> => {
    return lunaticDatabase.save(REFERENTIEL_ID, data).then(() => {
        referentielsData = data;
        return data;
    });
};

const addToSecondaryActivityReferentiel = (
    referentiel: ReferentielsEnum.ACTIVITYSECONDARYACTIVITY | ReferentielsEnum.ROUTESECONDARYACTIVITY,
    newItem: CheckboxOneCustomOption,
) => {
    lunaticDatabase.get(REFERENTIEL_ID).then((currentData: any) => {
        currentData[referentiel].push(newItem);
        saveReferentiels(currentData);
    });
};

const addToAutocompleteActivityReferentiel = (newItem: AutoCompleteActiviteOption) => {
    lunaticDatabase.get(REFERENTIEL_ID).then((currentData: any) => {
        currentData[ReferentielsEnum.ACTIVITYAUTOCOMPLETE].push(newItem);
        saveReferentiels(currentData);
    });
};

const getReferentiel = (refName: ReferentielsEnum) => {
    return referentielsData[refName];
};

const getVariable = (source: LunaticModel, dependency: string): LunaticModelVariable | undefined => {
    return source.variables.find(v => v.variableType === "COLLECTED" && v.name === dependency);
};

//Return the last lunatic model page that has been fill with data
const getCurrentPage = (data: LunaticData | undefined): number => {
    const source = getCurrentPageSource();
    if (data == null || !source?.components) {
        return -1;
    }
    const components = source?.components;
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

    activitySurveysIds.forEach(idSurvey => {
        let tabData: TabData = {
            idSurvey: idSurvey,
            surveyDateLabel: getPrintedSurveyDate(idSurvey, EdtRoutesNameEnum.ACTIVITY),
            firstNameLabel: getPrintedFirstName(idSurvey),
            score: getScore(idSurvey, t),
            isActivitySurvey: true,
        };
        tabsData.push(tabData);
    });
    workingTimeSurveysIds.forEach(idSurvey => {
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

const getPersonNumber = (idSurvey: string) => {
    const index =
        activitySurveysIds.indexOf(idSurvey) !== -1
            ? activitySurveysIds.indexOf(idSurvey)
            : workingTimeSurveysIds.indexOf(idSurvey);
    return index + 1;
};

const CODES_ACTIVITY_IGNORE_SOMEONE = ["110"];

const CODES_ACTIVITY_IGNORE_GOAL = [
    "110", //111,114,112,113
    "140",
    "210", //"215,213,221,223,231,232,233,234,241,251,264"
    "270",
    "260", //261,262,263, 264, 271,272
    "516",
    "531",
    "532",
    "510",

    "601", //620,623,624,625,627
    "631", //633,632
    "639",
    "641",
    "649",
    "652",
    "656",
    "658",
    "674",
    "664",
    "680", //671,668,662,663
];
const CODES_ACTIVITY_IGNORE_SCREEN = ["110", "674", "649", "671"];
const CODES_ACTIVITY_IGNORE_LOCATION = ["652"];

const filtrePage = (page: EdtRoutesNameEnum, activityCode: string) => {
    let codesToIgnore;
    let listToIgnore: string[] = [];

    switch (page) {
        case EdtRoutesNameEnum.MAIN_ACTIVITY_GOAL:
            listToIgnore = CODES_ACTIVITY_IGNORE_GOAL;
            break;
        case EdtRoutesNameEnum.ACTIVITY_LOCATION:
            listToIgnore = CODES_ACTIVITY_IGNORE_LOCATION;
            break;
        case EdtRoutesNameEnum.WITH_SOMEONE:
            listToIgnore = CODES_ACTIVITY_IGNORE_SOMEONE;
            break;
        case EdtRoutesNameEnum.WITH_SCREEN:
            listToIgnore = CODES_ACTIVITY_IGNORE_SCREEN;
            break;
        default:
            listToIgnore = [];
            break;
    }

    codesToIgnore = getCodesAIgnorer(listToIgnore);
    return codesToIgnore.indexOf(activityCode) >= 0;
};

const activityIgnore = (
    idSurvey: string,
    source: LunaticModel,
    iteration: number,
    pageNext: EdtRoutesNameEnum,
) => {
    const { activitiesRoutesOrGaps } = getActivitiesOrRoutes(t, idSurvey, source);

    let activityOrRoute = activitiesRoutesOrGaps.filter(act => !act.isGap)[iteration];
    const skip = filtrePage(pageNext, activityOrRoute.activity?.activityCode ?? "");
    return skip;
};

const skipNextPage = (
    idSurvey: string,
    source: LunaticModel,
    iteration: number,
    currentPage: EdtRoutesNameEnum,
    fieldConditionNext?: FieldNameEnum,
    nextRoute?: EdtRoutesNameEnum,
    isRoute?: boolean,
) => {
    const nextPageRoute = nextRoute
        ? skipAllNextPage(idSurvey, source, iteration, nextRoute, isRoute)
        : undefined;

    const nextCurrentPage = getNextLoopPage(currentPage, isRoute);
    const nextPageNextLoop = skipAllNextPage(idSurvey, source, iteration, nextCurrentPage, isRoute);

    if (
        nextPageRoute == EdtRoutesNameEnum.ACTIVITY_OR_ROUTE_PLANNER ||
        nextPageNextLoop == EdtRoutesNameEnum.ACTIVITY_OR_ROUTE_PLANNER
    ) {
        saveAndNav(
            getCurrentNavigatePath(
                idSurvey,
                EdtRoutesNameEnum.ACTIVITY,
                getOrchestratorPage(EdtRoutesNameEnum.ACTIVITY_OR_ROUTE_PLANNER),
            ),
        );
    } else {
        saveAndLoopNavigate(
            nextPageRoute || nextPageNextLoop,
            LoopEnum.ACTIVITY_OR_ROUTE,
            iteration,
            fieldConditionNext,
            fieldConditionNext ? nextPageNextLoop : undefined,
        );
    }
};

const skipAllNextPage = (
    idSurvey: string,
    source: LunaticModel,
    iteration: number,
    nextPage: EdtRoutesNameEnum,
    isRoute?: boolean,
): EdtRoutesNameEnum => {
    let page = nextPage;
    if (activityIgnore(idSurvey, source, iteration, nextPage)) {
        if (getStepPage(nextPage) == getLastStep(isRoute)) {
            return EdtRoutesNameEnum.ACTIVITY_OR_ROUTE_PLANNER;
        } else page = getNextLoopPage(nextPage, isRoute);
    }
    if (activityIgnore(idSurvey, source, iteration, page)) {
        return skipAllNextPage(idSurvey, source, iteration, page);
    }
    return page;
};

const findItemInCategoriesNomenclature = (
    id: string | undefined,
    ref: NomenclatureActivityOption[],
    parent?: NomenclatureActivityOption,
): { item: NomenclatureActivityOption; parent: NomenclatureActivityOption | undefined } | undefined => {
    let res = ref.find(a => a.id === id);
    if (res) {
        return {
            item: res,
            parent: parent,
        };
    } else {
        for (let i = 0; i < ref.length; i++) {
            let subsubs = ref[i].subs;
            if (subsubs) {
                let res2 = findItemInCategoriesNomenclature(id, subsubs, ref[i]);
                if (res2) {
                    return res2;
                }
            }
        }
    }
};

const getCodesAIgnorer = (listAIgnorer: string[]) => {
    const categoriesActivity = getNomenclatureRef();

    let codesActivity: string[] = [];

    listAIgnorer.forEach((code: string) => {
        if (codesActivity.indexOf(code) < 0) {
            codesActivity.push(code);
        }
        const findCategory = findItemInCategoriesNomenclature(code.toString(), categoriesActivity);
        if (findCategory?.item?.subs) {
            for (let category of findCategory?.item?.subs) {
                if (codesActivity.indexOf(category.id) < 0) {
                    codesActivity.push(category.id);
                    getCodesSubCategories(category.id, codesActivity, categoriesActivity);
                }
            }
        }
    });
    return codesActivity;
};

const getCodesSubCategories = (
    code: string,
    codesActivity: string[],
    categoriesActivity: NomenclatureActivityOption[],
) => {
    const findCategory = findItemInCategoriesNomenclature(code.toString(), categoriesActivity);
    if (findCategory?.item?.subs) {
        for (let category of findCategory?.item?.subs) {
            if (codesActivity.indexOf(category.id) < 0) {
                codesActivity.push(category.id);
                getCodesSubCategories(category.id, codesActivity, categoriesActivity);
            }
        }
    }
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
    getValue,
    setValue,
    getReferentiel,
    getComponentId,
    getComponentsOfVariable,
    getVariable,
    getTabsData,
    activitySurveysIds,
    workingTimeSurveysIds,
    FieldNameEnum,
    ReferentielsEnum,
    toIgnoreForRoute,
    toIgnoreForActivity,
    addToSecondaryActivityReferentiel,
    addToAutocompleteActivityReferentiel,
    activityIgnore,
    skipNextPage,
    filtrePage,
};
