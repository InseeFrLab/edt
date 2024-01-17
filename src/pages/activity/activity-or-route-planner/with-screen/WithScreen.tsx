import { Alert, CheckboxBooleanEdtSpecificProps } from "@inseefrlab/lunatic-edt";
import screenErrorIcon from "assets/illustration/error/screen.svg";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import LoopSurveyPage from "components/commons/LoopSurveyPage/LoopSurveyPage";
import { EdtRoutesNameEnum } from "enumerations/EdtRoutesNameEnum";
import { FieldNameEnum } from "enumerations/FieldNameEnum";
import { LoopEnum } from "enumerations/LoopEnum";
import { OrchestratorContext } from "interface/lunatic/Lunatic";
import { OrchestratorForStories, callbackHolder } from "orchestrator/Orchestrator";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useOutletContext, useParams } from "react-router-dom";
import { getLabels, getLabelsWhenQuit } from "service/alert-service";
import { getLoopInitialPage } from "service/loop-service";
import { getLoopPageSubpage, getPreviousLoopPage, getStepData } from "service/loop-stepper-service";
import {
    getCurrentNavigatePath,
    getNavigatePath,
    getOrchestratorPage,
    getParameterizedNavigatePath,
    onClose,
    onNext,
    onPrevious,
    saveAndLoopNavigate,
    saveAndNav,
    setEnviro,
    validate,
} from "service/navigation-service";
import { getValue } from "service/survey-service";
import { getSurveyIdFromUrl } from "utils/utils";

const WithScreenPage = () => {
    const { t } = useTranslation();
    const context: OrchestratorContext = useOutletContext();
    setEnviro(context, useNavigate(), callbackHolder);

    const location = useLocation();
    const idSurvey = getSurveyIdFromUrl(context, location);
    const paramIteration = useParams().iteration;
    const currentIteration = paramIteration ? +paramIteration : 0;
    const currentPage = EdtRoutesNameEnum.WITH_SCREEN;
    const isRoute = getValue(idSurvey, FieldNameEnum.ISROUTE, currentIteration) as boolean;
    const stepData = getStepData(currentPage, isRoute);
    const isCloture = getValue(idSurvey, FieldNameEnum.ISCLOSED) as boolean;
    const summaryRoutePath =
        getParameterizedNavigatePath(EdtRoutesNameEnum.ACTIVITY, idSurvey) +
        getNavigatePath(EdtRoutesNameEnum.ACTIVITY_SUMMARY);

    const [backClickEvent, setBackClickEvent] = useState<React.MouseEvent>();
    const [nextClickEvent, setNextClickEvent] = useState<React.MouseEvent>();
    const [isAlertDisplayed, setIsAlertDisplayed] = useState<boolean>(false);

    const specificProps: CheckboxBooleanEdtSpecificProps = {
        backClickEvent: backClickEvent,
        nextClickEvent: nextClickEvent,
        backClickCallback: () => {
            saveAndLoopNavigate(
                idSurvey,
                context.source,
                EdtRoutesNameEnum.WITH_SOMEONE_SELECTION,
                LoopEnum.ACTIVITY_OR_ROUTE,
                currentIteration,
                FieldNameEnum.WITHSOMEONE,
                getPreviousLoopPage(currentPage),
            );
        },
        nextClickCallback: () => {
            saveAndNav(
                idSurvey,
                isCloture
                    ? summaryRoutePath
                    : getCurrentNavigatePath(
                          idSurvey,
                          EdtRoutesNameEnum.ACTIVITY,
                          getOrchestratorPage(EdtRoutesNameEnum.ACTIVITY_OR_ROUTE_PLANNER),
                          context.source,
                      ),
            );
        },
        onSelectValue: () => {
            validate(idSurvey).then(() => {
                saveAndNav(
                    idSurvey,
                    isCloture
                        ? summaryRoutePath
                        : getCurrentNavigatePath(
                              idSurvey,
                              EdtRoutesNameEnum.ACTIVITY,
                              getOrchestratorPage(EdtRoutesNameEnum.ACTIVITY_OR_ROUTE_PLANNER),
                              context.source,
                          ),
                );
            });
        },
        labels: getLabels("with-screen-selecter"),
        errorIcon: screenErrorIcon,
    };

    return (
        <LoopSurveyPage
            onNext={useCallback((e: React.MouseEvent) => onNext(e, setNextClickEvent), [nextClickEvent])}
            onPrevious={useCallback(
                (e: React.MouseEvent) => onPrevious(e, setBackClickEvent),
                [backClickEvent],
            )}
            onClose={useCallback(
                () => onClose(idSurvey, context.source, false, setIsAlertDisplayed, currentIteration),
                [isAlertDisplayed],
            )}
            currentStepIcon={stepData.stepIcon}
            currentStepIconAlt={stepData.stepIconAlt}
            currentStepNumber={stepData.stepNumber}
            currentStepLabel={stepData.stepLabel}
            isRoute={isRoute}
        >
            <FlexCenter>
                <Alert
                    isAlertDisplayed={isAlertDisplayed}
                    onCompleteCallBack={useCallback(
                        () => setIsAlertDisplayed(false),
                        [isAlertDisplayed],
                    )}
                    onCancelCallBack={useCallback(
                        cancel =>
                            onClose(
                                idSurvey,
                                context.source,
                                cancel,
                                setIsAlertDisplayed,
                                currentIteration,
                            ),
                        [isAlertDisplayed],
                    )}
                    labels={getLabelsWhenQuit(isRoute)}
                    icon={screenErrorIcon}
                    errorIconAlt={t("page.activity-duration.alt-alert-icon")}
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

export default WithScreenPage;
