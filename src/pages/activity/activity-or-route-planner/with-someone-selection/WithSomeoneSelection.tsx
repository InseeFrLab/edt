import errorIcon from "assets/illustration/error/activity.svg";
import childIcon from "assets/illustration/with-someone-categories/child.svg";
import coupleIcon from "assets/illustration/with-someone-categories/couple.svg";
import otherKnownIcon from "assets/illustration/with-someone-categories/other-known.svg";
import otherIcon from "assets/illustration/with-someone-categories/other.svg";
import parentsIcon from "assets/illustration/with-someone-categories/parents.svg";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import LoopSurveyPage from "components/commons/LoopSurveyPage/LoopSurveyPage";
import { OrchestratorContext } from "interface/lunatic/Lunatic";
import { Alert, CheckboxGroupSpecificProps } from "lunatic-edt";
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
import { FieldNameEnum, getValue } from "service/survey-service";

const WithSomeoneSelectionPage = () => {
    const { t } = useTranslation();
    const context: OrchestratorContext = useOutletContext();
    setEnviro(context, useNavigate(), callbackHolder);

    const currentPage = EdtRoutesNameEnum.WITH_SOMEONE_SELECTION;
    const stepData = getStepData(currentPage, context.isRoute);
    const paramIteration = useParams().iteration;
    const currentIteration = paramIteration ? +paramIteration : 0;
    const isRoute = getValue(context.idSurvey, FieldNameEnum.ISROUTE, currentIteration) as boolean;

    const [isAlertDisplayed, setIsAlertDisplayed] = useState<boolean>(false);

    const specificProps: CheckboxGroupSpecificProps = {
        optionsIcons: {
            "1": coupleIcon,
            "2": parentsIcon,
            "3": childIcon,
            "4": otherKnownIcon,
            "5": otherIcon,
        },
    };

    const alertLabels = {
        content: !isRoute
            ? t("page.alert-when-quit.activity.alert-content")
            : t("page.alert-when-quit.route.alert-content"),
        cancel: t("page.alert-when-quit.alert-cancel"),
        complete: t("page.alert-when-quit.alert-complete"),
    };

    const saveAndLoopNavigate = (page: EdtRoutesNameEnum) => {
        saveAndNav(getLoopParameterizedNavigatePath(page, LoopEnum.ACTIVITY_OR_ROUTE, currentIteration));
    };

    const onNext = () => {
        saveAndLoopNavigate(EdtRoutesNameEnum.WITH_SCREEN);
    };

    const onPrevious = () => {
        saveAndLoopNavigate(EdtRoutesNameEnum.WITH_SOMEONE);
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
                    callbackHolder={callbackHolder}
                    page={getLoopInitialPage(LoopEnum.ACTIVITY_OR_ROUTE)}
                    subPage={getLoopPageSubpage(currentPage)}
                    iteration={currentIteration}
                    componentSpecificProps={specificProps}
                ></OrchestratorForStories>
            </FlexCenter>
        </LoopSurveyPage>
    );
};

export default WithSomeoneSelectionPage;
