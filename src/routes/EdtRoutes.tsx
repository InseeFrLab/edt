import { OrchestratorEdtNavigation } from "interface/route/OrchestratorEdtNavigation";
import ActivityPage from "pages/activity/Activity";
import DayOfSurveyPage from "pages/day-of-survey/DayOfSurvey";
import HelpPage from "pages/help/Help";
import HomePage from "pages/home/Home";
import NotFoundPage from "pages/not-found/NotFound";
import WhoAreYouPage from "pages/who-are-you/WhoAreYou";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const enum EdtRoutesNameEnum {
    HELP = "help",
    ACTIVITY = "activity/:idSurvey",
    ACTIVITY_WHO_ARE_YOU = "who-are-you",
    ACTIVITY_DAY_OF_SURVEY = "day-of-survey",
}

const mappingPageOrchestrator: OrchestratorEdtNavigation[] = [
    {
        page: EdtRoutesNameEnum.ACTIVITY_WHO_ARE_YOU,
        surveySource: "activity-survey.json",
        surveyPage: "1",
    },
    {
        page: EdtRoutesNameEnum.ACTIVITY_DAY_OF_SURVEY,
        surveySource: "activity-survey.json",
        surveyPage: "2",
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
                    <Route path={EdtRoutesNameEnum.ACTIVITY_WHO_ARE_YOU} element={<WhoAreYouPage />} />
                    <Route
                        path={EdtRoutesNameEnum.ACTIVITY_DAY_OF_SURVEY}
                        element={<DayOfSurveyPage />}
                    />
                </Route>
                {/* DEV : dev purpose only*/}
            </Routes>
        </BrowserRouter>
    );
};

export { EdtRoutes, EdtRoutesNameEnum, mappingPageOrchestrator };
