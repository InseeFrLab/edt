import { OrchestratorEdtNavigation } from "interface/route/OrchestratorEdtNavigation";
import { getLoopInitialPage, LoopEnum } from "service/loop-service";

const enum EdtRoutesNameEnum {
    HELP = "help",
    ERROR = "error",
    ACTIVITY = "activity/:idSurvey",
    WHO_ARE_YOU = "who-are-you",
    DAY_OF_SURVEY = "day-of-survey",
    WORK_TIME = "work-time/:idSurvey",
    WEEKLY_PLANNER = "weekly-planner",
    ACTIVITY_PLANNER = "activity-planner",
    ACTIVITY_DURATION = "activity-duration/:iteration",
    MAIN_ACTIVITY = "main-activity/:iteration",
    MAIN_ACTIVITY_GOAL = "main-activity-goal/:iteration",
    SECONDARY_ACTIVITY = "secondary-activity/:iteration",
    SECONDARY_ACTIVITY_SELECTION = "secondary-activity-selection/:iteration",
    ACTIVITY_LOCATION = "activity-location/:iteration",
    WITH_SOMEONE = "with-who/:iteration",
    WITH_SOMEONE_SELECTION = "with-who-selection/:iteration",
    WITH_SCREEN = "with-screen/:iteration",
}

const mappingPageOrchestrator: OrchestratorEdtNavigation[] = [
    {
        parentPage: EdtRoutesNameEnum.ACTIVITY,
        page: EdtRoutesNameEnum.WHO_ARE_YOU,
        surveySource: "activity-survey.json",
        surveyPage: "1",
    },
    {
        parentPage: EdtRoutesNameEnum.ACTIVITY,
        page: EdtRoutesNameEnum.DAY_OF_SURVEY,
        surveySource: "activity-survey.json",
        surveyPage: "2",
    },
    {
        parentPage: EdtRoutesNameEnum.ACTIVITY,
        page: EdtRoutesNameEnum.ACTIVITY_PLANNER,
        surveySource: "activity-survey.json",
        surveyPage: "3",
    },
    {
        parentPage: EdtRoutesNameEnum.ACTIVITY_PLANNER,
        page: EdtRoutesNameEnum.ACTIVITY_DURATION,
        surveySource: "activity-survey.json",
        surveyPage: getLoopInitialPage(LoopEnum.ACTIVITY),
        surveySubPage: "2",
        surveyStep: 1,
    },
    {
        parentPage: EdtRoutesNameEnum.ACTIVITY_PLANNER,
        page: EdtRoutesNameEnum.MAIN_ACTIVITY,
        surveySource: "activity-survey.json",
        surveyPage: getLoopInitialPage(LoopEnum.ACTIVITY),
        surveySubPage: "3",
        surveyStep: 2,
    },
    {
        parentPage: EdtRoutesNameEnum.ACTIVITY_PLANNER,
        page: EdtRoutesNameEnum.SECONDARY_ACTIVITY,
        surveySource: "activity-survey.json",
        surveyPage: getLoopInitialPage(LoopEnum.ACTIVITY),
        surveySubPage: "4",
        surveyStep: 3,
    },
    {
        parentPage: EdtRoutesNameEnum.ACTIVITY_PLANNER,
        page: EdtRoutesNameEnum.ACTIVITY_LOCATION,
        surveySource: "activity-survey.json",
        surveyPage: getLoopInitialPage(LoopEnum.ACTIVITY),
        surveySubPage: "5",
        surveyStep: 4,
    },
    {
        parentPage: EdtRoutesNameEnum.ACTIVITY_PLANNER,
        page: EdtRoutesNameEnum.WITH_SOMEONE,
        surveySource: "activity-survey.json",
        surveyPage: getLoopInitialPage(LoopEnum.ACTIVITY),
        surveySubPage: "6",
        surveyStep: 5,
    },
    {
        parentPage: EdtRoutesNameEnum.ACTIVITY_PLANNER,
        page: EdtRoutesNameEnum.WITH_SCREEN,
        surveySource: "activity-survey.json",
        surveyPage: getLoopInitialPage(LoopEnum.ACTIVITY),
        surveySubPage: "7",
        surveyStep: 6,
    },
    {
        parentPage: EdtRoutesNameEnum.ACTIVITY_PLANNER,
        page: EdtRoutesNameEnum.MAIN_ACTIVITY_GOAL,
        surveySource: "activity-survey.json",
        surveyPage: getLoopInitialPage(LoopEnum.ACTIVITY),
        surveySubPage: "8",
        surveyStep: 2,
    },
    {
        parentPage: EdtRoutesNameEnum.ACTIVITY_PLANNER,
        page: EdtRoutesNameEnum.SECONDARY_ACTIVITY_SELECTION,
        surveySource: "activity-survey.json",
        surveyPage: getLoopInitialPage(LoopEnum.ACTIVITY),
        surveySubPage: "9",
        surveyStep: 3,
    },
    {
        parentPage: EdtRoutesNameEnum.ACTIVITY_PLANNER,
        page: EdtRoutesNameEnum.WITH_SOMEONE_SELECTION,
        surveySource: "activity-survey.json",
        surveyPage: getLoopInitialPage(LoopEnum.ACTIVITY),
        surveySubPage: "10",
        surveyStep: 5,
    },
    {
        parentPage: EdtRoutesNameEnum.WORK_TIME,
        page: EdtRoutesNameEnum.WHO_ARE_YOU,
        surveySource: "work-time-survey.json",
        surveyPage: "1",
    },
    {
        parentPage: EdtRoutesNameEnum.WORK_TIME,
        page: EdtRoutesNameEnum.DAY_OF_SURVEY,
        surveySource: "work-time-survey.json",
        surveyPage: "2",
    },
    {
        parentPage: EdtRoutesNameEnum.WORK_TIME,
        page: EdtRoutesNameEnum.WEEKLY_PLANNER,
        surveySource: "work-time-survey.json",
        surveyPage: "3",
    },
];

export { mappingPageOrchestrator, EdtRoutesNameEnum };
