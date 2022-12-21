import { Box } from "@mui/material";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import PageIcon from "components/commons/PageIcon/PageIcon";
import ActivityButtons from "components/commons/SurveyPage/ActivityButtons/ActivityButtons";
import SurveyPageEditHeader from "components/commons/SurveyPage/SurveyPageEditHeader/SurveyPageEditHeader";
import SurveyPageHeader from "components/commons/SurveyPage/SurveyPageHeader/SurveyPageHeader";
import SurveyPageSimpleHeader from "components/commons/SurveyPage/SurveyPageSimpleHeader/SurveyPageSimpleHeader";
import ValidateButton from "components/commons/SurveyPage/ValidateButton/ValidateButton";
import EndActivityStepper from "components/edt/EndActivityStepper/EndActivityStepper";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { getLastCompletedStep } from "service/navigation-service";
import { activityComplementaryQuestionsStepperData } from "service/stepper.service";
import LoopNavigator from "../LoopSurveyPage/LoopNavigator/LoopNavigator";

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
    simpleHeaderLabel?: string;
    disableNav?: boolean;
    displayStepper?: boolean;
    onNext?(event?: React.MouseEvent): void;
    onPrevious?(event?: React.MouseEvent): void;
    currentStepNumber?: number;
    currentStepLabel?: string;
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
        simpleHeaderLabel,
        disableNav,
        displayStepper = false,
        onNext,
        onPrevious,
        currentStepNumber,
        currentStepLabel,
    } = props;
    const { t } = useTranslation();
    const { idSurvey } = useParams();

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
                <SurveyPageSimpleHeader
                    simpleHeaderLabel={simpleHeaderLabel}
                    onNavigateBack={onNavigateBack}
                />
            )}
            {displayStepper && currentStepNumber && currentStepLabel && (
                <EndActivityStepper
                    numberOfSteps={
                        activityComplementaryQuestionsStepperData[
                            activityComplementaryQuestionsStepperData.length - 1
                        ].stepNumber
                    }
                    lastCompletedStepNumber={getLastCompletedStep(idSurvey ?? "")}
                    currentStepNumber={currentStepNumber}
                    currentStepLabel={currentStepLabel}
                />
            )}

            {srcIcon && altIcon && <PageIcon srcIcon={srcIcon} altIcon={altIcon} />}
            {children}

            {displayStepper && (
                <LoopNavigator
                    onNext={onNext}
                    onPrevious={onPrevious}
                    onValidate={validate}
                    nextLabel={t("common.navigation.next")}
                    previousLabel={t("common.navigation.previous")}
                    validateLabel={t("common.navigation.validate")}
                />
            )}

            {!displayStepper && validate && (
                <FlexCenter>
                    <ValidateButton
                        onClick={validate}
                        text={t("common.navigation.validate")}
                        disabled={disableNav}
                    />
                </FlexCenter>
            )}
            {!displayStepper && onFinish && onAdd && finishLabel && !validate && (
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
