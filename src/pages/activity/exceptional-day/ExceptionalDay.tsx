import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import SurveyPage from "components/commons/SurveyPage/SurveyPage";
import { OrchestratorContext } from "interface/lunatic/Lunatic";
import { callbackHolder, OrchestratorForStories } from "orchestrator/Orchestrator";
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
import { getStepData } from "service/stepper.service";
import { getPrintedFirstName, saveData } from "service/survey-service";
import exceptionalDay from "assets/illustration/exceptional-day.svg";
import { CheckboxBooleanEdtSpecificProps } from "lunatic-edt";

const ExceptionalDayPage = () => {
    const context: OrchestratorContext = useOutletContext();
    const { t } = useTranslation();
    setEnviro(context, useNavigate(), callbackHolder);

    const currentPage = EdtRoutesNameEnum.EXCEPTIONAL_DAY;
    const stepData = getStepData(currentPage);

    const specificProps: CheckboxBooleanEdtSpecificProps = {
        onClick: () => {
            const save = saveData(context.idSurvey, callbackHolder.getData());
            save.then(() => {
                saveAndNextStep(EdtRoutesNameEnum.ACTIVITY, currentPage);
            });
        },
    };
    return (
        <SurveyPage
            onNavigateBack={() => saveAndNav()}
            onNext={() => saveAndNextStep(EdtRoutesNameEnum.ACTIVITY, currentPage)}
            onPrevious={() => saveAndNavFullPath(EdtRoutesNameEnum.KIND_OF_DAY)}
            firstName={getPrintedFirstName(context.idSurvey)}
            firstNamePrefix={t("component.survey-page-edit-header.week-of")}
            simpleHeader={true}
            simpleHeaderLabel={t("page.complementary-questions.simple-header-label")}
            srcIcon={exceptionalDay}
            altIcon={t("accessibility.asset.exceptional-day-alt")}
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
                    page={getOrchestratorPage(currentPage)}
                    componentSpecificProps={specificProps}
                ></OrchestratorForStories>
            </FlexCenter>
        </SurveyPage>
    );
};

export default ExceptionalDayPage;
