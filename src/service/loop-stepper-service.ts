import { ReactComponent as step1Icon } from "../assets/illustration/stepper/step-activity-duration.svg";
import { ReactComponent as step4Icon } from "../assets/illustration/stepper/step-activity-location.svg";
import { ReactComponent as step2Icon } from "../assets/illustration/stepper/step-main-activity.svg";
import { ReactComponent as step3BisIcon } from "../assets/illustration/stepper/step-mean-of-transport.svg";
import { ReactComponent as step2BisIcon } from "../assets/illustration/stepper/step-route.svg";
import { ReactComponent as step3Icon } from "../assets/illustration/stepper/step-secondary-activity.svg";
import { ReactComponent as step6Icon } from "../assets/illustration/stepper/step-with-screen.svg";
import { ReactComponent as step5Icon } from "../assets/illustration/stepper/step-with-someone.svg";
import { t } from "i18next";
import { EdtRoutesNameEnum, mappingPageOrchestrator } from "../routes/EdtRoutesMapping";

export interface StepData {
    page: EdtRoutesNameEnum;
    stepNumber: number;
    stepLabel: string;
    stepIcon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    stepIconAlt: string;
    isConditional?: boolean;
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
        page: EdtRoutesNameEnum.SECONDARY_ACTIVITY_SELECTION,
        stepNumber: 3,
        stepLabel: t("component.add-activity-stepper.step-3-label"),
        stepIcon: step3Icon,
        stepIconAlt: t("accessibility.asset.stepper.step-secondary-activity-alt"),
        isConditional: true,
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
        page: EdtRoutesNameEnum.WITH_SOMEONE_SELECTION,
        stepNumber: 5,
        stepLabel: t("component.add-activity-stepper.step-5-label"),
        stepIcon: step5Icon,
        stepIconAlt: t("accessibility.asset.stepper.step-with-someone-alt"),
        isConditional: true,
    },
    {
        page: EdtRoutesNameEnum.WITH_SCREEN,
        stepNumber: 6,
        stepLabel: t("component.add-activity-stepper.step-6-label"),
        stepIcon: step6Icon,
        stepIconAlt: t("accessibility.asset.stepper.step-with-screen-alt"),
    },
];

const loopActivityRouteStepperData: StepData[] = [
    {
        page: EdtRoutesNameEnum.ACTIVITY_DURATION,
        stepNumber: 1,
        stepLabel: t("component.add-activity-stepper.step-1-label"),
        stepIcon: step1Icon,
        stepIconAlt: t("accessibility.asset.stepper.step-activity-duration-alt"),
    },
    {
        page: EdtRoutesNameEnum.ROUTE,
        stepNumber: 2,
        stepLabel: t("component.add-activity-stepper.step-2-bis-label"),
        stepIcon: step2BisIcon,
        stepIconAlt: t("accessibility.asset.stepper.step-route-alt"),
    },
    {
        page: EdtRoutesNameEnum.MEAN_OF_TRANSPORT,
        stepNumber: 3,
        stepLabel: t("component.add-activity-stepper.step-3-bis-label"),
        stepIcon: step3BisIcon,
        stepIconAlt: t("accessibility.asset.stepper.step-mean-of-transport-alt"),
    },
    {
        page: EdtRoutesNameEnum.SECONDARY_ACTIVITY,
        stepNumber: 4,
        stepLabel: t("component.add-activity-stepper.step-3-label"),
        stepIcon: step3Icon,
        stepIconAlt: t("accessibility.asset.stepper.step-secondary-activity-alt"),
    },
    {
        page: EdtRoutesNameEnum.SECONDARY_ACTIVITY_SELECTION,
        stepNumber: 4,
        stepLabel: t("component.add-activity-stepper.step-3-label"),
        stepIcon: step3Icon,
        stepIconAlt: t("accessibility.asset.stepper.step-secondary-activity-alt"),
        isConditional: true,
    },
    {
        page: EdtRoutesNameEnum.WITH_SOMEONE,
        stepNumber: 5,
        stepLabel: t("component.add-activity-stepper.step-5-label"),
        stepIcon: step5Icon,
        stepIconAlt: t("accessibility.asset.stepper.step-with-someone-alt"),
    },
    {
        page: EdtRoutesNameEnum.WITH_SOMEONE_SELECTION,
        stepNumber: 5,
        stepLabel: t("component.add-activity-stepper.step-5-label"),
        stepIcon: step5Icon,
        stepIconAlt: t("accessibility.asset.stepper.step-with-someone-alt"),
        isConditional: true,
    },
    {
        page: EdtRoutesNameEnum.WITH_SCREEN,
        stepNumber: 6,
        stepLabel: t("component.add-activity-stepper.step-6-label"),
        stepIcon: step6Icon,
        stepIconAlt: t("accessibility.asset.stepper.step-with-screen-alt"),
    },
];

const getStepData = (page: EdtRoutesNameEnum, isRoute?: boolean): StepData => {
    if (isRoute) {
        return (
            loopActivityRouteStepperData.find(stepData => stepData.page === page) ??
            loopActivityRouteStepperData[0]
        );
    } else {
        return (
            loopActivityStepperData.find(stepData => stepData.page === page) ??
            loopActivityStepperData[0]
        );
    }
};

const getNextLoopPage = (currentPage: EdtRoutesNameEnum, isRoute?: boolean) => {
    const stepper = getStepper(isRoute);
    let index = stepper.find(stepData => stepData.page === currentPage)?.stepNumber ?? 0;
    let nextPage =
        stepper.find(stepData => stepData.stepNumber === index + 1 && !stepData.isConditional) ??
        stepper[1];
    return nextPage.page;
};

const getPreviousLoopPage = (currentPage: EdtRoutesNameEnum, isRoute?: boolean) => {
    const stepper = getStepper(isRoute);
    let index = stepper.find(stepData => stepData.page === currentPage)?.stepNumber ?? 0;
    let previousPage =
        stepper.find(stepData => stepData.stepNumber === index - 1 && !stepData.isConditional) ??
        stepper[1];
    return index > 0 ? previousPage.page : stepper[1].page;
};

const getLoopPageSubpage = (page: EdtRoutesNameEnum) => {
    return mappingPageOrchestrator.find(pageData => pageData.page === page)?.surveySubPage ?? "";
};

const getStepPage = (currentPage?: EdtRoutesNameEnum, isRoute?: boolean) => {
    const stepper = getStepper(isRoute);
    const step = stepper.find(stepData => stepData.page === currentPage);
    return step;
};

const getLastStep = (isRoute?: boolean) => {
    const stepper = getStepper(isRoute);
    return stepper[stepper.length - 1];
};

const getStepper = (isRoute?: boolean) => {
    return isRoute ? loopActivityRouteStepperData : loopActivityStepperData;
};

export {
    getLastStep,
    getLoopPageSubpage,
    getNextLoopPage,
    getPreviousLoopPage,
    getStepData,
    getStepPage,
    getStepper,
    loopActivityRouteStepperData,
    loopActivityStepperData,
};
