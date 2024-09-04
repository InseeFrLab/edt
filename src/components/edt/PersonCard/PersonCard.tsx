import { important, makeStylesEdt } from "@inseefrlab/lunatic-edt";
import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from "@mui/material";
import ExpandMoreIcon from "../../../assets/illustration/mui-icon/expand-more-white.svg?react";
import CatIcon from "../../../assets/illustration/person/cat.svg?react";
import OwlIcon from "../../../assets/illustration/person/owl.svg?react";
import ZebraIcon from "../../../assets/illustration/person/zebra.svg?react";
import FlexCenter from "../../../components/commons/FlexCenter/FlexCenter";
import DayCard from "../../../components/edt/DayCard/DayCard";
import WeekCard from "../../../components/edt/WeekCard/WeekCard";
import { EdtRoutesNameEnum } from "../../../enumerations/EdtRoutesNameEnum";
import { FieldNameEnum } from "../../../enumerations/FieldNameEnum";
import { LocalStorageVariableEnum } from "../../../enumerations/LocalStorageVariableEnum";
import { SourcesEnum } from "../../../enumerations/SourcesEnum";
import { Person } from "../../../interface/entity/Person";
import { OrchestratorContext } from "../../../interface/lunatic/Lunatic";
import { callbackHolder } from "../../../orchestrator/Orchestrator";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
    navToActivityOrPlannerOrSummary,
    navToWeeklyPlannerOrClose,
    setEnviro,
} from "../../../service/navigation-service";
import { isMobile } from "../../../service/responsive";
import Icon from "../Icon/Icon";
import {
    getData,
    getPrintedSurveyDate,
    getSource,
    getSurveyRights,
    getValue,
} from "../../../service/survey-service";

interface PersonCardProps {
    values: Person[];
    numPerson: number;
}

