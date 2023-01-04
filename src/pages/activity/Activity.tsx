import { Default } from "components/commons/Responsive/Responsive";
import SurveySelecter from "components/edt/SurveySelecter/SurveySelecter";
import { TabData } from "interface/component/Component";
import { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { EdtRoutesNameEnum } from "routes/EdtRoutesMapping";
import {
    getCurrentNavigatePath,
    getNavigatePath,
    getOrchestratorPage,
    getParameterizedNavigatePath,
} from "service/navigation-service";
import { getCurrentPageSource, getCurrentSurveyRootPage } from "service/orchestrator-service";
import { isTablet } from "service/responsive";
import { FieldNameEnum, getData, getTabsData, getValue } from "service/survey-service";

const ActivityPage = () => {
    const { idSurvey } = useParams();
    //handle error empty idSurvey and remove ?? "" and || ""
    const data = getData(idSurvey || "");
    const source = getCurrentPageSource();
    const navigate = useNavigate();
    const surveyRootPage = getCurrentSurveyRootPage();
    const { t } = useTranslation();
    const tabsData = getTabsData();
    const selectedTab = getTabsData().findIndex(tab => tab.idSurvey === idSurvey);
    const maxTabsPerRow = isTablet() ? 3 : 4;

    const reload = () => {
        // TODO : check with state full reload
        window.location.reload();
    };

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
            navigate(getNavigatePath(EdtRoutesNameEnum.ERROR));
        }
    }, []);

    const handleTabSelecterChange = useCallback((tabData: TabData) => {
        if (tabData.isActivitySurvey) {
            navigate(getParameterizedNavigatePath(EdtRoutesNameEnum.ACTIVITY, tabData.idSurvey));
            reload();
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
