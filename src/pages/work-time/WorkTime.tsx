import { makeStylesEdt } from "../../theme/make-style-edt.ts";
import { Box } from "@mui/material";
import { Default } from "../../components/commons/Responsive/Responsive";
import SurveySelecter from "../../components/edt/SurveySelecter/SurveySelecter";
import { EdtRoutesNameEnum } from "../../enumerations/EdtRoutesNameEnum";
import { ErrorCodeEnum } from "../../enumerations/ErrorCodeEnum";
import { SourcesEnum } from "../../enumerations/SourcesEnum";
import { TabData } from "../../interface/component/Component";
import { OrchestratorContext } from "../../interface/lunatic/Lunatic";
import { callbackHolder } from "../../orchestrator/Orchestrator";
import { useCallback, useEffect } from "react";
import { isAndroid, isIOS } from "react-device-detect";
import { useTranslation } from "react-i18next";
import { Outlet, useNavigate, useOutletContext, useParams } from "react-router-dom";
import {
    getParameterizedNavigatePath,
    navToWeeklyPlannerOrClose,
    setEnviro,
} from "../../service/navigation-service";
import { getCurrentSurveyRootPage } from "../../service/orchestrator-service";
import { isPwa } from "../../service/responsive";
import { getData, getGroupOfPerson, getSource, getSurveyRights, getTabsData } from "../../service/survey-service";

const WorkTimePage = () => {
    let { idSurvey } = useParams();
    let data = getData(idSurvey || "");
    const source = getSource(SourcesEnum.WORK_TIME_SURVEY);
    const navigate = useNavigate();

    const surveyRootPage = getCurrentSurveyRootPage();
    const { t } = useTranslation();
    const tabsData = getTabsData(t);
    const groupOfPerson = getGroupOfPerson(idSurvey ?? "");
    const filteredTabsData = tabsData.filter(tab => groupOfPerson.includes(tab.idSurvey));
    const selectedTab = filteredTabsData.findIndex(tab => tab.idSurvey === idSurvey);

    const context: OrchestratorContext = useOutletContext();
    const { classes, cx } = useStyles();

    setEnviro(context, useNavigate(), callbackHolder);

    useEffect(() => {
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
        <Box
            className={cx(
                !isPwa() && (isIOS || isAndroid) ? classes.pageMobileTablet : classes.pageDesktop,
            )}
        >
            <Default>
                <SurveySelecter
                    id={t("accessibility.component.survey-selecter.id")}
                    tabsData={filteredTabsData}
                    ariaLabel={t("accessibility.component.survey-selecter.aria-label")}
                    selectedTab={selectedTab}
                    onChangeSelected={handleTabSelecterChange}
                    isDefaultOpen={true}
                    maxTabsPerRow={3}
                    maxTabIndex={200}
                />
            </Default>
            <Outlet
                context={{
                    source: source,
                    data: data,
                    idSurvey: idSurvey,
                    surveyRootPage: surveyRootPage,
                    rightsSurvey: getSurveyRights(idSurvey ?? ""),
                }}
            />
        </Box>
    );
};

const useStyles = makeStylesEdt({ "name": { WorkTimePage } })(() => ({
    pageDesktop: {
        height: "100%",
        display: "flex",
        flexDirection: "column",
    },
    pageMobileTablet: {
        height: "100%",
        //maxHeight: "94vh",
        display: "flex",
        flexDirection: "column",
    },
}));

export default WorkTimePage;
