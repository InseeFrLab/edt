import { LoopData, LunaticData, LunaticModel } from "interface/lunatic/Lunatic";
import { mappingPageOrchestrator } from "routes/EdtRoutes";
import { getCurrentPageSource } from "service/orchestrator-service";
import { getData } from "service/survey-service";

const enum LoopEnum {
    ACTIVITY = "ACTIVITY",
}

const loopPageInfo: Map<LoopEnum, LoopData> = new Map();
loopPageInfo.set(LoopEnum.ACTIVITY, {
    loopInitialSequencePage: "3",
    loopInitialPage: "4",
    loopInitialSubpage: "2",
});

const getLoopInitialPage = (loop: LoopEnum): string => {
    return loopPageInfo.get(loop)?.loopInitialPage || "";
};

const getLoopInitialSubPage = (loop: LoopEnum): string => {
    return loopPageInfo.get(loop)?.loopInitialSubpage || "";
};

const getLoopInitialSequencePage = (loop: LoopEnum): string => {
    return loopPageInfo.get(loop)?.loopInitialSequencePage || "";
};

const getCurrentLoopPage = (
    data: LunaticData | undefined,
    currentLoop: LoopEnum | undefined,
    iteration: number | undefined,
) => {
    if (!currentLoop || iteration === undefined) {
        return 0;
    }
    const source = getCurrentPageSource();
    if (!data || !source?.components) {
        return 0;
    }
    const loop = source?.components.find(component => component.page === currentLoop);
    if (!loop || !loop.components) {
        return 0;
    }
    const initialLoopSubPage = getLoopInitialSubPage(currentLoop);
    let currentLoopSubpage = +initialLoopSubPage;
    //Page 1 is for subsequence, see in source
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
                        //return last fill subpage + 1
                        const subpage = component.page ? +component?.page.split(".")[1] : 0;
                        currentLoopSubpage = Math.max(+currentLoopSubpage, subpage + 1);
                    }
                }
            }
        }
    }
    return currentLoopSubpage;
};

const getLoopLastCompletedStep = (
    idSurvey: string,
    currentLoop: LoopEnum,
    iteration: number,
): number => {
    const data = getData(idSurvey);
    const currentLoopPage = getCurrentLoopPage(data, currentLoop, iteration);
    const page = mappingPageOrchestrator.find(
        page => page.surveySubPage && page.surveySubPage === currentLoopPage.toString(),
    );
    return page?.surveyStep ?? 0;
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
    let currentLoopSize = 0; //Page 1 is for subsequence, see in source
    for (const component of loop.components) {
        if (component.bindingDependencies) {
            for (const dependency of component.bindingDependencies) {
                const variable = source.variables.find(
                    v => v.variableType === "COLLECTED" && v.name === dependency,
                );
                if (variable) {
                    const value = data?.COLLECTED?.[variable.name]?.COLLECTED;
                    console.log(data);
                    if (Array.isArray(value) && value[0] !== null) {
                        currentLoopSize = Math.max(currentLoopSize, value.length);
                    }
                }
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