const PersonCard = (props: PersonCardProps) => {
    const { values, numPerson } = props;
    const { t } = useTranslation();
    const navigate = useNavigate();

    const isItMobile = isMobile();
    const { classes, cx } = useStyles({ "isMobileScreen": isItMobile });

    const imagesArray = [ZebraIcon, OwlIcon, CatIcon];
    const numGroup = values[0].num;

    const getFirstNameOfGroup = () => {
        const firstNamesInputs: string[] = values
            .map(val => {
                const idSurvey = val.data.surveyUnitId;
                const valueFirstName = getValue(idSurvey, FieldNameEnum.FIRSTNAME);
                return valueFirstName;
            })
            .filter(val => val != null);

        if (firstNamesInputs.length > 0) {
            return firstNamesInputs[0];
        } else {
            return t("common.user.person") + " " + numGroup;
        }
    };

    const formClose = (idSurvey: string) => {
        const surveyIsClosed = getValue(idSurvey, FieldNameEnum.ISCLOSED) as boolean;
        return surveyIsClosed;
    };

    const navActivity = useCallback(
        (idSurvey: string) => () => {
            let data = getData(idSurvey || "");
            let context: OrchestratorContext = {
                source: getSource(SourcesEnum.ACTIVITY_SURVEY),
                data: data,
                idSurvey: idSurvey,
                surveyRootPage: EdtRoutesNameEnum.ACTIVITY,
                global: false,
                rightsSurvey: getSurveyRights(idSurvey ?? ""),
            };
            localStorage.setItem(LocalStorageVariableEnum.IS_GLOBAL, "false");
            localStorage.setItem(LocalStorageVariableEnum.IDSURVEY_CURRENT, idSurvey);

            setEnviro(context, navigate, callbackHolder);

            navToActivityOrPlannerOrSummary(
                idSurvey,
                getSource(SourcesEnum.ACTIVITY_SURVEY).maxPage,
                navigate,
                getSource(SourcesEnum.ACTIVITY_SURVEY),
            );
        },
        [],
    );

    const renderActivityCard = useCallback((activitySurveyId: string, index: number) => {
        return (
            <Box key={"dayCard-" + index}>
                <DayCard
                    labelledBy={""}
                    describedBy={""}
                    onClick={navActivity(activitySurveyId)}
                    surveyDate={getPrintedSurveyDate(activitySurveyId)}
                    idSurvey={activitySurveyId}
                    isClose={formClose(activitySurveyId)}
                    tabIndex={index}
                />
            </Box>
        );
    }, []);

    const navWorkTime = useCallback(
        (idSurvey: string) => () => {
            let data = getData(idSurvey || "");

            localStorage.setItem(LocalStorageVariableEnum.IS_GLOBAL, "false");
            localStorage.setItem(LocalStorageVariableEnum.IDSURVEY_CURRENT, idSurvey);

            let context: OrchestratorContext = {
                source: getSource(SourcesEnum.WORK_TIME_SURVEY),
                data: data,
                idSurvey: idSurvey,
                surveyRootPage: EdtRoutesNameEnum.WORK_TIME,
                global: false,
                rightsSurvey: getSurveyRights(idSurvey ?? ""),
            };
            setEnviro(context, navigate, callbackHolder);
            return navToWeeklyPlannerOrClose(
                idSurvey,
                navigate,
                getSource(SourcesEnum.WORK_TIME_SURVEY),
            );
        },
        [],
    );

    const renderWorkTimeCard = useCallback((workTimeSurvey: string, index: number) => {
        return (
            <Box key={"weekCard-" + index}>
                <WeekCard
                    labelledBy={""}
                    describedBy={""}
                    onClick={navWorkTime(workTimeSurvey)}
                    surveyDate={getPrintedSurveyDate(workTimeSurvey, EdtRoutesNameEnum.WORK_TIME)}
                    isClose={formClose(workTimeSurvey)}
                    tabIndex={index + 1}
                />
            </Box>
        );
    }, []);

    const renderAccordion = () => {
        const firstName = getFirstNameOfGroup();
        return (
            <Accordion className={classes.personCardBox}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon aria-label={t("accessibility.asset.mui-icon.close")} />}
                    aria-controls="panel-content"
                    id="panel-header"
                    className={classes.headerPersonCard}
                >
                    <Box className={cx(classes.iconBox)}>
                        <Icon
                            icon={imagesArray[numPerson]}
                            alt={t("accessibility.asset.card.person-alt")}
                        />
                    </Box>
                    <Box className={classes.textBox}>
                        <Typography>{firstName}</Typography>
                    </Box>
                </AccordionSummary>
                <AccordionDetails className={classes.surveysBox}>
                    {values.map((data, index) =>
                        data.data.questionnaireModelId == SourcesEnum.ACTIVITY_SURVEY
                            ? renderActivityCard(data.data.surveyUnitId, index + 1)
                            : renderWorkTimeCard(data.data.surveyUnitId, index + 1),
                    )}
                </AccordionDetails>
            </Accordion>
        );
    };

    return <FlexCenter>{renderAccordion()}</FlexCenter>;
};

const useStyles = makeStylesEdt<{ isMobileScreen: boolean }>({ "name": { PersonCard } })(
    (theme, { isMobileScreen }) => ({
        personCardBox: {
            width: isMobileScreen ? "90%" : "55%",
            backgroundColor: theme.palette.secondary.main,
            color: theme.variables.white,
            margin: "0.5rem 0rem",
        },
        iconBox: {
            marginRight: "1rem",
            backgroundColor: theme.variables.white,
            borderRadius: "50% 20px",
            height: "38px",
            width: "38px",
            "img": {
                height: "37px",
                width: "40px",
            },
        },
        textBox: {
            margin: "auto 0rem",
        },
        headerPersonCard: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            maxHeight: "4rem",
            ".MuiAccordionSummary-content": {
                "&.Mui-expanded": {
                    margin: important("0px"),
                    minHeight: "48px",
                },
                minHeight: "48px",
            },
            "&.Mui-expanded": {
                margin: important("0px"),
                minHeight: "48px",
            },
        },
        surveysBox: {
            padding: important("0px 16px 16px 16px"),
        },
    }),
);

export default PersonCard;
