import { useTranslation } from "react-i18next";
import { ModalEdt } from "lunatic-edt";
import { makeStyles } from "tss-react/mui";
import felicitations from "assets/illustration/felicitations.svg";

interface FelicitationModalProps {
    content: string;
    isModalDisplayed: boolean;
    onCompleteCallBack(): void;
}

const FelicitationModal = (props: FelicitationModalProps) => {
    const { content, isModalDisplayed, onCompleteCallBack } = props;
    const { t } = useTranslation();

    const alertLabels = {
        title: t("component.modal-edt.modal-felicitation.title"),
        content: content,
        endContent: t("component.modal-edt.modal-felicitation.end-content"),
        buttonLabel: t("component.modal-edt.modal-felicitation.button"),
    };

    return (
        <ModalEdt
            isModalDisplayed={isModalDisplayed}
            onCompleteCallBack={onCompleteCallBack}
            labels={alertLabels}
            icon={felicitations}
            iconAlt={t("component.modal-edt.modal-felicitation.alt-icon")}
        ></ModalEdt>
    );
};

const useStyles = makeStyles({ "name": { FelicitationModal } })(() => ({}));

export default FelicitationModal;
