import { Default } from "components/commons/Responsive/Responsive";
import SurveySelecter from "components/edt/SurveySelecter/SurveySelecter";
import { EdtRoutesNameEnum } from "enumerations/EdtRoutesNameEnum";
import { ErrorCodeEnum } from "enumerations/ErrorCodeEnum";
import { FieldNameEnum } from "enumerations/FieldNameEnum";
import { SurveysIdsEnum } from "enumerations/SurveysIdsEnum";
import { TabData } from "interface/component/Component";
import { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import {
    getCurrentNavigatePath,
    getOrchestratorPage,
    getParameterizedNavigatePath,
    navToHome,
} from "service/navigation-service";
import { getCurrentPageSource, getCurrentSurveyRootPage } from "service/orchestrator-service";
import { isTablet } from "service/responsive";
import { getData, getTabsData, getValue, surveysIds } from "service/survey-service";

const ActivityPage = () => {
    let { idSurvey } = useParams();
    let data = getData(idSurvey || "");
    const source = getCurrentPageSource();
    const navigate = useNavigate();
    if (idSurvey && !surveysIds[SurveysIdsEnum.ACTIVITY_SURVEYS_IDS].find(id => id === idSurvey)) {
        navToHome();
    }
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
            const activityIsClosed = getValue(idSurvey, FieldNameEnum.ISCLOSED);
            navigate(
                getCurrentNavigatePath(
                    idSurvey,
                    surveyRootPage,
                    activityIsClosed
                        ? source.maxPage
                        : getOrchestratorPage(EdtRoutesNameEnum.ACTIVITY_OR_ROUTE_PLANNER),
                ),
            );
        } else {
            navigate(getParameterizedNavigatePath(EdtRoutesNameEnum.ERROR, ErrorCodeEnum.COMMON));
        }
    }, []);

    const handleTabSelecterChange = useCallback((tabData: TabData) => {
        if (tabData.isActivitySurvey) {
            idSurvey = tabData.idSurvey;
            const activityIsClosed = getValue(idSurvey || "", FieldNameEnum.ISCLOSED);
            data = getData(idSurvey);
            navigate(
                getCurrentNavigatePath(
                    tabData.idSurvey,
                    surveyRootPage,
                    activityIsClosed
                        ? source.maxPage
                        : getOrchestratorPage(EdtRoutesNameEnum.ACTIVITY_OR_ROUTE_PLANNER),
                ),
            );
        } else {
            navigate(getParameterizedNavigatePath(EdtRoutesNameEnum.WORK_TIME, tabData.idSurvey));
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
                />
            </Default>
            <Outlet
                context={{
                    source: source,
                    data: data,
                    idSurvey: idSurvey,
                    surveyRootPage: surveyRootPage,
                }}
            />
        </>
    );
};

export default ActivityPage;
