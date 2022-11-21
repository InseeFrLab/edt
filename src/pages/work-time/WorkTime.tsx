import { useEffect } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { getCurrentNavigatePath } from "service/navigation-service";
import { getCurrentPageSource, getCurrentSurveyParentPage } from "service/orchestrator-service";
import { getData } from "service/survey-service";

const WorkTimePage = () => {
    const { idSurvey } = useParams();
    //handle error empty idSurvey and remove ?? "" and || ""
    const data = getData(idSurvey || "");
    const source = getCurrentPageSource();
    const navigate = useNavigate();

    useEffect(() => {
        window.onpopstate = () => {
            navigate("/");
        };

        if (idSurvey && source) {
            navigate(getCurrentNavigatePath(idSurvey, getCurrentSurveyParentPage(), source.maxPage));
        } else {
            //TODO : redirect to error page ??
        }
    }, []);

    return (
        <>
            <Outlet context={{ source: source, data: data, idSurvey: idSurvey }} />
        </>
    );
};

export default WorkTimePage;
