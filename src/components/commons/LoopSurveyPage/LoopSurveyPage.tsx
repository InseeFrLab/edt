import { makeStylesEdt } from "@inseefrlab/lunatic-edt";
import { Box } from "@mui/material";
import AddActivityOrRouteStepper from "components/edt/AddActivityOrRouteStepper/AddActivityOrRouteStepper";
import { LoopEnum } from "enumerations/LoopEnum";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { getLoopLastCompletedStep } from "service/loop-service";
import { loopActivityStepperData } from "service/loop-stepper-service";
import LoopNavigator from "./LoopNavigator/LoopNavigator";
import LoopSurveyPageHeader from "./LoopSurveyPageHeader/LoopSurveyPageHeader";
import LoopSurveyPageSimpleHeader from "./LoopSurveyPageSimpleHeader/LoopSurveyPageSimpleHeader";

interface LoopSurveyPageProps {
    idSurvey: string;
    onNext?(event?: React.MouseEvent): void;
    onPrevious?(event?: React.MouseEvent): void;
    onValidate?(event?: React.MouseEvent): void;
    onClose?(): void;
    displayStepper?: boolean;
    displayHeader?: boolean;
    className?: string;
    children: JSX.Element[] | JSX.Element;
    currentStepIcon?: string;
    currentStepIconAlt?: string;
    currentStepNumber?: number;
    currentStepLabel?: string;
    isRoute?: boolean;
}

const LoopSurveyPage = (props: LoopSurveyPageProps) => {
    const {
        idSurvey,
        currentStepIcon,
        currentStepIconAlt,
        currentStepNumber,
        currentStepLabel,
        onNext,
        onPrevious,
        onValidate,
        onClose,
        displayStepper = true,
        displayHeader = true,
        className,
        children,
        isRoute,
    } = props;

    const { t } = useTranslation();
    const { idSurveyParam, iteration } = useParams();

    const { classes, cx } = useStyles();

    const lastCompletedStep = getLoopLastCompletedStep(
        idSurvey,
        LoopEnum.ACTIVITY_OR_ROUTE,
        iteration ? +iteration : 0,
    );

    return (
        <Box className={cx(classes.page, className)}>
            {displayStepper &&
                currentStepIcon &&
                currentStepIconAlt &&
                currentStepNumber &&
                currentStepLabel && (
                    <LoopSurveyPageHeader
                        onClose={onClose}
                        label={
                            isRoute ? t("common.stepper.add-route") : t("common.stepper.add-activity")
                        }
                    >
                        <AddActivityOrRouteStepper
                            numberOfSteps={
                                loopActivityStepperData[loopActivityStepperData.length - 1].stepNumber
                            }
                            lastCompletedStepNumber={lastCompletedStep}
                            currentStepIcon={currentStepIcon}
                            currentStepIconAlt={currentStepIconAlt}
                            currentStepNumber={currentStepNumber}
                            currentStepLabel={currentStepLabel}
                        />
                    </LoopSurveyPageHeader>
                )}
            {!displayStepper && displayHeader && onClose && (
                <LoopSurveyPageSimpleHeader
                    simpleHeaderLabel={currentStepLabel}
                    onNavigateBack={onClose}
                />
            )}
            <Box className={classes.content}>{children}</Box>
            <LoopNavigator
                onNext={onNext}
                onPrevious={onPrevious}
                onValidate={onValidate}
                nextLabel={t("common.navigation.next")}
                previousLabel={t("common.navigation.previous")}
                validateLabel={t("common.navigation.validate")}
            />
        </Box>
    );
};

const useStyles = makeStylesEdt({ "name": { NavButton: LoopSurveyPage } })(() => ({
    page: {
        height: "100%",
        display: "flex",
        flexDirection: "column",
        flexGrow: "1",
    },
    content: {
        flexGrow: "1",
        overflow: "auto",
        minHeight: "0",
        paddingBottom: "6rem",
    },
}));

export default LoopSurveyPage;
