import ActivityPage from "pages/activity/Activity";
import ActivityOrRoutePlannerPage from "pages/activity/activity-or-route-planner/ActivityOrRoutePlanner";
import ActivityDurationPage from "pages/activity/activity-or-route-planner/activity-duration/ActivityDuration";
import ActivityLocationPage from "pages/activity/activity-or-route-planner/activity/activity-location/ActivityLocation";
import MainActivityGoalPage from "pages/activity/activity-or-route-planner/activity/main-activity-goal/MainActivityGoal";
import MainActivityPage from "pages/activity/activity-or-route-planner/activity/main-activity/MainActivity";
import MeanOfTransportPage from "pages/activity/activity-or-route-planner/route/mean-of-transport/MeanOfTransport";
import RoutePage from "pages/activity/activity-or-route-planner/route/route/Route";
import SecondaryActivitySelectionPage from "pages/activity/activity-or-route-planner/secondary-activity-selection/SecondaryActivitySelection";
import SecondaryActivityPage from "pages/activity/activity-or-route-planner/secondary-activity/SecondaryActivity";
import WithScreenPage from "pages/activity/activity-or-route-planner/with-screen/WithScreen";
import WithSomeoneSelectionPage from "pages/activity/activity-or-route-planner/with-someone-selection/WithSomeoneSelection";
import WithSomeonePage from "pages/activity/activity-or-route-planner/with-someone/WithSomeone";
import ActivitySummaryPage from "pages/activity/activity-summary/ActivitySummary";
import EditActivityInformationPage from "pages/activity/edit-activity-information/EditActivityInformation";
import ExceptionalDayPage from "pages/activity/exceptional-day/ExceptionalDay";
import GreatestActivityDayPage from "pages/activity/greatest-activity-day/GreatestActivityDay";
import HelpActivityPage from "pages/activity/help/HelpActivity/HelpActivity";
import HelpCheckboxPage from "pages/activity/help/HelpCheckbox/HelpCheckbox";
import HelpDurationPage from "pages/activity/help/HelpDuration/HelpDuration";
import {
    default as HelpInstallPage,
    default as InstallPage,
} from "pages/activity/help/HelpInstallPage/HelpInstallPage";
import HelpCategoryActivityPage from "pages/activity/help/HelpMainActivity/HelpCategoryActivity";
import HelpSubCategoryActivityPage from "pages/activity/help/HelpMainActivity/HelpSubCategoryActivity";
import HelpWorkTimePage from "pages/activity/help/HelpWorkTime/HelpWorkTime";
import KindOfDayPage from "pages/activity/kind-of-day/KindOfDay";
import PhoneTimePage from "pages/activity/phone-time/PhoneTime";
import TravelTimePage from "pages/activity/travel-time/TravelTime";
import WorstActivityDayPage from "pages/activity/worst-activity-day/WorstActivityDay";
import DayOfSurveyPage from "pages/day-of-survey/DayOfSurvey";
import EditGlobalInformationPage from "pages/edit-global-information/EditGlobalInformation";
import EndSurveyPage from "pages/end-survey/EndSurvey";
import ErrorPage from "pages/error/Error";
import HelpPage from "pages/help/Help";
import HomeReviewerPage from "pages/home-reviewer/HomeReviewer";
import HomeSurveyedPage from "pages/home-surveyed/HomeSurveyed";
import HomePage from "pages/home/Home";
import NotFoundPage from "pages/not-found/NotFound";
import WhoAreYouPage from "pages/who-are-you/WhoAreYou";
import WorkTimePage from "pages/work-time/WorkTime";
import KindOfWeekPage from "pages/work-time/kind-of-week/KindOfWeek";
import WeeklyPlannerPage from "pages/work-time/weekly-planner/WeeklyPlanner";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { EdtRoutesNameEnum } from "./EdtRoutesMapping";

const EdtRoutes = (): JSX.Element => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="*" element={<NotFoundPage />} />
                <Route path="/" element={<HomePage />} />
                <Route path={EdtRoutesNameEnum.REVIEWER_HOME} element={<HomeReviewerPage />} />
                <Route path={EdtRoutesNameEnum.SURVEYED_HOME} element={<HomeSurveyedPage />} />
                <Route path={EdtRoutesNameEnum.INSTALL} element={<InstallPage />} />
                <Route path={EdtRoutesNameEnum.HELP} element={<HelpPage />} />
                <Route path={EdtRoutesNameEnum.HELP_INSTALL} element={<HelpInstallPage />} />
                <Route path={EdtRoutesNameEnum.HELP_ACTIVITY} element={<HelpActivityPage />} />
                <Route path={EdtRoutesNameEnum.HELP_DURATION} element={<HelpDurationPage />} />
                <Route
                    path={EdtRoutesNameEnum.HELP_MAIN_ACTIVITY_CATEGORY}
                    element={<HelpCategoryActivityPage />}
                />
                <Route
                    path={EdtRoutesNameEnum.HELP_MAIN_ACTIVITY_SUB_CATEGORY}
                    element={<HelpSubCategoryActivityPage />}
                />
                <Route path={EdtRoutesNameEnum.HELP_CHECKBOX} element={<HelpCheckboxPage />} />
                <Route path={EdtRoutesNameEnum.HELP_WORK_TIME} element={<HelpWorkTimePage />} />

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
                            path={EdtRoutesNameEnum.SECONDARY_ACTIVITY_SELECTION}
                            element={<SecondaryActivitySelectionPage />}
                        />
                        <Route
                            path={EdtRoutesNameEnum.WITH_SOMEONE_SELECTION}
                            element={<WithSomeoneSelectionPage />}
                        />
                        <Route
                            path={EdtRoutesNameEnum.EDIT_ACTIVITY_INFORMATION}
                            element={<EditActivityInformationPage />}
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
                    <Route
                        path={EdtRoutesNameEnum.EDIT_GLOBAL_INFORMATION}
                        element={<EditGlobalInformationPage />}
                    />
                    <Route path={EdtRoutesNameEnum.END_SURVEY} element={<EndSurveyPage />} />
                    <Route path={EdtRoutesNameEnum.ACTIVITY_SUMMARY} element={<ActivitySummaryPage />} />
                </Route>
                <Route path={EdtRoutesNameEnum.WORK_TIME} element={<WorkTimePage />}>
                    <Route path={EdtRoutesNameEnum.WHO_ARE_YOU} element={<WhoAreYouPage />} />
                    <Route path={EdtRoutesNameEnum.DAY_OF_SURVEY} element={<DayOfSurveyPage />} />
                    <Route path={EdtRoutesNameEnum.WEEKLY_PLANNER} element={<WeeklyPlannerPage />} />
                    <Route path={EdtRoutesNameEnum.KIND_OF_WEEK} element={<KindOfWeekPage />} />
                    <Route
                        path={EdtRoutesNameEnum.EDIT_GLOBAL_INFORMATION}
                        element={<EditGlobalInformationPage />}
                    />
                    <Route path={EdtRoutesNameEnum.END_SURVEY} element={<EndSurveyPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export { EdtRoutes };
