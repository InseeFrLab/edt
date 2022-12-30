import { Box } from "@mui/material";
import AddActivityOrRouteStepper from "components/edt/AddActivityOrRouteStepper/AddActivityOrRouteStepper";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { getLoopLastCompletedStep, LoopEnum } from "service/loop-service";
import { loopActivityStepperData } from "service/loop-stepper-service";
import LoopNavigator from "./LoopNavigator/LoopNavigator";
import LoopSurveyPageHeader from "./LoopSurveyPageHeader/LoopSurveyPageHeader";

interface LoopSurveyPageProps {
    onNext?(event?: React.MouseEvent): void;
    onPrevious?(event?: React.MouseEvent): void;
    onValidate?(): void;
    onClose?(): void;
    displayStepper?: boolean;
    className?: string;
    children: JSX.Element[] | JSX.Element;
    currentStepIcon?: string;
    currentStepIconAlt?: string;
    currentStepNumber?: number;
    currentStepLabel?: string;
}

const LoopSurveyPage = (props: LoopSurveyPageProps) => {
    const {
        currentStepIcon,
        currentStepIconAlt,
        currentStepNumber,
        currentStepLabel,
        onNext,
        onPrevious,
        onValidate,
        onClose,
        displayStepper = true,
        className,
        children,
    } = props;

    const { t } = useTranslation();
    const { idSurvey, iteration } = useParams();

    const lastCompletedStep = getLoopLastCompletedStep(
        idSurvey ?? "",
        LoopEnum.ACTIVITY_OR_ROUTE,
        iteration ? +iteration : 0,
        false,
    );

    //TODO: send isRoute as a parameter
    return (
        <Box className={className}>
            {displayStepper &&
                currentStepIcon &&
                currentStepIconAlt &&
                currentStepNumber &&
                currentStepLabel && (
                    <LoopSurveyPageHeader onClose={onClose} label={t("common.stepper.add-activity")}>
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

            {children}

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

export default LoopSurveyPage;
