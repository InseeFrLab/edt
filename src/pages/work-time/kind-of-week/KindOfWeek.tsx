import calendarWeek from "assets/illustration/kind-of-week-categories/calendar-week.svg";
import kindOfWeek from "assets/illustration/kind-of-week.svg";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import FelicitationModal from "components/commons/Modal/FelicitationModal/FelicitationModal";
import SurveyPage from "components/commons/SurveyPage/SurveyPage";
import { EdtRoutesNameEnum } from "enumerations/EdtRoutesNameEnum";
import { OrchestratorContext } from "interface/lunatic/Lunatic";
import { CheckboxOneSpecificProps } from "lunatic-edt";
import { callbackHolder, OrchestratorForStories } from "orchestrator/Orchestrator";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
    getOrchestratorPage,
    navFullPath,
    setEnviro,
    validateWithAlertAndNav,
} from "service/navigation-service";
import { getKindOfWeekRef } from "service/referentiel-service";
import { getPrintedFirstName } from "service/survey-service";

const KindOfWeekPage = () => {
    const context: OrchestratorContext = useOutletContext();
    const { t } = useTranslation();
    setEnviro(context, useNavigate(), callbackHolder);

    const currentPage = EdtRoutesNameEnum.KIND_OF_WEEK;

    const [isModalDisplayed, setIsModalDisplayed] = useState<boolean>(false);

    const specificProps: CheckboxOneSpecificProps = {
        icon: calendarWeek,
        onSelectValue: () => validateWithAlertAndNav(false, setIsModalDisplayed),
    };

    return (
        <SurveyPage
            validate={useCallback(
                () => validateWithAlertAndNav(false, setIsModalDisplayed),
                [isModalDisplayed],
            )}
            onNavigateBack={useCallback(
                () => validateWithAlertAndNav(false, setIsModalDisplayed),
                [isModalDisplayed],
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
                <FelicitationModal
                    isModalDisplayed={isModalDisplayed}
                    onCompleteCallBack={useCallback(
                        () => validateWithAlertAndNav(true, setIsModalDisplayed),
                        [],
                    )}
                    content={t("component.modal-edt.modal-felicitation.survey-content")}
                />
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
