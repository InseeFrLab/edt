import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import Box from "@mui/material/Box";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import PourcentProgress from "components/edt/PourcentProgress/PourcentProgress";
import { makeStylesEdt } from "lunatic-edt";
import { useTranslation } from "react-i18next";
interface WeekCardProps {
    labelledBy: string;
    describedBy: string;
    onClick(): void;
}

const WeekCard = (props: WeekCardProps) => {
    const { labelledBy, describedBy, onClick } = props;
    const { classes } = useStyles();
    const { t } = useTranslation();
    return (
        <FlexCenter>
            <Box
                aria-labelledby={labelledBy}
                aria-describedby={describedBy}
                className={classes.weekCardBox}
                onClick={onClick}
            >
                <Box className={classes.leftBox}>
                    <Box className={classes.iconBox}>
                        <CalendarMonthOutlinedIcon />
                    </Box>
                    <Box>
                        <Box>{t("component.week-card.week")}</Box>
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

const useStyles = makeStylesEdt({ "name": { WeekCard } })(theme => ({
    weekCardBox: {
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
        color: theme.palette.primary.light,
    },
}));

export default WeekCard;
