import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import LoopSurveyPage from "components/commons/LoopSurveyPage/LoopSurveyPage";
import { OrchestratorContext } from "interface/lunatic/Lunatic";
import { callbackHolder, OrchestratorForStories } from "orchestrator/Orchestrator";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { EdtRoutesNameEnum } from "routes/EdtRoutesMapping";
import { getLoopInitialPage, LoopEnum } from "service/loop-service";
import { getLoopPageSubpage } from "service/loop-stepper-service";
import {
    getCurrentNavigatePath,
    getOrchestratorPage,
    saveAndLoopNavigate,
    saveAndNav,
    setEnviro,
} from "service/navigation-service";
import {
    getActivitySecondaryActivityRef,
    getRouteSecondaryActivityRef,
} from "service/referentiel-service";

const SecondaryActivitySelectionPage = () => {
    const context: OrchestratorContext = useOutletContext();
    setEnviro(context, useNavigate(), callbackHolder);
    const { t } = useTranslation();
    const currentPage = EdtRoutesNameEnum.SECONDARY_ACTIVITY_SELECTION;
    const paramIteration = useParams().iteration;
    const currentIteration = paramIteration ? +paramIteration : 0;
    const [backClickEvent, setBackClickEvent] = useState<React.MouseEvent>();
    const [nextClickEvent, setNextClickEvent] = useState<React.MouseEvent>();

    const specificProps = {
        labels: {
            otherButtonLabel: t("page.secondary-activity-selection.other-button"),
            subchildLabel: t("page.secondary-activity-selection.add-activity-label"),
            inputPlaceholder: t("page.secondary-activity-selection.input-placeholder"),
        },
        backClickEvent: backClickEvent,
        nextClickEvent: nextClickEvent,
        backClickCallback: () => {
            saveAndLoopNavigate(
                EdtRoutesNameEnum.SECONDARY_ACTIVITY,
                LoopEnum.ACTIVITY_OR_ROUTE,
                currentIteration,
            );
        },
        nextClickCallback: () => {
            if (context.isRoute) {
                saveAndLoopNavigate(
                    EdtRoutesNameEnum.WITH_SOMEONE,
                    LoopEnum.ACTIVITY_OR_ROUTE,
                    currentIteration,
                );
            } else {
                saveAndLoopNavigate(
                    EdtRoutesNameEnum.ACTIVITY_LOCATION,
                    LoopEnum.ACTIVITY_OR_ROUTE,
                    currentIteration,
                );
            }
        },
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

    const onNext = (e: React.MouseEvent) => {
        setNextClickEvent(e);
    };

    const onPrevious = (e: React.MouseEvent) => {
        setBackClickEvent(e);
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
