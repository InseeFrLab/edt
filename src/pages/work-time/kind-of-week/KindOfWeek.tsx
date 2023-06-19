import { Alert, CheckboxOneSpecificProps } from "@inseefrlab/lunatic-edt";
import calendarWeek from "assets/illustration/kind-of-week-categories/calendar-week.svg";
import kindOfWeek from "assets/illustration/kind-of-week.svg";
import extension from "assets/illustration/mui-icon/extension.svg";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import SurveyPage from "components/commons/SurveyPage/SurveyPage";
import { EdtRoutesNameEnum } from "enumerations/EdtRoutesNameEnum";
import { OrchestratorContext } from "interface/lunatic/Lunatic";
import { OrchestratorForStories, callbackHolder } from "orchestrator/Orchestrator";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
    getNavigatePath,
    getOrchestratorPage,
    getParameterizedNavigatePath,
    navFullPath,
    onClose,
    saveAndNav,
    setEnviro,
    validate,
    validateWithAlertAndNav,
} from "service/navigation-service";
import { getKindOfWeekRef } from "service/referentiel-service";
import { getData, getPrintedFirstName } from "service/survey-service";

const KindOfWeekPage = () => {
    const context: OrchestratorContext = useOutletContext();
    const { t } = useTranslation();
    setEnviro(context, useNavigate(), callbackHolder);

    const currentPage = EdtRoutesNameEnum.KIND_OF_WEEK;

    const routeEnd =
        getParameterizedNavigatePath(EdtRoutesNameEnum.WORK_TIME, context.idSurvey) +
        getNavigatePath(EdtRoutesNameEnum.END_SURVEY);
    const routeWeeklyPlanner =
        getParameterizedNavigatePath(EdtRoutesNameEnum.WORK_TIME, context.idSurvey) +
        getNavigatePath(EdtRoutesNameEnum.WEEKLY_PLANNER);

    const [isAlertDisplayed, setIsAlertDisplayed] = useState<boolean>(false);

    const specificProps: CheckboxOneSpecificProps = {
        icon: calendarWeek,
        altIcon: t("accessibility.asset.kind-of-week-alt"),
        onSelectValue: () => {
            validate().then(() => saveAndNav(routeEnd));
        },
        extensionIcon: extension,
        extensionIconAlt: t("accessibility.asset.mui-icon.extension"),
    };

    const alertLabels = {
        boldContent: t("component.activity-selecter.alert-message"),
        content: "",
        cancel: t("page.alert-when-quit.alert-cancel"),
        complete: t("page.alert-when-quit.alert-complete"),
    };

    return (
        <SurveyPage
            validate={useCallback(
                () => validateWithAlertAndNav(false, setIsAlertDisplayed, undefined, routeEnd),
                [setIsAlertDisplayed],
            )}
            onNavigateBack={useCallback(
                () => validateWithAlertAndNav(false, setIsAlertDisplayed, undefined, routeWeeklyPlanner),
                [setIsAlertDisplayed],
            )}
            onPrevious={useCallback(() => navFullPath(EdtRoutesNameEnum.WEEKLY_PLANNER), [])}
            srcIcon={kindOfWeek}
            altIcon={t("accessibility.asset.kind-of-week-alt")}
            firstName={getPrintedFirstName(context.idSurvey)}
            firstNamePrefix={t("component.survey-page-edit-header.week-of")}
            simpleHeader={true}
            simpleHeaderLabel={t("page.kind-of-week.simple-header-label")}
        >
            <FlexCenter>
                <Alert
                    isAlertDisplayed={isAlertDisplayed}
                    onCompleteCallBack={useCallback(
                        () => setIsAlertDisplayed(false),
                        [isAlertDisplayed],
                    )}
                    onCancelCallBack={useCallback(
                        cancel => onClose(cancel, setIsAlertDisplayed),
                        [isAlertDisplayed],
                    )}
                    labels={alertLabels}
                    icon={kindOfWeek}
                    errorIconAlt={t("page.activity-duration.alt-alert-icon")}
                ></Alert>
                <OrchestratorForStories
                    source={context.source}
                    data={context.data}
                    cbHolder={callbackHolder}
                    page={getOrchestratorPage(currentPage)}
                    componentSpecificProps={specificProps}
                    overrideOptions={getKindOfWeekRef()}
                ></OrchestratorForStories>
            </FlexCenter>
        </SurveyPage>
    );
};

export default KindOfWeekPage;
