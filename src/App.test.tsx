import { render } from "@testing-library/react";
import App from "App.tsx";

jest.mock("oidc-react", () => ({
    useAuth: () => {
        return {
            isLoading: false,
            user: { sub: "foobar", email: "foo@bar" },
            isAuthenticated: true,
            loginWithRedirect: jest.fn(),
            logout: jest.fn(),
        };
    },
}));

jest.mock("react-i18next", () => ({
    // this mock makes sure any components using the translate hook can use it without a warning being shown
    useTranslation: () => {
        return {
            t: (str: any) => str,
            i18n: {
                changeLanguage: () =>
                    new Promise(() => {
                        console.log("");
                    }),
            },
        };
    },
}));

test("FAKE", () => {
    render(<App />);
});
