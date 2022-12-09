import InfoIcon from "assets/illustration/info.svg";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import LoopSurveyPage from "components/commons/LoopSurveyPage/LoopSurveyPage";
import { OrchestratorContext } from "interface/lunatic/Lunatic";
import { Info } from "lunatic-edt";
import { callbackHolder, OrchestratorForStories } from "orchestrator/Orchestrator";
import { useTranslation } from "react-i18next";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { EdtRoutesNameEnum } from "routes/EdtRoutesMapping";
import { getLoopInitialPage, LoopEnum } from "service/loop-service";
import { getNextLoopPage, getPreviousLoopPage, getStepData } from "service/loop-stepper-service";
import { getCurrentNavigatePath, getLoopParameterizedNavigatePath } from "service/navigation-service";
import { FieldNameEnum, getValue, saveData } from "service/survey-service";

const SecondaryActivityPage = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const context: OrchestratorContext = useOutletContext();
    const currentPage = EdtRoutesNameEnum.SECONDARY_ACTIVITY;
    const stepData = getStepData(currentPage);
    const paramIteration = useParams().iteration;
    const currentIteration = paramIteration ? +paramIteration : 0;

    const loopNavigate = (page: EdtRoutesNameEnum) => {
        navigate(
            getLoopParameterizedNavigatePath(
                page,
                context.idSurvey,
                LoopEnum.ACTIVITY,
                currentIteration,
            ),
        );
    };

    const saveAndGoToActivityPlanner = () => {
        saveData(context.idSurvey, callbackHolder.getData()).then(() => {
            navigate(getCurrentNavigatePath(context.idSurvey, EdtRoutesNameEnum.ACTIVITY, "3"));
        });
    };

    const onNext = () => {
        saveData(context.idSurvey, callbackHolder.getData()).then(() => {
            const hasSecondaryActivity = getValue(
                context.idSurvey,
                FieldNameEnum.WITHSECONDARYACTIVITY,
                currentIteration,
            );
            if (hasSecondaryActivity) {
                loopNavigate(EdtRoutesNameEnum.SECONDARY_ACTIVITY_SELECTION);
            } else {
                loopNavigate(getNextLoopPage(currentPage));
            }
        });
    };

    const onPrevious = () => {
        saveData(context.idSurvey, callbackHolder.getData()).then(() => {
            const goal = getValue(context.idSurvey, FieldNameEnum.GOAL, currentIteration);

            if (goal === "" || goal) {
                loopNavigate(EdtRoutesNameEnum.MAIN_ACTIVITY_GOAL);
            } else {
                loopNavigate(getPreviousLoopPage(currentPage));
            }
        });
    };

    return (
        <LoopSurveyPage
            onNext={onNext}
            onPrevious={onPrevious}
            onClose={saveAndGoToActivityPlanner}
            currentStepIcon={stepData.stepIcon}
            currentStepIconAlt={stepData.stepIconAlt}
            currentStepNumber={stepData.stepNumber}
            currentStepLabel={stepData.stepLabel}
        >
            <FlexCenter>
                <OrchestratorForStories
                    source={context.source}
                    data={context.data}
                    callbackHolder={callbackHolder}
                    page={getLoopInitialPage(LoopEnum.ACTIVITY)}
                    subPage={(stepData.stepNumber + 1).toString()}
                    iteration={currentIteration}
                ></OrchestratorForStories>
            </FlexCenter>
            <FlexCenter>
                <Info
                    normalText={t("page.secondary-activity.info-light")}
                    boldText={t("page.secondary-activity.info-bold")}
                    infoIcon={InfoIcon}
                    infoIconAlt={t("accessibility.asset.info.info-alt")}
                />
            </FlexCenter>
        </LoopSurveyPage>
    );
};

export default SecondaryActivityPage;
