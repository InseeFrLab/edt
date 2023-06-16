import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import SurveyPage from "components/commons/SurveyPage/SurveyPage";
import { FORMAT_TIME, MINUTE_LABEL, START_TIME_DAY } from "constants/constants";
import { EdtRoutesNameEnum } from "enumerations/EdtRoutesNameEnum";
import { OrchestratorContext } from "interface/lunatic/Lunatic";
import { callbackHolder, OrchestratorForStories } from "orchestrator/Orchestrator";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
    getNavigatePath,
    getOrchestratorPage,
    getParameterizedNavigatePath,
    saveAndNav,
    saveAndNavFullPath,
    setEnviro,
    validateAndNextStep,
} from "service/navigation-service";
import { getLanguage } from "service/referentiel-service";
import { getStepData } from "service/stepper.service";
import { surveyReadOnly } from "service/survey-activity-service";

const PhoneTimePage = () => {
    const currentPage = EdtRoutesNameEnum.PHONE_TIME;
    const context: OrchestratorContext = useOutletContext();
    const { t } = useTranslation();
    setEnviro(context, useNavigate(), callbackHolder);

    const stepData = getStepData(currentPage);

    const surveyPageStepProps = {
        onNavigateBack: useCallback(() => saveAndNav(), []),
        onNext: useCallback(
            () =>
                saveAndNav(
                    getParameterizedNavigatePath(EdtRoutesNameEnum.ACTIVITY, context.idSurvey) +
                        getNavigatePath(EdtRoutesNameEnum.END_SURVEY),
                ),
            [],
        ),
        onPrevious: useCallback(
            () =>
                context.surveyRootPage == EdtRoutesNameEnum.ACTIVITY
                    ? saveAndNavFullPath(EdtRoutesNameEnum.TRAVEL_TIME)
                    : saveAndNavFullPath(EdtRoutesNameEnum.WEEKLY_PLANNER),
            [],
        ),
        simpleHeader: true,
        simpleHeaderLabel: t("page.complementary-questions.simple-header-label"),
        displayStepper: true,
        currentStepNumber: stepData.stepNumber,
        currentStepLabel: stepData.stepLabel,
        backgroundWhiteHeader: true,
        modifiable: !surveyReadOnly(context.rightsSurvey),
    };

    const componentLunaticProps: any = {
        onSelectValue: () => validateAndNextStep(currentPage),
        language: getLanguage(),
        constants: {
            START_TIME_DAY: START_TIME_DAY,
            FORMAT_TIME: FORMAT_TIME,
            MINUTE_LABEL: MINUTE_LABEL,
        },
    };

    const orchestratorProps = {
        source: context.source,
        data: context.data,
        cbHolder: callbackHolder,
        page: getOrchestratorPage(currentPage, context.surveyRootPage),
        componentSpecificProps: componentLunaticProps,
    };

    return (
        <SurveyPage {...surveyPageStepProps}>
            <FlexCenter>
                <OrchestratorForStories {...orchestratorProps} />
            </FlexCenter>
        </SurveyPage>
    );
};

export default PhoneTimePage;
