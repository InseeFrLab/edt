import { Default } from "components/commons/Responsive/Responsive";
import SurveySelecter from "components/edt/SurveySelecter/SurveySelecter";
import { EdtRoutesNameEnum } from "enumerations/EdtRoutesNameEnum";
import { ErrorCodeEnum } from "enumerations/ErrorCodeEnum";
import { SourcesEnum } from "enumerations/SourcesEnum";
import { SurveysIdsEnum } from "enumerations/SurveysIdsEnum";
import { TabData } from "interface/component/Component";
import { OrchestratorContext } from "interface/lunatic/Lunatic";
import { callbackHolder } from "orchestrator/Orchestrator";
import { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Outlet, useNavigate, useOutletContext, useParams } from "react-router-dom";
import {
    getParameterizedNavigatePath,
    navToActivityOrPlannerOrSummary,
    navToHome,
    navToWeeklyPlannerOrClose,
    setEnviro,
} from "service/navigation-service";
import { getCurrentSurveyRootPage } from "service/orchestrator-service";
import { isTablet } from "service/responsive";
import { getData, getSource, getTabsData, surveysIds, getSurveyRights } from "service/survey-service";

const ActivityPage = () => {
    let { idSurvey } = useParams();
    let data = getData(idSurvey || "");
    const source = getSource(SourcesEnum.ACTIVITY_SURVEY);
    const navigate = useNavigate();
    if (
        idSurvey &&
        surveysIds &&
        !surveysIds[SurveysIdsEnum.ACTIVITY_SURVEYS_IDS]?.find(id => id === idSurvey)
    ) {
        navToHome();
    }
    const context: OrchestratorContext = useOutletContext();

    setEnviro(context, useNavigate(), callbackHolder);
    const surveyRootPage = getCurrentSurveyRootPage();
    const { t } = useTranslation();
    const tabsData = getTabsData(t);
    const selectedTab = tabsData.findIndex(tab => tab.idSurvey === idSurvey);
    const maxTabsPerRow = isTablet() ? 3 : 4;

    useEffect(() => {
        window.onpopstate = () => {
            navigate("/");
        };

        if (idSurvey && source) {
            navToActivityOrPlannerOrSummary(idSurvey, source.maxPage, navigate, source);
        } else {
            console.error(
                `Activité - Erreur recuperation du idSurvey: ${idSurvey} et source: ${source}`,
            );
            navigate(getParameterizedNavigatePath(EdtRoutesNameEnum.ERROR, ErrorCodeEnum.COMMON));
        }
    }, []);

    const handleTabSelecterChange = useCallback((tabData: TabData) => {
        if (tabData.isActivitySurvey) {
            idSurvey = tabData.idSurvey;
            data = getData(idSurvey);
            navToActivityOrPlannerOrSummary(idSurvey, source.maxPage, navigate, source);
        } else {
            navToWeeklyPlannerOrClose(tabData.idSurvey, navigate, source);
        }
    }, []);

    return (
        <>
            <Default>
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
            </Default>
            <Outlet
                context={{
                    source: source,
                    data: data,
                    idSurvey: idSurvey,
                    surveyRootPage: surveyRootPage,
                    rights: getSurveyRights(idSurvey ?? ""),
                }}
            />
        </>
    );
};

export default ActivityPage;
