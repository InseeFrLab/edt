import { makeStylesEdt } from "@inseefrlab/lunatic-edt";
import { Box, Typography } from "@mui/material";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import SurveyPage from "components/commons/SurveyPage/SurveyPage";
import ActivityOrRouteCard from "components/edt/ActivityCard/ActivityOrRouteCard";
import StepNavCard from "components/edt/StepNavCard/StepNavCard";
import { EdtRoutesNameEnum } from "enumerations/EdtRoutesNameEnum";
import { LoopEnum } from "enumerations/LoopEnum";
import { OrchestratorContext } from "interface/lunatic/Lunatic";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useOutletContext, useParams } from "react-router-dom";
import { loopActivityRouteStepperData, loopActivityStepperData } from "service/loop-stepper-service";
import { getLoopParameterizedNavigatePath, navFullPath } from "service/navigation-service";
import { surveyReadOnly } from "service/survey-activity-service";
import { getSurveyIdFromUrl } from "utils/utils";

const EditActivityInformationPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const context: OrchestratorContext = useOutletContext();
    const location = useLocation();
    const idSurvey = getSurveyIdFromUrl(context, location);

    const { classes } = useStyles();
    const paramIteration = useParams().iteration;
    const currentIteration = paramIteration ? +paramIteration : 0;
    const stepsData = context.activityOrRoute?.isRoute
        ? loopActivityRouteStepperData
        : loopActivityStepperData;

    const navToStep = useCallback(
        (page: EdtRoutesNameEnum) => () =>
            navigate(
                getLoopParameterizedNavigatePath(
                    idSurvey,
                    page,
                    LoopEnum.ACTIVITY_OR_ROUTE,
                    currentIteration,
                ),
            ),
        [],
    );

    return (
        <SurveyPage
            idSurvey={idSurvey}
            onNavigateBack={useCallback(
                () => navFullPath(idSurvey, EdtRoutesNameEnum.ACTIVITY_OR_ROUTE_PLANNER),
                [],
            )}
            onPrevious={useCallback(
                () => navFullPath(idSurvey, EdtRoutesNameEnum.ACTIVITY_OR_ROUTE_PLANNER),
                [],
            )}
            simpleHeaderLabel={t("page.edit-activity-information.header")}
            simpleHeader={true}
            backgroundWhiteHeader={false}
            modifiable={!surveyReadOnly(context.rightsSurvey)}
        >
            <FlexCenter>
                <ActivityOrRouteCard
                    labelledBy={""}
                    describedBy={""}
                    activityOrRoute={context.activityOrRoute ?? {}}
                />
            </FlexCenter>
            <Box className={classes.titleBox}>
                <Typography className={classes.title}>
                    {t("page.edit-activity-information.what-to-edit")}
                </Typography>
            </Box>
            <Box className={classes.flexColumn}>
                {stepsData
                    .filter(stepData => !stepData.isConditional)
                    .map(stepData => (
                        <StepNavCard
                            key={"nav-to-step-" + stepData.stepNumber}
                            onClick={navToStep(stepData.page)}
                            labelledBy={""}
                            describedBy={""}
                            stepData={stepData}
                        />
                    ))}
            </Box>
        </SurveyPage>
    );
};

const useStyles = makeStylesEdt({ "name": { StepNavCard } })(theme => ({
    flexColumn: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    titleBox: {
        marginLeft: "5%",
        marginTop: "2rem",
        marginBottom: "2rem",
    },
    title: {
        fontSize: "18px",
        fontWeight: "bold",
        color: theme.palette.text.primary,
    },
}));

export default EditActivityInformationPage;
