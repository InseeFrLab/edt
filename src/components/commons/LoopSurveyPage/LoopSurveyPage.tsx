import { Box } from "@mui/material";
import AddActivityStepper from "components/edt/AddActivityStepper/AddActivityStepper";
import { makeStylesEdt } from "lunatic-edt";
import { useTranslation } from "react-i18next";
import LoopNavigator from "./LoopNavigator/LoopNavigator";

interface LoopSurveyPageProps {
    onNext?(): void;
    onPrevious?(): void;
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
        className,
        children,
    } = props;
    const { t } = useTranslation();
    return (
        <Box className={className}>
            <AddActivityStepper
                numberOfSteps={0}
                lastCompletedStepNumber={0}
                currentStepIcon={currentStepIcon}
                currentStepIconAlt={currentStepIconAlt}
                currentStepNumber={currentStepNumber}
                currentStepLabel={currentStepLabel}
            />
            {children}
            <LoopNavigator
                onNext={onNext}
                onPrevious={onPrevious}
                nextLabel={t("common.navigation.next")}
                previousLabel={t("common.navigation.previous")}
            />
        </Box>
    );
};

const useStyles = makeStylesEdt({ "name": { LoopSurveyPage } })(() => ({}));

export default LoopSurveyPage;
