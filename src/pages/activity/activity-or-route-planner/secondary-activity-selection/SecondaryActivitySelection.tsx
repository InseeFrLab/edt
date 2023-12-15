import { CheckboxOneCustomOption } from "@inseefrlab/lunatic-edt";
import errorIcon from "assets/illustration/error/activity.svg";
import addLightBlue from "assets/illustration/mui-icon/add-light-blue.svg";
import addWhite from "assets/illustration/mui-icon/add.svg";
import extensionDisabled from "assets/illustration/mui-icon/extension-grey.svg";
import extension from "assets/illustration/mui-icon/extension.svg";
import search from "assets/illustration/mui-icon/search.svg";
import LoopSurveyPageStep from "components/commons/LoopSurveyPage/LoopSurveyPageStep/LoopSurveyPageStep";
import { SEPARATOR_DEFAUT } from "constants/constants";
import { EdtRoutesNameEnum } from "enumerations/EdtRoutesNameEnum";
import { FieldNameEnum } from "enumerations/FieldNameEnum";
import { ReferentielsEnum } from "enumerations/ReferentielsEnum";
import { OrchestratorContext } from "interface/lunatic/Lunatic";
import { useTranslation } from "react-i18next";
import { useLocation, useOutletContext, useParams } from "react-router-dom";
import {
    getActivitySecondaryActivityRef,
    getAutoCompleteRef,
    getRouteSecondaryActivityRef,
} from "service/referentiel-service";
import { surveyReadOnly } from "service/survey-activity-service";
import {
    addToSecondaryActivityReferentiel,
    getNewSecondaryActivities,
    getValue,
} from "service/survey-service";
import { getSurveyIdFromUrl } from "utils/utils";

const SecondaryActivitySelectionPage = () => {
    const context: OrchestratorContext = useOutletContext();
    const { t } = useTranslation();

    const location = useLocation();
    const idSurvey = getSurveyIdFromUrl(context, location);
    const paramIteration = useParams().iteration;
    const currentIteration = paramIteration ? +paramIteration : 0;
    const isRoute = getValue(idSurvey, FieldNameEnum.ISROUTE, currentIteration) as boolean;
    const referentiel = isRoute ? getRouteSecondaryActivityRef() : getActivitySecondaryActivityRef();
    const newActivities = getNewSecondaryActivities(idSurvey, referentiel);
    const modifiable = !surveyReadOnly(context.rightsSurvey);

    const specifiquesProps = {
        labelsSpecifics: {
            otherButtonLabel: t("page.secondary-activity-selection.other-button"),
            subchildLabel: t("page.secondary-activity-selection.add-activity-label"),
            inputPlaceholder: t("page.secondary-activity-selection.input-placeholder"),
            validateButton: t("component.activity-selecter.validate-button"),
        },
        addToReferentielCallBack: (newItem: CheckboxOneCustomOption) => {
            addToSecondaryActivityReferentiel(
                isRoute
                    ? ReferentielsEnum.ROUTESECONDARYACTIVITY
                    : ReferentielsEnum.ACTIVITYSECONDARYACTIVITY,
                newItem,
            );
        },
        referentiel: newActivities,
        displayStepper: false,
        modifiable: modifiable,
        activitesAutoCompleteRef: getAutoCompleteRef(),
        separatorSuggester: process.env.REACT_APP_SEPARATOR_SUGGESTER ?? SEPARATOR_DEFAUT,
        labelsClickableList: {
            selectInCategory: t("component.activity-selecter.select-in-category"),
            addActivity: t("component.activity-selecter.add-activity"),
            alertMessage: t("component.activity-selecter.alert-message"),
            alertIgnore: t("common.navigation.alert.ignore"),
            alertComplete: t("common.navigation.alert.complete"),
            alertAlticon: t("common.navigation.alert.alt-icon"),
            clickableListPlaceholder: t("component.activity-selecter.clickable-list-placeholder"),
            clickableListNotFoundLabel: t("component.activity-selecter.clickable-list-not-found-label"),
            clickableListNotFoundComment: t(
                "component.activity-selecter.clickable-list-not-found-comment",
            ),
            clickableListAddActivityButton: t(
                "component.activity-selecter.clickable-list-add-activity-button",
            ),

            clickableListNotSearchLabel: t(
                "component.activity-selecter.clickable-list-not-search-label",
            ),
            otherButton: t("component.activity-selecter.other-button"),
            saveButton: t("component.activity-selecter.save-button"),
        },
        icons: {
            clickableListIconNoResult: errorIcon,
            clickableListIconNoResultAlt: t(
                "component.activity-selecter.clickable-list-icon-no-result-alt",
            ),
            iconAddWhite: addWhite,
            iconAddLightBlue: addLightBlue,
            iconAddAlt: t("accessibility.asset.mui-icon.add"),
            iconExtension: modifiable ? extension : extensionDisabled,
            iconExtensionAlt: t("accessibility.asset.mui-icon.extension"),
            iconSearch: search,
            iconSearchAlt: t("accessibility.asset.mui-icon.search"),
        },
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
