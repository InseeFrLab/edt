import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import SurveyPage from "components/commons/SurveyPage/SurveyPage";
import { OrchestratorContext } from "interface/lunatic/Lunatic";
import { CheckboxOneSpecificProps } from "lunatic-edt";
import { callbackHolder, OrchestratorForStories } from "orchestrator/Orchestrator";
import { useTranslation } from "react-i18next";
import { useNavigate, useOutletContext } from "react-router-dom";
import { EdtRoutesNameEnum } from "routes/EdtRoutesMapping";
import {
    getCurrentNavigatePath,
    getFullNavigatePath,
    getNextPage,
    getOrchestratorPage,
} from "service/navigation-service";
import { getStepData } from "service/stepper.service";
import { getActivitesSelectedLabel } from "service/survey-activity-service";
import { getPrintedFirstName, saveData } from "service/survey-service";

const GreatestActivityDayPage = () => {
    const context: OrchestratorContext = useOutletContext();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const currentPage = EdtRoutesNameEnum.GREATEST_ACTIVITY_DAY;
    const stepData = getStepData(currentPage);
    const activites = getActivitesSelectedLabel(context.idSurvey);

    const specificProps: CheckboxOneSpecificProps = {
        options: activites.map(activity => {
            return { label: activity, value: activity };
        }),
        defaultIcon: true,
    };

    const saveAndGoHome = (): void => {
        saveData(context.idSurvey, callbackHolder.getData()).then(() => {
            navigate(
                getCurrentNavigatePath(
                    context.idSurvey,
                    EdtRoutesNameEnum.ACTIVITY,
                    context.source.maxPage,
                    undefined,
                    undefined,
                    undefined,
                    getNextPage(currentPage),
                ),
            );
        });
    };

    const onPrevious = () => {
        saveData(context.idSurvey, callbackHolder.getData()).then(() => {
            navigate(getFullNavigatePath(context.idSurvey, EdtRoutesNameEnum.ACTIVITY_OR_ROUTE_PLANNER));
        });
    };

    const onClose = () => {
        saveData(context.idSurvey, callbackHolder.getData()).then(() => {
            navigate("/");
        });
    };

    return (
        <SurveyPage
            onNavigateBack={onClose}
            onNext={saveAndGoHome}
            onPrevious={onPrevious}
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

export default GreatestActivityDayPage;
