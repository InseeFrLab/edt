import {
    LoopData,
    LunaticData,
    LunaticModel,
    LunaticModelComponent,
    LunaticModelVariable,
} from "interface/lunatic/Lunatic";
import { EdtRoutesNameEnum } from "routes/EdtRoutesMapping";
import { getCurrentPageSource } from "service/orchestrator-service";
import {
    FieldNameEnum,
    getData,
    getValue,
    getVariable,
    saveData,
    setValue,
    toIgnoreForActivity,
    toIgnoreForRoute,
} from "service/survey-service";
import { getLastStep, getStepPage, getStepper } from "./loop-stepper-service";
import { getLoopPage, getSurveySubPage } from "./navigation-service";

const enum LoopEnum {
    ACTIVITY_OR_ROUTE = "ACTIVITY_OR_ROUTE",
}

const loopPageInfo: Map<LoopEnum, LoopData> = new Map();
loopPageInfo.set(LoopEnum.ACTIVITY_OR_ROUTE, {
    loopInitialSequencePage: "3",
    loopInitialPage: "4",
    loopInitialSubpage: "2",
    loopLastSubpage: "12",
});

const getLoopInitialPage = (loop: LoopEnum): string => {
    return loopPageInfo.get(loop)?.loopInitialPage || "";
};

const getLoopInitialSubPage = (loop: LoopEnum): string => {
    return loopPageInfo.get(loop)?.loopInitialSubpage || "";
};

const getLoopLastSubPage = (loop: LoopEnum): string => {
    return loopPageInfo.get(loop)?.loopLastSubpage || "";
};

const getLoopInitialSequencePage = (loop: LoopEnum): string => {
    return loopPageInfo.get(loop)?.loopInitialSequencePage || "";
};

const getCurrentLoopPageOfVariable = (
    data: LunaticData | undefined,
    variable: LunaticModelVariable | undefined,
    currentLoopSubpage: number,
    iteration: number,
    component: LunaticModelComponent,
    isRoute?: boolean,
) => {
    if (variable) {
        const value = data?.COLLECTED?.[variable.name]?.COLLECTED;
        if (Array.isArray(value) && value[iteration] !== undefined && value[iteration] !== null) {
            //return last fill subpage + 1
            const subpage = component.page ? +component?.page.split(".")[1] : 0;
            const pageSubpage = getLoopPage(subpage);
            let currentLoop = skipPage(currentLoopSubpage, pageSubpage?.page, isRoute);
            return currentLoop;
        }
        return currentLoopSubpage;
    }
    return currentLoopSubpage;
};

const skipPage = (
    currentLoopSubpage: number,
    currentPage?: EdtRoutesNameEnum,
    isRoute?: boolean,
): number => {
    const lastStep = getLastStep(isRoute)?.stepNumber;
    const stepper = getStepper(isRoute);

    let index = getStepPage(currentPage, isRoute)?.stepNumber;
    index = index && index >= lastStep ? lastStep : index;

    const nextPage = stepper.find(stepData => stepData.stepNumber == (index ?? 0) + 1)?.page;
    const surveySubPage = Number(getSurveySubPage(nextPage) ?? currentLoopSubpage);

    if (nextPage) {
        return surveySubPage > currentLoopSubpage ? surveySubPage : currentLoopSubpage;
    } else return Number(getLoopLastSubPage(LoopEnum.ACTIVITY_OR_ROUTE)) + 1;
};

