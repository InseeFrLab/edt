import { useEffect } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { getCurrentActivityNavigatePath } from "service/navigation-service";
import { getCurrentPageSource } from "service/orchestrator-service";
import { getData } from "service/survey-activity-service";

const WorkTimePage = () => {
    const { idSurvey } = useParams();
    //handle error empty idSurvey and remove ?? "" and || ""
    const data = getData(idSurvey || "");
    const source = getCurrentPageSource(idSurvey || "") as object | null;
    const navigate = useNavigate();

    useEffect(() => {
        if (idSurvey && source) {
            navigate(getCurrentActivityNavigatePath(idSurvey));
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
