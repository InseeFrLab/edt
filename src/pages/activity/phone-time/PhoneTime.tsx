import FlexCenter from "../../../components/commons/FlexCenter/FlexCenter";
import SurveyPage from "../../../components/commons/SurveyPage/SurveyPage";
import { FORMAT_TIME, MINUTE_LABEL, START_TIME_DAY } from "../../../constants/constants";
import { EdtRoutesNameEnum } from "../../../enumerations/EdtRoutesNameEnum";
import { OrchestratorContext } from "../../../interface/lunatic/Lunatic";
import { OrchestratorForStories, callbackHolder } from "../../../orchestrator/Orchestrator";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import {
    getNavigatePath,
    getOrchestratorPage,
    getParameterizedNavigatePath,
    saveAndNavLocally,
    saveAndNavFullPath,
    setEnviro,
    validateAndNextStep,
} from "../../../service/navigation-service";
import { getLanguage } from "../../../service/referentiel-service";
import { getStepData } from "../../../service/stepper.service";
import { surveyReadOnly } from "../../../service/survey-activity-service";
import { getData } from "../../../service/survey-service";
import { getSurveyIdFromUrl } from "../../../utils/utils";

const PhoneTimePage = () => {
    const currentPage = EdtRoutesNameEnum.PHONE_TIME;
    const context: OrchestratorContext = useOutletContext();
    const location = useLocation();
    const idSurvey = getSurveyIdFromUrl(context, location);
    const { t } = useTranslation();
    setEnviro(context, useNavigate(), callbackHolder);

    const stepData = getStepData(currentPage);

    const surveyPageStepProps = {
        idSurvey: idSurvey,
        onNavigateBack: useCallback(() => saveAndNavLocally(idSurvey), []),
        onNext: useCallback(
            () =>
                saveAndNavLocally(
                    idSurvey,
                    getParameterizedNavigatePath(EdtRoutesNameEnum.ACTIVITY, idSurvey) +
                        getNavigatePath(EdtRoutesNameEnum.END_SURVEY),
                ),
            [],
        ),
        onPrevious: useCallback(
            () =>
                context.surveyRootPage == EdtRoutesNameEnum.ACTIVITY
                    ? saveAndNavFullPath(idSurvey, EdtRoutesNameEnum.TRAVEL_TIME)
                    : saveAndNavFullPath(idSurvey, EdtRoutesNameEnum.WEEKLY_PLANNER),
            [],
        ),
        simpleHeader: true,
        simpleHeaderLabel: t("page.complementary-questions.simple-header-label"),
        displayStepper: true,
        currentStepNumber: stepData.stepNumber,
        currentStepLabel: stepData.stepLabel,
        backgroundWhiteHeader: true,
    };

    const componentLunaticProps: any = {
        onSelectValue: () => validateAndNextStep(idSurvey, context.source, currentPage),
        language: getLanguage(),
        constants: {
            START_TIME_DAY: START_TIME_DAY,
            FORMAT_TIME: FORMAT_TIME,
            MINUTE_LABEL: MINUTE_LABEL,
        },
        modifiable: !surveyReadOnly(context.rightsSurvey),
    };

    const orchestratorProps = {
        source: context.source,
        data: getData(idSurvey),
        cbHolder: callbackHolder,
        page: getOrchestratorPage(currentPage, context.surveyRootPage),
        componentSpecificProps: componentLunaticProps,
        idSurvey: idSurvey,
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
