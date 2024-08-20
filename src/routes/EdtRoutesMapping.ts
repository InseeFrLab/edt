import { EdtRoutesNameEnum } from "enumerations/EdtRoutesNameEnum";
import { LoopEnum } from "enumerations/LoopEnum";
import { OrchestratorEdtNavigation } from "interface/route/OrchestratorEdtNavigation";
import { getLoopInitialPage } from "service/loop-service";

let mappingPageOrchestrator: OrchestratorEdtNavigation[] = [
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
        page: EdtRoutesNameEnum.ACTIVITY_OR_ROUTE_PLANNER,
        surveySource: "activity-survey.json",
        surveyPage: "3",
    },
    {
        parentPage: EdtRoutesNameEnum.ACTIVITY_OR_ROUTE_PLANNER,
        page: EdtRoutesNameEnum.ACTIVITY_DURATION,
        surveySource: "activity-survey.json",
        surveyPage: getLoopInitialPage(LoopEnum.ACTIVITY_OR_ROUTE),
        surveySubPage: "2",
        surveyStep: 1,
    },
    {
        parentPage: EdtRoutesNameEnum.ACTIVITY_OR_ROUTE_PLANNER,
        page: EdtRoutesNameEnum.MAIN_ACTIVITY,
        surveySource: "activity-survey.json",
        surveyPage: getLoopInitialPage(LoopEnum.ACTIVITY_OR_ROUTE),
        surveySubPage: "3",
        surveyStep: 2,
    },
    {
        parentPage: EdtRoutesNameEnum.ACTIVITY_OR_ROUTE_PLANNER,
        page: EdtRoutesNameEnum.ROUTE,
        surveySource: "activity-survey.json",
        surveyPage: getLoopInitialPage(LoopEnum.ACTIVITY_OR_ROUTE),
        surveySubPage: "4",
        surveyStep: 2,
    },
    {
        parentPage: EdtRoutesNameEnum.ACTIVITY_OR_ROUTE_PLANNER,
        page: EdtRoutesNameEnum.MEAN_OF_TRANSPORT,
        surveySource: "activity-survey.json",
        surveyPage: getLoopInitialPage(LoopEnum.ACTIVITY_OR_ROUTE),
        surveySubPage: "5",
        surveyStep: 3,
    },
    {
        parentPage: EdtRoutesNameEnum.ACTIVITY_OR_ROUTE_PLANNER,
        page: EdtRoutesNameEnum.SECONDARY_ACTIVITY,
        surveySource: "activity-survey.json",
        surveyPage: getLoopInitialPage(LoopEnum.ACTIVITY_OR_ROUTE),
        surveySubPage: "6",
        surveyStep: 3,
    },
    {
        parentPage: EdtRoutesNameEnum.ACTIVITY_OR_ROUTE_PLANNER,
        page: EdtRoutesNameEnum.SECONDARY_ACTIVITY_SELECTION,
        surveySource: "activity-survey.json",
        surveyPage: getLoopInitialPage(LoopEnum.ACTIVITY_OR_ROUTE),
        surveySubPage: "7",
        surveyStep: 3,
    },
    {
        parentPage: EdtRoutesNameEnum.ACTIVITY_OR_ROUTE_PLANNER,
        page: EdtRoutesNameEnum.ACTIVITY_LOCATION,
        surveySource: "activity-survey.json",
        surveyPage: getLoopInitialPage(LoopEnum.ACTIVITY_OR_ROUTE),
        surveySubPage: "8",
        surveyStep: 4,
    },
    {
        parentPage: EdtRoutesNameEnum.ACTIVITY_OR_ROUTE_PLANNER,
        page: EdtRoutesNameEnum.WITH_SOMEONE,
        surveySource: "activity-survey.json",
        surveyPage: getLoopInitialPage(LoopEnum.ACTIVITY_OR_ROUTE),
        surveySubPage: "9",
        surveyStep: 5,
    },
    {
        parentPage: EdtRoutesNameEnum.ACTIVITY_OR_ROUTE_PLANNER,
        page: EdtRoutesNameEnum.WITH_SOMEONE_SELECTION,
        surveySource: "activity-survey.json",
        surveyPage: getLoopInitialPage(LoopEnum.ACTIVITY_OR_ROUTE),
        surveySubPage: "10",
        surveyStep: 5,
    },
    {
        parentPage: EdtRoutesNameEnum.ACTIVITY_OR_ROUTE_PLANNER,
        page: EdtRoutesNameEnum.WITH_SCREEN,
        surveySource: "activity-survey.json",
        surveyPage: getLoopInitialPage(LoopEnum.ACTIVITY_OR_ROUTE),
        surveySubPage: "11",
        surveyStep: 6,
    },
    {
        parentPage: EdtRoutesNameEnum.ACTIVITY_OR_ROUTE_PLANNER,
        page: EdtRoutesNameEnum.MAIN_ACTIVITY_GOAL,
        surveySource: "activity-survey.json",
        surveyPage: getLoopInitialPage(LoopEnum.ACTIVITY_OR_ROUTE),
        surveySubPage: "12",
        surveyStep: 2,
    },
    {
        parentPage: EdtRoutesNameEnum.ACTIVITY,
        page: EdtRoutesNameEnum.GREATEST_ACTIVITY_DAY,
        surveySource: "activity-survey.json",
        surveyPage: "5",
    },
    {
        parentPage: EdtRoutesNameEnum.ACTIVITY,
        page: EdtRoutesNameEnum.WORST_ACTIVITY_DAY,
        surveySource: "activity-survey.json",
        surveyPage: "6",
    },
    {
        parentPage: EdtRoutesNameEnum.ACTIVITY,
        page: EdtRoutesNameEnum.KIND_OF_DAY,
        surveySource: "activity-survey.json",
        surveyPage: "7",
    },
    {
        parentPage: EdtRoutesNameEnum.ACTIVITY,
        page: EdtRoutesNameEnum.EXCEPTIONAL_DAY,
        surveySource: "activity-survey.json",
        surveyPage: "8",
    },
    {
        parentPage: EdtRoutesNameEnum.ACTIVITY,
        page: EdtRoutesNameEnum.TRAVEL_TIME,
        surveySource: "activity-survey.json",
        surveyPage: "9",
    },
    {
        parentPage: EdtRoutesNameEnum.ACTIVITY,
        page: EdtRoutesNameEnum.PHONE_TIME,
        surveySource: "activity-survey.json",
        surveyPage: "10",
    },
    {
        parentPage: EdtRoutesNameEnum.ACTIVITY,
        page: EdtRoutesNameEnum.EDIT_GLOBAL_INFORMATION,
        surveySource: "activity-survey.json",
        surveyPage: "3",
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
    {
        parentPage: EdtRoutesNameEnum.WORK_TIME,
        page: EdtRoutesNameEnum.KIND_OF_WEEK,
        surveySource: "work-time-survey.json",
        surveyPage: "4",
    },
    {
        parentPage: EdtRoutesNameEnum.WORK_TIME,
        page: EdtRoutesNameEnum.EDIT_GLOBAL_INFORMATION,
        surveySource: "work-time-survey.json",
        surveyPage: "5",
    },
];

const routesToIgnoreForActivity = [EdtRoutesNameEnum.ROUTE, EdtRoutesNameEnum.MEAN_OF_TRANSPORT];

const routesToIgnoreForRoute = [
    EdtRoutesNameEnum.MAIN_ACTIVITY,
    EdtRoutesNameEnum.MAIN_ACTIVITY_GOAL,
    EdtRoutesNameEnum.SECONDARY_ACTIVITY,
    EdtRoutesNameEnum.ACTIVITY_LOCATION,
    EdtRoutesNameEnum.WITH_SOMEONE,
    EdtRoutesNameEnum.WITH_SCREEN,
    EdtRoutesNameEnum.SECONDARY_ACTIVITY_SELECTION,
    EdtRoutesNameEnum.WITH_SOMEONE_SELECTION,
];

export { EdtRoutesNameEnum, mappingPageOrchestrator, routesToIgnoreForActivity, routesToIgnoreForRoute };
