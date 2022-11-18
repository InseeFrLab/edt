import { Box } from "@mui/material";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import PageIcon from "components/commons/PageIcon/PageIcon";
import SurveyPageHeader from "components/commons/SurveyPageHeader/SurveyPageHeader";
import ValidateButton from "components/commons/ValidateButton/ValidateButton";
import { makeStylesEdt } from "lunatic-edt";
import { useTranslation } from "react-i18next";

interface SurveyPageProps {
    children: JSX.Element[] | JSX.Element;
    className?: string;
    validate(): void;
    srcIcon?: string;
    altIcon?: string;
    onNavigateBack(): void;
    firstName: string;
    surveyDate: string;
}

const SurveyPage = (props: SurveyPageProps) => {
    const { children, className, srcIcon, altIcon, validate, onNavigateBack, firstName, surveyDate } =
        props;
    const { t } = useTranslation();
    const { classes, cx } = useStyles();
    return (
        <Box className={cx(classes.navGap, className)}>
            <SurveyPageHeader
                surveyDate={surveyDate}
                firstName={firstName}
                onNavigateBack={onNavigateBack}
            />
            {srcIcon && altIcon && <PageIcon srcIcon={srcIcon} altIcon={altIcon} />}
            {children}
            <FlexCenter>
                <ValidateButton onClick={validate} text={t("common.navigation.validate")} />
            </FlexCenter>
        </Box>
    );
};

const useStyles = makeStylesEdt({ "name": { SurveyPage } })(() => ({
    navGap: {
        marginBottom: "4.25rem",
    },
}));

export default SurveyPage;
