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
import { getLabels } from "service/alert-service";
import { getLoopInitialPage, LoopEnum } from "service/loop-service";
import { getLoopPageSubpage, getStepData } from "service/loop-stepper-service";
import {
    getLoopParameterizedNavigatePath,
    onClose,
    onNext,
    onPrevious,
    saveAndNav,
    setEnviro,
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

    const [backClickEvent, setBackClickEvent] = useState<React.MouseEvent>();
    const [nextClickEvent, setNextClickEvent] = useState<React.MouseEvent>();
    const [isAlertDisplayed, setIsAlertDisplayed] = useState<boolean>(false);

    const specificProps: CheckboxGroupSpecificProps = {
        optionsIcons: {
            "1": coupleIcon,
            "2": parentsIcon,
            "3": childIcon,
            "4": otherKnownIcon,
            "5": otherIcon,
        },
        labels: getLabels("with-someone-selecter"),
        errorIcon: errorIcon,
        backClickEvent: backClickEvent,
        nextClickEvent: nextClickEvent,
        backClickCallback: () => {
            saveAndLoopNavigate(EdtRoutesNameEnum.WITH_SOMEONE);
        },
        nextClickCallback: () => {
            saveAndLoopNavigate(EdtRoutesNameEnum.WITH_SCREEN);
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

    return (
        <LoopSurveyPage
            onNext={e => onNext(e, setNextClickEvent)}
            onPrevious={e => onPrevious(e, setBackClickEvent)}
            onClose={() => onClose(false, setIsAlertDisplayed, currentIteration)}
            displayStepper={false}
            currentStepLabel={stepData.stepLabel}
        >
            <FlexCenter>
                <Alert
                    isAlertDisplayed={isAlertDisplayed}
                    onCompleteCallBack={() => setIsAlertDisplayed(false)}
                    onCancelCallBack={cancel => onClose(cancel, setIsAlertDisplayed, currentIteration)}
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
                ></OrchestratorForStories>
            </FlexCenter>
        </LoopSurveyPage>
    );
};

export default WithSomeoneSelectionPage;
