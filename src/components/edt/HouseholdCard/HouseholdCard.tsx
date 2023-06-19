import { important, makeStylesEdt } from "@inseefrlab/lunatic-edt";
import { Box, Divider, Typography } from "@mui/material";
import { EdtRoutesNameEnum } from "enumerations/EdtRoutesNameEnum";
import { LocalStorageVariableEnum } from "enumerations/LocalStorageVariableEnum";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getNavigatePath } from "service/navigation-service";
import { isMobile } from "service/responsive";

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

    const isItMobile = isMobile();

    const onClickHouseholdCard = useCallback(() => {
        localStorage.setItem(LocalStorageVariableEnum.ID_HOUSEHOLD, idHousehold);
        navigate(getNavigatePath(EdtRoutesNameEnum.SURVEYED_HOME));
    }, [idHousehold, navigate, props]);

    const renderCard = () => {
        return (
            <>
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
            </>
        );
    };

    const renderCardMobile = () => {
        return (
            <>
                <Box className={classes.cardMobileBox}>
                    <Box className={classes.personBoxMobile}>
                        <Box
                            className={cx(
                                classes.iconBox,
                                getType(),
                                isItMobile ? classes.iconBoxMobile : "",
                            )}
                        >
                            <img src={iconPerson} alt={iconPersonAlt} />
                        </Box>
                        <Box className={classes.identityBox}>
                            <Typography className={classes.label}>{householdStaticLabel}</Typography>
                            <Typography className={classes.labelBold}>
                                {dataHousehold.idHousehold}
                            </Typography>
                            <Typography className={classes.labelBold}>
                                {dataHousehold.userName}
                            </Typography>
                        </Box>
                    </Box>
                    <Box>
                        <Box className={classes.rowBox}>
                            {hasStarted && (
                                <>
                                    <Typography className={classes.amount}>
                                        {dataHousehold.stats?.numHouseholdsInProgress}
                                    </Typography>
                                    <Typography className={classes.label}>
                                        {startedSurveyLabel}
                                    </Typography>
                                </>
                            )}
                        </Box>
                        <Box className={classes.rowValidBox}>
                            {hasClosed && (
                                <>
                                    <Typography className={classes.amount}>
                                        {dataHousehold.stats?.numHouseholdsClosed}
                                    </Typography>
                                    <Typography className={classes.label}>
                                        {closedSurveyLabel}
                                    </Typography>
                                </>
                            )}
                        </Box>
                        <Box className={classes.rowValidBox}>
                            {hasValidated && (
                                <>
                                    <Typography className={classes.amount}>
                                        {dataHousehold.stats?.numHouseholdsValidated}
                                    </Typography>
                                    <Typography className={classes.label}>
                                        {validatedSurveyLabel}
                                    </Typography>
                                </>
                            )}
                        </Box>
                    </Box>
                    <Box className={classes.dateBox}>
                        <Typography>{dataHousehold.surveyDate}</Typography>
                    </Box>
                </Box>
                <Box className={classes.arrowBox}>
                    <img src={iconArrow} alt={iconArrowAlt} />
                </Box>
            </>
        );
    };

    return (
        <Box
            className={cx(isItMobile ? classes.familyCardBoxMobile : classes.familyCardBox)}
            onClick={onClickHouseholdCard}
        >
            {isItMobile ? renderCardMobile() : renderCard()}
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
    familyCardBoxMobile: {
        width: "100%",
        borderRadius: "4px 10px 10px 4px",
        display: "flex",
        alignItems: "center",
        backgroundColor: theme.variables.white,
        color: theme.palette.primary.light,
        marginTop: "1rem",
        cursor: "pointer",
        paddingRight: "1rem",
        height: "210px",
    },
    cardMobileBox: {
        display: "flex",
        flexDirection: "column",
        padding: "1rem",
    },
    personBoxMobile: {
        display: "flex",
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
    iconBoxMobile: {
        height: important("70px"),
        minWidth: important("70px"),
        maxWidth: important("70px"),
        padding: important("0"),
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
        minWidth: "100px",
        width: "20%",
    },
    dataBox: {
        margin: "0 1rem",
        display: "flex",
        alignItems: "flex-start",
        width: "20%",
        flexDirection: "column",
        minWidth: "87px",
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
        overflowWrap: "anywhere",
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
