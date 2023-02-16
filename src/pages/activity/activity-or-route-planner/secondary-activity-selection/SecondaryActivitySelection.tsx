import errorIcon from "assets/illustration/error/activity.svg";
import LoopSurveyPageStep from "components/commons/LoopSurveyPage/LoopSurveyPageStep/LoopSurveyPageStep";
import { EdtRoutesNameEnum } from "enumerations/EdtRoutesNameEnum";
import { FieldNameEnum } from "enumerations/FieldNameEnum";
import { ReferentielsEnum } from "enumerations/ReferentielsEnum";
import { OrchestratorContext } from "interface/lunatic/Lunatic";
import { CheckboxOneCustomOption } from "lunatic-edt";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";
import {
    getActivitySecondaryActivityRef,
    getRouteSecondaryActivityRef,
} from "service/referentiel-service";
import { addToSecondaryActivityReferentiel } from "service/survey-service";

const SecondaryActivitySelectionPage = () => {
    const context: OrchestratorContext = useOutletContext();
    const { t } = useTranslation();

    const specifiquesProps = {
        labelsSpecifics: {
            otherButtonLabel: t("page.secondary-activity-selection.other-button"),
            subchildLabel: t("page.secondary-activity-selection.add-activity-label"),
            inputPlaceholder: t("page.secondary-activity-selection.input-placeholder"),
        },
        addToReferentielCallBack: (newItem: CheckboxOneCustomOption) => {
            addToSecondaryActivityReferentiel(
                context.isRoute
                    ? ReferentielsEnum.ROUTESECONDARYACTIVITY
                    : ReferentielsEnum.ACTIVITYSECONDARYACTIVITY,
                newItem,
            );
        },
        referentiel: context.isRoute
            ? getRouteSecondaryActivityRef()
            : getActivitySecondaryActivityRef(),
        displayStepper: false,
    };

    return (
        <LoopSurveyPageStep
            currentPage={EdtRoutesNameEnum.SECONDARY_ACTIVITY_SELECTION}
            labelOfPage={"secondary-activity-selecter"}
            errorIcon={errorIcon}
            backRoute={EdtRoutesNameEnum.SECONDARY_ACTIVITY}
            nextRoute={
                context.isRoute ? EdtRoutesNameEnum.WITH_SOMEONE : EdtRoutesNameEnum.ACTIVITY_LOCATION
            }
            fieldConditionBack={FieldNameEnum.WITHSECONDARYACTIVITY}
            specifiquesProps={specifiquesProps}
        />
    );
};

export default SecondaryActivitySelectionPage;
