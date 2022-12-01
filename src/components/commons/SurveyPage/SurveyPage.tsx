import { Box } from "@mui/material";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import PageIcon from "components/commons/PageIcon/PageIcon";
import SurveyPageHeader from "components/commons/SurveyPageHeader/SurveyPageHeader";
import ValidateButton from "components/commons/ValidateButton/ValidateButton";
import { useTranslation } from "react-i18next";
import SurveyPageEditHeader from "../SurveyPageEditHeader/SurveyPageEditHeader";
import SurveyPageSimpleHeader from "../SurveyPageSimpleHeader/SurveyPageSimpleHeader";

interface SurveyPageProps {
    children: JSX.Element[] | JSX.Element;
    className?: string;
    validate(): void;
    srcIcon?: string;
    altIcon?: string;
    onNavigateBack?(): void;
    firstName?: string;
    surveyDate?: string;
    onEdit?(): void;
    simpleHeader?: boolean;
    disableNav?: boolean;
}

const SurveyPage = (props: SurveyPageProps) => {
    const {
        children,
        className,
        srcIcon,
        altIcon,
        validate,
        onNavigateBack,
        onEdit,
        firstName,
        surveyDate,
        simpleHeader = false,
        disableNav,
    } = props;
    const { t } = useTranslation();

    return (
        <Box className={className}>
            {!simpleHeader && firstName && surveyDate && onNavigateBack && (
                <SurveyPageHeader
                    surveyDate={surveyDate}
                    firstName={firstName}
                    onNavigateBack={onNavigateBack}
                />
            )}
            {!simpleHeader && firstName && onEdit && onNavigateBack && (
                <SurveyPageEditHeader
                    firstName={firstName}
                    onNavigateBack={onNavigateBack}
                    onEdit={onEdit}
                />
            )}
            {simpleHeader && onNavigateBack && (
                <SurveyPageSimpleHeader onNavigateBack={onNavigateBack} />
            )}
            {srcIcon && altIcon && <PageIcon srcIcon={srcIcon} altIcon={altIcon} />}
            {children}
            <FlexCenter>
                <ValidateButton
                    onClick={validate}
                    text={t("common.navigation.validate")}
                    disabled={disableNav}
                />
            </FlexCenter>
        </Box>
    );
};

export default SurveyPage;
