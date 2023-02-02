import { FieldNameEnum } from "enumerations/FieldNameEnum";
import { LoopEnum } from "enumerations/LoopEnum";
import {
    LoopData,
    LunaticData,
    LunaticModel,
    LunaticModelComponent,
    LunaticModelVariable,
} from "interface/lunatic/Lunatic";
import { getCurrentPageSource } from "service/orchestrator-service";
import {
    getData,
    getValue,
    getVariable,
    saveData,
    setValue,
    toIgnoreForActivity,
    toIgnoreForRoute,
} from "service/survey-service";
import { getLastStep, getStepPage } from "./loop-stepper-service";
import { getLoopPage } from "./navigation-service";

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

const getLoopInitialSequencePage = (loop: LoopEnum): string => {
    return loopPageInfo.get(loop)?.loopInitialSequencePage || "";
};

const LOOP_PAGES_CONDITIONALS = ["4.7", "4.10"];

/**
 * Skip pages conditionals
 * if conditional value is false or
 * if one of values of composant it's added
 *
 * @param loopComponents components of loop
 * @param component
 * @param data
 * @param iteration
 * @returns if skip variable
 */
const ignoreVariablesCondtionals = (
    loopComponents: LunaticModelComponent[],
    component: LunaticModelComponent | undefined,
    data: LunaticData | undefined,
    iteration: number,
) => {
    const pageOfConditional = Number(component?.page?.split(".")[1]) - 1;
    const isPageOfConditional = LOOP_PAGES_CONDITIONALS.indexOf(component?.page ?? "") >= 0;

    const componentConditional = loopComponents.find(
        component => component.page == component?.page?.split(".")[0] + "." + pageOfConditional,
    );
    const depConditional = componentConditional?.bindingDependencies?.[0];
    const valueOfConditional = data?.COLLECTED?.[depConditional ?? ""]?.COLLECTED as boolean[];

    //is page of values of conditional = true
    if (isPageOfConditional) {
        const mustShowPageOfConditional =
            valueOfConditional[iteration] != null && valueOfConditional[iteration];
        //in page of conditional select yes
        if (mustShowPageOfConditional) {
            let ignore = false;
            const deps = component?.bindingDependencies; //values of composant
            let isInputConditional = false;
            //ignore all variables of composant if it's added one of dependencies of component
            deps?.forEach(dep => {
                const value = data?.COLLECTED?.[dep ?? ""]?.COLLECTED;
                if (Array.isArray(value) && value[iteration] != null) {
                    const conditional = value[iteration] as string | boolean;
                    if (!isInputConditional) {
                        if (typeof conditional == "string") isInputConditional = conditional.length > 0;
                        if (typeof conditional == "boolean") isInputConditional = conditional;
                    }
                }
            });
            ignore = isInputConditional;
            return ignore;
        } //other, skip variables of conditional
        else return true;
    } else return false;
};

const ignoreDepsActivity = (
    variable: LunaticModelVariable | undefined,
    component: LunaticModelComponent | undefined,
    data: LunaticData | undefined,
    iteration: number,
) => {
    const variableActivity =
        component?.componentType == "ActivitySelecter" &&
        (component?.bindingDependencies?.indexOf(variable?.name ?? "") ?? -1) >= 0;
    if (variableActivity) {
        let oneActivityIsAdded = false;
        const activityCategory = data?.COLLECTED?.[FieldNameEnum.MAINACTIVITY_ID]?.COLLECTED;
        const isFullyCompleted =
            data?.COLLECTED?.[FieldNameEnum.MAINACTIVITY_ISFULLYCOMPLETED]?.COLLECTED;

        if (
            Array.isArray(activityCategory) &&
            activityCategory[iteration] != null &&
            Array.isArray(isFullyCompleted) &&
            isFullyCompleted[iteration] != null &&
            isFullyCompleted[iteration]
        ) {
            oneActivityIsAdded = true;
        }

        const activityAutoComplete =
            data?.COLLECTED?.[FieldNameEnum.MAINACTIVITY_SUGGESTERID]?.COLLECTED;
        if (Array.isArray(activityAutoComplete) && activityAutoComplete[iteration] != null) {
            oneActivityIsAdded = true;
        }

        const newActivity = data?.COLLECTED?.[FieldNameEnum.MAINACTIVITY_LABEL]?.COLLECTED;
        if (Array.isArray(newActivity) && newActivity[iteration] != null) {
            oneActivityIsAdded = true;
        }
        return oneActivityIsAdded;
    } else {
        return false;
    }
};

