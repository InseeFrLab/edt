import {
    LoopData,
    LunaticData,
    LunaticModel,
    LunaticModelComponent,
    LunaticModelVariable,
} from "interface/lunatic/Lunatic";
import { mappingPageOrchestrator } from "routes/EdtRoutesMapping";
import { getCurrentPageSource } from "service/orchestrator-service";
import { getData, getVariable, toIgnoreForActivity, toIgnoreForRoute } from "service/survey-service";

const enum LoopEnum {
    ACTIVITY_OR_ROUTE = "ACTIVITY_OR_ROUTE",
}

const loopPageInfo: Map<LoopEnum, LoopData> = new Map();
loopPageInfo.set(LoopEnum.ACTIVITY_OR_ROUTE, {
    loopInitialSequencePage: "3",
    loopInitialPage: "4",
    loopInitialSubpage: "2",
    loopLastSubpage: "7",
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
) => {
    if (variable) {
        const value = data?.COLLECTED?.[variable.name]?.COLLECTED;
        if (Array.isArray(value) && value[iteration] !== undefined && value[iteration] !== null) {
            //return last fill subpage + 1
            const subpage = component.page ? +component?.page.split(".")[1] : 0;
            return Math.max(+currentLoopSubpage, subpage + 1);
        }
        return currentLoopSubpage;
    }
    return currentLoopSubpage;
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
                if (
                    (isRoute && !toIgnoreForRoute.find(dep => dependency === dep)) ||
                    (!isRoute && !toIgnoreForActivity.find(dep => dependency === dep))
                ) {
                    const variable = getVariable(source, dependency);
                    getCurrentLoopPageOfVariable(
                        data,
                        variable,
                        currentLoopSubpage,
                        iteration,
                        component,
                    );
                }
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
): number => {
    const data = getData(idSurvey);
    const currentLastCompletedLoopPage = getCurrentLoopPage(data, currentLoop, iteration) - 1;
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
