import { Alert, makeStylesEdt } from "@inseefrlab/lunatic-edt";
import HelpIcon from "@mui/icons-material/Help";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import { Box, Button } from "@mui/material";
import disconnectIcon from "assets/illustration/disconnect.svg";
import logo from "assets/illustration/logo.png";
import reminder_note from "assets/illustration/reminder-note.svg";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import DayCard from "components/edt/DayCard/DayCard";
import WeekCard from "components/edt/WeekCard/WeekCard";
import { EdtRoutesNameEnum } from "enumerations/EdtRoutesNameEnum";
import { FieldNameEnum } from "enumerations/FieldNameEnum";
import { LocalStorageVariableEnum } from "enumerations/LocalStorageVariableEnum";
import { SourcesEnum } from "enumerations/SourcesEnum";
import { SurveysIdsEnum } from "enumerations/SurveysIdsEnum";
import { useAuth } from "oidc-react";
import React, { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { getFlatLocalStorageValue } from "service/local-storage-service";
import { lunaticDatabase } from "service/lunatic-database";
import {
    getNavigatePath,
    navToActivityOrPlannerOrSummary,
    navToWeeklyPlannerOrClose,
} from "service/navigation-service";
import {
    getPrintedFirstName,
    getPrintedSurveyDate,
    getSource,
    getValue,
    surveysIds,
} from "service/survey-service";

const HomePage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { classes } = useStyles();
    const auth = useAuth();
    const [isAlertDisplayed, setIsAlertDisplayed] = React.useState<boolean>(false);

    const hasSeenInstallScreenString = getFlatLocalStorageValue(
        LocalStorageVariableEnum.HAS_SEEN_INSTALL_SCREEN,
    );

    const alertProps = {
        isAlertDisplayed: isAlertDisplayed,
        onCompleteCallBack: useCallback(() => disconnect(), []),
        onCancelCallBack: useCallback(() => setIsAlertDisplayed(false), [isAlertDisplayed]),
        labels: {
            boldContent: t("page.home.logout-popup.content"),
            content: "",
            cancel: t("common.navigation.cancel"),
            complete: t("page.home.navigation.logout"),
        },
        icon: disconnectIcon,
        errorIconAlt: t("page.alert-when-quit.alt-alert-icon"),
    };

    useEffect(() => {
        if (
            hasSeenInstallScreenString !== "true" &&
            !window.matchMedia("(display-mode: standalone)").matches
        ) {
            navigate(EdtRoutesNameEnum.INSTALL);
        }
    }, []);

    const navWorkTime = useCallback(
        (idSurvey: string) => () =>
            navToWeeklyPlannerOrClose(idSurvey, navigate, getSource(SourcesEnum.WORK_TIME_SURVEY)),
        [],
    );

    const onDisconnect = useCallback(() => setIsAlertDisplayed(true), [isAlertDisplayed]);

    const disconnect = useCallback(() => {
        auth.signOut();
        auth.userManager.signoutRedirect({
            id_token_hint: localStorage.getItem("id_token") || undefined,
        });
        auth.userManager.clearStaleState();
        auth.userManager.signoutRedirectCallback().then(() => {
            localStorage.clear();
            lunaticDatabase.clear();
            window.location.replace(process.env.REACT_APP_PUBLIC_URL || "");
            auth.userManager.clearStaleState();
        });
    }, []);

    const navActivity = useCallback(
        (idSurvey: string) => () => {
            navToActivityOrPlannerOrSummary(
                idSurvey,
                getSource(SourcesEnum.ACTIVITY_SURVEY).maxPage,
                navigate,
                getSource(SourcesEnum.ACTIVITY_SURVEY),
            );
        },
        [],
    );

    const formClose = (idSurvey: string) => {
        const surveyIsClosed = getValue(idSurvey, FieldNameEnum.ISCLOSED) as boolean;
        return surveyIsClosed;
    };

    return (
        <>
            <FlexCenter>
                <Alert {...alertProps} />
            </FlexCenter>
            <Box className={classes.headerBox}>
                <Box className={classes.logoBox}>
                    <img
                        className={classes.logoImg}
                        src={logo}
                        alt={t("accessibility.asset.logo-alt")}
                    />
                </Box>
                <Box className={classes.helpBox}>
                    <Button
                        color="secondary"
                        startIcon={<HelpIcon />}
                        onClick={useCallback(
                            () => navigate(getNavigatePath(EdtRoutesNameEnum.HELP)),
                            [],
                        )}
                    >
                        {t("page.home.navigation.link-help-label")}
                    </Button>
                    <Button
                        color="secondary"
                        startIcon={<PowerSettingsNewIcon />}
                        onClick={onDisconnect}
                    >
                        {t("page.home.navigation.logout")}
                    </Button>
                </Box>
            </Box>

            <Box className={classes.cardsBox}>
                <FlexCenter className={classes.spacing}>
                    <img src={reminder_note} alt={t("accessibility.asset.reminder-notes-alt")} />
                </FlexCenter>
                {surveysIds[SurveysIdsEnum.ACTIVITY_SURVEYS_IDS].map(idSurvey => (
                    <DayCard
                        key={idSurvey + "-dayCard"}
                        labelledBy={""}
                        describedBy={""}
                        onClick={navActivity(idSurvey)}
                        firstName={getPrintedFirstName(idSurvey)}
                        surveyDate={getPrintedSurveyDate(idSurvey)}
                        idSurvey={idSurvey}
                        isClose={formClose(idSurvey)}
                    />
                ))}

                {surveysIds[SurveysIdsEnum.WORK_TIME_SURVEYS_IDS].map(idSurvey => (
                    <WeekCard
                        key={idSurvey + "-weekCard"}
                        labelledBy={""}
                        describedBy={""}
                        onClick={navWorkTime(idSurvey)}
                        firstName={getPrintedFirstName(idSurvey)}
                        surveyDate={getPrintedSurveyDate(idSurvey, EdtRoutesNameEnum.WORK_TIME)}
                        idSurvey={idSurvey}
                        isClose={formClose(idSurvey)}
                    />
                ))}
            </Box>
        </>
    );
};

const useStyles = makeStylesEdt({ "name": { NavButton: HomePage } })(() => ({
    cardsBox: {
        overflowY: "auto",
        paddingBottom: "6rem",
    },
    logoBox: {
        paddingLeft: "1rem",
        paddingTop: "0.5rem",
    },
    logoImg: {
        width: "40px",
    },
    helpBox: {
        paddingRight: "0.5rem",
    },
    headerBox: {
        display: "flex",
        justifyContent: "space-between",
        paddingTop: "0.5rem",
    },
    spacing: {
        margin: "1rem",
    },
}));

export default HomePage;
