import errorIcon from "assets/illustration/error/activity.svg";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import LoopSurveyPage from "components/commons/LoopSurveyPage/LoopSurveyPage";
import { OrchestratorContext } from "interface/lunatic/Lunatic";
import { Alert } from "lunatic-edt";
import { callbackHolder, OrchestratorForStories } from "orchestrator/Orchestrator";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { EdtRoutesNameEnum } from "routes/EdtRoutesMapping";
import { getLoopInitialPage, LoopEnum } from "service/loop-service";
import { getLoopPageSubpage, getStepData } from "service/loop-stepper-service";
import {
    getCurrentNavigatePath,
    getLoopParameterizedNavigatePath,
    getOrchestratorPage,
    saveAndNav,
    setEnviro,
    validateWithAlertAndNav,
} from "service/navigation-service";
import {
    getActivitySecondaryActivityRef,
    getRouteSecondaryActivityRef,
} from "service/referentiel-service";
import {
    FieldNameEnum,
    getValue,
    addToSecondaryActivityReferentiel,
    ReferentielsEnum,
} from "service/survey-service";
import { CheckboxOneCustomOption, CheckboxOneSpecificProps } from "lunatic-edt";

const SecondaryActivitySelectionPage = () => {
    const context: OrchestratorContext = useOutletContext();
    setEnviro(context, useNavigate(), callbackHolder);
    const { t } = useTranslation();
    const currentPage = EdtRoutesNameEnum.SECONDARY_ACTIVITY_SELECTION;
    const stepData = getStepData(currentPage, context.isRoute);
    const paramIteration = useParams().iteration;
    const currentIteration = paramIteration ? +paramIteration : 0;
    const isRoute = getValue(context.idSurvey, FieldNameEnum.ISROUTE, currentIteration) as boolean;

    const [backClickEvent, setBackClickEvent] = useState<React.MouseEvent>();
    const [nextClickEvent, setNextClickEvent] = useState<React.MouseEvent>();
    const [isAlertDisplayed, setIsAlertDisplayed] = useState<boolean>(false);

    const specificProps: CheckboxOneSpecificProps = {
        labels: {
            otherButtonLabel: t("page.secondary-activity-selection.other-button"),
            subchildLabel: t("page.secondary-activity-selection.add-activity-label"),
            inputPlaceholder: t("page.secondary-activity-selection.input-placeholder"),
        },
        labelsAlert: {
            alertMessage: t("component.secondary-activity-selecter.alert-message"),
            alertIgnore: t("component.secondary-activity-selecter.alert-ignore"),
            alertComplete: t("component.secondary-activity-selecter.alert-complete"),
            alertAlticon: t("component.secondary-activity-selecter.alert-alt-icon"),
        },
        errorIcon: errorIcon,
        backClickEvent: backClickEvent,
        nextClickEvent: nextClickEvent,
        backClickCallback: () => {
            saveAndLoopNavigate(EdtRoutesNameEnum.SECONDARY_ACTIVITY);
        },
        nextClickCallback: () => {
            if (context.isRoute) {
                saveAndLoopNavigate(EdtRoutesNameEnum.WITH_SOMEONE);
            } else {
                saveAndLoopNavigate(EdtRoutesNameEnum.ACTIVITY_LOCATION);
            }
        },
        addToReferentielCallBack: (newItem: CheckboxOneCustomOption) => {
            addToSecondaryActivityReferentiel(
                context.isRoute
                    ? ReferentielsEnum.ROUTESECONDARYACTIVITY
                    : ReferentielsEnum.ACTIVITYSECONDARYACTIVITY,
                newItem,
            );
        },
    };

    const alertLabels = {
        boldContent: t("page.alert-when-quit.activity.alert-content-bold"),
        content: !isRoute
            ? t("page.alert-when-quit.activity.alert-content")
            : t("page.alert-when-quit.route.alert-content"),
        cancel: t("page.alert-when-quit.alert-cancel"),
        complete: t("page.alert-when-quit.alert-complete"),
    };

    const saveAndLoopNavigate = (page: EdtRoutesNameEnum) => {
        saveAndNav(getLoopParameterizedNavigatePath(page, LoopEnum.ACTIVITY_OR_ROUTE, currentIteration));
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
            onClose={() => onClose(false)}
            displayStepper={false}
            currentStepLabel={stepData.stepLabel}
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
                    overrideOptions={
                        context.isRoute
                            ? getRouteSecondaryActivityRef()
                            : getActivitySecondaryActivityRef()
                    }
                    componentSpecificProps={specificProps}
                ></OrchestratorForStories>
            </FlexCenter>
        </LoopSurveyPage>
    );
};

export default SecondaryActivitySelectionPage;
