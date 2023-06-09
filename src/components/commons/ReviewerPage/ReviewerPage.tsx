import { makeStylesEdt } from "@inseefrlab/lunatic-edt";
import { Button } from "@mui/material";
import { Box } from "@mui/system";
import BreadcrumbsReviewer from "../BreadcrumbsReviewer/BreadcrumbsReviewer";
import { isMobile } from "service/responsive";

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
    const isItMobile = isMobile();

    return (
        <Box className={cx(classes.reviewerPageBox, className)}>
            <Box className={classes.headerBox}>
                <Box>
                    <Button color="primary" variant="contained" onClick={onClickHome}>
                        <img src={homeIcon} alt={homeIconAlt} />
                    </Button>
                </Box>
                <BreadcrumbsReviewer
                    labelBreadcrumbPrincipal={"page.breadcrumbs-reviewer.home"}
                    labelBreadcrumbSecondary={"page.breadcrumbs-reviewer.all-surveys"}
                />
            </Box>
            <Box className={cx(classes.contentBox, isItMobile ? classes.contentBoxMobile : "")}>
                {children}
            </Box>
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
        padding: "2rem 3rem 1rem 3rem",
        display: "flex",
        flexDirection: "column",
    },
    contentBoxMobile: {
        height: "100%",
        overflow: "hidden",
        padding: "2rem 2rem 1rem 2rem",
        display: "flex",
        flexDirection: "column",
    },
}));

export default ReviewerPage;
