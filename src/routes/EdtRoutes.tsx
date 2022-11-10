import ActivityPage from "pages/activity/Activity";
import HelpPage from "pages/help/Help";
import HomePage from "pages/home/Home";
import NotFoundPage from "pages/not-found/NotFound";
import OrchestratorPage from "pages/orchestrator/Orchestrator";
import WhoAreYouPage from "pages/who-are-you/WhoAreYou";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const enum EdtRoutesNameEnum {
    HELP = "help",
    ACTIVITY = "activity/*",
    WHO_ARE_YOU = "who-are-you",
    //dev purpose only
    ORCHESTRATOR = "orchestrator",
}

const EdtRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="*" element={<NotFoundPage />} />
                <Route path="/" element={<HomePage />} />
                <Route path={EdtRoutesNameEnum.HELP} element={<HelpPage />} />
                <Route path={EdtRoutesNameEnum.ACTIVITY} element={<ActivityPage />}>
                    <Route path={EdtRoutesNameEnum.WHO_ARE_YOU} element={<WhoAreYouPage />} />
                </Route>
                {/* DEV : dev purpose only*/}
                <Route path={EdtRoutesNameEnum.ORCHESTRATOR} element={<OrchestratorPage />} />
            </Routes>
        </BrowserRouter>
    );
};

const getNavigatePath = (page: EdtRoutesNameEnum): string => {
    return "/" + page;
};

export { EdtRoutes, EdtRoutesNameEnum, getNavigatePath };
