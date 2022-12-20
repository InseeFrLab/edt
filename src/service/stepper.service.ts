import { t } from "i18next";
import { EdtRoutesNameEnum } from "routes/EdtRoutesMapping";

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
        page: EdtRoutesNameEnum.TYPE_DAY,
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
        activityComplementaryQuestionsStepperData.find(stepData => stepData.page === page) ||
        activityComplementaryQuestionsStepperData[0]
    );
};

const getNextPage = (currentPage: EdtRoutesNameEnum) => {
    let index = activityComplementaryQuestionsStepperData.findIndex(
        stepData => stepData.page === currentPage,
    );
    return activityComplementaryQuestionsStepperData[index + 1].page;
};

const getPreviousPage = (currentPage: EdtRoutesNameEnum) => {
    let index = activityComplementaryQuestionsStepperData.findIndex(
        stepData => stepData.page === currentPage,
    );
    return activityComplementaryQuestionsStepperData[index - 1].page;
};

export { activityComplementaryQuestionsStepperData, getStepData, getPreviousPage, getNextPage };
