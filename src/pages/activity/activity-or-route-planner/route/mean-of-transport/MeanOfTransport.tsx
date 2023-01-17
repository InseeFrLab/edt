import meanOfTransportErrorIcon from "assets/illustration/error/mean-of-transport.svg";
import option1 from "assets/illustration/mean-of-transport-categories/1.svg";
import option2 from "assets/illustration/mean-of-transport-categories/2.svg";
import option3 from "assets/illustration/mean-of-transport-categories/3.svg";
import option4 from "assets/illustration/mean-of-transport-categories/4.svg";
import option5 from "assets/illustration/mean-of-transport-categories/5.svg";
import option6 from "assets/illustration/mean-of-transport-categories/6.svg";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import LoopSurveyPage from "components/commons/LoopSurveyPage/LoopSurveyPage";
import { OrchestratorContext } from "interface/lunatic/Lunatic";
import { Alert, CheckboxGroupSpecificProps } from "lunatic-edt";
import { callbackHolder, OrchestratorForStories } from "orchestrator/Orchestrator";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { EdtRoutesNameEnum } from "routes/EdtRoutesMapping";
import { getLabels, getLabelsWhenQuit } from "service/alert-service";
import { getLoopInitialPage, LoopEnum } from "service/loop-service";
import {
    getLoopPageSubpage,
    getNextLoopPage,
    getPreviousLoopPage,
    getStepData,
} from "service/loop-stepper-service";
import { onClose, onNext, onPrevious, saveAndLoopNavigate, setEnviro } from "service/navigation-service";

const MeanOfTransportPage = () => {
    const { t } = useTranslation();
    const context: OrchestratorContext = useOutletContext();
    setEnviro(context, useNavigate(), callbackHolder);

    const currentPage = EdtRoutesNameEnum.MEAN_OF_TRANSPORT;
    const stepData = getStepData(currentPage, true);
    const paramIteration = useParams().iteration;
    const currentIteration = paramIteration ? +paramIteration : 0;

    const [backClickEvent, setBackClickEvent] = useState<React.MouseEvent>();
    const [nextClickEvent, setNextClickEvent] = useState<React.MouseEvent>();
    const [isAlertDisplayed, setIsAlertDisplayed] = useState<boolean>(false);

    const specificProps: CheckboxGroupSpecificProps = {
        optionsIcons: {
            "1": option1,
            "2": option2,
            "3": option3,
            "4": option4,
            "5": option5,
            "6": option6,
        },
        backClickEvent: backClickEvent,
        nextClickEvent: nextClickEvent,
        backClickCallback: () => {
            saveAndLoopNavigate(
                getPreviousLoopPage(currentPage, true),
                LoopEnum.ACTIVITY_OR_ROUTE,
                currentIteration,
            );
        },
        nextClickCallback: () => {
            saveAndLoopNavigate(
                getNextLoopPage(currentPage, true),
                LoopEnum.ACTIVITY_OR_ROUTE,
                currentIteration,
            );
        },
        labels: getLabels("mean-of-transport-selecter"),
        errorIcon: meanOfTransportErrorIcon,
    };

    return (
        <LoopSurveyPage
            onNext={useCallback((e: React.MouseEvent) => onNext(e, setNextClickEvent), [])}
            onPrevious={useCallback((e: React.MouseEvent) => onPrevious(e, setBackClickEvent), [])}
            onClose={useCallback(() => onClose(false, setIsAlertDisplayed, currentIteration), [])}
            currentStepIcon={stepData.stepIcon}
            currentStepIconAlt={stepData.stepIconAlt}
            currentStepNumber={stepData.stepNumber}
            currentStepLabel={stepData.stepLabel}
            isRoute={true}
        >
            <FlexCenter>
                <Alert
                    isAlertDisplayed={isAlertDisplayed}
                    onCompleteCallBack={useCallback(() => setIsAlertDisplayed(false), [])}
                    onCancelCallBack={useCallback(
                        cancel => onClose(cancel, setIsAlertDisplayed, currentIteration),
                        [],
                    )}
                    labels={getLabelsWhenQuit(true)}
                    icon={meanOfTransportErrorIcon}
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

export default MeanOfTransportPage;
