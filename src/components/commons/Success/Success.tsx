import DoneIcon from "@mui/icons-material/Done";
import { Box } from "@mui/material";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import { makeStyles } from "tss-react/mui";

interface SuccessProps {
    labelledBy: string;
    describedBy: string;
    successMessage: string;
}

const Success = (props: SuccessProps) => {
    const { labelledBy, describedBy, successMessage } = props;
    const { classes } = useStyles();

    return (
        <FlexCenter>
            <Box
                className={classes.successBox}
                aria-labelledby={labelledBy}
                aria-describedby={describedBy}
            >
                <Box>
                    <DoneIcon className={classes.icon} />
                </Box>
                <Box>
                    <h3>{successMessage}</h3>
                </Box>
            </Box>
        </FlexCenter>
    );
};

const useStyles = makeStyles({ "name": { Success } })(theme => ({
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
