import { t } from "i18next";
import { LunaticData } from "interface/lunatic/Lunatic";
import { generateDateFromStringInput, getFrenchDayFromDate } from "lunatic-edt";
import { EdtRoutesNameEnum, mappingPageOrchestrator } from "routes/EdtRoutes";
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
    DEBUT = "DEBUT",
    FIN = "FIN",
}

const enum LoopPage {
    ACTIVITY = "4",
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
                    if (value !== undefined && value !== null && !Array.isArray(value)) {
                        currentPage = Math.max(currentPage, component.page ? +component?.page : 0);
                    }
                }
            }
        }
    }
    return currentPage;
};

const getCurrentLoopPage = (
    data: LunaticData | undefined,
    loopPage: string | undefined,
    iteration: number | undefined,
) => {
    if (!loopPage || iteration === undefined) {
        return 0;
    }
    const source = getCurrentPageSource();
    if (!data || !source?.components) {
        return 0;
    }
    const loop = source?.components.find(component => component.page === loopPage);
    if (!loop || !loop.components) {
        return 0;
    }
    let currentLoopPage = 2; //Page 1 is for subsequence, see in source
    for (const component of loop.components) {
        if (component.bindingDependencies) {
            for (const dependency of component.bindingDependencies) {
                const variable = source.variables.find(
                    v => v.variableType === "COLLECTED" && v.name === dependency,
                );
                if (variable) {
                    const value = data?.COLLECTED?.[variable.name]?.COLLECTED;
                    if (
                        Array.isArray(value) &&
                        value[iteration] !== undefined &&
                        value[iteration] !== null
                    ) {
                        currentLoopPage = Math.max(
                            currentLoopPage,
                            component.page ? +component?.page : 0,
                        );
                    }
                }
            }
        }
    }
    return currentLoopPage;
};

const getLoopLastCompletedStep = (idSurvey: string, loopPage: string, iteration: number): number => {
    const data = getData(idSurvey);
    const currentLoopPage = getCurrentLoopPage(data, LoopPage.ACTIVITY, iteration);
    const page = mappingPageOrchestrator.find(
        page => page.surveySubPage && page.surveySubPage === currentLoopPage.toString(),
    );
    return page?.surveyStep ?? 0;
};

const getLoopSize = (idSurvey: string, loopPage: LoopPage): number => {
    if (!loopPage) {
        return 0;
    }
    const source = getCurrentPageSource();
    if (!source?.components) {
        return 0;
    }
    const loop = source?.components.find(component => component.page === loopPage);
    if (!loop || !loop.components) {
        return 0;
    }
    const data = getData(idSurvey);
    let currentLoopSize = 0; //Page 1 is for subsequence, see in source
    for (const component of loop.components) {
        if (component.bindingDependencies) {
            for (const dependency of component.bindingDependencies) {
                const variable = source.variables.find(
                    v => v.variableType === "COLLECTED" && v.name === dependency,
                );
                if (variable) {
                    const value = data?.COLLECTED?.[variable.name]?.COLLECTED;
                    if (Array.isArray(value)) {
                        currentLoopSize = Math.max(currentLoopSize, value.length);
                    }
                }
            }
        }
    }
    return currentLoopSize;
};

const getValue = (idSurvey: string, variableName: FieldNameEnum, iteration?: number) => {
    if (iteration) {
        // TODO : complete if useful
        //console.log(datas.get(idSurvey)?.COLLECTED?.[variableName]?.COLLECTED);
        //return datas.get(idSurvey)?.COLLECTED?.[variableName]?.COLLECTED?.[iteration];
    } else {
        return datas.get(idSurvey)?.COLLECTED?.[variableName]?.COLLECTED;
    }
};

const getValues = (idSurvey: string, variableName: FieldNameEnum) => {
    return datas.get(idSurvey)?.COLLECTED?.[variableName]?.COLLECTED;
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
    getCurrentLoopPage,
    getLastName,
    getFirstName,
    getPrintedFirstName,
    getSurveyDate,
    getPrintedSurveyDate,
    getValue,
    getValues,
    getLoopSize,
    getLoopLastCompletedStep,
    activitySurveysIds,
    workingTimeSurveysIds,
    LoopPage,
    FieldNameEnum,
};
