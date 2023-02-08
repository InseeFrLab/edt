import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import FelicitationModal from "components/commons/Modal/FelicitationModal/FelicitationModal";
import { EdtRoutesNameEnum } from "enumerations/EdtRoutesNameEnum";
import { OrchestratorContext } from "interface/lunatic/Lunatic";
import { callbackHolder, OrchestratorForStories } from "orchestrator/Orchestrator";
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
    } = props;

    const { t } = useTranslation();
    const context: OrchestratorContext = useOutletContext();
    setEnviro(context, useNavigate(), callbackHolder);

    const stepData = getStepData(currentPage);
    const [isModalDisplayed, setIsModalDisplayed] = useState<boolean>(false);

    const componentLunaticProps: any = {
        onSelectValue: () => validateAndNextStep(currentPage),
        options: specifiquesProps?.options,
        defaultIcon: specifiquesProps?.defaultIcon,
        icon: specifiquesProps?.icon,
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
        firstName: getPrintedFirstName(context.idSurvey),
        firstNamePrefix: t("component.survey-page-edit-header.week-of"),
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
            <FlexCenter>
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

export default SurveyPageStep;
