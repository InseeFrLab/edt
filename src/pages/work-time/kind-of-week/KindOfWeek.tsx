import calendarWeek from "assets/illustration/kind-of-week-categories/calendar-week.svg";
import kindOfWeek from "assets/illustration/kind-of-week.svg";
import FlexCenter from "components/commons/FlexCenter/FlexCenter";
import FelicitationModal from "components/commons/Modal/FelicitationModal/FelicitationModal";
import SurveyPage from "components/commons/SurveyPage/SurveyPage";
import { OrchestratorContext } from "interface/lunatic/Lunatic";
import { CheckboxOneSpecificProps } from "lunatic-edt";
import { callbackHolder, OrchestratorForStories } from "orchestrator/Orchestrator";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useOutletContext } from "react-router-dom";
import { EdtRoutesNameEnum } from "routes/EdtRoutesMapping";
import { getOrchestratorPage, setEnviro, validateWithAlertAndNav } from "service/navigation-service";
import { getKindOfWeekRef } from "service/referentiel-service";
import { getPrintedFirstName } from "service/survey-service";

const specificProps: CheckboxOneSpecificProps = {
    icon: calendarWeek,
};

const KindOfWeekPage = () => {
    const context: OrchestratorContext = useOutletContext();
    const { t } = useTranslation();
    setEnviro(context, useNavigate(), callbackHolder);

    const currentPage = EdtRoutesNameEnum.KIND_OF_WEEK;

    const [isModalDisplayed, setIsModalDisplayed] = useState<boolean>(false);

    return (
        <SurveyPage
            validate={() => validateWithAlertAndNav(false, setIsModalDisplayed)}
            onNavigateBack={() => validateWithAlertAndNav(false, setIsModalDisplayed)}
            srcIcon={kindOfWeek}
            altIcon={t("accessibility.asset.kind-of-week-alt")}
            firstName={getPrintedFirstName(context.idSurvey)}
            firstNamePrefix={t("component.survey-page-edit-header.week-of")}
            simpleHeader={true}
            simpleHeaderLabel={t("page.complementary-questions.simple-header-label")}
        >
            <FlexCenter>
                <FelicitationModal
                    isModalDisplayed={isModalDisplayed}
                    onCompleteCallBack={() => validateWithAlertAndNav(true, setIsModalDisplayed)}
                    content={t("component.modal-edt.modal-felicitation.survey-content")}
                />
                <OrchestratorForStories
                    source={context.source}
                    data={context.data}
                    callbackHolder={callbackHolder}
                    page={getOrchestratorPage(currentPage)}
                    componentSpecificProps={specificProps}
                    overrideOptions={getKindOfWeekRef()}
                ></OrchestratorForStories>
            </FlexCenter>
        </SurveyPage>
    );
};

export default KindOfWeekPage;
