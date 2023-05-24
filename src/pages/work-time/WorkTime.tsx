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
    navToHome,
    navToWeeklyPlannerOrClose,
    setEnviro,
} from "service/navigation-service";
import { getCurrentSurveyRootPage } from "service/orchestrator-service";
import { isTablet } from "service/responsive";
import { getData, getSource, getTabsData, surveysIds } from "service/survey-service";
import { isIOS, isAndroid, isDesktop } from "react-device-detect";
import { isPwa } from "service/responsive";
import { Box } from "@mui/material";
import { makeStylesEdt, WeeklyPlannerSpecificProps } from "@inseefrlab/lunatic-edt";

const WorkTimePage = () => {
    let { idSurvey } = useParams();
    let data = getData(idSurvey || "");
    const source = getSource(SourcesEnum.WORK_TIME_SURVEY);
    const navigate = useNavigate();
    if (idSurvey && !surveysIds[SurveysIdsEnum.WORK_TIME_SURVEYS_IDS]?.find(id => id === idSurvey)) {
        navToHome();
    }
    const surveyRootPage = getCurrentSurveyRootPage();
    const { t } = useTranslation();
    const tabsData = getTabsData(t);
    const selectedTab = tabsData.findIndex(tab => tab.idSurvey === idSurvey);
    const maxTabsPerRow = isTablet() ? 3 : 4;

    const context: OrchestratorContext = useOutletContext();
    const { classes, cx } = useStyles();

    setEnviro(context, useNavigate(), callbackHolder);

    useEffect(() => {
        window.onpopstate = () => {
            navigate("/");
        };

        if (idSurvey && source) {
            navToWeeklyPlannerOrClose(idSurvey, navigate, source);
        } else {
            navigate(getParameterizedNavigatePath(EdtRoutesNameEnum.ERROR, ErrorCodeEnum.COMMON));
        }
    }, []);

    const handleTabSelecterChange = useCallback((tabData: TabData) => {
        if (tabData.isActivitySurvey) {
            navigate(getParameterizedNavigatePath(EdtRoutesNameEnum.ACTIVITY, tabData.idSurvey));
        } else {
            idSurvey = tabData.idSurvey;
            data = getData(idSurvey);
            navToWeeklyPlannerOrClose(idSurvey, navigate, source);
        }
    }, []);

    return (
        <Box className={cx(!isPwa() && isIOS ? classes.pageMobileTablet : classes.pageMobileTablet)}>
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
                }}
            />
        </Box>
    );
};

const useStyles = makeStylesEdt({ "name": { WorkTimePage } })(() => ({
    pageDesktop: {
        height: "100%",
    },
    pageMobileTablet: {
        height: "100%",
        maxHeight: "87vh",
    },
}));

export default WorkTimePage;