// Give the first loop subpage that don't have any data fill
const getCurrentLoopPage = (
    idSurvey: string,
    data: LunaticData | undefined,
    currentLoop: LoopEnum,
    iteration: number | undefined,
    isRoute?: boolean,
): {
    step: number;
    completed: boolean;
} => {
    if (!currentLoop || iteration === undefined) {
        return { step: 0, completed: false };
    }
    const source = getCurrentPageSource();
    if (!data || !source?.components) {
        return { step: 0, completed: false };
    }
    const loop = source?.components.find(
        component => component.page === getLoopInitialPage(currentLoop),
    );
    if (!loop || !loop.components) {
        return { step: 0, completed: false };
    }
    const initialLoopSubPage = +getLoopInitialSubPage(currentLoop);
    const lastLoopSubPage = +getLoopLastSubPage(currentLoop);
    let currentLoopSubpage = initialLoopSubPage;
    for (const component of loop.components) {
        if (component.bindingDependencies) {
            for (const dependency of component.bindingDependencies) {
                if (isRoute && toIgnoreForRoute.find(dep => dependency == dep)) {
                    continue;
                }
                if (!isRoute && toIgnoreForActivity.find(dep => dependency == dep)) {
                    continue;
                }
                const variable = getVariable(source, dependency);
                currentLoopSubpage = getCurrentLoopPageOfVariable(
                    data,
                    variable,
                    currentLoopSubpage,
                    iteration,
                    component,
                    isRoute,
                );
            }
        }
    }
    setLoopCompleted(idSurvey, iteration, currentLoopSubpage > lastLoopSubPage);
    if (currentLoopSubpage > lastLoopSubPage) {
        //means we have fully completed iteration, in this case we want to go back to the first question of the loopPage
        return { step: initialLoopSubPage, completed: true };
    }
    return { step: currentLoopSubpage, completed: false };
};

const setLoopCompleted = (idSurvey: string, iteration: number | undefined, isCompleted: boolean) => {
    const completed = setValue(idSurvey, FieldNameEnum.ISCOMPLETED, isCompleted, iteration);
    if (completed) {
        saveData(idSurvey, completed);
    }
};

const getLoopLastCompletedStep = (
    idSurvey: string,
    currentLoop: LoopEnum,
    iteration: number,
): number => {
    const data = getData(idSurvey);
    const isRoute = getValue(idSurvey, FieldNameEnum.ISROUTE, iteration) as boolean;
    const currentLoopPage = getCurrentLoopPage(idSurvey, data, currentLoop, iteration, isRoute);
    const lastStep = getLastStep(isRoute).stepNumber;

    if (currentLoopPage.completed) return lastStep;

    const currentPage = getLoopPage(currentLoopPage.step)?.page;
    const currentStep = getStepPage(currentPage, isRoute)?.stepNumber ?? lastStep + 1;
    const currentLastCompletedLoopPage = currentStep <= lastStep ? currentStep - 1 : lastStep;

    return currentLastCompletedLoopPage;
};

const getLoopSizeOfVariable = (
    data: LunaticData | undefined,
    variable: LunaticModelVariable | undefined,
    currentLoopSize: number,
): number => {
    if (variable) {
        const value = data?.COLLECTED?.[variable.name]?.COLLECTED;
        if (Array.isArray(value) && value[0] !== null) {
            return Math.max(currentLoopSize, value.length);
        } else return currentLoopSize;
    } else return currentLoopSize;
};

const getLoopSize = (idSurvey: string, currentLoop: LoopEnum): number => {
    const source = getCurrentPageSource();
    const loopPage = getLoopInitialPage(currentLoop);
    if (!source?.components) {
        return 0;
    }
    const loop = source?.components.find(component => component.page === loopPage);
    if (!loop || !loop.components) {
        return 0;
    }
    const data = getData(idSurvey);
    let currentLoopSize = 0;
    for (const component of loop.components) {
        if (component.bindingDependencies) {
            for (const dependency of component.bindingDependencies) {
                const variable = getVariable(source, dependency);
                currentLoopSize = getLoopSizeOfVariable(data, variable, currentLoopSize);
            }
        }
    }
    return currentLoopSize;
};

const setLoopSize = (source: LunaticModel, currentLoop: LoopEnum, size: number): number => {
    const initialLoopPage = getLoopInitialPage(currentLoop);
    const loop = source.components.find(composant => composant.page === initialLoopPage);
    if (loop && loop.iterations) {
        loop.iterations.value = size.toString();
        return +loop.iterations.value;
    }
    return 0;
};

export {
    LoopEnum,
    getLoopInitialPage,
    getLoopInitialSubPage,
    getLoopInitialSequencePage,
    getCurrentLoopPage,
    getLoopLastCompletedStep,
    getLoopSize,
    setLoopSize,
};
