import { makeStylesEdt } from "@inseefrlab/lunatic-edt";
import { Breadcrumbs, Button } from "@mui/material";
import { Box } from "@mui/system";

interface ReviewerPageProps {
    onClickHome: () => void;
    homeIcon: string;
    homeIconAlt: string;
    children: JSX.Element[] | JSX.Element;
    className?: string;
}

const ReviewerPage = (props: ReviewerPageProps) => {
    const { onClickHome, homeIcon, homeIconAlt, children, className } = props;
    const { classes, cx } = useStyles();

    return (
        <Box className={cx(classes.reviewerPageBox, className)}>
            <Box className={classes.headerBox}>
                <Box>
                    <Button color="primary" variant="contained" onClick={onClickHome}>
                        <img src={homeIcon} alt={homeIconAlt} />
                    </Button>
                </Box>
                <Box>
                    <Breadcrumbs separator="›" aria-label="breadcrumb">
                        {/*breadcrumbs*/}
                    </Breadcrumbs>
                </Box>
            </Box>
            <Box className={classes.contentBox}>{children}</Box>
        </Box>
    );
};

const useStyles = makeStylesEdt({ "name": { ReviewerPage } })(theme => ({
    headerBox: {
        display: "flex",
        alignItems: "center",
        padding: "1rem",
        backgroundColor: theme.variables.white,
    },
    reviewerPageBox: {},
    contentBox: {
        height: "100%",
        overflow: "hidden",
        padding: "1rem 2rem 1rem 2rem",
        display: "flex",
        flexDirection: "column",
    },
}));

export default ReviewerPage;
