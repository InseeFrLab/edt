import { EdtRoutesNameEnum } from "enumerations/EdtRoutesNameEnum";

import errorIcon from "assets/illustration/error/activity.svg";
import help from "assets/illustration/goals/help.svg";
import home from "assets/illustration/goals/home.svg";
import solidarity from "assets/illustration/goals/solidarity.svg";
import work from "assets/illustration/goals/work.svg";

import LoopSurveyPageStep from "components/commons/LoopSurveyPage/LoopSurveyPageStep/LoopSurveyPageStep";
import { useTranslation } from "react-i18next";
import { getActivityGoalRef } from "service/referentiel-service";

const MainActivityGoalPage = () => {
    const { t } = useTranslation();

    const getIcon = (iconName: string): string => {
        switch (iconName) {
            case "home": {
                return home;
            }
            case "work": {
                return work;
            }
            case "help": {
                return help;
            }
            case "solidarity": {
                return solidarity;
            }
            default: {
                return home;
            }
        }
    };

    const referentiel = getActivityGoalRef();
    const optionsIcons: { [key: string]: { icon: string; altIcon: string } } = {};

    referentiel.forEach(option => {
        optionsIcons[option.value] = {
            icon: getIcon(option?.iconName || ""),
            altIcon: t("accessibility.assets.goal.categories." + option.iconName + "-alt"),
        };
    });

    const specifiquesProps = {
        optionsIcons: optionsIcons,
        displayStepper: true,
        currentStepLabel: "component.add-activity-stepper.step-2-label",
        referentiel: referentiel,
    };

    return (
        <LoopSurveyPageStep
            currentPage={EdtRoutesNameEnum.MAIN_ACTIVITY_GOAL}
            labelOfPage={"goal-selecter"}
            errorIcon={errorIcon}
            backRoute={EdtRoutesNameEnum.MAIN_ACTIVITY}
            nextRoute={EdtRoutesNameEnum.SECONDARY_ACTIVITY}
            specifiquesProps={specifiquesProps}
        />
    );
};

export default MainActivityGoalPage;
