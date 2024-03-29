import {
    formateDateToFrenchFormat,
    generateDateFromStringInput,
    important,
    InfoProps,
    makeStylesEdt,
    TooltipInfo,
} from "@inseefrlab/lunatic-edt";
import { Box, Button, Modal, Typography } from "@mui/material";
import { ReactComponent as InfoIcon } from "assets/illustration/info.svg";
import { ReactComponent as ArrowBackIosIcon } from "assets/illustration/mui-icon/arrow-back-ios-white.svg";
import { ReactComponent as ArrowForwardIosIcon } from "assets/illustration/mui-icon/arrow-forward-ios-white.svg";
import { ReactComponent as ArrowForwardIcon } from "assets/illustration/mui-icon/arrow-forward.svg";
import { ReactComponent as InfoTooltipIcon } from "assets/illustration/mui-icon/info.svg";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import SurveyPage from "components/commons/SurveyPage/SurveyPage";
import ActivityOrRouteCard from "components/edt/ActivityCard/ActivityOrRouteCard";
import AddActivityOrRoute from "components/edt/AddActivityOrRoute/AddActivityOrRoute";
import { EdtRoutesNameEnum } from "enumerations/EdtRoutesNameEnum";
import React, { useCallback } from "react";
import { isAndroid, isBrowser, isIOS, isMobile as isMobileNav } from "react-device-detect";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
    getNavigatePath,
    navFullPath,
    navToActivityRoutePlanner,
    navToHelp,
    navToHome,
} from "service/navigation-service";
import { getLanguage } from "service/referentiel-service";
import { isDesktop, isMobile, isPwa, isTablet } from "service/responsive";
import { mockActivitiesRoutesOrGaps } from "service/survey-activity-service";
import { v4 as uuidv4 } from "uuid";

