
import FelicitationsIcon from "../../../../assets/illustration/felicitations.svg?react";
import { useTranslation } from "react-i18next";
import ModalEdt from "../../../lunatic-edt/ModalEdt";

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
            icon={
                <FelicitationsIcon aria-label={t("component.modal-edt.modal-felicitation.alt-icon")} />
            }
        ></ModalEdt>
    );
};

export default FelicitationModal;
