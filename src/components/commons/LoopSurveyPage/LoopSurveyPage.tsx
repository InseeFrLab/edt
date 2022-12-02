import { Box } from "@mui/material";
import AddActivityStepper from "components/edt/AddActivityStepper/AddActivityStepper";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { getLoopLastCompletedStep, LoopEnum } from "service/loop-service";
import { loopActivityStepperData } from "service/loop-stepper-service";
import LoopNavigator from "./LoopNavigator/LoopNavigator";
import LoopSurveyPageHeader from "./LoopSurveyPageHeader/LoopSurveyPageHeader";

interface LoopSurveyPageProps {
    onNext?(): void;
    onPrevious?(): void;
    onValidate?(): void;
    onClose?(): void;
    className?: string;
    children: JSX.Element[] | JSX.Element;
    currentStepIcon: string;
    currentStepIconAlt: string;
    currentStepNumber: number;
    currentStepLabel: string;
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
        className,
        children,
    } = props;

    const { t } = useTranslation();
    const { idSurvey, iteration } = useParams();

    return (
        <Box className={className}>
            <LoopSurveyPageHeader onClose={onClose} label={t("common.stepper.add-activity")}>
                <AddActivityStepper
                    numberOfSteps={loopActivityStepperData.length}
                    lastCompletedStepNumber={getLoopLastCompletedStep(
                        idSurvey ?? "",
                        LoopEnum.ACTIVITY,
                        iteration ? +iteration : 0,
                    )}
                    currentStepIcon={currentStepIcon}
                    currentStepIconAlt={currentStepIconAlt}
                    currentStepNumber={currentStepNumber}
                    currentStepLabel={currentStepLabel}
                />
            </LoopSurveyPageHeader>

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
