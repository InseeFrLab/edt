import { Box } from "@mui/material";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import PageIcon from "components/commons/PageIcon/PageIcon";
import ActivityButtons from "components/commons/SurveyPage/ActivityButtons/ActivityButtons";
import SurveyPageEditHeader from "components/commons/SurveyPage/SurveyPageEditHeader/SurveyPageEditHeader";
import SurveyPageHeader from "components/commons/SurveyPage/SurveyPageHeader/SurveyPageHeader";
import SurveyPageSimpleHeader from "components/commons/SurveyPage/SurveyPageSimpleHeader/SurveyPageSimpleHeader";
import ValidateButton from "components/commons/SurveyPage/ValidateButton/ValidateButton";
import { useTranslation } from "react-i18next";

interface SurveyPageProps {
    children: JSX.Element[] | JSX.Element;
    className?: string;
    validate?(): void;
    onFinish?(): void;
    onAdd?(): void;
    finishLabel?: string;
    addLabel?: string;
    srcIcon?: string;
    altIcon?: string;
    onNavigateBack?(): void;
    firstName?: string;
    firstNamePrefix?: string;
    surveyDate?: string;
    onEdit?(): void;
    simpleHeader?: boolean;
}

const SurveyPage = (props: SurveyPageProps) => {
    const {
        children,
        className,
        srcIcon,
        altIcon,
        validate,
        onFinish,
        onAdd,
        finishLabel,
        addLabel,
        onNavigateBack,
        onEdit,
        firstName,
        firstNamePrefix,
        surveyDate,
        simpleHeader = false,
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
            {!simpleHeader && firstName && firstNamePrefix && onEdit && onNavigateBack && (
                <SurveyPageEditHeader
                    firstName={firstName}
                    firstNamePrefix={firstNamePrefix}
                    onNavigateBack={onNavigateBack}
                    onEdit={onEdit}
                />
            )}
            {simpleHeader && onNavigateBack && (
                <SurveyPageSimpleHeader onNavigateBack={onNavigateBack} />
            )}
            {srcIcon && altIcon && <PageIcon srcIcon={srcIcon} altIcon={altIcon} />}
            {children}
            {validate && (
                <FlexCenter>
                    <ValidateButton onClick={validate} text={t("common.navigation.validate")} />
                </FlexCenter>
            )}
            {onFinish && onAdd && finishLabel && !validate && (
                <FlexCenter>
                    <ActivityButtons
                        onClickFinish={onFinish}
                        onClickAdd={onAdd}
                        finishLabel={finishLabel}
                        addLabel={addLabel}
                    />
                </FlexCenter>
            )}
        </Box>
    );
};

export default SurveyPage;
