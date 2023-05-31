import { makeStylesEdt } from "@inseefrlab/lunatic-edt";
import { Box, Divider, Typography } from "@mui/material";
import { EdtRoutesNameEnum } from "enumerations/EdtRoutesNameEnum";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getNavigatePath } from "service/navigation-service";
import { initializeHomeSurveys } from "service/survey-service";

interface HouseholdCardProps {
    idHousehold: string;
    iconPerson: string;
    iconPersonAlt: string;
    iconArrow: string;
    iconArrowAlt: string;
    householdStaticLabel: string;
    startedSurveyLabel: string;
    closedSurveyLabel: string;
    validatedSurveyLabel: string;
    dataHousehold: any;
    onClick?: () => void;
}

const HouseholdCard = (props: HouseholdCardProps) => {
    const {
        idHousehold,
        iconPerson,
        iconPersonAlt,
        iconArrow,
        iconArrowAlt,
        householdStaticLabel,
        startedSurveyLabel,
        closedSurveyLabel,
        validatedSurveyLabel,
        dataHousehold,
    } = props;
    const { classes, cx } = useStyles();
    const navigate = useNavigate();

    const getType = (): string => {
        if (
            dataHousehold.stats?.numHouseholdsInProgress == 0 &&
            dataHousehold.stats?.numHouseholdsClosed == 0 &&
            dataHousehold.stats?.numHouseholdsValidated == dataHousehold.stats?.numHouseholds
        ) {
            return classes.gray;
        } else if (dataHousehold.stats?.numHouseholdsClosed >= 1) {
            return classes.green;
        } else {
            return classes.orange;
        }
    };

    const hasStarted =
        dataHousehold.stats?.numHouseholdsInProgress >= 1 ||
        (dataHousehold.stats?.numHouseholdsClosed == 0 &&
            dataHousehold.stats?.numHouseholdsValidated == 0);

    const hasClosed = dataHousehold.stats?.numHouseholdsClosed >= 1;
    const hasValidated = dataHousehold.stats?.numHouseholdsValidated >= 1;

    const hasSeparator =
        dataHousehold.stats?.numHouseholdsClosed >= 1 ||
        dataHousehold.stats?.numHouseholdsValidated >= 1;

    const onClickHouseholdCard = useCallback(() => {
        navigate(getNavigatePath(EdtRoutesNameEnum.SURVEYED_HOME));
    }, []);

    return (
        <Box className={classes.familyCardBox} onClick={onClickHouseholdCard}>
            <Box className={cx(classes.iconBox, getType())}>
                <img src={iconPerson} alt={iconPersonAlt} />
            </Box>
            <Box className={classes.identityBox}>
                <Typography className={classes.label}>{householdStaticLabel}</Typography>
                <Typography className={classes.labelBold}>{dataHousehold.idHousehold}</Typography>
                <Typography className={classes.labelBold}>{dataHousehold.userName}</Typography>
            </Box>
            <Box className={classes.dataBox}>
                <Box className={classes.rowBox}>
                    {hasStarted && (
                        <>
                            <Typography className={classes.amount}>
                                {dataHousehold.stats?.numHouseholdsInProgress}
                            </Typography>
                            <Typography className={classes.label}>{startedSurveyLabel}</Typography>
                        </>
                    )}
                </Box>
            </Box>

            <Box className={classes.separatorBox}>
                {hasSeparator ? (
                    <Divider className={classes.separator} orientation="vertical" flexItem />
                ) : (
                    <Box className={classes.emptyBox} />
                )}
            </Box>

            <Box className={classes.dataValidBox}>
                <Box className={classes.rowValidBox}>
                    {hasClosed && (
                        <>
                            <Typography className={classes.amount}>
                                {dataHousehold.stats?.numHouseholdsClosed}
                            </Typography>
                            <Typography className={classes.label}>{closedSurveyLabel}</Typography>
                        </>
                    )}
                </Box>
                <Box className={classes.rowValidBox}>
                    {hasValidated && (
                        <>
                            <Typography className={classes.amount}>
                                {dataHousehold.stats?.numHouseholdsValidated}
                            </Typography>
                            <Typography className={classes.label}>{validatedSurveyLabel}</Typography>
                        </>
                    )}
                </Box>
            </Box>

            <Box className={classes.dateBox}>
                <Typography>{dataHousehold.surveyDate}</Typography>
            </Box>
            <Box className={classes.arrowBox}>
                <img src={iconArrow} alt={iconArrowAlt} />
            </Box>
        </Box>
    );
};

const useStyles = makeStylesEdt({ "name": { HouseholdCard } })(theme => ({
    familyCardBox: {
        width: "100%",
        borderRadius: "4px 10px 10px 4px",
        display: "flex",
        alignItems: "center",
        backgroundColor: theme.variables.white,
        color: theme.palette.primary.light,
        marginTop: "1rem",
        cursor: "pointer",
        paddingRight: "1rem",
        minHeight: "100px",
    },
    iconBox: {
        border: "1px solid",
        borderRadius: "4px 20px 20px 4px",
        paddingRight: "1.25rem",
        paddingLeft: "1rem",
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        height: "100px",
        minWidth: "90px",
        maxWidth: "120px",
        justifyContent: "center",
        width: "10%",
    },
    orange: {
        backgroundColor: "#fc9f0a",
        borderColor: "#fc9f0a",
    },
    gray: {
        backgroundColor: "#515856",
        borderColor: "#515856",
    },
    green: {
        backgroundColor: "#2dce96",
        borderColor: "#2dce96",
    },
    identityBox: {
        margin: "0 1rem",
        padding: "0.5rem 0",
        minWidth: "115px",
        width: "20%",
    },
    dataBox: {
        margin: "0 1rem",
        display: "flex",
        alignItems: "flex-start",
        width: "20%",
        flexDirection: "column",
    },
    dataValidBox: {
        margin: "0 1rem",
        display: "flex",
        alignItems: "flex-start",
        width: "20%",
        flexDirection: "column",
    },
    rowBox: {
        display: "flex",
        alignItems: "flex-start",
        minWidth: "110px",
        alignSelf: "end",
    },
    rowValidBox: {
        display: "flex",
        alignItems: "flex-start",
        minWidth: "90px",
    },
    emptyBox: {
        minWidth: "35px",
    },
    dateBox: {
        flexDirection: "row",
        width: "15%",
    },
    arrowBox: {
        display: "flex",
        marginLeft: "auto",
        height: "1.5rem",
    },
    amount: {
        marginRight: "0.5rem",
    },
    label: {
        color: theme.palette.primary.dark,
    },
    labelBold: {
        color: theme.palette.primary.dark,
        fontWeight: "bold",
    },
    separator: {
        margin: "0 1rem",
        borderColor: theme.palette.primary.light,
        minHeight: "100%",
    },
    separatorBox: {
        height: "3.5rem",
    },
}));

export default HouseholdCard;
