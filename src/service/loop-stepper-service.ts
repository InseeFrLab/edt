import step1Icon from "assets/illustration/stepper/step-activity-duration.svg";
import step4Icon from "assets/illustration/stepper/step-activity-location.svg";
import step2Icon from "assets/illustration/stepper/step-main-activity.svg";
import step3Icon from "assets/illustration/stepper/step-secondary-activity.svg";
import step6Icon from "assets/illustration/stepper/step-with-screen.svg";
import step5Icon from "assets/illustration/stepper/step-with-someone.svg";
import { t } from "i18next";
import { EdtRoutesNameEnum } from "routes/EdtRoutesMapping";

export interface StepData {
    page: EdtRoutesNameEnum;
    stepNumber: number;
    stepLabel: string;
    stepIcon: string;
    stepIconAlt: string;
}

const loopActivityStepperData: StepData[] = [
    {
        page: EdtRoutesNameEnum.ACTIVITY_DURATION,
        stepNumber: 1,
        stepLabel: t("component.add-activity-stepper.step-1-label"),
        stepIcon: step1Icon,
        stepIconAlt: t("accessibility.asset.stepper.step-activity-duration-alt"),
    },
    {
        page: EdtRoutesNameEnum.MAIN_ACTIVITY,
        stepNumber: 2,
        stepLabel: t("component.add-activity-stepper.step-2-label"),
        stepIcon: step2Icon,
        stepIconAlt: t("accessibility.asset.stepper.step-main-activity-alt"),
    },
    {
        page: EdtRoutesNameEnum.SECONDARY_ACTIVITY,
        stepNumber: 3,
        stepLabel: t("component.add-activity-stepper.step-3-label"),
        stepIcon: step3Icon,
        stepIconAlt: t("accessibility.asset.stepper.step-secondary-activity-alt"),
    },
    {
        page: EdtRoutesNameEnum.ACTIVITY_LOCATION,
        stepNumber: 4,
        stepLabel: t("component.add-activity-stepper.step-4-label"),
        stepIcon: step4Icon,
        stepIconAlt: t("accessibility.asset.stepper.step-activity-location-alt"),
    },
    {
        page: EdtRoutesNameEnum.WITH_SOMEONE,
        stepNumber: 5,
        stepLabel: t("component.add-activity-stepper.step-5-label"),
        stepIcon: step5Icon,
        stepIconAlt: t("accessibility.asset.stepper.step-with-someone-alt"),
    },
    {
        page: EdtRoutesNameEnum.WITH_SCREEN,
        stepNumber: 6,
        stepLabel: t("component.add-activity-stepper.step-6-label"),
        stepIcon: step6Icon,
        stepIconAlt: t("accessibility.asset.stepper.step-with-screen-alt"),
    },
];

const getStepData = (page: EdtRoutesNameEnum): StepData => {
    return (
        loopActivityStepperData.find(stepData => stepData.page === page) || loopActivityStepperData[0]
    );
};

const getNextLoopPage = (currentPage: EdtRoutesNameEnum) => {
    let index = loopActivityStepperData.findIndex(stepData => stepData.page === currentPage);
    return loopActivityStepperData[index + 1].page;
};
const getPreviousLoopPage = (currentPage: EdtRoutesNameEnum) => {
    let index = loopActivityStepperData.findIndex(stepData => stepData.page === currentPage);
    return loopActivityStepperData[index - 1].page;
};

export { loopActivityStepperData, getStepData, getPreviousLoopPage, getNextLoopPage };
