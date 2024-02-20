import SurveySelecter from "components/edt/SurveySelecter/SurveySelecter";
import { EdtRoutesNameEnum } from "enumerations/EdtRoutesNameEnum";
import { ErrorCodeEnum } from "enumerations/ErrorCodeEnum";
import { SourcesEnum } from "enumerations/SourcesEnum";
import { TabData } from "interface/component/Component";
import { OrchestratorContext } from "interface/lunatic/Lunatic";
import { callbackHolder } from "orchestrator/Orchestrator";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import { Outlet, useNavigate, useOutletContext, useParams } from "react-router-dom";
import {
    getParameterizedNavigatePath,
    navToActivityOrPlannerOrSummary,
    navToWeeklyPlannerOrClose,
    setEnviro,
} from "service/navigation-service";
import { getCurrentSurveyRootPage } from "service/orchestrator-service";
import { tabletMinWidth } from "service/responsive";
import { getData, getSource, getSurveyRights, getTabsData } from "service/survey-service";

const ActivityPage = () => {
    const source = getSource(SourcesEnum.ACTIVITY_SURVEY);
    const navigate = useNavigate();

    const context: OrchestratorContext = useOutletContext();
    setEnviro(context, useNavigate(), callbackHolder);

    let { idSurvey } = useParams();
    let data = getData(idSurvey ?? context.idSurvey);

    const surveyRootPage = getCurrentSurveyRootPage();
    const { t } = useTranslation();

    const tabsData = getTabsData(t);
    const selectedTab = tabsData.findIndex(tab => tab.idSurvey === idSurvey);
    const maxTabsPerRow = 4;

    const [isOpen, setIsOpen] = useState<boolean>(false);

    useEffect(() => {
        if (idSurvey && source) {
            navToActivityOrPlannerOrSummary(idSurvey, source.maxPage, navigate, source);
        } else {
            console.error(
                `Activité - Erreur recuperation du idSurvey: ${idSurvey} et source: ${source}`,
            );
            navigate(getParameterizedNavigatePath(EdtRoutesNameEnum.ERROR, ErrorCodeEnum.COMMON));
        }
    }, []);

    const handleClickHeader = () => {
        const classSelecterOpen = document.getElementById("tabs-survey-selecter-2");
        setIsOpen(classSelecterOpen !== null);
    };

    useEffect(() => {
        window.addEventListener("click", handleClickHeader);

        return () => {
            window.removeEventListener("click", handleClickHeader);
        };
    });

    const handleTabSelecterChange = useCallback((tabData: TabData) => {
        if (tabData.isActivitySurvey) {
            idSurvey = tabData.idSurvey;
            data = getData(idSurvey);
            navToActivityOrPlannerOrSummary(idSurvey, source.maxPage, navigate, source);
        } else {
            navToWeeklyPlannerOrClose(tabData.idSurvey, navigate, source);
        }
    }, []);

    const isNotMobile = useMediaQuery({ minWidth: tabletMinWidth });
    return (
        <>
            <>
                {isNotMobile && (
                    <SurveySelecter
                        id={t("accessibility.component.survey-selecter.id")}
                        tabsData={tabsData}
                        ariaLabel={t("accessibility.component.survey-selecter.aria-label")}
                        selectedTab={selectedTab}
                        onChangeSelected={handleTabSelecterChange}
                        isDefaultOpen={selectedTab >= maxTabsPerRow}
                        maxTabsPerRow={maxTabsPerRow}
                        maxTabIndex={200}
                    />
                )}
            </>
            <Outlet
                context={{
                    source: source,
                    data: data,
                    idSurvey: idSurvey,
                    surveyRootPage: surveyRootPage,
                    rightsSurvey: getSurveyRights(idSurvey ?? ""),
                    isOpenHeader: isOpen,
                }}
            />
        </>
    );
};

export default ActivityPage;
