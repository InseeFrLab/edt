import { CircularProgress } from "@mui/material";
import reminder_note from "assets/illustration/reminder-note.svg";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import PageIcon from "components/commons/PageIcon/PageIcon";
import { useTranslation } from "react-i18next";
import { makeStyles } from "tss-react/mui";

interface LoadingFullProps {
    message: string;
    thanking?: string;
}

const LoadingFull = (props: LoadingFullProps) => {
    const { message, thanking } = props;
    const { t } = useTranslation();
    const { classes } = useStyles({});

    return (
        <>
            <FlexCenter>
                <PageIcon
                    srcIcon={reminder_note}
                    altIcon={t("accessibility.asset.reminder-notes-alt")}
                />
            </FlexCenter>
            <FlexCenter>
                <CircularProgress thickness={2} className={classes.loading} />
            </FlexCenter>
            <FlexCenter>
                <h2 className={classes.centerMobile}>{message}</h2>
            </FlexCenter>
            <FlexCenter>{thanking ? <h3>{thanking}</h3> : <></>}</FlexCenter>
        </>
    );
};

const useStyles = makeStyles<{}>()(() => ({
    loading: {
        width: "117px !important",
        height: "117px !important",
    },
    centerMobile: {
        width: "100%",
        textAlign: "center",
    },
}));

export default LoadingFull;
