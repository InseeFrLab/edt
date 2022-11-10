import Box from "@mui/material/Box";
import PersonSunIcon from "assets/illustration/card/person-sun.svg";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import PourcentProgress from "components/edt/PourcentProgress/PourcentProgress";
import { makeStylesEdt } from "lunatic-edt";
import { useTranslation } from "react-i18next";

interface DayCardProps {
    labelledBy: string;
    describedBy: string;
    onClick(): void;
}

const DayCard = (props: DayCardProps) => {
    const { labelledBy, describedBy, onClick } = props;
    const { classes } = useStyles();
    const { t } = useTranslation();

    return (
        <FlexCenter>
            <Box
                aria-labelledby={labelledBy}
                aria-describedby={describedBy}
                className={classes.dayCardBox}
                onClick={onClick}
            >
                <Box className={classes.leftBox}>
                    <Box className={classes.iconBox}>
                        <img src={PersonSunIcon} alt={t("accessibility.asset.card.person-sun-alt")} />
                    </Box>
                    <Box>
                        <Box>{t("component.day-card.day")}</Box>
                        <Box>{t("common.user.person")}</Box>
                    </Box>
                </Box>
                <Box>
                    <PourcentProgress labelledBy={""} describedBy={""} progress={"0"} />
                </Box>
            </Box>
        </FlexCenter>
    );
};

const useStyles = makeStylesEdt({ "name": { DayCard } })(theme => ({
    dayCardBox: {
        width: "90%",
        border: "1px solid transparent",
        borderRadius: "10px",
        padding: "1rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: theme.variables.white,
        color: theme.palette.primary.light,
        marginTop: "1rem",
        cursor: "pointer",
    },
    leftBox: {
        display: "flex",
        alignItems: "center",
    },
    iconBox: {
        marginRight: "1rem",
    },
}));

export default DayCard;
