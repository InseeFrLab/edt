import bagIcon from "assets/illustration/type-of-day-categories/bag.svg";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import SurveyPage from "components/commons/SurveyPage/SurveyPage";
import { OrchestratorContext } from "interface/lunatic/Lunatic";
import { CheckboxGroupSpecificProps } from "lunatic-edt";
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
import { getPrintedFirstName } from "service/survey-service";

const KindOfDayPage = () => {
    const context: OrchestratorContext = useOutletContext();
    const { t } = useTranslation();
    setEnviro(context, useNavigate(), callbackHolder);

    const currentPage = EdtRoutesNameEnum.KIND_OF_DAY;
    const stepData = getStepData(currentPage);

    const specificProps: CheckboxGroupSpecificProps = {
        optionsIcons: {
            "1": bagIcon,
            "2": bagIcon,
            "3": bagIcon,
            "4": bagIcon,
        },
    };

    return (
        <SurveyPage
            onNavigateBack={() => saveAndNav()}
            onNext={() => saveAndNextStep(EdtRoutesNameEnum.ACTIVITY, currentPage)}
            onPrevious={() => saveAndNavFullPath(EdtRoutesNameEnum.WORST_ACTIVITY_DAY)}
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
                    callbackHolder={callbackHolder}
                    componentSpecificProps={specificProps}
                    page={getOrchestratorPage(currentPage)}
                ></OrchestratorForStories>
            </FlexCenter>
        </SurveyPage>
    );
};

export default KindOfDayPage;
