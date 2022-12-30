import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import LoopSurveyPage from "components/commons/LoopSurveyPage/LoopSurveyPage";
import { OrchestratorContext } from "interface/lunatic/Lunatic";
import { callbackHolder, OrchestratorForStories } from "orchestrator/Orchestrator";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { EdtRoutesNameEnum } from "routes/EdtRoutesMapping";
import { getLoopInitialPage, LoopEnum } from "service/loop-service";
import {
    getCurrentNavigatePath,
    getLoopParameterizedNavigatePath,
    getOrchestratorPage,
    saveAndNav,
    setEnviro,
} from "service/navigation-service";

import errorIcon from "assets/illustration/error/activity.svg";
import option1 from "assets/illustration/goals/1.svg";
import option2 from "assets/illustration/goals/2.svg";
import option3 from "assets/illustration/goals/3.svg";
import option4 from "assets/illustration/goals/4.svg";

import { IconGridCheckBoxOneSpecificProps } from "lunatic-edt";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { getLoopPageSubpage } from "service/loop-stepper-service";

const MainActivityGoalPage = () => {
    const { t } = useTranslation();
    const context: OrchestratorContext = useOutletContext();
    setEnviro(context, useNavigate(), callbackHolder);

    const currentPage = EdtRoutesNameEnum.MAIN_ACTIVITY_GOAL;
    const paramIteration = useParams().iteration;
    const currentIteration = paramIteration ? +paramIteration : 0;

    const [backClickEvent, setBackClickEvent] = useState<React.MouseEvent>();
    const [nextClickEvent, setNextClickEvent] = useState<React.MouseEvent>();

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
            saveAndLoopNavigate(EdtRoutesNameEnum.MAIN_ACTIVITY);
        },
        nextClickCallback: () => {
            saveAndLoopNavigate(EdtRoutesNameEnum.SECONDARY_ACTIVITY);
        },
        labels: {
            alertMessage: t("component.goal-selecter.alert-message"),
            alertIgnore: t("component.goal-selecter.alert-ignore"),
            alertComplete: t("component.goal-selecter.alert-complete"),
            alertAlticon: t("component.goal-selecter.alert-alt_icon"),
        },
        errorIcon: errorIcon,
    };

    const saveAndLoopNavigate = (page: EdtRoutesNameEnum) => {
        saveAndNav(getLoopParameterizedNavigatePath(page, LoopEnum.ACTIVITY_OR_ROUTE, currentIteration));
    };

    const onNext = (e: React.MouseEvent) => {
        setNextClickEvent(e);
    };

    const onPrevious = (e: React.MouseEvent) => {
        setBackClickEvent(e);
    };

    const onClose = () => {
        saveAndNav(
            getCurrentNavigatePath(
                context.idSurvey,
                EdtRoutesNameEnum.ACTIVITY,
                getOrchestratorPage(EdtRoutesNameEnum.ACTIVITY_OR_ROUTE_PLANNER),
            ),
        );
    };

    return (
        <LoopSurveyPage onNext={onNext} onPrevious={onPrevious} onClose={onClose}>
            <FlexCenter>
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

export default MainActivityGoalPage;
