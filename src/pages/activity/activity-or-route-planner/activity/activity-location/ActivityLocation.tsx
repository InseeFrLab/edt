import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import LoopSurveyPage from "components/commons/LoopSurveyPage/LoopSurveyPage";
import { OrchestratorContext } from "interface/lunatic/Lunatic";
import { Alert, IconGridCheckBoxOneSpecificProps } from "lunatic-edt";
import { callbackHolder, OrchestratorForStories } from "orchestrator/Orchestrator";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { EdtRoutesNameEnum } from "routes/EdtRoutesMapping";
import { getLoopInitialPage, LoopEnum } from "service/loop-service";
import {
    getLoopPageSubpage,
    getNextLoopPage,
    getPreviousLoopPage,
    getStepData,
} from "service/loop-stepper-service";
import { onClose, onNext, onPrevious, saveAndLoopNavigate, setEnviro } from "service/navigation-service";
import { FieldNameEnum } from "service/survey-service";
import errorIcon from "assets/illustration/error/activity.svg";
import locationErrorIcon from "assets/illustration/error/location.svg";
import option1 from "assets/illustration/locations/1.svg";
import option2 from "assets/illustration/locations/2.svg";
import option3 from "assets/illustration/locations/3.svg";
import option4 from "assets/illustration/locations/4.svg";
import option5 from "assets/illustration/locations/5.svg";
import option6 from "assets/illustration/locations/6.svg";
import { getLabels, getLabelsWhenQuit } from "service/alert-service";
import { getPlaceRef } from "service/referentiel-service";

const ActivityLocationPage = () => {
    const { t } = useTranslation();
    const context: OrchestratorContext = useOutletContext();
    setEnviro(context, useNavigate(), callbackHolder);

    const currentPage = EdtRoutesNameEnum.ACTIVITY_LOCATION;
    const stepData = getStepData(currentPage);
    const paramIteration = useParams().iteration;
    const currentIteration = paramIteration ? +paramIteration : 0;

    const [backClickEvent, setBackClickEvent] = useState<React.MouseEvent>();
    const [nextClickEvent, setNextClickEvent] = useState<React.MouseEvent>();
    const [isAlertDisplayed, setIsAlertDisplayed] = useState<boolean>(false);

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
            saveAndLoopNavigate(
                EdtRoutesNameEnum.SECONDARY_ACTIVITY_SELECTION,
                LoopEnum.ACTIVITY_OR_ROUTE,
                currentIteration,
                FieldNameEnum.WITHSECONDARYACTIVITY,
                getPreviousLoopPage(currentPage),
            );
        },
        nextClickCallback: () => {
            saveAndLoopNavigate(
                getNextLoopPage(currentPage),
                LoopEnum.ACTIVITY_OR_ROUTE,
                currentIteration,
            );
        },
        labels: getLabels("location-selecter"),
        errorIcon: locationErrorIcon,
    };

    return (
        <LoopSurveyPage
            onNext={e => onNext(e, setNextClickEvent)}
            onPrevious={e => onPrevious(e, setBackClickEvent)}
            onClose={() => onClose(false, setIsAlertDisplayed, currentIteration)}
            currentStepIcon={stepData.stepIcon}
            currentStepIconAlt={stepData.stepIconAlt}
            currentStepNumber={stepData.stepNumber}
            currentStepLabel={stepData.stepLabel}
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
                    overrideOptions={getPlaceRef()}
                    componentSpecificProps={specificProps}
                ></OrchestratorForStories>
            </FlexCenter>
        </LoopSurveyPage>
    );
};

export default ActivityLocationPage;
