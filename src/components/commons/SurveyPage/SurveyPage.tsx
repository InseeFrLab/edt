import { makeStylesEdt, ProgressBar } from "@inseefrlab/lunatic-edt";
import { Box, colors } from "@mui/material";
import FlexCenter from "../../../components/commons/FlexCenter/FlexCenter";
import LoopNavigator from "../../../components/commons/LoopSurveyPage/LoopNavigator/LoopNavigator";
import PageIcon from "../../../components/commons/PageIcon/PageIcon";
import ActivityButtons from "../../../components/commons/SurveyPage/ActivityButtons/ActivityButtons";
import SurveyPageEditHeader from "../../../components/commons/SurveyPage/SurveyPageEditHeader/SurveyPageEditHeader";
import SurveyPageHeader from "../../../components/commons/SurveyPage/SurveyPageHeader/SurveyPageHeader";
import SurveyPageSimpleHeader from "../../../components/commons/SurveyPage/SurveyPageSimpleHeader/SurveyPageSimpleHeader";
import ValidateButton from "../../../components/commons/SurveyPage/ValidateButton/ValidateButton";
import EndActivityStepper from "../../../components/edt/EndActivityStepper/EndActivityStepper";
import { LunaticModel } from "../../../interface/lunatic/Lunatic";
import React, { ReactElement, useEffect } from "react";
import { isAndroid, isIOS } from "react-device-detect";
import { useTranslation } from "react-i18next";
import { getLastCompletedStep } from "../../../service/navigation-service";
import { isMobile, isPwa } from "../../../service/responsive";
import { activityComplementaryQuestionsStepperData } from "../../../service/stepper.service";
import { getScore } from "../../../service/survey-activity-service";
import { min } from "lodash";

interface SurveyPageProps {
    children: JSX.Element[] | JSX.Element;
    className?: string;
    validate?(): void;
    onFinish?(idSurvey: string, source?: LunaticModel): void;
    onAdd?(): void;
    finishLabel?: string;
    addLabel?: string;
    icon?: ReactElement<any>;
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
    idSurvey: string;
    score?: number;
    helpStep?: number;
    modifiable?: boolean;
}

const SurveyPage = (props: SurveyPageProps) => {
    const {
        children,
        className,
        icon,
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
        modifiable = true,
    } = props;
    const { t } = useTranslation();

    const isMobileNav = !isPwa && (isIOS || isAndroid || isMobile());
    const headerHeight = document.getElementById(
        t("accessibility.component.survey-selecter.id"),
    )?.clientHeight;

    const windowHeight = isMobileNav ? window.innerHeight : window.innerHeight - (headerHeight ?? 0);

    const { classes, cx } = useStyles({
        "innerHeight": windowHeight,
    });
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
        <Box className={cx(classes.page, className)}>
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
                    modifiable={modifiable}
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
                    lastCompletedStepNumber={getLastCompletedStep(idSurvey ?? "")}
                    currentStepNumber={currentStepNumber}
                    currentStepLabel={currentStepLabel}
                />
            )}
            {renderProgressBar()}
            <Box className={classes.content}>
                {icon && <PageIcon icon={icon} />}
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
                <FlexCenter className={classes.bottomBar}>
                    <ValidateButton
                        onClick={validate}
                        text={t("common.navigation.validate")}
                        disabled={modifiable ? disableNav : true}
                    />
                </FlexCenter>
            )}
            {!displayStepper && onFinish && onAdd && finishLabel && !validate && (
                <FlexCenter className={classes.bottomBar}>
                    <ActivityButtons
                        onClickFinish={onFinish}
                        onClickAdd={onAdd}
                        finishLabel={finishLabel}
                        addLabel={addLabel}
                        helpStep={helpStep}
                        modifiable={modifiable}
                    />
                </FlexCenter>
            )}
        </Box>
    );
};

const useStyles = makeStylesEdt<{
    innerHeight: number;
}>({ "name": { NavButton: SurveyPage } })((theme, { innerHeight }) => ({
    page: {
        flexGrow: "1",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden !important",
        height: innerHeight,
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
    bottomBar: {
        minHeight: "4.5rem",
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
    }
}));

export default SurveyPage;
