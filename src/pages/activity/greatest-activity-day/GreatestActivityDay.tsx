import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import SurveyPage from "components/commons/SurveyPage/SurveyPage";
import { OrchestratorContext } from "interface/lunatic/Lunatic";
import { CheckboxOneSpecificProps } from "lunatic-edt";
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
import { getActivitesSelectedLabel } from "service/survey-activity-service";
import { getPrintedFirstName, saveData } from "service/survey-service";
import greatestActivityDay from "assets/illustration/greatest-activity-day.svg";

const GreatestActivityDayPage = () => {
    const context: OrchestratorContext = useOutletContext();
    const { t } = useTranslation();
    setEnviro(context, useNavigate(), callbackHolder);

    const currentPage = EdtRoutesNameEnum.GREATEST_ACTIVITY_DAY;
    const stepData = getStepData(currentPage);
    const activites = getActivitesSelectedLabel(context.idSurvey);

    const specificProps: CheckboxOneSpecificProps = {
        options: activites.map(activity => {
            return { label: activity, value: activity };
        }),
        defaultIcon: true,
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
            onPrevious={() => saveAndNavFullPath(EdtRoutesNameEnum.ACTIVITY_OR_ROUTE_PLANNER)}
            firstName={getPrintedFirstName(context.idSurvey)}
            firstNamePrefix={t("component.survey-page-edit-header.week-of")}
            simpleHeader={true}
            simpleHeaderLabel={t("page.complementary-questions.simple-header-label")}
            srcIcon={greatestActivityDay}
            altIcon={t("accessibility.asset.greatest-activity-day-alt")}
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
                ></OrchestratorForStories>
            </FlexCenter>
        </SurveyPage>
    );
};

export default GreatestActivityDayPage;
