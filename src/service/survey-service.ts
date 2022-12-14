import { t } from "i18next";
import {
    LunaticData,
    LunaticModel,
    LunaticModelComponent,
    LunaticModelVariable,
} from "interface/lunatic/Lunatic";
import { generateDateFromStringInput, getFrenchDayFromDate } from "lunatic-edt";
import { EdtRoutesNameEnum } from "routes/EdtRoutesMapping";
import { lunaticDatabase } from "service/lunatic-database";
import { getCurrentPageSource } from "service/orchestrator-service";

const datas = new Map<string, LunaticData>();
const activitySurveysIds = ["activitySurvey1", "activitySurvey2", "activitySurvey3"];
const workingTimeSurveysIds = ["workingSurvey1", "workingSurvey2"];
const surveysIds = [...activitySurveysIds, ...workingTimeSurveysIds];

const enum FieldNameEnum {
    LASTNAME = "LASTNAME",
    FIRSTNAME = "FIRSTNAME",
    SURVEYDATE = "SURVEYDATE",
    STARTTIME = "STARTTIME",
    ENDTIME = "ENDTIME",
    MAINACTIVITY = "MAINACTIVITY",
    GOAL = "GOAL",
    WITHSECONDARYACTIVITY = "WITHSECONDARYACTIVITY",
    SECONDARYACTIVITY = "SECONDARYACTIVITY",
    PLACE = "PLACE",
    WITHSOMEONE = "WITHSOMEONE",
    COUPLE = "COUPLE",
    PARENTS = "PARENTS",
    CHILD = "CHILD",
    OTHERKNOWN = "OTHERKNOWN",
    OTHER = "OTHER",
    WITHSCREEN = "WITHSCREEN",
}

const initializeDatas = (): Promise<LunaticData[]> => {
    const promises: Promise<LunaticData>[] = [];
    for (const idSurvey of surveysIds) {
        promises.push(
            lunaticDatabase.get(idSurvey).then(data => {
                datas.set(idSurvey, data || {});
                return data || {};
            }),
        );
    }
    return Promise.all(promises);
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

const getVariable = (source: LunaticModel, dependency: string): LunaticModelVariable | undefined => {
    return source.variables.find(v => v.variableType === "COLLECTED" && v.name === dependency);
};

//Return the last lunatic model page that has been fill with data
const getCurrentPage = (data: LunaticData | undefined): number => {
    //TODO : redirect if we got error page and data is undefined
    const source = getCurrentPageSource();
    if (!data || !source?.components) {
        return 0;
    }
    let currentPage = 0;
    for (const component of source?.components) {
        if (component.bindingDependencies) {
            for (const dependency of component.bindingDependencies) {
                const variable = getVariable(source, dependency);
                currentPage = getCurrentPageOfVariable(data, variable, currentPage, component);
            }
        }
    }
    return currentPage;
};

const getCurrentPageOfVariable = (
    data: LunaticData | undefined,
    variable: LunaticModelVariable | undefined,
    currentPage: number,
    component: LunaticModelComponent,
): number => {
    if (variable) {
        const value = data?.COLLECTED?.[variable.name]?.COLLECTED;
        if (value !== undefined && value !== null && !Array.isArray(value)) {
            return Math.max(currentPage, component.page ? +component.page : 0);
        } else return currentPage;
    } else {
        return currentPage;
    }
};

const getComponentId = (variableName: FieldNameEnum, source: LunaticModel) => {
    return source?.variables.find(variable => variable.name === variableName)?.componentRef;
};

const getValue = (idSurvey: string, variableName: FieldNameEnum, iteration?: number) => {
    if (iteration != null) {
        let value = datas.get(idSurvey)?.COLLECTED?.[variableName]?.COLLECTED;
        return Array.isArray(value) ? value[iteration] : null;
    } else {
        return datas.get(idSurvey)?.COLLECTED?.[variableName]?.COLLECTED;
    }
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
        return label + " - " + capitalizedDayName + " " + [splittedDate[1], splittedDate[2]].join("/");
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
    getComponentId,
    getVariable,
    activitySurveysIds,
    workingTimeSurveysIds,
    FieldNameEnum,
};
