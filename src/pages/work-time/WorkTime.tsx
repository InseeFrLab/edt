import { Default } from "components/commons/Responsive/Responsive";
import SurveySelecter from "components/edt/SurveySelecter/SurveySelecter";
import { EdtRoutesNameEnum } from "enumerations/EdtRoutesNameEnum";
import { SurveysIdsEnum } from "enumerations/SurveysIdsEnum";
import { TabData } from "interface/component/Component";
import { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import {
    getCurrentNavigatePath,
    getNavigatePath,
    getParameterizedNavigatePath,
    navToHome,
} from "service/navigation-service";
import { getCurrentPageSource, getCurrentSurveyRootPage } from "service/orchestrator-service";
import { isTablet } from "service/responsive";
import { getData, getTabsData, surveysIds } from "service/survey-service";

const WorkTimePage = () => {
    let { idSurvey } = useParams();
    let data = getData(idSurvey || "");
    const source = getCurrentPageSource();
    const navigate = useNavigate();
    if (idSurvey && !surveysIds[SurveysIdsEnum.WORK_TIME_SURVEYS_IDS].find(id => id === idSurvey)) {
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
            navigate(getCurrentNavigatePath(idSurvey, surveyRootPage, source.maxPage));
        } else {
            navigate(getNavigatePath(EdtRoutesNameEnum.ERROR));
        }
    }, []);

    const handleTabSelecterChange = useCallback((tabData: TabData) => {
        if (tabData.isActivitySurvey) {
            navigate(getParameterizedNavigatePath(EdtRoutesNameEnum.ACTIVITY, tabData.idSurvey));
        } else {
            idSurvey = tabData.idSurvey;
            data = getData(idSurvey);
            navigate(getCurrentNavigatePath(idSurvey, surveyRootPage, source.maxPage));
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

export default WorkTimePage;
