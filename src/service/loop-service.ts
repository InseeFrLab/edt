import { NomenclatureActivityOption } from "@inseefrlab/lunatic-edt";
import {
    CODES_ACTIVITY_IGNORE_GOAL,
    CODES_ACTIVITY_IGNORE_LOCATION,
    CODES_ACTIVITY_IGNORE_SCREEN,
    CODES_ACTIVITY_IGNORE_SECONDARY_ACTIVITY,
    CODES_ACTIVITY_IGNORE_SOMEONE,
} from "constants/constants";
import { EdtRoutesNameEnum } from "enumerations/EdtRoutesNameEnum";
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
    getDatas,
    getValue,
    getValueOfData,
    getVariable,
    saveData,
    setValue,
    toIgnoreForActivity,
    toIgnoreForRoute,
} from "service/survey-service";
import {
    getLastStep,
    getNextLoopPage,
    getPreviousLoopPage,
    getStepPage,
    getStepper,
} from "./loop-stepper-service";
import {
    getCurrentNavigatePath,
    getLoopPage,
    getOrchestratorPage,
    saveAndLoopNavigate,
    saveAndNav,
} from "./navigation-service";
import { getNomenclatureRef } from "./referentiel-service";

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

const getValueOfActivity = (data: LunaticData | undefined, iteration: number) => {
    const activityCategory = getValueOfData(data, FieldNameEnum.MAINACTIVITY_ID);
    if (Array.isArray(activityCategory) && activityCategory[iteration] != null) {
        return activityCategory[iteration] as string;
    }

    const activityAutoComplete = getValueOfData(data, FieldNameEnum.MAINACTIVITY_SUGGESTERID);
    if (Array.isArray(activityAutoComplete) && activityAutoComplete[iteration] != null) {
        return (activityAutoComplete[iteration] as string).split("-")[0];
    }
};

/**
 *
 * @param component
 * @param data
 * @param iteration
 * @param pageToSkip
 * @returns
 */
const ignoreActivity = (
    component: LunaticModelComponent | undefined,
    data: LunaticData | undefined,
    iteration: number,
    pageToSkip: EdtRoutesNameEnum,
) => {
    const pageLoop = Number(component?.page?.split(".")[1]);
    const loop = getLoopPage(pageLoop);
    if (loop?.page == pageToSkip) {
        const codeActivity = getValueOfActivity(data, iteration) ?? "";
        return filtrePage(pageToSkip, codeActivity);
    }
    return false;
};
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
    const valueOfConditional = getValueOfData(data, depConditional ?? "") as string[];

    //is page of values of conditional = true
    if (isPageOfConditional) {
        const mustShowPageOfConditional =
            valueOfConditional &&
            valueOfConditional?.[iteration] != null &&
            valueOfConditional?.[iteration] == "true";
        //in page of conditional select yes
        if (mustShowPageOfConditional) {
            let ignore = false;
            const deps = component?.bindingDependencies; //values of composant
            //ignore all variables of composant if it's added one of dependencies of component
            deps?.forEach(dep => {
                const value = getValueOfData(data, dep ?? "");

                if (Array.isArray(value) && value[iteration] != null) {
                    const conditional = value[iteration] as string | boolean;
                    if (!ignore) {
                        if (typeof conditional == "string") ignore = conditional.length > 0;
                        if (typeof conditional == "boolean") ignore = conditional;
                    }
                }
            });
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
        const activityCategory = getValueOfData(data, FieldNameEnum.MAINACTIVITY_ID);
        const isFullyCompleted = getValueOfData(data, FieldNameEnum.MAINACTIVITY_ISFULLYCOMPLETED);

        if (
            Array.isArray(activityCategory) &&
            activityCategory[iteration] != null &&
            Array.isArray(isFullyCompleted) &&
            isFullyCompleted[iteration] != null &&
            isFullyCompleted[iteration]
        ) {
            oneActivityIsAdded = true;
        }

        const activityAutoComplete = getValueOfData(data, FieldNameEnum.MAINACTIVITY_SUGGESTERID);
        if (Array.isArray(activityAutoComplete) && activityAutoComplete[iteration] != null) {
            oneActivityIsAdded = true;
        }

        const newActivity = getValueOfData(data, FieldNameEnum.MAINACTIVITY_LABEL);
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
    let ignoreLocation = ignoreActivity(component, data, iteration, EdtRoutesNameEnum.ACTIVITY_LOCATION);
    let ignoreSomeone = ignoreActivity(component, data, iteration, EdtRoutesNameEnum.WITH_SOMEONE);
    let ignoreScreen = ignoreActivity(component, data, iteration, EdtRoutesNameEnum.WITH_SCREEN);
    let ignoreGoal = ignoreActivity(component, data, iteration, EdtRoutesNameEnum.MAIN_ACTIVITY_GOAL);
    let ignoreSecondaryActivity = ignoreActivity(
        component,
        data,
        iteration,
        EdtRoutesNameEnum.SECONDARY_ACTIVITY,
    );

    const filtrerActivities =
        ignoreLocation || ignoreSomeone || ignoreScreen || ignoreGoal || ignoreSecondaryActivity;

    let toIgnoreActivity = ignoreDepsActivity(variable, component, data, iteration);
    let toIgnoreIfInputInCheckboxGroup =
        component?.componentType == "CheckboxGroupEdt" &&
        ignoreDepsOfCheckboxGroup(component, data, iteration);
    return (
        toIgnore ||
        filtrerActivities ||
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
        const value = getValueOfData(data, dep ?? "");
        if (Array.isArray(value) && value[iteration] != null) {
            const conditional = value[iteration] as string | boolean;
            if (conditional) existOneDepAdded = true;
        }
    });
    return existOneDepAdded;
};

