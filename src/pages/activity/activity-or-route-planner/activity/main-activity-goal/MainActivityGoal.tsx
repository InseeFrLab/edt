import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import LoopSurveyPage from "components/commons/LoopSurveyPage/LoopSurveyPage";
import { OrchestratorContext } from "interface/lunatic/Lunatic";
import { callbackHolder, OrchestratorForStories } from "orchestrator/Orchestrator";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { EdtRoutesNameEnum } from "routes/EdtRoutesMapping";
import { getLoopInitialPage, LoopEnum } from "service/loop-service";
import { onClose, onNext, onPrevious, saveAndLoopNavigate, setEnviro } from "service/navigation-service";

import errorIcon from "assets/illustration/error/activity.svg";
import option1 from "assets/illustration/goals/1.svg";
import option2 from "assets/illustration/goals/2.svg";
import option3 from "assets/illustration/goals/3.svg";
import option4 from "assets/illustration/goals/4.svg";

import { Alert, IconGridCheckBoxOneSpecificProps } from "lunatic-edt";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { getLabels, getLabelsWhenQuit } from "service/alert-service";
import { getLoopPageSubpage, getStepData } from "service/loop-stepper-service";

const MainActivityGoalPage = () => {
    const { t } = useTranslation();
    const context: OrchestratorContext = useOutletContext();
    setEnviro(context, useNavigate(), callbackHolder);

    const currentPage = EdtRoutesNameEnum.MAIN_ACTIVITY_GOAL;
    const stepData = getStepData(currentPage, context.isRoute);

    const paramIteration = useParams().iteration;
    const currentIteration = paramIteration ? +paramIteration : 0;

    const [backClickEvent, setBackClickEvent] = useState<React.MouseEvent>();
    const [nextClickEvent, setNextClickEvent] = useState<React.MouseEvent>();
    const [isAlertDisplayed, setIsAlertDisplayed] = useState<boolean>(false);

    const specificProps: IconGridCheckBoxOneSpecificProps = {
        optionsIcons: {
            "1": option1,
            "2": option2,
            "3": option3,
            "4": option4,
        },
        backClickEvent: backClickEvent,
        nextClickEvent: nextClickEvent,
        backClickCallback: () => {
            saveAndLoopNavigate(
                EdtRoutesNameEnum.MAIN_ACTIVITY,
                LoopEnum.ACTIVITY_OR_ROUTE,
                currentIteration,
            );
        },
        nextClickCallback: () => {
            saveAndLoopNavigate(
                EdtRoutesNameEnum.SECONDARY_ACTIVITY,
                LoopEnum.ACTIVITY_OR_ROUTE,
                currentIteration,
            );
        },
        labels: getLabels("goal-selecter"),
        errorIcon: errorIcon,
    };

    return (
        <LoopSurveyPage
            onNext={e => onNext(e, setNextClickEvent)}
            onPrevious={e => onPrevious(e, setBackClickEvent)}
            onClose={() => onClose(false, setIsAlertDisplayed, currentIteration)}
            displayStepper={false}
            currentStepLabel={t("component.add-activity-stepper.step-2-label")}
        >
            <FlexCenter>
                <Alert
                    isAlertDisplayed={isAlertDisplayed}
                    onCompleteCallBack={() => setIsAlertDisplayed(false)}
                    onCancelCallBack={cancel => onClose(cancel, setIsAlertDisplayed, currentIteration)}
                    labels={getLabelsWhenQuit()}
                    icon={errorIcon}
                    errorIconAlt={t("page.alert-when-quit.alt-alert-icon")}
                ></Alert>
                <OrchestratorForStories
                    source={context.source}
                    data={context.data}
                    cbHolder={callbackHolder}
                    page={getLoopInitialPage(LoopEnum.ACTIVITY_OR_ROUTE)}
                    subPage={getLoopPageSubpage(currentPage)}
                    iteration={currentIteration}
                    componentSpecificProps={specificProps}
                ></OrchestratorForStories>
            </FlexCenter>
        </LoopSurveyPage>
    );
};

export default MainActivityGoalPage;
