import { OrchestratorEdtNavigation } from "interface/route/OrchestratorEdtNavigation";
import ActivityPage from "pages/activity/Activity";
import ActivityDurationPage from "pages/activity/activity-planner/activity-duration/ActivityDuration";
import ActivityLocationPage from "pages/activity/activity-planner/activity-location/ActivityLocation";
import ActivityPlannerPage from "pages/activity/activity-planner/ActivityPlanner";
import MainActivityPage from "pages/activity/activity-planner/main-activity/MainActivity";
import SecondaryActivityPage from "pages/activity/activity-planner/secondary-activity/SecondaryActivity";
import WithScreenPage from "pages/activity/activity-planner/with-screen/WithScreen";
import WithSomeonePage from "pages/activity/activity-planner/with-someone/WithSomeone";
import DayOfSurveyPage from "pages/day-of-survey/DayOfSurvey";
import ErrorPage from "pages/error/Error";
import HelpPage from "pages/help/Help";
import HomePage from "pages/home/Home";
import NotFoundPage from "pages/not-found/NotFound";
import WhoAreYouPage from "pages/who-are-you/WhoAreYou";
import WeeklyPlannerPage from "pages/work-time/weekly-planner/WeeklyPlanner";
import WorkTimePage from "pages/work-time/WorkTime";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LoopPage } from "service/survey-service";

const enum EdtRoutesNameEnum {
    HELP = "help",
    ERROR = "error",
    ACTIVITY = "activity/:idSurvey",
    WHO_ARE_YOU = "who-are-you",
    DAY_OF_SURVEY = "day-of-survey",
    WORK_TIME = "work-time/:idSurvey",
    WEEKLY_PLANNER = "weekly-planner",
    ACTIVITY_PLANNER = "activity-planner",
    ACTIVITY_DURATION = "activity-duration/:iteration",
    MAIN_ACTIVITY = "main-activity/:iteration",
    SECONDARY_ACTIVITY = "secondary-activity/:iteration",
    ACTIVITY_LOCATION = "activity-location/:iteration",
    WITH_SOMEONE = "with-who/:iteration",
    WITH_SCREEN = "with-screen/:iteration",
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
        parentPage: EdtRoutesNameEnum.ACTIVITY,
        page: EdtRoutesNameEnum.ACTIVITY_PLANNER,
        surveySource: "activity-survey.json",
        surveyPage: "3",
    },
    {
        parentPage: EdtRoutesNameEnum.ACTIVITY_PLANNER,
        page: EdtRoutesNameEnum.ACTIVITY_DURATION,
        surveySource: "activity-survey.json",
        surveyPage: LoopPage.ACTIVITY,
        surveySubPage: "2",
        surveyStep: 1,
    },
    {
        parentPage: EdtRoutesNameEnum.ACTIVITY_PLANNER,
        page: EdtRoutesNameEnum.MAIN_ACTIVITY,
        surveySource: "activity-survey.json",
        surveyPage: LoopPage.ACTIVITY,
        surveySubPage: "3",
        surveyStep: 2,
    },
    {
        parentPage: EdtRoutesNameEnum.ACTIVITY_PLANNER,
        page: EdtRoutesNameEnum.SECONDARY_ACTIVITY,
        surveySource: "activity-survey.json",
        surveyPage: LoopPage.ACTIVITY,
        surveySubPage: "4",
        surveyStep: 3,
    },
    {
        parentPage: EdtRoutesNameEnum.ACTIVITY_PLANNER,
        page: EdtRoutesNameEnum.ACTIVITY_LOCATION,
        surveySource: "activity-survey.json",
        surveyPage: LoopPage.ACTIVITY,
        surveySubPage: "5",
        surveyStep: 4,
    },
    {
        parentPage: EdtRoutesNameEnum.ACTIVITY_PLANNER,
        page: EdtRoutesNameEnum.WITH_SOMEONE,
        surveySource: "activity-survey.json",
        surveyPage: LoopPage.ACTIVITY,
        surveySubPage: "6",
        surveyStep: 5,
    },
    {
        parentPage: EdtRoutesNameEnum.ACTIVITY_PLANNER,
        page: EdtRoutesNameEnum.WITH_SCREEN,
        surveySource: "activity-survey.json",
        surveyPage: LoopPage.ACTIVITY,
        surveySubPage: "7",
        surveyStep: 6,
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
                <Route path={EdtRoutesNameEnum.ERROR} element={<ErrorPage />} />
                <Route path={EdtRoutesNameEnum.ACTIVITY} element={<ActivityPage />}>
                    <Route path={EdtRoutesNameEnum.WHO_ARE_YOU} element={<WhoAreYouPage />} />
                    <Route path={EdtRoutesNameEnum.DAY_OF_SURVEY} element={<DayOfSurveyPage />} />
                    <Route path={EdtRoutesNameEnum.ACTIVITY_PLANNER} element={<ActivityPlannerPage />}>
                        <Route
                            path={EdtRoutesNameEnum.ACTIVITY_DURATION}
                            element={<ActivityDurationPage />}
                        />
                        <Route path={EdtRoutesNameEnum.MAIN_ACTIVITY} element={<MainActivityPage />} />
                        <Route
                            path={EdtRoutesNameEnum.SECONDARY_ACTIVITY}
                            element={<SecondaryActivityPage />}
                        />
                        <Route
                            path={EdtRoutesNameEnum.ACTIVITY_LOCATION}
                            element={<ActivityLocationPage />}
                        />
                        <Route path={EdtRoutesNameEnum.WITH_SOMEONE} element={<WithSomeonePage />} />
                        <Route path={EdtRoutesNameEnum.WITH_SCREEN} element={<WithScreenPage />} />
                    </Route>
                </Route>
                <Route path={EdtRoutesNameEnum.WORK_TIME} element={<WorkTimePage />}>
                    <Route path={EdtRoutesNameEnum.WHO_ARE_YOU} element={<WhoAreYouPage />} />
                    <Route path={EdtRoutesNameEnum.DAY_OF_SURVEY} element={<DayOfSurveyPage />} />
                    <Route path={EdtRoutesNameEnum.WEEKLY_PLANNER} element={<WeeklyPlannerPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export { EdtRoutes, EdtRoutesNameEnum, mappingPageOrchestrator };
