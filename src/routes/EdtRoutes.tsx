import ExceptionalDayPage from "pages/activity-complementary-questions/exceptional-day/ExceptionalDay";
import GreatestActivityDayPage from "pages/activity-complementary-questions/greatest-activity-day/GreatestActivityDay";
import KindOfDayPage from "pages/activity-complementary-questions/kind-of-day/KindOfDay";
import PhoneTimePage from "pages/activity-complementary-questions/phone-time/PhoneTime";
import TravelTimePage from "pages/activity-complementary-questions/travel-time/TravelTime";
import WorstActivityDayPage from "pages/activity-complementary-questions/worst-activity-day/WorstActivityDay";
import ActivityPage from "pages/activity/Activity";
import ActivityDurationPage from "pages/activity/activity-or-route-planner/activity-duration/ActivityDuration";
import ActivityLocationPage from "pages/activity/activity-or-route-planner/activity/activity-location/ActivityLocation";
import ActivitySecondaryActivitySelectionPage from "pages/activity/activity-or-route-planner/activity/activity-secondary-activity-selection/ActivitySecondaryActivitySelection";
import MainActivityGoalPage from "pages/activity/activity-or-route-planner/activity/main-activity-goal/MainActivityGoal";
import MainActivityPage from "pages/activity/activity-or-route-planner/activity/main-activity/MainActivity";
import ActivityOrRoutePlannerPage from "pages/activity/activity-or-route-planner/ActivityOrRoutePlanner";
import MeanOfTransportPage from "pages/activity/activity-or-route-planner/route/mean-of-transport/MeanOfTransport";
import RouteSecondaryActivitySelectionPage from "pages/activity/activity-or-route-planner/route/route-secondary-activity-selection/RouteSecondaryActivitySelection";
import RoutePage from "pages/activity/activity-or-route-planner/route/route/Route";
import SecondaryActivityPage from "pages/activity/activity-or-route-planner/secondary-activity/SecondaryActivity";
import WithScreenPage from "pages/activity/activity-or-route-planner/with-screen/WithScreen";
import WithSomeoneSelectionPage from "pages/activity/activity-or-route-planner/with-someone-selection/WithSomeoneSelection";
import WithSomeonePage from "pages/activity/activity-or-route-planner/with-someone/WithSomeone";
import DayOfSurveyPage from "pages/day-of-survey/DayOfSurvey";
import ErrorPage from "pages/error/Error";
import HelpPage from "pages/help/Help";
import HomePage from "pages/home/Home";
import NotFoundPage from "pages/not-found/NotFound";
import WhoAreYouPage from "pages/who-are-you/WhoAreYou";
import KindOfWeekPage from "pages/work-time/kind-of-week/KindOfWeek";
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
                    <Route
                        path={EdtRoutesNameEnum.ACTIVITY_OR_ROUTE_PLANNER}
                        element={<ActivityOrRoutePlannerPage />}
                    >
                        <Route
                            path={EdtRoutesNameEnum.ACTIVITY_DURATION}
                            element={<ActivityDurationPage />}
                        />
                        <Route path={EdtRoutesNameEnum.MAIN_ACTIVITY} element={<MainActivityPage />} />
                        <Route path={EdtRoutesNameEnum.ROUTE} element={<RoutePage />} />
                        <Route
                            path={EdtRoutesNameEnum.MEAN_OF_TRANSPORT}
                            element={<MeanOfTransportPage />}
                        />
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
                        <Route
                            path={EdtRoutesNameEnum.MAIN_ACTIVITY_GOAL}
                            element={<MainActivityGoalPage />}
                        />
                        <Route
                            path={EdtRoutesNameEnum.ACTIVITY_SECONDARY_ACTIVITY_SELECTION}
                            element={<ActivitySecondaryActivitySelectionPage />}
                        />
                        <Route
                            path={EdtRoutesNameEnum.ROUTE_SECONDARY_ACTIVITY_SELECTION}
                            element={<RouteSecondaryActivitySelectionPage />}
                        />
                        <Route
                            path={EdtRoutesNameEnum.WITH_SOMEONE_SELECTION}
                            element={<WithSomeoneSelectionPage />}
                        />
                    </Route>
                    <Route
                        path={EdtRoutesNameEnum.GREATEST_ACTIVITY_DAY}
                        element={<GreatestActivityDayPage />}
                    />
                    <Route
                        path={EdtRoutesNameEnum.WORST_ACTIVITY_DAY}
                        element={<WorstActivityDayPage />}
                    />
                    <Route path={EdtRoutesNameEnum.KIND_OF_DAY} element={<KindOfDayPage />} />
                    <Route path={EdtRoutesNameEnum.EXCEPTIONAL_DAY} element={<ExceptionalDayPage />} />
                    <Route path={EdtRoutesNameEnum.TRAVEL_TIME} element={<TravelTimePage />} />
                    <Route path={EdtRoutesNameEnum.PHONE_TIME} element={<PhoneTimePage />} />
                </Route>
                <Route path={EdtRoutesNameEnum.WORK_TIME} element={<WorkTimePage />}>
                    <Route path={EdtRoutesNameEnum.WHO_ARE_YOU} element={<WhoAreYouPage />} />
                    <Route path={EdtRoutesNameEnum.DAY_OF_SURVEY} element={<DayOfSurveyPage />} />
                    <Route path={EdtRoutesNameEnum.WEEKLY_PLANNER} element={<WeeklyPlannerPage />} />
                    <Route path={EdtRoutesNameEnum.KIND_OF_WEEK} element={<KindOfWeekPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export { EdtRoutes };