const HelpActivity = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const isSubchildDisplayed = false;
    const [isAddActivityOrRouteOpen, setIsAddActivityOrRouteOpen] = React.useState(false);
    const [addActivityOrRouteFromGap, setAddActivityOrRouteFromGap] = React.useState(false);
    const [gapStartTime, setGapStartTime] = React.useState<string>();
    const [gapEndTime, setGapEndTime] = React.useState<string>();
    const [helpStep, setHelpStep] = React.useState(1);

    const isItDesktop = isDesktop();
    const isItTablet = isTablet();
    const isItMobile = isMobile();

    const { classes, cx } = useStyles({ "innerHeight": window.innerHeight });

    const activitiesRoutesOrGaps = mockActivitiesRoutesOrGaps();
    const surveyDate = "2023-03-29";

    const onOpenAddActivityOrRoute = useCallback(
        (startTime?: string, endTime?: string) => {
            setIsAddActivityOrRouteOpen(true);
            if (startTime && endTime) {
                setAddActivityOrRouteFromGap(true);
                setGapStartTime(startTime);
                setGapEndTime(endTime);
            }
        },
        [addActivityOrRouteFromGap, gapStartTime, gapEndTime],
    );

    const onCloseAddActivityOrRoute = useCallback(() => {
        setIsAddActivityOrRouteOpen(false);
        setAddActivityOrRouteFromGap(false);
    }, [isAddActivityOrRouteOpen, addActivityOrRouteFromGap]);

    const onEdit = useCallback(() => {
        navFullPath(" ", EdtRoutesNameEnum.EDIT_GLOBAL_INFORMATION, EdtRoutesNameEnum.ACTIVITY);
    }, []);

    const onHelp = useCallback(() => {
        navToHelp();
    }, []);

    const navToActivityRouteHome = useCallback(() => {
        navToHome();
    }, []);

    const infoLabels: InfoProps = {
        boldText: t("page.activity-planner.info"),
        infoIcon: <InfoIcon aria-label={t("accessibility.asset.info.info-alt")} />,
        infoIconTooltip: <InfoTooltipIcon aria-label={t("accessibility.asset.info.info-alt")} />,
        border: true,
    };

    const titleLabels = {
        boldTitle: formateDateToFrenchFormat(generateDateFromStringInput(surveyDate), getLanguage()),
        typeTitle: "h1",
    };

    const navToNextPage = useCallback(
        () => navigate(getNavigatePath(EdtRoutesNameEnum.HELP_DURATION)),
        [],
    );

    const nextHelpStep = useCallback(() => {
        helpStep < 3 ? setHelpStep(helpStep + 1) : navToNextPage();
    }, [helpStep]);

    const previousHelpStep = useCallback(() => {
        setHelpStep(helpStep > 1 ? helpStep - 1 : 1);
    }, [helpStep]);

    const getClassNameHelp = () => {
        if (isItDesktop && helpStep == 2) return classes.contentHelpBoxDesktop;
        else if (isMobileNav && isBrowser) return classes.contentHelpBoxMobile;
        else return classes.contentHelpBox;
    };

    const renderHelp = () => {
        return (
            <Modal disableEnforceFocus open={true}>
                <Box className={classes.rootHelp}>
                    <Box>
                        <Box className={classes.headerHelpBox}>
                            {helpStep > 1 && (
                                <Button
                                    className={classes.buttonHelpBox}
                                    variant="outlined"
                                    onClick={previousHelpStep}
                                    startIcon={
                                        <ArrowBackIosIcon
                                            aria-label={t("accessibility.asset.mui-icon.arrow-back-ios")}
                                        />
                                    }
                                >
                                    {t("common.navigation.previous")}
                                </Button>
                            )}
                            {
                                <Button
                                    className={classes.buttonHelpBox}
                                    variant="outlined"
                                    onClick={nextHelpStep}
                                    endIcon={
                                        <ArrowForwardIosIcon
                                            aria-label={t(
                                                "accessibility.asset.mui-icon.arrow-forward-ios",
                                            )}
                                        />
                                    }
                                >
                                    {t("common.navigation.next")}
                                </Button>
                            }
                        </Box>
                        <Box className={classes.centerBox}>
                            <Button
                                className={classes.buttonSkipBox}
                                variant="outlined"
                                onClick={navToActivityRouteHome}
                                endIcon={
                                    <ArrowForwardIcon
                                        aria-label={t("accessibility.asset.mui-icon.arrow-forward")}
                                    />
                                }
                            >
                                {t("common.navigation.skip")}
                            </Button>
                        </Box>
                    </Box>
                    <Box className={getClassNameHelp()}>{renderHelpStep()}</Box>
                </Box>
            </Modal>
        );
    };

    const renderHelpStep = () => {
        return (
            <>
                {helpStep == 1 && (
                    <Box id="help-step-1" className={cx(classes.stepHelpOne)}>
                        <Box className={classes.stepHelpBox}>
                            {t("component.help.help-page-1.help-step-1")}
                        </Box>
                    </Box>
                )}
                {helpStep == 2 && (
                    <Box
                        id="help-step-2"
                        className={cx(
                            classes.stepHelpTwo,
                            isItDesktop ? classes.stepHelpTwoDesktop : "",
                            isItTablet && !isItMobile ? classes.stepHelpTwoTablet : "",
                            isItMobile ? classes.stepHelpTwoMobile : "",
                        )}
                    >
                        <Box className={classes.stepHelpBox}>
                            {t("component.help.help-page-1.help-step-2")}
                        </Box>
                    </Box>
                )}
                {helpStep == 3 && (
                    <Box id="help-step-3" className={cx(classes.stepHelpThree)}>
                        <Box className={cx(classes.stepHelpBox)}>
                            {t("component.help.help-page-1.help-step-3")}
                        </Box>
                    </Box>
                )}
            </>
        );
    };

    const heightClass = isPwa() ? classes.fullHeight : classes.fullHeightNav;

    const isMobileApp = () => {
        return !isPwa() && isMobileNav && (isIOS || isAndroid);
    };

    function getClassCondition(condition: boolean, classNameYes: any, classNameNo: any) {
        return condition ? classNameYes : classNameNo;
    }

    return (
        <Box className={classes.root}>
            {renderHelp()}
            <Box
                className={cx(
                    classes.surveyPageBox,
                    getClassCondition(isMobileApp(), classes.surveyPageBoxTablet, ""),
                )}
            >
                {(isItDesktop || !isSubchildDisplayed) && (
                    <Box className={classes.innerSurveyPageBox}>
                        <SurveyPage
                            onNavigateBack={navToActivityRouteHome}
                            onPrevious={navToActivityRouteHome}
                            onEdit={onEdit}
                            onHelp={onHelp}
                            firstName={" "}
                            firstNamePrefix={t("component.survey-page-edit-header.planning-of")}
                            onFinish={navToActivityRoutePlanner}
                            onAdd={onOpenAddActivityOrRoute}
                            finishLabel={t("common.navigation.finish")}
                            addLabel={
                                activitiesRoutesOrGaps.length === 0
                                    ? t("common.navigation.add")
                                    : undefined
                            }
                            activityProgressBar={true}
                            idSurvey={" "}
                            score={10}
                            helpStep={helpStep}
                        >
                            <Box
                                className={
                                    isItDesktop && isSubchildDisplayed
                                        ? classes.outerContentBox
                                        : heightClass
                                }
                            >
                                <Box
                                    className={
                                        isItDesktop && isSubchildDisplayed
                                            ? classes.innerContentBox
                                            : heightClass
                                    }
                                >
                                    <Box className={classes.innerContentScroll}>
                                        <FlexCenter>
                                            <Box className={classes.infoBox}>
                                                {activitiesRoutesOrGaps.length !== 0 && (
                                                    <>
                                                        <Typography className={classes.label}>
                                                            {t("page.activity-planner.activity-for-day")}
                                                        </Typography>
                                                        <TooltipInfo
                                                            infoLabels={infoLabels}
                                                            titleLabels={titleLabels}
                                                        />
                                                    </>
                                                )}
                                            </Box>
                                        </FlexCenter>

                                        {
                                            <Box className={classes.activityCardsContainer}>
                                                {activitiesRoutesOrGaps.map(activity => (
                                                    <FlexCenter key={uuidv4()}>
                                                        <ActivityOrRouteCard
                                                            labelledBy={""}
                                                            describedBy={""}
                                                            onClick={navToActivityRoutePlanner}
                                                            onClickGap={onOpenAddActivityOrRoute}
                                                            activityOrRoute={activity}
                                                            onEdit={navToActivityRoutePlanner}
                                                            onDelete={navToActivityRoutePlanner}
                                                            helpStep={helpStep}
                                                        />
                                                    </FlexCenter>
                                                ))}
                                            </Box>
                                        }
                                    </Box>
                                </Box>
                            </Box>
                        </SurveyPage>

                        <AddActivityOrRoute
                            labelledBy={""}
                            describedBy={""}
                            onClickActivity={navToActivityRoutePlanner}
                            onClickRoute={navToActivityRoutePlanner}
                            handleClose={onCloseAddActivityOrRoute}
                            open={isAddActivityOrRouteOpen}
                        />
                    </Box>
                )}
            </Box>
        </Box>
    );
};

