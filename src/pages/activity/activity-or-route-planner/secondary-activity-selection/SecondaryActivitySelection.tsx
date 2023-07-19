import { CheckboxOneCustomOption } from "@inseefrlab/lunatic-edt";
import errorIcon from "assets/illustration/error/activity.svg";
import LoopSurveyPageStep from "components/commons/LoopSurveyPage/LoopSurveyPageStep/LoopSurveyPageStep";
import { EdtRoutesNameEnum } from "enumerations/EdtRoutesNameEnum";
import { FieldNameEnum } from "enumerations/FieldNameEnum";
import { ReferentielsEnum } from "enumerations/ReferentielsEnum";
import { OrchestratorContext } from "interface/lunatic/Lunatic";
import { useTranslation } from "react-i18next";
import { useLocation, useOutletContext, useParams } from "react-router-dom";
import {
    getActivitySecondaryActivityRef,
    getRouteSecondaryActivityRef,
} from "service/referentiel-service";
import { addToSecondaryActivityReferentiel, getValue } from "service/survey-service";
import { getSurveyIdFromUrl } from "utils/utils";

const SecondaryActivitySelectionPage = () => {
    const context: OrchestratorContext = useOutletContext();
    const { t } = useTranslation();

    const location = useLocation();
    const idSurvey = getSurveyIdFromUrl(context, location);
    const paramIteration = useParams().iteration;
    const currentIteration = paramIteration ? +paramIteration : 0;
    const isRoute = getValue(idSurvey, FieldNameEnum.ISROUTE, currentIteration) as boolean;

    const specifiquesProps = {
        labelsSpecifics: {
            otherButtonLabel: t("page.secondary-activity-selection.other-button"),
            subchildLabel: t("page.secondary-activity-selection.add-activity-label"),
            inputPlaceholder: t("page.secondary-activity-selection.input-placeholder"),
        },
        addToReferentielCallBack: (newItem: CheckboxOneCustomOption) => {
            addToSecondaryActivityReferentiel(
                isRoute
                    ? ReferentielsEnum.ROUTESECONDARYACTIVITY
                    : ReferentielsEnum.ACTIVITYSECONDARYACTIVITY,
                newItem,
            );
        },
        referentiel: isRoute ? getRouteSecondaryActivityRef() : getActivitySecondaryActivityRef(),
        displayStepper: false,
    };

    return (
        <LoopSurveyPageStep
            currentPage={EdtRoutesNameEnum.SECONDARY_ACTIVITY_SELECTION}
            labelOfPage={"secondary-activity-selecter"}
            errorIcon={errorIcon}
            backRoute={EdtRoutesNameEnum.SECONDARY_ACTIVITY}
            nextRoute={isRoute ? EdtRoutesNameEnum.WITH_SOMEONE : EdtRoutesNameEnum.ACTIVITY_LOCATION}
            fieldConditionBack={FieldNameEnum.WITHSECONDARYACTIVITY}
            specifiquesProps={specifiquesProps}
        />
    );
};

export default SecondaryActivitySelectionPage;
