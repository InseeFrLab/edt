import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import SurveyPage from "components/commons/SurveyPage/SurveyPage";
import { OrchestratorContext } from "interface/lunatic/Lunatic";
import { makeStylesEdt } from "lunatic-edt";
import { callbackHolder } from "orchestrator/Orchestrator";
import React from "react";
import { Outlet, useNavigate, useOutletContext } from "react-router-dom";
import { getCurrentNavigatePath } from "service/navigation-service";
import { getPrintedFirstName, saveData } from "service/survey-service";

const ActivityPlannerPage = () => {
    const navigate = useNavigate();
    const context = useOutletContext() as OrchestratorContext;
    const { classes } = useStyles();
    const [isSubchildDisplayed, setIsSubChildDisplayed] = React.useState(false);

    const saveAndGoHome = (): void => {
        saveData(context.idSurvey, callbackHolder.getData()).then(() => {
            navigate("/");
        });
    };

    const save = (): void => {
        saveData(context.idSurvey, callbackHolder.getData());
    };

    const validate = () => {
        console.log(callbackHolder.getData());
        save();
        //save();
    };

    const navBack = () => {
        saveAndGoHome();
    };

    const onEdit = () => {
        //TODO : sprint 5 edition des données
    };

    const navToActivity = (iteration: number): void => {
        setIsSubChildDisplayed(true);
        navigate(
            getCurrentNavigatePath(
                context.idSurvey,
                context.surveyRootPage,
                context.source.maxPage,
                "4",
                iteration,
            ),
        );
    };

    return (
        <>
            {!isSubchildDisplayed && (
                <SurveyPage
                    onNavigateBack={navBack}
                    onEdit={onEdit}
                    firstName={getPrintedFirstName(context.idSurvey)}
                    validate={validate}
                >
                    <FlexCenter>
                        <h1>ici la liste des activites avec redirection iteration</h1>
                    </FlexCenter>
                    <div onClick={() => navToActivity(0)}>Activite 1</div>
                    <div onClick={() => navToActivity(1)}>Activite 2</div>
                </SurveyPage>
            )}
            <Outlet
                context={{
                    source: context.source,
                    data: context.data,
                    idSurvey: context.idSurvey,
                    surveyRootPage: context.surveyRootPage,
                }}
            />
        </>
    );
};

const useStyles = makeStylesEdt({ "name": { ActivityPlannerPage } })(() => ({}));

export default ActivityPlannerPage;
