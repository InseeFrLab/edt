import { makeStylesEdt } from "@inseefrlab/lunatic-edt";
import { Breadcrumbs } from "@mui/material";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/system";
import { EdtRoutesNameEnum } from "enumerations/EdtRoutesNameEnum";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { getNavigatePath } from "service/navigation-service";
import { useNavigate } from "react-router-dom";

interface BreadcrumbsReviewerProps {
    labelBreadcrumbPrincipal: string;
    labelBreadcrumbSecondary: string;
}

const BreadcrumbsReviewer = (props: BreadcrumbsReviewerProps) => {
    const { labelBreadcrumbPrincipal, labelBreadcrumbSecondary } = props;

    const { classes } = useStyles();
    const { t } = useTranslation();
    const navigate = useNavigate();

    const navigateHome = useCallback(() => {
        return navigate(getNavigatePath(EdtRoutesNameEnum.REVIEWER_SURVEYS_OVERVIEW));
    }, []);

    const breadcrumbs = [
        <Link
            underline="hover"
            key="1"
            color="inherit"
            onClick={navigateHome}
            className={classes.breadcrumb}
        >
            {t(labelBreadcrumbPrincipal)}
        </Link>,
        <Typography key="2" color="text.primary" className={classes.breadcrumbFinal}>
            {t(labelBreadcrumbSecondary)}
        </Typography>,
    ];

    return (
        <Box className={classes.breadcrumbBox}>
            <Breadcrumbs separator="›" aria-label="breadcrumb">
                {breadcrumbs}
            </Breadcrumbs>
        </Box>
    );
};

const useStyles = makeStylesEdt({ "name": { BreadcrumbsReviewer } })(theme => ({
    breadcrumb: {
        fontSize: "18px",
    },
    breadcrumbFinal: {
        fontSize: "18px",
        fontWeight: "bold",
    },
    breadcrumbBox: {
        paddingLeft: "1rem",
    },
}));

export default BreadcrumbsReviewer;
