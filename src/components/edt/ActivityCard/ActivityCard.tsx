import { Box, Divider } from "@mui/material";
import { makeStylesEdt } from "lunatic-edt";

interface ActivityCardProps {
    labelledBy: string;
    describedBy: string;
    label: string;
    onClick(): void;
}

const ActivityCard = (props: ActivityCardProps) => {
    const { labelledBy, describedBy, label, onClick } = props;
    const { classes } = useStyles();
    return (
        <Box
            className={classes.activityCardBox}
            onClick={onClick}
            aria-labelledby={labelledBy}
            aria-describedby={describedBy}
        >
            <Box></Box>
            <Divider orientation="vertical" variant="middle" flexItem />
            <Box>
                <Box>{label}</Box>
                <Box></Box>
            </Box>
        </Box>
    );
};

const useStyles = makeStylesEdt({ "name": { ActivityCard } })(theme => ({
    activityCardBox: {
        backgroundColor: theme.variables.white,
        border: "1px solid transparent",
        borderRadius: "10px",
        padding: "1rem",
        display: "flex",
        cursor: "pointer",
        width: "90%",
        maxWidth: "310px",
        marginTop: "1rem",
    },
}));

export default ActivityCard;
