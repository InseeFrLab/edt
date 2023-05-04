import { makeStylesEdt } from "@inseefrlab/lunatic-edt";
import extension from "assets/illustration/mui-icon/extension.svg";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import FelicitationModal from "components/commons/Modal/FelicitationModal/FelicitationModal";
import { FORMAT_TIME, MINUTE_LABEL, START_TIME_DAY } from "constants/constants";
import { EdtRoutesNameEnum } from "enumerations/EdtRoutesNameEnum";
import { OrchestratorContext } from "interface/lunatic/Lunatic";
import { OrchestratorForStories, callbackHolder } from "orchestrator/Orchestrator";
import { SetStateAction, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useOutletContext } from "react-router";
import {
    getOrchestratorPage,
    saveAndNav,
    saveAndNavFullPath,
    saveAndNextStep,
    setEnviro,
    validateAndNextStep,
} from "service/navigation-service";
import { getLanguage } from "service/referentiel-service";
import { getStepData } from "service/stepper.service";
import { getPrintedFirstName, getPrintedSurveyDate } from "service/survey-service";
import SurveyPage from "../SurveyPage";

export interface SurveyPageStepProps {
    currentPage: EdtRoutesNameEnum;
    backRoute?: EdtRoutesNameEnum;
    nextRoute?: EdtRoutesNameEnum;
    isStep?: boolean;
    errorIcon?: string;
    errorAltIcon?: string;
    specifiquesProps?: any;
    disableButton?: boolean;
    withBottomPadding?: boolean;
}

const SurveyPageStep = (props: SurveyPageStepProps) => {
    const {
        currentPage,
        backRoute,
        nextRoute,
        isStep = true,
        errorIcon,
        errorAltIcon,
        specifiquesProps,
        disableButton,
        withBottomPadding = false,
    } = props;

    const { t } = useTranslation();
    const context: OrchestratorContext = useOutletContext();
    setEnviro(context, useNavigate(), callbackHolder);
    const { classes } = useStyles();

    const stepData = getStepData(currentPage);
    const [isModalDisplayed, setIsModalDisplayed] = useState<boolean>(false);

    const componentLunaticProps: any = {
        onSelectValue: () => validateAndNextStep(currentPage),
        options: specifiquesProps?.options,
        defaultIcon: specifiquesProps?.defaultIcon,
        icon: specifiquesProps?.icon,
        altIcon: t(specifiquesProps?.altIconLabel),
        language: getLanguage(),
        constants: {
            START_TIME_DAY: START_TIME_DAY,
            FORMAT_TIME: FORMAT_TIME,
            MINUTE_LABEL: MINUTE_LABEL,
        },
        extensionIcon: extension,
        extensionIconAlt: t("accessibility.asset.mui-icon.extension"),
    };

    const surveyPageStepProps = {
        onNavigateBack: useCallback(
            () =>
                specifiquesProps?.displayModal
                    ? validateAndNav(false, setIsModalDisplayed)
                    : saveAndNav(),
            [isModalDisplayed],
        ),
        onNext: useCallback(
            () =>
                specifiquesProps?.displayModal
                    ? validateAndNav(false, setIsModalDisplayed)
                    : saveAndNextStep(EdtRoutesNameEnum.ACTIVITY, currentPage),
            [isModalDisplayed],
        ),
        onPrevious: useCallback(() => (backRoute ? saveAndNavFullPath(backRoute) : saveAndNav()), []),
        simpleHeader: true,
        simpleHeaderLabel: t("page.complementary-questions.simple-header-label"),
        srcIcon: errorIcon,
        altIcon: errorAltIcon ? t(errorAltIcon) : undefined,
        displayStepper: true,
        currentStepNumber: stepData.stepNumber,
        currentStepLabel: stepData.stepLabel,
        backgroundWhiteHeader: true,
        disableNav: disableButton,
    };

    const surveyPageNotStepProps = {
        validate: useCallback(
            () =>
                nextRoute
                    ? saveAndNavFullPath(nextRoute)
                    : saveAndNextStep(context.surveyRootPage, currentPage),
            [],
        ),
        srcIcon: errorIcon,
        altIcon: errorAltIcon ? t(errorAltIcon) : undefined,
        onNavigateBack: useCallback(() => saveAndNav(), []),
        onPrevious: useCallback(() => (backRoute ? saveAndNavFullPath(backRoute) : saveAndNav()), []),
        firstName: getPrintedFirstName(context.idSurvey),
        surveyDate: getPrintedSurveyDate(context.idSurvey, context.surveyRootPage),
        disableNav: disableButton,
    };

    const orchestratorProps = {
        source: context.source,
        data: context.data,
        cbHolder: callbackHolder,
        page: getOrchestratorPage(currentPage, context.surveyRootPage),
        overrideOptions: specifiquesProps?.referentiel,
        componentSpecificProps: componentLunaticProps,
    };

    const validateAndNav = (
        forceQuit: boolean,
        setIsModalDisplayed: (value: SetStateAction<boolean>) => void,
    ): void => {
        if (forceQuit) {
            saveAndNav();
        } else {
            setIsModalDisplayed(true);
        }
    };

    const surveyPageProps = isStep ? surveyPageStepProps : surveyPageNotStepProps;

    return (
        <SurveyPage {...surveyPageProps}>
            <FlexCenter className={withBottomPadding ? classes.bottomPadding : ""}>
                <FelicitationModal
                    isModalDisplayed={isModalDisplayed}
                    onCompleteCallBack={useCallback(
                        () => validateAndNav(true, setIsModalDisplayed),
                        [isModalDisplayed],
                    )}
                    content={t("component.modal-edt.modal-felicitation.activity-content")}
                />
                <OrchestratorForStories {...orchestratorProps} />
            </FlexCenter>
        </SurveyPage>
    );
};

const useStyles = makeStylesEdt({ "name": { SurveyPageStep } })(() => ({
    bottomPadding: {
        paddingBottom: "6rem",
    },
}));

export default SurveyPageStep;
