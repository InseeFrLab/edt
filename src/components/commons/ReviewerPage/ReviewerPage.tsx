
import { Button } from "@mui/material";
import { Box } from "@mui/system";
import { ReactElement } from "react";
import { isMobile } from "../../../service/responsive";
import BreadcrumbsReviewer from "../BreadcrumbsReviewer/BreadcrumbsReviewer";
import { makeStylesEdt } from "../../../theme";

interface ReviewerPageProps {
    onClickHome: () => void;
    icon: ReactElement<any>;
    children: JSX.Element[] | JSX.Element;
    className?: string;
}

const ReviewerPage = (props: ReviewerPageProps) => {
    const { onClickHome, icon, children, className } = props;
    const { classes, cx } = useStyles();
    const isItMobile = isMobile();

    return (
        <Box className={cx(classes.reviewerPageBox, className)}>
            <Box className={classes.headerBox}>
                <Box>
                    <Button color="primary" variant="contained" onClick={onClickHome}>
                        {icon}
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
        padding: "2rem 1.5rem 1rem 1.5rem",
        display: "flex",
        flexDirection: "column",
    },
}));

export default ReviewerPage;
