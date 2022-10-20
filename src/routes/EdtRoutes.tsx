import ActivityPage from "pages/activity/Activity";
import HelpPage from "pages/help/Help";
import HomePage from "pages/home/Home";
import NotFoundPage from "pages/not-found/NotFound";
import OrchestratorPage from "pages/orchestrator/Orchestrator";
import WhoAreYouPage from "pages/who-are-you/WhoAreYou";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const EdtRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="*" element={<NotFoundPage />} />
                <Route path="/" element={<HomePage />} />
                <Route path="help" element={<HelpPage />} />
                <Route path="activity" element={<ActivityPage />} />
                <Route path="who-are-you" element={<WhoAreYouPage />} />
                {/* DEV : dev purpose only*/}
                <Route path="orchestrator" element={<OrchestratorPage />} />
            </Routes>
        </BrowserRouter>
    );
};

export default EdtRoutes;
