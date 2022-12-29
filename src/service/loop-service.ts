import {
    LoopData,
    LunaticData,
    LunaticModel,
    LunaticModelComponent,
    LunaticModelVariable,
} from "interface/lunatic/Lunatic";
import {
    EdtRoutesNameEnum,
    mappingPageOrchestrator,
    routesToIgnoreForActivity,
    routesToIgnoreForRoute,
} from "routes/EdtRoutesMapping";
import { getCurrentPageSource } from "service/orchestrator-service";
import { getData, getVariable, toIgnoreForActivity, toIgnoreForRoute } from "service/survey-service";
import { getPage } from "./navigation-service";

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
            const pageSubpage = getPage(subpage);
            const currentLoop = skipPage(currentLoopSubpage, pageSubpage?.page, isRoute);
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
    let routeSkip: EdtRoutesNameEnum | undefined;
    if (isRoute) {
        routeSkip = routesToIgnoreForRoute.find(route => route === currentPage);
    } else {
        routeSkip = routesToIgnoreForActivity.find(route => route === currentPage);
    }
    if (routeSkip) return currentLoopSubpage + 1;
    else return currentLoopSubpage;
};

// Give the first loop subpage that don't have any data fill
const getCurrentLoopPage = (
    data: LunaticData | undefined,
    currentLoop: LoopEnum | undefined,
    iteration: number | undefined,
    isRoute?: boolean,
) => {
    if (!currentLoop || iteration === undefined) {
        return 0;
    }
    const source = getCurrentPageSource();
    if (!data || !source?.components) {
        return 0;
    }
    const loop = source?.components.find(
        component => component.page === getLoopInitialPage(currentLoop),
    );
    if (!loop || !loop.components) {
        return 0;
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
    if (currentLoopSubpage > lastLoopSubPage) {
        //means we have fully completed iteration, in this case we want to go back to the first question of the loopPage
        return initialLoopSubPage;
    }
    return currentLoopSubpage;
};

const getLoopLastCompletedStep = (
    idSurvey: string,
    currentLoop: LoopEnum,
    iteration: number,
    isRoute?: boolean,
): number => {
    const data = getData(idSurvey);
    const currentLastCompletedLoopPage = getCurrentLoopPage(data, currentLoop, iteration, isRoute);
    const page = mappingPageOrchestrator.find(
        page => page.surveySubPage && page.surveySubPage === currentLastCompletedLoopPage.toString(),
    );
    return page?.surveyStep ?? 0;
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
