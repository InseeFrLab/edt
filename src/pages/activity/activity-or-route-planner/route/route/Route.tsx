import errorIcon from "assets/illustration/error/activity.svg";
import option1 from "assets/illustration/route-categories/1.svg";
import option2 from "assets/illustration/route-categories/2.svg";
import option3 from "assets/illustration/route-categories/3.svg";
import option4 from "assets/illustration/route-categories/4.svg";
import option5 from "assets/illustration/route-categories/5.svg";
import option6 from "assets/illustration/route-categories/6.svg";
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
import {
    getCurrentNavigatePath,
    getLoopParameterizedNavigatePath,
    getOrchestratorPage,
    validateWithAlertAndNav,
} from "service/navigation-service";
import { getRouteRef } from "service/referentiel-service";
import { saveData } from "service/survey-service";

const RoutePage = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const context: OrchestratorContext = useOutletContext();
    const currentPage = EdtRoutesNameEnum.ROUTE;
    const stepData = getStepData(currentPage, true);
    const paramIteration = useParams().iteration;
    const currentIteration = paramIteration ? +paramIteration : 0;

    const saveAndLoopNavigate = (page: EdtRoutesNameEnum) => {
        saveData(context.idSurvey, callbackHolder.getData()).then(() => {
            loopNavigate(page);
        });
    };

    const onPrevious = () => {
        saveAndLoopNavigate(getPreviousLoopPage(currentPage, true));
    };

    const onNext = () => {
        saveAndLoopNavigate(getNextLoopPage(currentPage, true));
    };

    const [backClickEvent] = useState<React.MouseEvent>();
    const [nextClickEvent] = useState<React.MouseEvent>();
    const [isAlertDisplayed, setIsAlertDisplayed] = useState<boolean>(false);

    const alertLabels = {
        boldContent: t("page.alert-when-quit.activity.alert-content-bold"),
        content: t("page.alert-when-quit.route.alert-content"),
        cancel: t("page.alert-when-quit.alert-cancel"),
        complete: t("page.alert-when-quit.alert-complete"),
    };

    //TODO : check error popup with Marion
    const specificProps: IconGridCheckBoxOneSpecificProps = {
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
        backClickCallback: onPrevious,
        nextClickCallback: onNext,
        labels: {
            alertMessage: t("component.route-selecter.alert-message"),
            alertIgnore: t("component.route-selecter.alert-ignore"),
            alertComplete: t("component.route-selecter.alert-complete"),
            alertAlticon: t("component.route-selecter.alert-alt-icon"),
        },
        errorIcon: errorIcon,
    };

    const loopNavigate = (page: EdtRoutesNameEnum) => {
        navigate(getLoopParameterizedNavigatePath(page, LoopEnum.ACTIVITY_OR_ROUTE, currentIteration));
    };

    const onClose = (forceQuit: boolean) => {
        validateWithAlertAndNav(
            forceQuit,
            setIsAlertDisplayed,
            currentIteration,
            getCurrentNavigatePath(
                context.idSurvey,
                EdtRoutesNameEnum.ACTIVITY,
                getOrchestratorPage(EdtRoutesNameEnum.ACTIVITY_OR_ROUTE_PLANNER),
            ),
        );
    };

    return (
        <LoopSurveyPage
            onPrevious={onPrevious}
            onNext={onNext}
            onClose={() => onClose(false)}
            currentStepIcon={stepData.stepIcon}
            currentStepIconAlt={stepData.stepIconAlt}
            currentStepNumber={stepData.stepNumber}
            currentStepLabel={stepData.stepLabel}
            isRoute={true}
        >
            <FlexCenter>
                <Alert
                    isAlertDisplayed={isAlertDisplayed}
                    onCompleteCallBack={() => setIsAlertDisplayed(false)}
                    onCancelCallBack={onClose}
                    labels={alertLabels}
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
                    overrideOptions={getRouteRef()}
                ></OrchestratorForStories>
            </FlexCenter>
        </LoopSurveyPage>
    );
};

export default RoutePage;