const useStyles = makeStylesEdt<{ innerHeight: number }>({ "name": { HelpActivity } })(theme => ({
    root: {
        height: important("100vh"),
        maxHeight: important("100vh"),
        display: important("flex"),
    },
    infoBox: {
        width: "350px",
        padding: "1rem 0.25rem 0.5rem 2rem",
        marginBottom: "1rem",
    },
    label: {
        fontSize: "14px",
    },
    date: {
        fontSize: "18px",
        fontWeight: "bold",
    },
    surveyPageBox: {
        flexGrow: "1",
        display: "flex",
        alignItems: "flex-start",
        overflow: "hidden",
        height: "100vh",
        maxHeight: "100vh",
    },
    surveyPageBoxTablet: {
        flexGrow: "1",
        display: "flex",
        alignItems: "flex-start",
        overflow: "hidden",
        height: "100%",
        maxHeight: isIOS ? "87vh" : innerHeight + "px",
    },
    innerContentBox: {
        border: "1px solid transparent",
        borderRadius: "20px",
        backgroundColor: theme.palette.background.default,
        flexGrow: "1",
        display: "flex",
        padding: "1rem 0",
    },
    activityCardsContainer: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, max-content))",
        gridGap: "1rem",
        justifyContent: "center",
        padding: "initial",
        marginBottom: "6rem",
    },
    innerContentScroll: {
        overflowY: "auto",
        flexGrow: "1",
        paddingBottom: "1rem",
    },
    outerContentBox: {
        padding: "0.5rem",
        flexGrow: "1",
        display: "flex",
        backgroundColor: theme.variables.white,
        height: "100%",
    },
    innerSurveyPageBox: {
        flexGrow: "1",
        height: "100%",
        display: "flex",
    },
    fullHeight: {
        height: "100%",
        display: "flex",
        justifyContent: "center",
        flexGrow: "1",
    },
    fullHeightNav: {
        display: "flex",
        justifyContent: "center",
        flexGrow: "1",
    },
    headerHelpBox: {
        display: "flex",
    },
    rootHelp: {
        padding: "0.5rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "100%",
        marginTop: "0.5rem",
        justifyContent: "space-between",
    },
    contentHelpBox: {
        height: "78vh",
        maxHeight: "78vh",
        display: "flex",
        alignItems: "end",
        marginBottom: "4.5rem",
    },
    contentHelpBoxMobile: {
        height: "100%",
        maxHeight: "60vh",
        display: "flex",
        alignItems: "end",
        marginBottom: "4.5rem",
    },
    contentHelpBoxDesktop: {
        height: "100%",
        display: "flex",
        alignItems: "start",
        marginBottom: "4.5rem",
        width: "315px",
    },
    buttonHelpBox: {
        backgroundColor: "#2c2e33",
        color: theme.variables.white,
        borderColor: "transparent",
        marginBottom: "1rem",
        marginRight: "1rem",
        width: "10rem",
        "&:hover": {
            backgroundColor: "#2c2e33",
            color: theme.variables.white,
            borderColor: important(theme.variables.white),
        },
    },
    buttonSkipBox: {
        color: theme.variables.white,
        backgroundColor: "#707070",
        borderColor: "transparent",
        marginBottom: "1rem",
        marginRight: "1rem",
        width: "10rem",
        "&:hover": {
            color: theme.variables.white,
            backgroundColor: "#707070",
            borderColor: important(theme.variables.white),
        },
    },
    stepHelpBox: {
        fontWeight: "bold",
        borderRadius: "1rem",
        padding: "1rem",
        backgroundColor: "#707070",
        color: theme.variables.white,
    },
    stepHelpOne: {
        width: "13rem",
        marginLeft: "13rem",
    },
    stepHelpTwo: {},
    stepHelpTwoDesktop: {
        width: "50vw",
        marginTop: "16.5rem",
    },
    stepHelpTwoTablet: {
        width: "50vw",
        marginTop: "16.5rem",
        marginLeft: "13rem",
        height: "100%",
        paddingTop: "44%",
        paddingLeft: "17%",
    },
    stepHelpTwoMobile: {
        width: "78vw",
        paddingTop: "48%",
        height: "100%",
        marginLeft: "0rem",
    },
    stepHelpThree: {
        width: "13rem",
        marginLeft: "-10rem",
    },
    centerBox: {
        textAlign: "center",
    },
}));

export default HelpActivity;