/**
 * Ignore variables depending on type (activity or journey)
 * @param variable
 * @param loopComponents
 * @param component
 * @param data
 * @param iteration
 * @param isRoute
 * @returns if skip variable
 */
const ignoreDeps = (
    variable: LunaticModelVariable | undefined,
    loopComponents: LunaticModelComponent[],
    component: LunaticModelComponent | undefined,
    data: LunaticData | undefined,
    iteration: number,
    isRoute?: boolean,
) => {
    let toIgnore = ignoreVariablesCondtionals(loopComponents, component, data, iteration);
    let toIgnoreActivity = ignoreDepsActivity(variable, component, data, iteration);
    let toIgnoreIfInputInCheckboxGroup =
        component?.componentType == "CheckboxGroupEdt" &&
        ignoreDepsOfCheckboxGroup(component, data, iteration);
    return (
        toIgnore ||
        toIgnoreActivity ||
        toIgnoreIfInputInCheckboxGroup ||
        (isRoute && toIgnoreForRoute.find(dep => variable?.name == dep)) ||
        (!isRoute && toIgnoreForActivity.find(dep => variable?.name == dep))
    );
};

/**
 * Ignore reste of variables if one of bindingDependencies is added
 */
const ignoreDepsOfCheckboxGroup = (
    component: LunaticModelComponent | undefined,
    data: LunaticData | undefined,
    iteration: number,
) => {
    let existOneDepAdded = false;
    component?.bindingDependencies?.forEach(dep => {
        const value = data?.COLLECTED?.[dep ?? ""]?.COLLECTED;
        if (Array.isArray(value) && value[iteration] != null) {
            const conditional = value[iteration] as string | boolean;
            if (conditional) existOneDepAdded = true;
        }
    });
    return existOneDepAdded;
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
    let currentLoopSubpage = initialLoopSubPage;

    const components = loop.components;
    let notFilled = false;
    let completed = false;
    let i = 0;
    while (!notFilled && i < components.length) {
        const component = components[i];
        notFilled = haveVariableNotFilled(components, component, source, data, iteration, isRoute);
        if (notFilled) {
            const subpage = component.page ? +component?.page.split(".")[1] : 0;
            const pageSubpage = getLoopPage(subpage);
            currentLoopSubpage = Number(pageSubpage?.surveySubPage);
        }
        i++;
    }
    if (i == components.length && !notFilled) completed = true;
    setLoopCompleted(idSurvey, iteration, completed);

    if (completed) {
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

const getLoopSize = (idSurvey: string, currentLoop: LoopEnum, sourceModel?: LunaticModel): number => {
    const source = sourceModel != null ? sourceModel : getCurrentPageSource();
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

const haveVariableNotFilled = (
    loopComponents: LunaticModelComponent[],
    component: LunaticModelComponent | undefined,
    source: LunaticModel,
    data: LunaticData | undefined,
    iteration: number,
    isRoute?: boolean,
) => {
    const variables = component?.bindingDependencies;
    if (variables == null || variables.length == 0) return false;
    let filled = false;
    variables.forEach(v => {
        const variable = getVariable(source, v);
        if (!ignoreDeps(variable, loopComponents, component, data, iteration, isRoute) && variable) {
            const value = data?.COLLECTED?.[variable.name]?.COLLECTED;
            if (Array.isArray(value) && value[iteration] != null) {
                filled = false;
            } else {
                filled = true;
            }
        }
    });
    return filled;
};

export {
    getLoopInitialPage,
    getLoopInitialSubPage,
    getLoopInitialSequencePage,
    getCurrentLoopPage,
    getLoopLastCompletedStep,
    getLoopSize,
    setLoopSize,
};
