import { useEffect } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { EdtRoutesNameEnum } from "routes/EdtRoutesMapping";
import { getCurrentNavigatePath, getOrchestratorPage } from "service/navigation-service";
import { getCurrentPageSource, getCurrentSurveyRootPage } from "service/orchestrator-service";
import { FieldNameEnum, getData, getValue } from "service/survey-service";

const ActivityPage = () => {
    const { idSurvey } = useParams();
    //handle error empty idSurvey and remove ?? "" and || ""
    const data = getData(idSurvey || "");
    const source = getCurrentPageSource();
    const navigate = useNavigate();
    const surveyRootPage = getCurrentSurveyRootPage();

    useEffect(() => {
        window.onpopstate = () => {
            navigate("/");
        };

        if (idSurvey && source) {
            const activityIsClosed = getValue(idSurvey, FieldNameEnum.ISCLOSED);
            navigate(
                getCurrentNavigatePath(
                    idSurvey,
                    surveyRootPage,
                    activityIsClosed
                        ? source.maxPage
                        : getOrchestratorPage(EdtRoutesNameEnum.ACTIVITY_OR_ROUTE_PLANNER),
                ),
            );
        } else {
            //TODO : redirect to error page ??
        }
    }, []);

    return (
        <>
            <Outlet
                context={{
                    source: source,
                    data: data,
                    idSurvey: idSurvey,
                    surveyRootPage: surveyRootPage,
                }}
            />
        </>
    );
};

export default ActivityPage;
