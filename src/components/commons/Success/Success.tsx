import { makeStylesEdt } from "@inseefrlab/lunatic-edt";
import { Box } from "@mui/material";
import { ReactComponent as DoneIcon } from "assets/illustration/mui-icon/done.svg";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import { useTranslation } from "react-i18next";

interface SuccessProps {
    labelledBy: string;
    describedBy: string;
    successMessage: string;
}

const Success = (props: SuccessProps) => {
    const { labelledBy, describedBy, successMessage } = props;
    const { classes } = useStyles();
    const { t } = useTranslation();

    return (
        <FlexCenter>
            <Box
                className={classes.successBox}
                aria-labelledby={labelledBy}
                aria-describedby={describedBy}
            >
                <Box>
                    <DoneIcon aria-label={t("accessibility.asset.mui-icon.done")} />
                </Box>
                <Box>
                    <h3>{successMessage}</h3>
                </Box>
            </Box>
        </FlexCenter>
    );
};

const useStyles = makeStylesEdt({ "name": { Success } })(theme => ({
    successBox: {
        width: "90%",
        display: "flex",
        alignItems: "center",
        border: "1px solid transparent",
        borderRadius: "10px",
        backgroundColor: theme.palette.success.main,
        padding: "0 1rem",
    },
    icon: {
        width: "20px",
        marginRight: "1rem",
    },
}));

export default Success;
