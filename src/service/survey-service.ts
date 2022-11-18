import { t } from "i18next";
import { LunaticData } from "interface/lunatic/Lunatic";
import { lunaticDatabase } from "service/lunatic-database";
import { getCurrentPageSource } from "service/orchestrator-service";

const datas = new Map<string, LunaticData>();
const activitySurveysIds = ["activitySurvey1", "activitySurvey2", "activitySurvey3"];
const workingTimeSurveysIds = ["workingSurvey1", "workingSurvey2"];
const surveysIds = [...activitySurveysIds, ...workingTimeSurveysIds];

const enum FieldNameEnum {
    lastName = "LASTNAME",
    firstName = "FIRSTNAME",
    surveyDate = "SURVEYDATE",
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
                const variable = source.variables.find(
                    v => v.variableType === "COLLECTED" && v.name === dependency,
                );
                if (variable) {
                    const value = data?.COLLECTED?.[variable.name]?.COLLECTED;
                    if (value !== undefined && value !== null) {
                        currentPage = Math.max(currentPage, +component.page);
                    }
                }
            }
        }
    }
    return currentPage;
};

const getValue = (idSurvey: string, variableName: FieldNameEnum) => {
    return datas.get(idSurvey)?.COLLECTED?.[variableName]?.COLLECTED;
};

const getLastName = (idSurvey: string) => {
    return getValue(idSurvey, FieldNameEnum.lastName)?.toString();
};

const getFirstName = (idSurvey: string) => {
    return getValue(idSurvey, FieldNameEnum.firstName)?.toString();
};

const getSurveyDate = (idSurvey: string) => {
    return getValue(idSurvey, FieldNameEnum.surveyDate)?.toString();
};

// return survey firstname if exist or default value
const getPrintedFirstName = (idSurvey: string): string => {
    return getFirstName(idSurvey) || t("common.user.person") + " " + getPersonNumber(idSurvey);
};

// return survey date in french format (day x - dd/mm) if exist or default value
const getPrintedSurveyDate = (idSurvey: string): string => {
    const savedSurveyDate = getSurveyDate(idSurvey);
    if (savedSurveyDate) {
        const [year, month, day] = savedSurveyDate.split("-");
        return t("component.day-card.day") + " - " + [day, month, year].join("/");
    } else {
        return t("component.day-card.day") + " 1";
    }
};

const getPersonNumber = (idSurvey: string) => {
    return (activitySurveysIds.indexOf(idSurvey) || workingTimeSurveysIds.indexOf(idSurvey)) + 1;
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
    activitySurveysIds,
    workingTimeSurveysIds,
};