const filtrePage = (page: EdtRoutesNameEnum, activityCode: string) => {
    let codesToIgnore;
    let listToIgnore: string[] = [];

    const activityCodeOrSuggesterCode =
        activityCode.split("-").length > 1 ? activityCode.split("-")[0] : activityCode;

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
        case EdtRoutesNameEnum.SECONDARY_ACTIVITY:
            listToIgnore = CODES_ACTIVITY_IGNORE_SECONDARY_ACTIVITY;
            break;
        default:
            listToIgnore = [];
            break;
    }

    codesToIgnore = getAllCodesFromActivitiesCodes(listToIgnore);
    const exist = codesToIgnore.indexOf(activityCodeOrSuggesterCode) >= 0;
    return exist;
};

/**
 * Skip page according to the selected activity
 * @param idSurvey
 * @param source
 * @param iteration
 * @param pageNext
 * @param t
 * @returns true if have to skip page according to the selected activity
 */
const activityIgnore = (idSurvey: string, iteration: number, page: EdtRoutesNameEnum): boolean => {
    const data = getDatas().get(idSurvey);
    const codeActivity = getValueOfActivity(data, iteration) ?? "";
    const skip = filtrePage(page, codeActivity ?? "");
    return skip;
};

/**
 * Navigate to next page by skipping pages that should not be shown depending on the activty
 * @param idSurvey
 * @param source
 * @param iteration
 * @param currentPage
 * @param fieldConditionNext
 * @param nextRoute
 * @param isRoute
 */
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
        (nextPageRoute == null && nextPageNextLoop == EdtRoutesNameEnum.ACTIVITY_OR_ROUTE_PLANNER)
    ) {
        saveAndNav(
            idSurvey,
            getCurrentNavigatePath(
                idSurvey,
                EdtRoutesNameEnum.ACTIVITY,
                getOrchestratorPage(EdtRoutesNameEnum.ACTIVITY_OR_ROUTE_PLANNER),
                source,
            ),
        );
    } else {
        saveAndLoopNavigate(
            idSurvey,
            source,
            nextPageRoute || nextPageNextLoop,
            LoopEnum.ACTIVITY_OR_ROUTE,
            iteration,
            fieldConditionNext,
            fieldConditionNext ? nextPageNextLoop : undefined,
        );
    }
};

/**
 * Navigate to previous page by skipping pages that should not be shown depending on the activty
 * @param idSurvey
 * @param source
 * @param iteration
 * @param currentPage
 * @param fieldConditionNext
 * @param nextRoute
 * @param isRoute
 */
