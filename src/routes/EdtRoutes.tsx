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
import { EdtRoutesNameEnum } from "./EdtRoutesMapping";

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

export { EdtRoutes };
