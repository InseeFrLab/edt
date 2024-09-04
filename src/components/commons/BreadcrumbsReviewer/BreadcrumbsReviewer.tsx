import { makeStylesEdt } from "@inseefrlab/lunatic-edt";
import { Breadcrumbs } from "@mui/material";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/system";
import { EdtRoutesNameEnum } from "../../../enumerations/EdtRoutesNameEnum";
import { LocalStorageVariableEnum } from "../../../enumerations/LocalStorageVariableEnum";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { getFlatLocalStorageValue } from "../../../service/local-storage-service";
import { getNavigatePath } from "../../../service/navigation-service";

interface BreadcrumbsReviewerProps {
    labelBreadcrumbPrincipal: string;
    labelBreadcrumbSecondary: string;
}

const BreadcrumbsReviewer = (props: BreadcrumbsReviewerProps) => {
    const { labelBreadcrumbPrincipal, labelBreadcrumbSecondary } = props;

    const { classes } = useStyles();
    const { t } = useTranslation();
    const navigate = useNavigate();

    const isDemoMode = getFlatLocalStorageValue(LocalStorageVariableEnum.IS_DEMO_MODE) === "true";

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
            {isDemoMode ? t("page.breadcrumbs-reviewer.demostration") : t(labelBreadcrumbPrincipal)}
        </Link>,
        <Typography key="2" color="text.primary" className={classes.breadcrumbFinal}>
            {t(labelBreadcrumbSecondary)}
        </Typography>,
    ];

    if (isDemoMode) breadcrumbs.pop();

    return (
        <Box className={classes.breadcrumbBox}>
            <Breadcrumbs separator="›" aria-label="breadcrumb">
                {breadcrumbs}
            </Breadcrumbs>
        </Box>
    );
};

const useStyles = makeStylesEdt({ "name": { BreadcrumbsReviewer } })(() => ({
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
