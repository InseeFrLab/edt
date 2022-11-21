import { ClickableList } from "lunatic-edt";
import { useTranslation } from "react-i18next";
import iconNoResult from "../../assets/illustration/error/puzzle.svg";
import activites from ".././../activites.json";

const HelpPage = () => {
    const { t } = useTranslation();
    return (
        <>
            <header>Help - {t("home.page.welcome")}</header>

            <ClickableList
                options={activites}
                handleChange={() => console.log("handleChange")}
                createActivity={() => console.log("createActivity")}
                placeholder="Saisissez une activité"
                notFoundLabel="Aucun résultat trouvé"
                notFoundComment="Vous pourrez l'ajouter en cliquant sur le bouton ci-dessous, ou le bouton + ci-dessus"
                addActivityButtonLabel="Ajouter l'activité"
                iconNoResult={iconNoResult}
                iconNoResultAlt="alt pour icon no result"
            ></ClickableList>
        </>
    );
};

export default HelpPage;
