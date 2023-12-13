import { t } from "i18next";
import { LunaticData, LunaticModel, LunaticModelComponent } from "interface/lunatic/Lunatic";
import { EdtRoutesNameEnum, mappingPageOrchestrator } from "routes/EdtRoutesMapping";
import { getCurrentPageSource } from "./orchestrator-service";
import { getValueOfData, getVariable } from "./survey-service";

export interface StepData {
    page: EdtRoutesNameEnum;
    stepNumber: number;
    stepLabel: string;
    stepIcon?: string;
    stepIconAlt?: string;
}

const activityComplementaryQuestionsStepperData: StepData[] = [
    {
        page: EdtRoutesNameEnum.GREATEST_ACTIVITY_DAY,
        stepNumber: 1,
        stepLabel: t("component.end-activity-stepper.step-1-label"),
    },
    {
        page: EdtRoutesNameEnum.WORST_ACTIVITY_DAY,
        stepNumber: 1,
        stepLabel: t("component.end-activity-stepper.step-1-label"),
    },
    {
        page: EdtRoutesNameEnum.KIND_OF_DAY,
        stepNumber: 2,
        stepLabel: t("component.end-activity-stepper.step-2-label"),
    },
    {
        page: EdtRoutesNameEnum.EXCEPTIONAL_DAY,
        stepNumber: 2,
        stepLabel: t("component.end-activity-stepper.step-2-label"),
    },
    {
        page: EdtRoutesNameEnum.TRAVEL_TIME,
        stepNumber: 3,
        stepLabel: t("component.end-activity-stepper.step-3-label"),
    },
    {
        page: EdtRoutesNameEnum.PHONE_TIME,
        stepNumber: 4,
        stepLabel: t("component.end-activity-stepper.step-4-label"),
    },
];

const getStepData = (page: EdtRoutesNameEnum): StepData => {
    return (
        activityComplementaryQuestionsStepperData.find(stepData => stepData.page === page) ??
        activityComplementaryQuestionsStepperData[0]
    );
};

const getLastStep = () => {
    return activityComplementaryQuestionsStepperData[
        activityComplementaryQuestionsStepperData.length - 1
    ];
};

const getPageOfStep = (page: EdtRoutesNameEnum) => {
    return mappingPageOrchestrator.find(pageData => pageData.page === page)?.surveyPage ?? "";
};

const getComponentStep = (step: StepData, source: LunaticModel): LunaticModelComponent | undefined => {
    const page = getPageOfStep(step.page);
    const component = source?.components.find(comp => comp.page && comp.page === page);
    return component;
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
            const value = getValueOfData(data, variable.name);
            if (value != null && !Array.isArray(value)) {
                filled = false;
            } else filled = true;
        }
    });
    return filled;
};

const getLastPageStep = (data: LunaticData | undefined): StepData | null => {
    const stepper = activityComplementaryQuestionsStepperData;
    const source = getCurrentPageSource();
    let lastStepNotFilled = stepper[stepper.length - 1];
    let notFilled = false;

    let i = 0;
    while (!notFilled && i < stepper.length) {
        const stepData = stepper[i];
        const component = getComponentStep(stepData, source);
        notFilled = haveVariableNotFilled(component, source, data);
        if (notFilled) lastStepNotFilled = stepData;
        i++;
    }
    let lastStepFilled =
        lastStepNotFilled.stepNumber == 1 ? null : stepper[lastStepNotFilled.stepNumber - 1];

    if (lastStepNotFilled == getLastStep()) {
        const component = getComponentStep(lastStepNotFilled, source);
        lastStepFilled = haveVariableNotFilled(component, source, data)
            ? stepper[stepper.length - 2]
            : stepper[stepper.length - 1];
    }
    return lastStepFilled;
};

export {
    activityComplementaryQuestionsStepperData,
    getLastPageStep,
    getLastStep,
    getPageOfStep,
    getStepData,
};
