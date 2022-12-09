import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import LoopSurveyPage from "components/commons/LoopSurveyPage/LoopSurveyPage";
import { OrchestratorContext } from "interface/lunatic/Lunatic";
import { IconGridCheckBoxOneSpecificProps } from "lunatic-edt";
import { callbackHolder, OrchestratorForStories } from "orchestrator/Orchestrator";
import { useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { EdtRoutesNameEnum } from "routes/EdtRoutesMapping";
import { getLoopInitialPage, LoopEnum } from "service/loop-service";
import { getNextLoopPage, getPreviousLoopPage, getStepData } from "service/loop-stepper-service";
import { getCurrentNavigatePath, getLoopParameterizedNavigatePath } from "service/navigation-service";
import { FieldNameEnum, getValue, saveData } from "service/survey-service";

import option1 from "assets/illustration/locations/1.svg";
import option2 from "assets/illustration/locations/2.svg";
import option3 from "assets/illustration/locations/3.svg";
import option4 from "assets/illustration/locations/4.svg";
import option5 from "assets/illustration/locations/5.svg";
import option6 from "assets/illustration/locations/6.svg";
import { useTranslation } from "react-i18next";

const ActivityLocationPage = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const context: OrchestratorContext = useOutletContext();
    const currentPage = EdtRoutesNameEnum.ACTIVITY_LOCATION;
    const stepData = getStepData(currentPage);
    const paramIteration = useParams().iteration;
    const currentIteration = paramIteration ? +paramIteration : 0;

    const [backClickEvent, setBackClickEvent] = useState<React.MouseEvent>();
    const [nextClickEvent, setNextClickEvent] = useState<React.MouseEvent>();

    const specificProps: IconGridCheckBoxOneSpecificProps = {
        optionsIcons: {
            "11": option1,
            "12": option2,
            "14": option3,
            "15": option4,
            "13": option5,
            "16": option6,
        },
        backClickEvent: backClickEvent,
        nextClickEvent: nextClickEvent,
        backClickCallback: () => {
            saveData(context.idSurvey, callbackHolder.getData()).then(() => {
                const hasSecondaryActivity = getValue(
                    context.idSurvey,
                    FieldNameEnum.WITHSECONDARYACTIVITY,
                    currentIteration,
                );
                if (hasSecondaryActivity) {
                    loopNavigate(EdtRoutesNameEnum.SECONDARY_ACTIVITY_SELECTION);
                } else {
                    loopNavigate(getPreviousLoopPage(currentPage));
                }
            });
        },
        nextClickCallback: () => {
            saveAndLoopNavigate(getNextLoopPage(currentPage));
        },
        labels: {
            alertMessage: t("component.location-selecter.alert-message"),
            alertIgnore: t("component.location-selecter.alert-ignore"),
            alertComplete: t("component.location-selecter.alert-complete"),
        },
    };

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

    const saveAndLoopNavigate = (page: EdtRoutesNameEnum) => {
        saveData(context.idSurvey, callbackHolder.getData()).then(() => {
            loopNavigate(page);
        });
    };

    const saveAndGoToActivityPlanner = () => {
        saveData(context.idSurvey, callbackHolder.getData()).then(() => {
            navigate(getCurrentNavigatePath(context.idSurvey, EdtRoutesNameEnum.ACTIVITY, "3"));
        });
    };

    const onNext = (e: React.MouseEvent) => {
        setNextClickEvent(e);
    };

    const onPrevious = (e: React.MouseEvent) => {
        setBackClickEvent(e);
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
                    componentSpecificProps={specificProps}
                ></OrchestratorForStories>
            </FlexCenter>
        </LoopSurveyPage>
    );
};

export default ActivityLocationPage;
