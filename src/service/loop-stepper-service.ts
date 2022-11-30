import step1Icon from "assets/illustration/stepper/step-activity-duration.svg";
import step4Icon from "assets/illustration/stepper/step-activity-location.svg";
import step2Icon from "assets/illustration/stepper/step-main-activity.svg";
import step3Icon from "assets/illustration/stepper/step-secondary-activity.svg";
import step6Icon from "assets/illustration/stepper/step-with-screen.svg";
import step5Icon from "assets/illustration/stepper/step-with-someone.svg";
import { t } from "i18next";

export interface StepData {
    stepNumber: number;
    stepLabel: string;
    stepIcon: string;
    stepIconAlt: string;
}

const loopStepperData: StepData[] = [
    {
        stepNumber: 1,
        stepLabel: t("component.add-activity-stepper.step-1-label"),
        stepIcon: step1Icon,
        stepIconAlt: t("accessibility.asset.stepper.step-activity-duration-alt"),
    },
    {
        stepNumber: 2,
        stepLabel: t("component.add-activity-stepper.step-2-label"),
        stepIcon: step2Icon,
        stepIconAlt: t("accessibility.asset.stepper.step-main-activity-alt"),
    },
    {
        stepNumber: 3,
        stepLabel: t("component.add-activity-stepper.step-3-label"),
        stepIcon: step3Icon,
        stepIconAlt: t("accessibility.asset.stepper.step-secondary-activity-alt"),
    },
    {
        stepNumber: 4,
        stepLabel: t("component.add-activity-stepper.step-4-label"),
        stepIcon: step4Icon,
        stepIconAlt: t("accessibility.asset.stepper.step-activity-location-alt"),
    },
    {
        stepNumber: 5,
        stepLabel: t("component.add-activity-stepper.step-5-label"),
        stepIcon: step5Icon,
        stepIconAlt: t("accessibility.asset.stepper.step-with-someone-alt"),
    },
    {
        stepNumber: 6,
        stepLabel: t("component.add-activity-stepper.step-6-label"),
        stepIcon: step6Icon,
        stepIconAlt: t("accessibility.asset.stepper.step-with-screen-alt"),
    },
];

const getStepData = (stepNumber: number): StepData => {
    return loopStepperData[stepNumber - 1];
};

export { loopStepperData, getStepData };