const skipBackPage = (
    idSurvey: string,
    source: LunaticModel,
    iteration: number,
    currentPage: EdtRoutesNameEnum,
    fieldConditionBack?: FieldNameEnum,
    backRoute?: EdtRoutesNameEnum,
    isRoute?: boolean,
) => {
    const backPageRoute = backRoute
        ? skipAllBackPage(idSurvey, source, iteration, backRoute, isRoute)
        : undefined;

    const backCurrentPage = getPreviousLoopPage(currentPage, isRoute);
    const backPageBackLoop = skipAllBackPage(idSurvey, source, iteration, backCurrentPage, isRoute);

    if (
        backPageRoute == EdtRoutesNameEnum.ACTIVITY_OR_ROUTE_PLANNER ||
        backPageBackLoop == EdtRoutesNameEnum.ACTIVITY_OR_ROUTE_PLANNER
    ) {
        saveAndNav(
            idSurvey,
            getCurrentNavigatePath(
                idSurvey,
                EdtRoutesNameEnum.ACTIVITY,
                getOrchestratorPage(EdtRoutesNameEnum.ACTIVITY_OR_ROUTE_PLANNER),
                source,
            ),
        );
    } else {
        saveAndLoopNavigate(
            idSurvey,
            source,
            backPageRoute || backPageBackLoop,
            LoopEnum.ACTIVITY_OR_ROUTE,
            iteration,
            fieldConditionBack,
            fieldConditionBack ? backPageBackLoop : undefined,
        );
    }
};

/**
 * Skip all pages that should be filtre
 * @param idSurvey
 * @param source
 * @param iteration
 * @param nextPage
 * @param t
 * @param isRoute
 * @returns next page by skipping all pages that should not be shown depending on the activty
 */
const skipAllNextPage = (
    idSurvey: string,
    source: LunaticModel,
    iteration: number,
    nextPage: EdtRoutesNameEnum,
    isRoute?: boolean,
): EdtRoutesNameEnum => {
    let page = nextPage;
    if (activityIgnore(idSurvey, iteration, nextPage)) {
        if (getStepPage(nextPage) == getLastStep(isRoute)) {
            return EdtRoutesNameEnum.ACTIVITY_OR_ROUTE_PLANNER;
        } else page = getNextLoopPage(nextPage, isRoute);
    }
    if (activityIgnore(idSurvey, iteration, page)) {
        return skipAllNextPage(idSurvey, source, iteration, page, isRoute);
    }
    return page;
};

/**
 * Skip all pages that should be filtre
 * @param idSurvey
 * @param source
 * @param iteration
 * @param nextPage
 * @param t
 * @param isRoute
 * @returns previous page by skipping all pages that should not be shown depending on the activty
 */
const skipAllBackPage = (
    idSurvey: string,
    source: LunaticModel,
    iteration: number,
    backPage: EdtRoutesNameEnum,
    isRoute?: boolean,
): EdtRoutesNameEnum => {
    let page = backPage;
    if (activityIgnore(idSurvey, iteration, backPage)) {
        if (getStepPage(backPage) == getStepper(isRoute)[0]) {
            return EdtRoutesNameEnum.ACTIVITY_OR_ROUTE_PLANNER;
        } else page = getPreviousLoopPage(backPage, isRoute);
    }
    if (activityIgnore(idSurvey, iteration, page)) {
        return skipAllBackPage(idSurvey, source, iteration, page, isRoute);
    }
    return page;
};

/**
 * Find activity
 * @param id
 * @param ref
 * @param parent
 * @returns
 */
const findItemInCategoriesNomenclature = (
    id: string | undefined,
    referentiel: NomenclatureActivityOption[],
    parent?: NomenclatureActivityOption,
): { item: NomenclatureActivityOption; parent: NomenclatureActivityOption | undefined } | undefined => {
    let res = referentiel.find(a => a.id === id);
    if (res) {
        return {
            item: res,
            parent: parent,
        };
    } else {
        for (let ref of referentiel) {
            let subsubs = ref.subs;
            if (subsubs) {
                let res2 = findItemInCategoriesNomenclature(id, subsubs, ref);
                if (res2) {
                    return res2;
                }
            }
        }
    }
};

/**
 * Get all subcodes of activities
 * @param listAIgnorer codes from which we want to obtain the subcategories
 * @returns
 */
const getAllCodesFromActivitiesCodes = (listAIgnorer: string[]) => {
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

/**
 *
 * @param code
 * @param codesActivity
 * @param categoriesActivity
 */
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
        //means we have fully completed iteration,
        //in this case we want to go back to the first question of the loopPage
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
        const value = getValueOfData(data, variable.name);
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
    const loop = source?.components?.find(composant => composant.page === initialLoopPage);
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
            const value = getValueOfData(data, variable.name);
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
    activityIgnore,
    filtrePage,
    getAllCodesFromActivitiesCodes,
    getCurrentLoopPage,
    getLoopInitialPage,
    getLoopInitialSequencePage,
    getLoopInitialSubPage,
    getLoopLastCompletedStep,
    getLoopSize,
    getValueOfActivity,
    setLoopSize,
    skipBackPage,
    skipNextPage,
};
