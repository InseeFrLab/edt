import { OrchestratorEdtNavigation } from "interface/route/OrchestratorEdtNavigation";
import ActivityPage from "pages/activity/Activity";
import DayOfSurveyPage from "pages/day-of-survey/DayOfSurvey";
import HelpPage from "pages/help/Help";
import HomePage from "pages/home/Home";
import NotFoundPage from "pages/not-found/NotFound";
import WhoAreYouPage from "pages/who-are-you/WhoAreYou";
import WorkTimePage from "pages/work-time/WorkTime";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const enum EdtRoutesNameEnum {
    HELP = "help",
    ACTIVITY = "activity/:idSurvey",
    WHO_ARE_YOU = "who-are-you",
    DAY_OF_SURVEY = "day-of-survey",
    WORK_TIME = "work-time/:idSurvey",
    WEEKLY_PLANNER = "weekly-planner",
}

const mappingPageOrchestrator: OrchestratorEdtNavigation[] = [
    {
        parentPage: EdtRoutesNameEnum.ACTIVITY,
        page: EdtRoutesNameEnum.WHO_ARE_YOU,
        surveySource: "activity-survey.json",
        surveyPage: "1",
    },
    {
        parentPage: EdtRoutesNameEnum.ACTIVITY,
        page: EdtRoutesNameEnum.DAY_OF_SURVEY,
        surveySource: "activity-survey.json",
        surveyPage: "2",
    },
    {
        parentPage: EdtRoutesNameEnum.WORK_TIME,
        page: EdtRoutesNameEnum.WHO_ARE_YOU,
        surveySource: "work-time-survey.json",
        surveyPage: "1",
    },
    {
        parentPage: EdtRoutesNameEnum.WORK_TIME,
        page: EdtRoutesNameEnum.DAY_OF_SURVEY,
        surveySource: "work-time-survey.json",
        surveyPage: "2",
    },
    {
        parentPage: EdtRoutesNameEnum.WORK_TIME,
        page: EdtRoutesNameEnum.WEEKLY_PLANNER,
        surveySource: "work-time-survey.json",
        surveyPage: "3",
    },
];

const EdtRoutes = (): JSX.Element => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="*" element={<NotFoundPage />} />
                <Route path="/" element={<HomePage />} />
                <Route path={EdtRoutesNameEnum.HELP} element={<HelpPage />} />
                <Route path={EdtRoutesNameEnum.ACTIVITY} element={<ActivityPage />}>
                    <Route path={EdtRoutesNameEnum.WHO_ARE_YOU} element={<WhoAreYouPage />} />
                    <Route path={EdtRoutesNameEnum.DAY_OF_SURVEY} element={<DayOfSurveyPage />} />
                </Route>
                <Route path={EdtRoutesNameEnum.WORK_TIME} element={<WorkTimePage />}>
                    <Route path={EdtRoutesNameEnum.WHO_ARE_YOU} element={<WhoAreYouPage />} />
                    <Route path={EdtRoutesNameEnum.DAY_OF_SURVEY} element={<DayOfSurveyPage />} />
                    <Route path={EdtRoutesNameEnum.WEEKLY_PLANNER} element={<DayOfSurveyPage />} />
                </Route>
                {/* DEV : dev purpose only*/}
            </Routes>
        </BrowserRouter>
    );
};

export { EdtRoutes, EdtRoutesNameEnum, mappingPageOrchestrator };
