import { makeStylesEdt, ProgressBar } from "@inseefrlab/lunatic-edt";
import { Box } from "@mui/material";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import LoopNavigator from "components/commons/LoopSurveyPage/LoopNavigator/LoopNavigator";
import PageIcon from "components/commons/PageIcon/PageIcon";
import ActivityButtons from "components/commons/SurveyPage/ActivityButtons/ActivityButtons";
import SurveyPageEditHeader from "components/commons/SurveyPage/SurveyPageEditHeader/SurveyPageEditHeader";
import SurveyPageHeader from "components/commons/SurveyPage/SurveyPageHeader/SurveyPageHeader";
import SurveyPageSimpleHeader from "components/commons/SurveyPage/SurveyPageSimpleHeader/SurveyPageSimpleHeader";
import ValidateButton from "components/commons/SurveyPage/ValidateButton/ValidateButton";
import EndActivityStepper from "components/edt/EndActivityStepper/EndActivityStepper";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getLastCompletedStep } from "service/navigation-service";
import { activityComplementaryQuestionsStepperData } from "service/stepper.service";
import { getScore } from "service/survey-activity-service";
import { isIOS, isAndroid, isDesktop } from "react-device-detect";
import { isPwa } from "service/responsive";

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
    onHelp?(): void;
    simpleHeader?: boolean;
    simpleHeaderLabel?: string;
    disableNav?: boolean;
    displayStepper?: boolean;
    onNext?(event?: React.MouseEvent): void;
    onPrevious?(event?: React.MouseEvent): void;
    currentStepNumber?: number;
    currentStepLabel?: string;
    backgroundWhiteHeader?: boolean;
    activityProgressBar?: boolean;
    idSurvey?: string;
    score?: number;
    helpStep?: number;
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
        onHelp,
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
        backgroundWhiteHeader,
        activityProgressBar = false,
        idSurvey,
        score,
        helpStep,
    } = props;
    const { t } = useTranslation();
    const { classes, cx } = useStyles();

    const [scoreAct, setScoreAct] = React.useState<number | undefined>(score);

    useEffect(() => {
        setScoreAct(getScore(idSurvey || "", t));
    }, [score]);

    const renderProgressBar = () => {
        return (
            activityProgressBar &&
            idSurvey && (
                <Box className={classes.progressBar}>
                    <ProgressBar value={scoreAct} showlabel={true}></ProgressBar>
                </Box>
            )
        );
    };

    return (
        <Box
            className={cx(
                classes.page,
                className,
                helpStep && isIOS ? classes.pageHelp : "",
                !isPwa() && isIOS && !helpStep ? classes.pageMobileTablet : classes.pageDesktop,
            )}
        >
            {!simpleHeader && firstName && surveyDate && onNavigateBack && (
                <SurveyPageHeader
                    surveyDate={surveyDate}
                    firstName={firstName}
                    onNavigateBack={onNavigateBack}
                />
            )}
            {!simpleHeader && firstName && firstNamePrefix && (onEdit || onHelp) && onPrevious && (
                <SurveyPageEditHeader
                    firstName={firstName}
                    firstNamePrefix={firstNamePrefix}
                    onNavigateBack={onPrevious}
                    onEdit={onEdit}
                    onHelp={onHelp}
                />
            )}
            {simpleHeader && onNavigateBack && (
                <SurveyPageSimpleHeader
                    simpleHeaderLabel={simpleHeaderLabel}
                    onNavigateBack={onNavigateBack}
                    backgroundWhite={backgroundWhiteHeader}
                />
            )}
            {displayStepper && currentStepNumber && currentStepLabel && (
                <EndActivityStepper
                    numberOfSteps={
                        activityComplementaryQuestionsStepperData[
                            activityComplementaryQuestionsStepperData.length - 1
                        ].stepNumber
                    }
                    lastCompletedStepNumber={getLastCompletedStep()}
                    currentStepNumber={currentStepNumber}
                    currentStepLabel={currentStepLabel}
                />
            )}
            {renderProgressBar()}
            <Box className={classes.content}>
                {srcIcon && altIcon && <PageIcon srcIcon={srcIcon} altIcon={altIcon} />}
                {children}
            </Box>

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
                        helpStep={helpStep}
                    />
                </FlexCenter>
            )}
        </Box>
    );
};

const useStyles = makeStylesEdt({ "name": { NavButton: SurveyPage } })(theme => ({
    page: {
        flexGrow: "1",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden !important",
    },
    pageDesktop: {
        height: "100%",
    },
    pageMobileTablet: {
        height: "100%",
        maxHeight: "87vh",
    },
    pageHelp: {
        height: "100%",
        maxHeight: "94vh",
    },
    content: {
        flexGrow: "1",
        overflow: "auto",
        minHeight: "0",
        overflowX: "hidden",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
    },
    progressBar: {
        padding: "1rem 0.5rem",
        backgroundColor: theme.variables.white,
        overflow: "hidden",
    },
}));

export default SurveyPage;
