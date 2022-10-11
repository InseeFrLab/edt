import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import frFile from "./locales/fr/fr.json";

i18n.use(initReactI18next).init({
    resources: {
        fr: {
            translation: frFile,
        },
    },
    lng: "fr",
    fallbackLng: "fr",
    interpolation: {
        escapeValue: false,
    },
});
