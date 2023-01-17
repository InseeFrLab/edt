import bagIcon from "assets/illustration/type-of-day-categories/bag.svg";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import SurveyPage from "components/commons/SurveyPage/SurveyPage";
import { OrchestratorContext } from "interface/lunatic/Lunatic";
import { CheckboxOneSpecificProps } from "lunatic-edt";
import { callbackHolder, OrchestratorForStories } from "orchestrator/Orchestrator";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useOutletContext } from "react-router-dom";
import { EdtRoutesNameEnum } from "routes/EdtRoutesMapping";
import {
    getOrchestratorPage,
    saveAndNav,
    saveAndNavFullPath,
    saveAndNextStep,
    setEnviro,
} from "service/navigation-service";
import { getKindOfDayRef } from "service/referentiel-service";
import { getStepData } from "service/stepper.service";
import { getPrintedFirstName } from "service/survey-service";

const KindOfDayPage = () => {
    const context: OrchestratorContext = useOutletContext();
    const { t } = useTranslation();
    setEnviro(context, useNavigate(), callbackHolder);

    const currentPage = EdtRoutesNameEnum.KIND_OF_DAY;
    const stepData = getStepData(currentPage);

    const specificProps: CheckboxOneSpecificProps = {
        icon: bagIcon,
    };

    return (
        <SurveyPage
            onNavigateBack={useCallback(() => saveAndNav(), [])}
            onNext={useCallback(() => saveAndNextStep(EdtRoutesNameEnum.ACTIVITY, currentPage), [])}
            onPrevious={useCallback(() => saveAndNavFullPath(EdtRoutesNameEnum.WORST_ACTIVITY_DAY), [])}
            firstName={getPrintedFirstName(context.idSurvey)}
            firstNamePrefix={t("component.survey-page-edit-header.week-of")}
            simpleHeader={true}
            simpleHeaderLabel={t("page.complementary-questions.simple-header-label")}
            displayStepper={true}
            currentStepNumber={stepData.stepNumber}
            currentStepLabel={stepData.stepLabel}
            backgroundWhiteHeader={true}
        >
            <FlexCenter>
                <OrchestratorForStories
                    source={context.source}
                    data={context.data}
                    cbHolder={callbackHolder}
                    componentSpecificProps={specificProps}
                    page={getOrchestratorPage(currentPage)}
                    overrideOptions={getKindOfDayRef()}
                ></OrchestratorForStories>
            </FlexCenter>
        </SurveyPage>
    );
};

export default KindOfDayPage;
